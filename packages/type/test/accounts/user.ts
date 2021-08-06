import { Base } from "./base";
import { type } from "../../src";

export class User extends Base {
    name = {
        first: type.String(),
        last: type.String(),
    };
};
