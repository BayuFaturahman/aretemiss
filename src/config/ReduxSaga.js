import { all } from 'redux-saga/effects'
import { watcherAuth } from '../sagas/authSagas'
import { watcherAccount } from '../sagas/accountSagas'


export default function* reduxSaga() {
    yield all([
        ...watcherAuth,
        ...watcherAccount
    ])
}