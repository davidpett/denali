import DenaliObject from '../metal/object';
import Model from './model';
import { RelationshipDescriptor } from './descriptors';

/**
 * The ORMAdapter class is responsible for enabling Denali to communicate with the ORM of your
 * choice. It does this by boiling down the possible actions that a user might before against a
 * Model that would involve persistence into a set of basic operations. Your adapter then implements
 * these operations, and Denali can build on top of that.
 *
 * @module denali
 * @submodule data
 */
abstract class ORMAdapter extends DenaliObject {

  /**
   * ORM Adapters should be singletons
   */
  static singleton = true;

  /**
   * Find a record by id.
   */
  public abstract async find(type: string, id: any, options: any): Promise<any>;

  /**
   * Find a single record that matches the given query.
   */
  public abstract async findOne(type: string, query: any, options: any): Promise<any>;

  /**
   * Find all records of this type.
   */
  public abstract async all(type: string, options: any): Promise<any[]>;

  /**
   * Find all records that match the given query.
   */
  public abstract async query(type: string, query: any, options: any): Promise<any[]>;

  /**
   * Return the id for the given model.
   */
  public abstract idFor(model: Model): any;

  /**
   * Set the id for the given model.
   */
  public abstract setId(model: Model, value: any): void;

  /**
   * Build an internal record instance of the given type with the given data. Note that this method
   * should return the internal, ORM representation of the record, not a Denali Model.
   */
  public abstract buildRecord(type: string, data: any, options: any): any;

  /**
   * Return the value for the given attribute on the given record.
   */
  public abstract getAttribute(model: Model, attribute: string): any;

  /**
   * Set the value for the given attribute on the given record.
   *
   * @returns returns true if set operation was successful
   */
  public abstract setAttribute(model: Model, attribute: string, value: any): boolean;

  /**
   * Delete the value for the given attribute on the given record. The semantics of this may behave
   * slightly differently depending on backend - SQL databases may NULL out the value, while
   * document stores like Mongo may actually delete the key from the document (rather than just
   * nulling it out)
   *
   * @returns returns true if delete operation was successful
   */
  public abstract deleteAttribute(model: Model, attribute: string): boolean;

  /**
   * Return the related record(s) for the given relationship.
   *
   * @param model The model whose related records are being fetched
   * @param relationship The name of the relationship on the model that should be fetched
   * @param descriptor The RelationshipDescriptor of the relationship being fetch
   * @param query An optional query to filter the related records by
   */
  public abstract async getRelated(model: Model, relationship: string, descriptor: RelationshipDescriptor, query: any, options: any): Promise<any|any[]>;

  /**
   * Set the related record(s) for the given relationship. Note: for has-many relationships, the
   * entire set of existing related records should be replaced by the supplied records. The old
   * related records should be "unlinked" in their relationship. Whether that results in the
   * deletion of those old records is up to the ORM adapter, although it is recommended that they
   * not be deleted unless the user has explicitly expressed that intent.
   *
   * @param model The model whose related records are being altered
   * @param relationship The name of the relationship on the model that should be altered
   * @param descriptor The RelationshipDescriptor of the relationship being altered
   * @param related The related record(s) that should be linked to the given relationship
   */
  public abstract async setRelated(model: Model, relationship: string, descriptor: RelationshipDescriptor, related: any, options: any): Promise<void>;

  /**
   * Add related record(s) to a hasMany relationship. Existing related records should remain
   * unaltered.
   *
   * @param model The model whose related records are being altered
   * @param relationship The name of the relationship on the model that should be altered
   * @param descriptor The RelationshipDescriptor of the relationship being altered
   * @param related The related record(s) that should be linked to the given relationship
   */
  public abstract async addRelated(model: Model, relationship: string, descriptor: RelationshipDescriptor, related: Model|Model[], options: any): Promise<void>;

  /**
   * Remove related record(s) from a hasMany relationship. Note: The removed related records should
   * be "unlinked" in their relationship. Whether that results in the deletion of those old records
   * is up to the ORM adapter, although it is recommended that they not be deleted unless the user
   * has explicitly expressed that intent.
   *
   * @param model The model whose related records are being altered
   * @param relationship The name of the relationship on the model that should be altered
   * @param descriptor The RelationshipDescriptor of the relationship being altered
   * @param related The related record(s) that should be removed from the relationship; if not
   *                provided, then all related records should be removed
   */
  public abstract async removeRelated(model: Model, relationship: string, descriptor: RelationshipDescriptor, related: Model|Model[]|null, options: any): Promise<void>;

  /**
   * Persist the supplied model.
   */
  public abstract async saveRecord(model: Model, options: any): Promise<void>;

  /**
   * Delete the supplied model from the persistent data store.
   */
  public abstract async deleteRecord(model: Model, options: any): Promise<void>;

  /**
   * Takes an array of Denali Models and defines an ORM specific model class, and/or any other ORM
   * specific setup that might be required for that Model.
   */
  public async defineModels(models: typeof Model[]): Promise<void> {
    // defaults to no-op
  };

}

export default ORMAdapter;
