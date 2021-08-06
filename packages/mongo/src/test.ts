import { MongoClient } from 'mongodb';
import { envConfig } from '@uk/config';
import { Model } from './model';
import type from '@uk/type';

export const config = envConfig({
    MONGO: 'mongodb://127.0.0.1/__ukmongotest',
});

export const client = new MongoClient(config.MONGO, {
    useUnifiedTopology: true,
});

class User {
    _id = type.MongoID().primary().auto();
    a = String;
    b = Number;
}

const TUser = new Model(User, { client });
