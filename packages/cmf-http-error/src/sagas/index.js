import { fork } from 'redux-saga/effects';

import { httpHandler } from './http';

export function* httpErrorSaga() {
	yield fork(httpHandler);
}

export default {
	httpErrorSaga,
};
