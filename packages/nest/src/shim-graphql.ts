/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as mappedTypes from 'nestjs-mapped-types';

var nestGraphql;
try {
    nestGraphql = eval(`require('@nestjs/graphql')`);
} catch {}
var graphqlUpload: any = {};
try {
    graphqlUpload = eval(`require('graphql-upload')`);
} catch {}

nestGraphql = nestGraphql?.PartialType ? nestGraphql : mappedTypes;

export const PartialType: typeof mappedTypes.PartialType = nestGraphql.PartialType;
export const IntersectionType: typeof mappedTypes.IntersectionType = nestGraphql.IntersectionType;
export const PickType: typeof mappedTypes.PickType = nestGraphql.PickType;
export const OmitType: typeof mappedTypes.OmitType = nestGraphql.OmitType;

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

export const InputType: InputType = nestGraphql.InputType ?? (() => () => {});
export const ObjectType: ObjectType = nestGraphql.ObjectType ?? (() => () => {});
export const Args: any = nestGraphql.Args ?? (() => () => {});
export const Int: any = nestGraphql.Int ?? (() => () => {});
export const ID: any = nestGraphql.ID ?? (() => () => {});
export const NestField: any = nestGraphql.Field ?? (() => () => {});
export const Float: any = nestGraphql.Float ?? (() => () => {});
export const registerEnumType: any = nestGraphql.registerEnumType ?? (() => {});

export const GraphQLUpload = graphqlUpload.GraphQLUpload ?? (() => {});
