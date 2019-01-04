import get from 'lodash/get';
import { HTTP_STATUS } from '@talend/react-cmf/lib/middlewares/http/constants';

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

const specializedErrorPages = [NOT_FOUND, FORBIDDEN];

export function mapStatusCodeToPage(code) {
	if (specializedErrorPages.includes(code)) {
		return `/${code}`;
	}

	return `/${INTERNAL_SERVER_ERROR}`;
}

/**
 * @param {Object} cmf error
 * @returns {Object} that will change webapp location to either /404 /403 or /500
 */
export function redirectToStatusCodePage(error) {
	return {
		type: '@@router/CALL_HISTORY_METHOD',
		payload: {
			method: 'push',
			args: [mapStatusCodeToPage(get(error, 'stack.status'))],
		},
	};
}

export function notFound() {
	return redirectToStatusCodePage({ stack: { status: NOT_FOUND } });
}

/**
 * action creator
 * @param {Event} event which trigger this action
 * @param {Object} data {model,action} sub objects
 * @returns {Object} action
 */
export function redirect(event, data = {}) {
	let path = get(data, 'action.path', '');
	if (data.model && data.model.id) {
		path = path.replace('$id', data.model.id);
	} else if (data.model && data.model.get) {
		path = path.replace('$id', data.model.get('id'));
	}
	return {
		type: '@@router/CALL_HISTORY_METHOD',
		payload: {
			method: 'push',
			args: [path],
		},
	};
}

export default {
	redirect,
	notFound,
	redirectToStatusCodePage,
};
