import { HTTP_STATUS } from '@talend/react-cmf/lib/middlewares/http/constants';

import { mapStatusCodeToPage, notFound } from './redirect';

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

describe('handle error pages', () => {
	it('should return /403 page when code is 403', () => {
		const errorCode = NOT_FOUND;
		expect(mapStatusCodeToPage(errorCode)).toBe(`/${errorCode}`);
	});
	it('should return /404 page when code is 404', () => {
		const errorCode = FORBIDDEN;
		expect(mapStatusCodeToPage(errorCode)).toBe(`/${errorCode}`);
	});
	it('should return /500 page when code is 500', () => {
		const errorCode = INTERNAL_SERVER_ERROR;
		expect(mapStatusCodeToPage(errorCode)).toBe(`/${errorCode}`);
	});
	it('should return /500 page when code is neither 403, 404 or 500', () => {
		expect(mapStatusCodeToPage(472)).toBe('/500');
	});
	it('should return /404 action', () => {
		expect(notFound()).toEqual({
			type: '@@router/CALL_HISTORY_METHOD',
			payload: {
				method: 'push',
				args: ['/404'],
			},
		});
	});
});
