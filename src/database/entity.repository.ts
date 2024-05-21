import { Document, FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

/**
 * Abstract class to represent a generic repository for a Mongoose model.
 * This class provides common database operations for a given Mongoose model.
 *
 * @template T extends Document - The Mongoose document type.
 */
export abstract class EntityRepository<T extends Document> {
  /**
   * Constructor to create an instance of the repository.
   *
   * @param {Model<T>} entityModel - The Mongoose model this repository is associated with.
   */
  constructor(private readonly entityModel: Model<T>) {}

  /**
   * Creates a new document in the database.
   *
   * @param {unknown} createEntityData - The data to create a new entity.
   * @returns {Promise<T>} A promise that resolves with the created document.
   */
  create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  /**
   * Finds documents matching the given query.
   *
   * @param {FilterQuery<T>} entityFilterQuery - The query to filter documents. Default is an empty object.
   * @param {QueryOptions<T>} options - Query options. Default is an empty object.
   * @param {ProjectionType<T>} projection - Fields to include or exclude. Default is an empty object.
   * @returns {Promise<T[] | null>} A promise that resolves with the found documents or null.
   */
  find(
    entityFilterQuery: FilterQuery<T> = {},
    options: QueryOptions<T> = {},
    projection: ProjectionType<T> = {},
  ): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery, projection, options).exec();
  }

  /**
   * Finds a single document matching the given query.
   *
   * @param {FilterQuery<T>} entityFilterQuery - The query to filter the document. Default is an empty object.
   * @param {QueryOptions<T>} options - Query options. Default is an empty object.
   * @param {ProjectionType<T>} projection - Fields to include or exclude. Default is an empty object.
   * @returns {Promise<T | null>} A promise that resolves with the found document or null.
   */
  findOne(
    entityFilterQuery: FilterQuery<T> = {},
    options: QueryOptions<T> = {},
    projection: ProjectionType<T> = {},
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, projection, options).exec();
  }

  /**
   * Finds a single document matching the query and updates it.
   *
   * @param {UpdateQuery<unknown>} updateEntityData - The update operations to be applied to the document.
   * @param {FilterQuery<T>} entityFilterQuery - The query to filter the document. Default is an empty object.
   * @param {QueryOptions<T>} options - Query options. Default is an empty object.
   * @returns {Promise<T | null>} A promise that resolves with the updated document or null.
   */
  findOneAndUpdate(
    updateEntityData: UpdateQuery<unknown>,
    entityFilterQuery: FilterQuery<T> = {},
    options: QueryOptions<T> = {},
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, options).exec();
  }

  /**
   * Finds a single document matching the query and deletes it.
   *
   * @param {FilterQuery<T>} entityFilterQuery - The query to filter the document. Default is an empty object.
   * @param {QueryOptions<T>} options - Query options. Default is an empty object.
   * @returns {Promise<T | null>} A promise that resolves with the deleted document or null.
   */
  findOneAndDelete(entityFilterQuery: FilterQuery<T> = {}, options: QueryOptions<T> = {}): Promise<T | null> {
    return this.entityModel.findOneAndDelete(entityFilterQuery, options).exec();
  }
}
