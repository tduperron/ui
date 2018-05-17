import * as Constants from './Constants';
import DataAccessorWithSorterAndFilter from '../index';

/**
 * This class wraps a data accessor and a mapping accessor
 * and provides some convenient methods to manipulate data.
 * It uses a cache to store the schema elements.
 * It manages the filtering and sorting of the data.
 */
export default class DataAccessorWrapper {
	constructor(dataAccessor, mappingAccessor) {
		this.dataAccessor = dataAccessor;
		this.mappingAccessor = mappingAccessor;
		this.cache = {};
		this.schema2side = {};
		this.internalDataAccessors = {};
		this.mappingVersion = 0;
	}

	/**
	* @private
	*/
	side(schema) {
		return this.schema2side[this.getSchemaId(schema)];
	}

	isRegistered(schema) {
		return side(schema);
	}

	registerSchema(schema, side) {
		const schemaId = this.getSchemaId(schema);
		this.schema2side[schemaId] = side;
		this.initializeInternalDataAccessor(schema, side);
		this.populateCache(schema, side);
	}

	/**
	* @private
	*/
	initializeInternalDataAccessor(schema, side) {
		const elements = this.getSchemaElements(schema, false);
		this.internalDataAccessors[side] = new DataAccessorWithSorterAndFilter(
			elements,
			this.dataAccessor
		);
	}

	/**
	* @private
	*/
	populateCache(schema, side) {
		this.cache[side] = {};
		const elements = this.getSchemaElements(schema, false);
		for (let i = 0; i < elements.length; i += 1) {
			this.cache[side][this.getElementId(elements[i])] = elements[i];
		}
	}

	/**
	* @private
	*/
	access(schema) {
		return this.internalDataAccessors[this.side(schema)];
	}

	isCacheInitialized() {
		return this.cache;
	}

	getSchemaElementFromCache(schema, id) {
		return this.cache[this.side(schema)][id];
	}

	getElementFromCache(side, id) {
		return this.cache[side][id];
	}

	addFilter(schema, filter) {
		this.access(schema).addFilter(filter);
	}

	getFiltersVersion(schema) {
		return this.access(schema).getFiltersVersion();
	}

	removeFilter(schema, filter) {
		this.access(schema).removeFilter(filter);
	}

	filterSchema(schema, filterId) {
		this.access(schema).filter(filterId);
	}

	filterAll(schema) {
		this.access(schema).filterAll();
	}

	hasFilters(schema) {
		return this.access(schema).hasFilters();
	}

	hasFiltersActive(schema) {
		return this.access(schema).hasFiltersActive();
	}

	isFiltered(schema, element) {
		return this.access(schema).isFiltered(element);
	}

	setSorter(schema, sorter) {
		this.access(schema).setSorter(sorter);
	}

	hasSorter(schema) {
		return this.access(schema).hasSorter();
	}

	getSorter(schema) {
		return this.access(schema).getSorter();
	}

	clearSorter(schema) {
		this.access(schema).clearSorter();
	}

	sort(schema) {
		this.access(schema).sort();
	}

	/**
	 * Returns true if the two elements are equals.
	 * Default implementation is based on element id.
	 */
	areElementsEqual(element1, element2) {
		if (this.dataAccessor.areElementsEqual) {
			return this.dataAccessor.areElementsEqual(element1, element2);
		}
		return this.getElementId(element1) === this.getElementId(element2);
	}

	getSchemaId(schema) {
		return this.dataAccessor.getSchemaId(schema);
	}

	/**
	 * Returns the name of the schema.
	 */
	getSchemaName(schema) {
		return this.dataAccessor.getSchemaName(schema);
	}

	/**
	 * Returns the number of elements in the schema.
	 * @param {object} schema - The schema
	 * @param {boolean} withFiltersAndSorter - if true then the result takes into account the filters.
	 */
	getSchemaSize(schema, withFiltersAndSorter) {
		return this.access(schema).getSize(withFiltersAndSorter);
	}

	/**
	 * Returns all the elements of the schema in an array.
	 */
	getSchemaElements(schema, withFiltersAndSorter) {
		return this.access(schema).getElements(withFiltersAndSorter);
	}

	/**
	 * Returns the nth element of the schema.
	 */
	getSchemaElement(schema, index, withFiltersAndSorter) {
		return this.access(schema).getElement(index, withFiltersAndSorter);
	}

	/**
	 * Returns the index of the given element,
	 * returns -1 if it is not in the schema.
	 */
	getSchemaElementIndex(schema, element, withFiltersAndSorter) {
		return this.access(schema).getElementIndex(element, withFiltersAndSorter);
	}

	/**
	* Returns the element corresponding to the given schema and identifier.
	* @param {object} schema - The schema
	* @param {string} id - the element identifier
	*/
	getSchemaElementFromId(schema, id) {
		if (this.isCacheInitialized()) {
			return this.getSchemaElementFromCache(schema, id);
		}
		return this.access(schema).getElementFromId(id);
	}

	/**
	 * Returns the identifier of the element.
	 * Identifier must be unique.
	 */
	getElementId(element) {
		return this.dataAccessor.getElementId(element);
	}

	/**
	* Returns a label for the given element.
	*/
	getElementLabel(element) {
		return this.dataAccessor.getElementLabel(element);
	}

	/**
	 * Returns true if the array of elements contains the specified element.
	 */
	includes(elements, element) {
		if (this.dataAccessor.includes) {
			return this.dataAccessor.includes(elements, element);
		}
		for (let i = 0; i < elements.length; i += 1) {
			if (this.areElementsEqual(elements[i], element)) {
				return true;
			}
		}
		return false;
	}

	getRowData(element, key) {
    return this.dataAccessor.getRowData(element, key);
  }

  getHeaderData(key) {
    return this.dataAccessor.getHeaderData(key);
  }

	haveSameData(element1, element2, key) {
		const data1 = this.getRowData(element1, key);
		const data2 = this.getRowData(element2, key);
		return data1 && data2 && data1 === data2;
	}

	getMappingVersion() {
		return this.mappingVersion;
	}

	/**
	 * Returns an array of all the mapping items. A mapping item defines
	 * a mapping between an input and an output element.
	 */
	getMappingItems(mapping) {
		return this.mappingAccessor.getMappingItems(mapping);
	}

	/**
	 * Returns true if the given mapping is empty
	 */
	isMappingEmpty(mapping) {
		return this.mappingAccessor.isMappingEmpty(mapping);
	}

	/**
	 * Return the mapped element for the specified side.
	 */
	getMappedElement(mappingItem, side) {
		return this.mappingAccessor.getMappedElement(mappingItem, side);
	}

	/**
	 * Add a new mapping from source element to target element.
	 * Returns the updated mapping.
	 */
	addMapping(mapping, source, target) {
		this.mappingVersion += 1;
		return this.mappingAccessor.addMapping(mapping, source, target);
	}

	addMappingItems(mapping, mappingItems) {
		let updatedMapping = mapping;
		for (let i = 0; i < mappingItems.length; i += 1) {
			const item = mappingItems[i];
			updatedMapping = this.mappingAccessor.addMapping(updatedMapping, item.source, item.target);
		}
		this.mappingVersion += 1;
		return updatedMapping;
	}

	/**
	 * Remove the (source->target) mapping.
	 * Returns the updated mapping.
	 */
	removeMapping(mapping, source, target) {
		this.mappingVersion += 1;
		return this.mappingAccessor.removeMapping(mapping, source, target);
	}

	/**
	 * Remove all the mapping items.
	 * Returns the updated mapping.
	 */
	clearMapping(mapping) {
		this.mappingVersion += 1;
		return this.mappingAccessor.clearMapping(mapping);
	}

	// Some more convenient methods

	isElementInMappingItem(mappingItem, element, side) {
		const mappedElement = this.getMappedElement(mappingItem, side);
		return this.areElementsEqual(mappedElement, element);
	}

	/**
	 * isElementMapped returns true if the given (element, side) is mapped
	 * (i.e. if it appears in the mapping)
	 */
	isElementMapped(mapping, element, side) {
		if (mapping != null) {
			const mappingItems = this.getMappingItems(mapping);
			return mappingItems.find(item => this.isElementInMappingItem(item, element, side));
		}
		return false;
	}

	/**
	 * isFullMapped returns true if all the elements of the given schema are mapped
	 */
	isFullMapped(mapping, schema, side) {
		// TODO could be optimized
		for (let i = 0; i < this.getSchemaSize(schema, false); i += 1) {
			if (!this.isElementMapped(mapping, this.getSchemaElement(schema, i, false), side)) {
				return false;
			}
		}
		return true;
	}

	getMappingItemsWithElement(mapping, element, side) {
		const mappingItems = this.getMappingItems(mapping);
		return mappingItems.filter(item => this.isElementInMappingItem(item, element, side));
	}

	getConnectedElements(mapping, element, side) {
		const items = this.getMappingItemsWithElement(mapping, element, side);
		if (items != null) {
			const connectedSide = Constants.switchMappingSide(side);
			return items.map(item => this.getMappedElement(item, connectedSide));
		}
		return null;
	}

	haveSameContent(elements1, elements2) {
		if (elements1 && elements2) {
			if (elements1.length === elements2.length) {
				for (let i = 0; i < elements1.length; i += 1) {
					if (!this.includes(elements2, elements1[i])) {
						return false;
					}
				}
				return true;
			}
			return false;
		} else if (elements1 || elements2) {
			return false;
		}
		return true;
	}

}
