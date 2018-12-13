import * as collections from './collections';
import * as router from './router';
import toJS from './toJS';
import registry from '../registry';
import expression from '../expression';
import sagas from '../sagas';
import selectorTo from './selectorTo';

/**
 * This function register a selector in the cmf registry
 * @param {string} id the selector id you want
 * @param {generator} selector the selector
 * @param {object} context optional context to get the registry
 */
function register(id, selector, context) {
	registry.addToRegistry(`selector:${id}`, selector, context);
	expression.register(id, selectorTo.toExpression(selector, id), context);
	sagas.register(id, selectorTo.toSaga(selector, id), context);
}

/**
 * This function allow to get a selector from the registry
 * @param {string} id the selector id you want
 * @param {object} context optional context to get the registry
 */
function get(id, context) {
	return registry.getFromRegistry(`selector:${id}`, context);
}

const registerMany = registry.getRegisterMany(register);

export default {
	get,
	register,
	registerMany,
	collections,
	router,
	toJS,
};
