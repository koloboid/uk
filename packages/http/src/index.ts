import { type } from '@uk/type';

export namespace http {
    export function Get<TRt, TQuery = null, THeaders = {}>(returnType: TRt, queryArgs?: TQuery, headers?: THeaders) {
        return new Resolver('GET', returnType, queryArgs, undefined, headers);
    }

    export function Post<TRet, TBody, TQuery, THeaders>(
        returnType: TRet,
        bodyType: TBody,
        queryArgs?: TQuery,
        headers?: THeaders,
    ) {
        return new Resolver('POST', { returnType, queryArgs, headers, bodyType });
    }

    export class Resolver<TMethod extends Methods, TRv, TQuery = null, TBody = null, THeaders = {}> {
        constructor(readonly method: TMethod, readonly rv: TRv, query?: TQuery, body?: TBody, headers?: THeaders) {}
    }
    export namespace Resolver {
        export type Any = Resolver<Methods, any, any, any, any>;
    }

    export type Methods = 'GET' | 'POST';

    export function createServer<TSchema extends type.Class>(
        schema: TSchema,
        impl: Implementation<InstanceType<TSchema>, Context, {}>,
    ): any;
    export function createServer<TSchema extends type.Class, TCtx extends Context>(
        schema: TSchema,
        contextClass: type.Class<TCtx>,
        impl: Implementation<InstanceType<TSchema>, TCtx, type.Class<{}>>,
    ): any;
    export function createServer<
        TSchema extends type.Class,
        TCtx extends Context,
        THeaders extends type.Schema<THeaders>,
    >(
        schema: TSchema,
        contextClass: type.Class<TCtx>,
        headers: type.Class<THeaders>,
        impl: Implementation<InstanceType<TSchema>, TCtx, THeaders>,
    ): any;
    export function createServer(schema: any, contextClass?: any, headers?: any, impl?: any): any {}

    export function implement<TSchema extends type.Class>(
        schema: TSchema,
        impl: Implementation<InstanceType<TSchema>, Context, {}>,
    ): Implementation<InstanceType<TSchema>, Context, {}>;
    export function implement<TSchema extends type.Class, TCtx extends Context>(
        schema: TSchema,
        contextClass: type.Class<TCtx>,
        impl: Implementation<InstanceType<TSchema>, TCtx, {}>,
    ): Implementation<InstanceType<TSchema>, TCtx, {}>;
    export function implement<TSchema extends type.Class, TCtx extends Context, THeaders extends type.Schema<THeaders>>(
        schema: TSchema,
        contextClass: type.Class<TCtx>,
        headers: type.Class<THeaders>,
        impl: Implementation<InstanceType<TSchema>, TCtx, THeaders>,
    ): Implementation<InstanceType<TSchema>, TCtx, THeaders>;
    export function implement(schema: any, contextClass: any, headers?: any, impl?: any): any {
        throw new Error('Not implemented yet');
    }

    export type Implementation<TSchema, TCtx, THeaders> = {
        [P in keyof TSchema]: TSchema[P] extends Resolver.Any
            ? ResolverImpl<TSchema[P], TCtx, THeaders>
            : TSchema[P] extends type.Class
            ? Implementation<InstanceType<TSchema[P]>, TCtx, THeaders>
            : 'NOT_AN_SCHEMA_OR_RESOLVER';
    };

    export type ResolverImpl<R, TCtx, TParentHeaders> = R extends Resolver<
        'GET',
        infer TRv,
        infer TQuery,
        infer _TBody,
        infer THeaders
    >
        ? TRv extends type.Schema<TRv>
            ? TQuery extends null
                ? (
                      ctx: Context.Typed<TRv, TCtx, TQuery, _TBody, THeaders & TParentHeaders>,
                  ) => Promise<type.Initial<TRv> | Context.Typed<TRv, TCtx, TQuery, _TBody, THeaders>>
                : (
                      ctx: Context.Typed<TRv, TCtx, TQuery, _TBody, THeaders & TParentHeaders>,
                      query: type.Unbox<TQuery, 'plain'>,
                  ) => Promise<type.Initial<TRv> | Context.Typed<TRv, TCtx, TQuery, _TBody, THeaders>>
            : 'RETURN_TYPE_IS_NOT_A_SCHEMA'
        : 'NOT_A_RESOLVER';

    export class Context {
        query: unknown;
        headers: unknown;
        body: unknown;
        req: unknown;
        resp: unknown;
    }

    export namespace Context {
        export type Typed<TRv extends type.Schema<TRv>, TCtx, TQuery, TBody, THeaders> = TCtx & {
            query: type.Unbox<TQuery, 'plain'>;
            headers: type.Unbox<THeaders, 'plain'>;
            body: type.Unbox<TBody, 'plain'>;
            send(status: number, resp: type.Initial<TRv>): Typed<TRv, TCtx, TQuery, TBody, THeaders>;
        };
    }

    export function createClient<TSchema>(opts: any): Client<TSchema> {
        throw new Error('Not implemented yet');
    }

    export type Client<TSchema> = {
        [P in keyof TSchema]: TSchema[P] extends Resolver.Any
            ? ClientCall<TSchema[P]>
            : TSchema[P] extends type.Class
            ? Client<InstanceType<TSchema[P]>>
            : 'NOT_AN_SCHEMA_OR_RESOLVER';
    };

    export type ClientCall<R> = R extends Resolver<'GET', infer TRv, infer TQuery, infer _TBody, infer THeaders>
        ? TRv extends type.Schema<TRv>
            ? TQuery extends null
                ? () => Promise<type.Initial<TRv>>
                : (query: type<TQuery>) => Promise<type.Initial<TRv>>
            : 'RETURN_TYPE_IS_NOT_A_SCHEMA'
        : 'NOT_A_RESOLVER';
}
