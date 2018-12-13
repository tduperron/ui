import { select } from 'redux-saga/effects';
import sagas from './sagas';

const data = {
	services: {},
	inComponent: {},
	inSaga: {},
	inSelector: {},
};

/**
 * get give you access to the service registry
 * @param {string} id of the wanted service
 * @return {object} given wrapped service
 */
function get(id) {
	return data.services[id];
}

function getKeyPrefix(serviceId) {
	return `service#${serviceId}:`;
}

function privatize(config = {}, serviceId) {
	const PREFIX = getKeyPrefix(serviceId);
	return Object.keys(config).reduce((acc, key) => {
		// eslint-disable-next-line no-param-reassign
		acc[`${PREFIX}${key}`] = config[key];
		return acc;
	}, {});
}

function getOriginalKey(serviceId, key) {
	return key.replace(getKeyPrefix(serviceId), '');
}


function getInComponent(mod) {
	// eslint-disable-next-line no-param-reassign
	return props => {
		const extendedModule = {};
		Object.keys(mod.actionCreators).forEach(key => {
			// eslint-disable-next-line no-param-reassign
			extendedModule[key] = (...args) => props.dispacthActionCreator(key, ...args);
		});
		return extendedModule;
	};
}

function getInSaga(mod, id) {
	// eslint-disable-next-line no-param-reassign
	return () => {
		if (!data.inSaga[id]) {
			const inSagaModule = {};
			Object.keys(mod.actionCreators || {}).forEach(key => {
				const shortKey = getOriginalKey(id, key);
				// eslint-disable-next-line no-param-reassign
				inSagaModule[shortKey] = function* execActionCreators(...args) {
					yield sagas.putActionCreator(key, ...args);
				};
			});
			Object.keys(mod.selectors || {}).forEach(key => {
				const selector = mod.selectors[key];
				// eslint-disable-next-line no-param-reassign
				if (inSagaModule[key]) {
					throw new Error(`${key} is used for selector and actioncreators`);
				}
				inSagaModule[key] = function* execSelector(...args) {
					if (args.length === 0) {
						return yield select(selector);
					}
					const state = yield select();
					return selector(state, ...args);
				};
			});
			data.inSaga[id] = inSagaModule;
		}
		return data.inSaga[id];
	};
}

/**
 * register add a service into a registry under an id.
 * it creates an optimized API depending on a given context.
 * It also privatize your code in the registry so your code is isolated from the rest of the world
 * Note serviceId must be unique in an application.
 * @param {string} serviceId unique id to get the service later
 * @param {object} service the configuration to use
 */
function register(serviceId, service) {
	const config = {};
	config.id = `service-${serviceId}`;
	config.actionCreators = privatize(service.actionCreators, serviceId);
	config.expressions = privatize(service.expressions, serviceId);
	config.sagas = privatize(service.sagas, serviceId);

	// register service
	data.services[serviceId] = {
		inComponent: getInComponent(service, serviceId),
		inSaga: getInSaga(service, serviceId),
		inSelector: () => service.selectors || {},
	};
	return config;
}

export default {
	get,
	register,
};
