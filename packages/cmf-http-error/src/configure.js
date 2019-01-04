import api from '@talend/react-cmf';

import { redirect, notFound } from './actions/redirect';

const registerActionCreator = api.actionCreator.register;

function initialize() {
	registerActionCreator('redirect', redirect);
	registerActionCreator('redirect:404', notFound);
}

export default {
	initialize,
};
