import { MongoClient } from 'mongodb';
import { envConfig } from '@uk/config';
export { Model } from '../../../dist';

export const config = envConfig({
    MONGO: 'mongodb://127.0.0.1/__ukmongotest',
});

export const client = new MongoClient(config.MONGO, {
    useUnifiedTopology: true,
});
