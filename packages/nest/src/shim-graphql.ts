/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

const nest = require('@nestjs/graphql');

export function PartialType<T>(of: { new(): T }): { new(): Partial<T> } {
    return nest.PartialType(of)
}

//////////////////////////////////////////////////////////////////////

export interface ObjectTypeOptions {
    description?: string;
    isAbstract?: boolean;
    implements?: Function | Function[] | (() => Function | Function[]);
}

export type ObjectType = {
    (): ClassDecorator;
    (options: ObjectTypeOptions): ClassDecorator;
    (name: string, options?: ObjectTypeOptions): ClassDecorator;
};

export interface InputTypeOptions {
    description?: string;
    isAbstract?: boolean;
}

export interface InputType {
    (): ClassDecorator;
    (options: InputTypeOptions): ClassDecorator;
    (name: string, options?: InputTypeOptions): ClassDecorator;
}

export const InputType: InputType = nest.InputType ?? (() => () => {});
export const ObjectType: ObjectType = nest.ObjectType ?? (() => () => {});
export const Args: any = nest.Args ?? (() => () => {});
export const Int: any = nest.Int ?? (() => () => {});
export const ID: any = nest.ID ?? (() => () => {});
export const NestField: any = nest.Field ?? (() => () => {});
export const Float: any = nest.Float ?? (() => () => {});
export const registerEnumType: any = nest.registerEnumType ?? (() => {});
