import { Base } from './base';
import { type } from '../../src';

export class Company extends Base {
    name = {
        short: type.String(),
        full: type.String(),
    };
}
