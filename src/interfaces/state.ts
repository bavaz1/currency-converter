import firebase from 'firebase';
import History from './history';

export default interface State {
  currencies: Array<Object>,
  from: string,
  to: string,
  amount: number,
  result: number,
  authUser: firebase.User | null,
  googleID: string | null,
  history: Array<History> | null
}
