import React from 'react';
import axios from 'axios';
import { Button, Form } from 'semantic-ui-react';

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
  axios.get('https://api.exchangeratesapi.io/latest')
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
  }

  state = {
    currencies: [],
    from: '',
    to: '',
    amount: 0,
    result: 0
  };

  public componentDidMount() {
    setCurrencies(this);
  }

  public handleChange(event: any, data: any) {
    this.setState({
      [data.name]: data.value
    });
  }

  handleSubmit(event: any) {
    axios.get(`https://api.exchangeratesapi.io/latest?base=${this.state.from}`)
      .then(res => {
        // TODO: Fix NaN possibility
        const result = this.state.amount * res.data.rates[this.state.to];
        this.setState({ result });
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>Currency converter</h1>

        <h3>Change currency</h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Dropdown name='from' label='From:' placeholder='EUR' search selection options={this.state.currencies} onChange={this.handleChange} required/>
          <Form.Input value={this.state.amount} type='text' name='amount' onChange={this.handleChange} required/>

          <Form.Dropdown name='to' label='To:' placeholder='HUF' search selection options={this.state.currencies} onChange={this.handleChange} required/>
          <Form.Input value={this.state.result.toFixed(2)} type='text' name='result' disabled onChange={this.handleChange}/>

          <Button type='submit'>Convert</Button>
        </Form>
      </div>
    )
  }
}
