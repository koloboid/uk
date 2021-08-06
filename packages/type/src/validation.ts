import { Shape } from './shape';
import { type } from './type';

export class ValidationError extends Error {}

export class Validator<TSchema extends type.Schema<TSchema>> {
    constructor(private shape: Shape.Any, private validations: Validation<TSchema>) {}

    validate(doc: type.Plain<TSchema>) {
        if (doc === null) throw new ValidationError('DOCUMENT_IS_NULL');
        if (doc === undefined) throw new ValidationError('DOCUMENT_IS_UNDEFINED');
        if (typeof doc !== 'object') throw new ValidationError('DOCUMENT_IS_NOT_OBJECT');
        for (const n in this.validations) {
            const validator = this.validations[n];
            let checker;
            const value = this.shape.fields.get(n)?.get(doc);
            if (value instanceof Date) checker = new DateChecker(value);
            else if (typeof value === 'number') checker = new NumberChecker(value);
            else if (typeof value === 'string') checker = new StringChecker(value);
            if (checker) {
                type.writeable(Object.freeze({ foo: 'abr', a: 2 }));
            }
        }
    }
}

export type Validation<
    TSchema extends type.Schema<TSchema>,
    TPlain = type.Plain<TSchema>,
    TKeys extends type.Path.Keys<TPlain> = type.Path.Keys<TPlain>,
> = {
    [P in TKeys]: (
        checker: SelectChecker<type.Path.Prop<TPlain, P>>,
        value: type.Path.Prop<TPlain, P>,
    ) => boolean | Checker<any>;
};

export type SelectChecker<TType> = TType extends string
    ? StringChecker
    : TType extends number
    ? NumberChecker
    : TType extends Date
    ? DateChecker
    : never;

export abstract class Checker<T> {
    constructor(readonly value: T) {}
}

export class StringChecker extends Checker<string> {
    length(min: number, max?: number) {
        return this;
    }
}

export class NumberChecker extends Checker<number> {}

export class DateChecker extends Checker<Date> {}
