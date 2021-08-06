export { MongoClient } from 'mongodb';
export * from './model';
export * from './select';
export * from './update';

export type SortDir = 1 | -1 | 'asc' | 'desc' | 'ASC' | 'DESC';
