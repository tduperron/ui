import { HTTP_STATUS } from '@talend/react-cmf/lib/middlewares/http/constants';
import get from 'lodash/get';
import { put, takeLatest } from 'redux-saga/effects';
import { SAGA_FINISHED } from '../constants/sagas';
import { redirectToStatusCodePage } from '../actions/redirect';

const { UNAUTHORIZED, FORBIDDEN, NOT_FOUND } = HTTP_STATUS;

export function* handleHttpError(event, action) {
	if (!event.error || !event.error.stack) {
		return put(SAGA_FINISHED);
	}

	if (get(action, 'options.silent')) {
		// consistent return type
		return SAGA_FINISHED;
	}

	switch (event.error.stack.status) {
		case UNAUTHORIZED:
			// ee only
			return put(SAGA_FINISHED);
		case FORBIDDEN:
		case NOT_FOUND:
			return yield put(redirectToStatusCodePage(event.error));
		default:
			return yield put(redirectToStatusCodePage(event.error));
	}
}

export function* httpHandler() {
	yield takeLatest('@@HTTP/ERRORS', handleHttpError);
}
