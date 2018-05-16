/**
 * @module react-cmf/lib/actions/collectionsActions
 */
import CONSTANTS from '../constant';

// keep backward compatibility
export const { COLLECTION_ADD_OR_REPLACE, COLLECTION_REMOVE, COLLECTION_MUTATE } = CONSTANTS;

/**
 * Add or replace collection data in store
 * @param {string} collectionId identifier
 * @param {any} data element that represent business data
 */
export function addOrReplace(collectionId, data) {
	return {
		type: CONSTANTS.COLLECTION_ADD_OR_REPLACE,
		collectionId,
		data,
	};
}

/**
 * Remove collection data in store to free space
 * @param {string} collectionId identifier
 *
 * @throws if you try to remove non existent collection
 */
export function remove(collectionId) {
	return {
		type: CONSTANTS.COLLECTION_REMOVE,
		collectionId,
	};
}

/**
 * mutateCollection let's you apply operations on a given collection
 *
 * @param {string} id collection identifier
 * @param {object} operations operations to be applied on the collection
 * {
 * 		add: [],
 * 		update: {},
 * 		delete: []
 * }
 */
export function mutate(id, operations) {
	return {
		type: CONSTANTS.COLLECTION_MUTATE,
		id,
		operations,
	};
}

// backward compatibility
export const addOrReplaceCollection = addOrReplace;
export const mutateCollection = mutate;
export const removeCollection = remove;
