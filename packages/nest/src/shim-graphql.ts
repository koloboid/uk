/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as mappedTypes from 'nestjs-mapped-types';

var nest;
try {
    nest = eval(`require('@nestjs/graphql')`);
} catch {}

nest = nest?.PartialType ? nest : mappedTypes;

export const PartialType: typeof mappedTypes.PartialType = nest.PartialType;
export const IntersectionType: typeof mappedTypes.IntersectionType = nest.IntersectionType;
export const PickType: typeof mappedTypes.PickType = nest.PickType;
export const OmitType: typeof mappedTypes.OmitType = nest.OmitType;

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
