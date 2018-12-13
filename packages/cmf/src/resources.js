import { call, put, takeEvery } from 'redux-saga/lib/effects';
import actions from './actions';
import sagas from './sagas';

function* loadResource(resource) {
	const { data, response } = yield call(sagas.http[resource.method || 'get'], resource.url);
	if (response.ok) {
		yield put(actions.collections.addOrReplace(resource.id, data));
	}
}

function persist(event) {
	if (event && event.persist) {
		event.perist();
	}
}

/**
 * get creates a resource with just an id an http slug.
 * @param {object} config {id: 'article', API_URL: '/api/v1/articles' }
 * @return {object} cmfModule configuration ready for service API
 */
export default function get(config) {
	const ID = config.id.toUpperCase();
	const CONSTANTS = {
		CREATE_ONE: `SERVICE_${ID}_CREATE_ONE`,
		DELETE_ONE: `SERVICE_${ID}_DELETE_ONE`,
		FETCH_ALL: `SERVICE_${ID}_FETCH_ALL`,
		SELECT_ONE: `SERVICE_${ID}_SELECT_ONE`,
		COLLECTION_ID: `${config.id}.all`,
		CURRENT: `${config.id}.current`,
	};
	const actionCreators = {
		create: (event, data) => {
			persist(event);
			return {
				type: CONSTANTS.CREATE_ONE,
				data,
				event,
			};
		},
		delete: (event, { id }) => {
			persist(event);
			return {
				type: CONSTANTS.DELETE_ONE,
				id,
				event,
			};
		},
		fetchAll: () => ({
			type: CONSTANTS.FETCH_ALL,
		}),
		select: (event, { id }) => {
			persist(event);
			return {
				type: CONSTANTS.SELECT_ONE,
				id,
				event,
			};
		},
	};
	const cacheGetAll = {};
	const cacheGetCurrent = {};
	const selectors = {
		getAll: state => {
			const items = state.cmf.collections.get(CONSTANTS.COLLECTION_ID);
			if (cacheGetAll.key !== items) {
				cacheGetAll.key = items;
				cacheGetAll.value = items.toJS();
			}
			return cacheGetAll.value;
		},
		getCurrent: state => {
			const id = state.cmf.collections.get(CONSTANTS.CURRENT);
			if (cacheGetCurrent.key !== id) {
				cacheGetCurrent.key = id;
				delete cacheGetCurrent.value;
				const items = selectors.getAll(state);
				const found = items.find(item => item.id === id);
				if (found) {
					cacheGetCurrent.value = found;
				}
			}
			return cacheGetCurrent.value;
		},
	};

	function* fetchAllEffect() {
		return yield call(loadResource, {
			url: config.API_URL,
			id: CONSTANTS.COLLECTION_ID,
		});
	}

	function* createEffect(action) {
		return yield call(sagas.http.post, config.API_URL, action.data);
	}

	function* removeEffect(action) {
		return yield call(sagas.http.delete, `${config.API_URL}/${action.id}`);
	}

	function* selectEffect(action) {
		return yield put(actions.collections.addOrReplace(
			CONSTANTS.CURRENT, action.id
		));
	}
	function* saga() {
		yield takeEvery(CONSTANTS.DELETE_ONE, removeEffect);
		yield takeEvery(CONSTANTS.FETCH_ALL, fetchAllEffect);
		yield takeEvery(CONSTANTS.CREATE_ONE, createEffect);
		yield takeEvery(CONSTANTS.SELECT_ONE, selectEffect);
	}
	return {
		actionCreators,
		selectors,
		saga,
		sagas: {
			fetchAllEffect,
			createEffect,
			removeEffect,
			selectEffect,
		},
	};
}
