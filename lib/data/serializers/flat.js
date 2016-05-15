import assert from 'assert';
import { singularize } from 'inflection';
import Serializer from '../serializer';
import Model from '../model';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import mapValues from 'lodash/mapValues';
import isUndefined from 'lodash/isUndefined';

/**
 * Renders the payload as a flat JSON object or array at the top level. Related
 * records are embedded.
 *
 * @title FlatSerializer
 */

export default class FlatSerializer extends Serializer {

  /**
   * Renders the payload, either a primary data payload or an error payload.
   *
   * @method render
   *
   * @param  {Object|Array} payload  a record, array of records, or error
   * @param  {Object} options
   *
   * @return {Object|Array}         the rendered payload
   */
  render(payload, options = {}) {
    if (payload instanceof Error) {
      return this.renderError(payload);
    }
    return this.renderPrimary(payload, options);
  }

  /**
   * Renders a primary data payload (a record or array of records).
   *
   * @method renderPrimary
   *
   * @param  {Object|Array}  payload  record or array of records
   * @param  {Object}  options
   *
   * @return {Object|Array}              the rendered primary data
   */
  renderPrimary(payload, options) {
    if (isArray(payload)) {
      return payload.map((record) => {
        return this.renderRecord(record, options);
      });
    }
    return this.renderRecord(payload, options);
  }

  /**
   * Renders an individual record
   *
   * @method renderRecord
   *
   * @param  {Object}     record
   * @param  {Object}     options
   *
   * @return {Object}             the rendered record
   */
  renderRecord(record, options) {
    let id = record.id;
    let attributes = this.serializeAttributes(record, options);
    let relationships = this.serializeRelationships(record, options);
    relationships = mapValues(relationships, (relationship) => {
      return relationship.data;
    });
    return assign({ id }, attributes, relationships);
  }

  /**
   * Serialize the attributes for a given record
   *
   * @param  {Object}      record
   * @param  {Object}      options
   *
   * @return {Object}      the serialized attributes
   */
  serializeAttributes(record) {
    let serializedAttributes = {};
    this.attributes.forEach((attributeName) => {
      let key = this.serializeAttributeName(attributeName);
      let rawValue = record.getAttribute(attributeName);
      if (!isUndefined(rawValue)) {
        let value = this.serializeAttributeValue(rawValue, key, record);
        serializedAttributes[key] = value;
      }
    });
    return serializedAttributes;
  }

  /**
   * Transform attribute names into their over-the-wire representation. Default
   * behavior uses the attribute name as-is.
   *
   * @method serializeAttributeName
   *
   * @param  {name}               name the attribute name to serialize
   *
   * @return {String}                    the serialized attribute name
   */
  serializeAttributeName(attributeName) {
    return attributeName;
  }

  /**
   * Take an attribute value and return the serialized value. Useful for
   * changing how certain types of values are serialized, i.e. Date objects.
   *
   * The default implementation returns the attribute's value unchanged.
   *
   * @method serializeAttributeValue
   *
   * @param  {*}            value
   * @param  {String}       key
   * @param  {Object}       record
   *
   * @return {*}             the value that should be rendered
   */
  serializeAttributeValue(value/* , key, record */) {
    return value;
  }

  serializeRelationships(record, options = {}) {
    let serializedRelationships = {};

    // The result of this.relationships is a whitelist of which relationships
    // should be serialized, and the configuration for their serialization
    let relationships = typeof this.relationships === 'function' ? this.relationships.call(options.action) : this.relationships;
    relationships.forEach((config) => {
      if (typeof config === 'string') {
        config = { name: config, type: singularize(config) };
      }
      let key = config.key || this.serializeRelationshipName(config.name);
      let descriptor = record.constructor[config.name];
      assert(descriptor, `You specified a '${ config.name }' relationship in your ${ record.constructor.type } serializer, but no such relationship is defined on the ${ record.constructor.type } model`);
      serializedRelationships[key] = this.serializeRelationship(config, descriptor, record, options);
    });
  }

  serializeRelationship(config, descriptor, record, options) {
    if (isArray(record)) {
      if (record[0] instanceof Model) {
        let relatedSerializer = Serializer.serializerFor(record, options);
        return record.map((relatedRecord) => {
          return relatedSerializer.renderRecord(relatedRecord, options);
        });
      }
      return record;
    }
    if (record instanceof Model) {
      let relatedSerializer = Serializer.serializerFor(record, options);
      return relatedSerializer.renderRecord(record, options);
    }
    return record;
  }

  /**
   * Transform relationship names into their over-the-wire representation. Default
   * behavior uses the relationship name as-is.
   *
   * @method serializeRelationshipName
   *
   * @param  {name}               name the relationship name to serialize
   *
   * @return {String}                    the serialized relationship name
   */
  serializeRelationshipName(name) {
    return name;
  }

  /**
   * Render an error payload
   *
   * @method renderError
   *
   * @param  {Error}    error
   *
   * @return {Object}          the rendered error payload
   */
  renderError(error) {
    return {
      status: error.status || 500,
      code: error.code || 'InternalServerError',
      message: error.message
    };
  }

}
