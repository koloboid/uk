import { type } from '../../src';
import { expectType } from 'tsd';
import { ObjectID } from 'bson';
import { Object1, Object2, Scalars } from './models';
import { PObject1 } from './plain';

//declare const plainObject1: type.Selector<type.Joined<Object1>, '*'>;
declare const plainObject1: type.Select<Object2, '*'>;
plainObject1.arrayHashScalars[0]['s'];

// expectType<typeof plainObject1>(plainObject1 as PObject1);
// expectType<PObject1>(plainObject1);
