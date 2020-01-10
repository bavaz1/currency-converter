import React from 'react';
import axios from 'axios';
import { Button, Form, Icon } from 'semantic-ui-react';
import firebase from 'firebase';
import HistoryTable from './components/HistoryTable';
import config from './config/firebase.json';
import State from './interfaces/state';
import History from './interfaces/history';

const HISTORY_MAX_COUNT = 20;
const EXCHANGE_API_URI = 'https://api.exchangeratesapi.io/latest';

firebase.initializeApp(config);
const db = firebase.firestore();

const getCurrencyValues = (res: any) => {
  const currencyValues = Object.keys(res.data.rates);
  currencyValues.push(res.data.base);
  currencyValues.sort((a, b) => a.localeCompare(b));
  return currencyValues;
}

const getCurrencies = (res: any) => {
  const currencyValues = getCurrencyValues(res);
  const currencies: Array<Object> = currencyValues.map(currency => {
    return {
      key: currency,
      text: currency,
      value: currency,
    }
  });
  return currencies;
};

const setCurrencies = (that: any) => {
  axios.get(EXCHANGE_API_URI)
    .then(res => {
      const currencies = getCurrencies(res);
      that.setState({ currencies });
    });
};

export default class App extends React.Component {
  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  state: State = {
    currencies: [],
    from: '',
    to: '',
    amount: 0,
    result: 0,
    authUser: null,
    profileID: null,
    history: null
  };

  componentDidMount() {
    setCurrencies(this);
  }

  handleChange(event: any, data: any) {
    this.setState({
      [data.name]: data.value
    });
  }

  handleSubmit(event: any) {
    event.preventDefault();
    axios.get(`${EXCHANGE_API_URI}?base=${this.state.from}`)
      .then(res => {
        // TODO: Fix NaN possibility
        const result = this.state.amount * res.data.rates[this.state.to];
        this.setState({ result });
        this.saveConversion(result);
      });
    if (this.isSignedIn()) {
      this.setHistory();
    }
  }

  handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const that = this;
    firebase.auth().signInWithPopup(provider).then(function(result) {
      const profile: any = result!.additionalUserInfo!.profile;
      if (profile) {
        db.collection("users").doc(profile.id).set({
          name: profile.name,
          email: profile.email
        });
        that.setState({ authUser: result.user, profileID: profile.id });
      }
    }).then(() => this.setHistory());
  }

  handleSignOut() {
    console.log(this.state.authUser);
    this.setState({ authUser: null, history: null })
  }

  saveConversion(result: number) {
    if (this.state.profileID) {
      db.collection("conversions").add({
        profileID: this.state.profileID,
        from: this.state.from,
        to: this.state.to,
        amount: this.state.amount,
        result: result.toFixed(2),
        date: Date.now()
      });
    }
  }

  setHistory() {
    db.collection("conversions").where("profileID", "==", this.state.profileID).get().then(conversions => {
      if (conversions.empty) {
        console.log('Your history is empty.');
        return;
      }

      const history: Array<History> = [];
      conversions.forEach(doc => {
        const conversion = doc.data();
        history.push({
          from: conversion.from,
          to: conversion.to,
          amount: conversion.amount,
          result: conversion.result,
          date: conversion.date
        });
      });
      console.log('history', history)
      this.setState({ history: history.slice(0, HISTORY_MAX_COUNT) });
    }).catch(err => {
      console.log('Error getting documents', err);
    });
  }

  isSignedIn() {
    if (this.state.authUser) {
      return (
        <div>
          <h3>You are signed in!</h3>
          <Button color='grey' onClick={this.handleSignOut} >Sign Out</Button>
        </div>
      )
    }
    return (
      <div>
        <h3>You are NOT signed in!</h3>
        <Button color='google plus' onClick={this.handleGoogleLogin} >
          <Icon name='google plus'/> Google Plus
        </Button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>Currency converter</h1>

        <h3>Change currency</h3>

        {this.isSignedIn()}

        <Form onSubmit={this.handleSubmit}>
          <Form.Dropdown name='from' label='From:' placeholder='EUR' search selection options={this.state.currencies} onChange={this.handleChange} required/>
          <Form.Input value={this.state.amount} type='text' name='amount' onChange={this.handleChange} required/>

          <Form.Dropdown name='to' label='To:' placeholder='HUF' search selection options={this.state.currencies} onChange={this.handleChange} required/>
          <Form.Input value={this.state.result.toFixed(2)} type='text' name='result' disabled onChange={this.handleChange}/>

          <Button type='submit'>Convert</Button>
        </Form>

        <h3>History:</h3>
        <HistoryTable history={this.state.history}/>
      </div>
    )
  }
}
