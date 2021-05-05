/// <reference types="node" />
import { RouteOptions } from 'fastify';
import { JsonSchemaProperty, ObjectJsonSchemaProperty } from 'type-jsonschema';
export declare const errorLabel = "[ERROR] fastify-autoload:";
export declare type ValidMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS';
export declare type AnyRoute = Omit<RouteOptions, 'method' | 'url'>;
export declare type DeleteRoute = AnyRoute;
export declare type GetRoute = Omit<AnyRoute, 'body'>;
export declare type HeadRoute = AnyRoute;
export declare type PatchRoute = AnyRoute;
export declare type PostRoute = AnyRoute;
export declare type PutRoute = AnyRoute;
export declare type OptionsRoute = AnyRoute;
interface Security {
    [key: string]: string[];
}
interface StrictAnyRoute extends AnyRoute {
    schema: {
        summary?: string;
        description?: string;
        security?: Security[];
        tags?: string[];
        consumes?: string[];
        produces?: string[];
        body?: JsonSchemaProperty;
        querystring?: JsonSchemaProperty;
        params?: ObjectJsonSchemaProperty['properties'];
        headers?: JsonSchemaProperty;
        response?: {
            [key: number]: JsonSchemaProperty;
        };
    };
}
export declare type StrictDeleteRoute = StrictAnyRoute;
export declare type StrictGetRoute = Omit<StrictAnyRoute, 'body'>;
export declare type StrictHeadRoute = StrictAnyRoute;
export declare type StrictPatchRoute = StrictAnyRoute;
export declare type StrictPostRoute = StrictAnyRoute;
export declare type StrictPutRoute = StrictAnyRoute;
export declare type StrictOptionsRoute = StrictAnyRoute;
export interface Resource {
    delete?: DeleteRoute;
    get?: GetRoute;
    head?: HeadRoute;
    patch?: PatchRoute;
    post?: PostRoute;
    put?: PutRoute;
    options?: OptionsRoute;
}
export interface StrictResource {
    delete?: StrictDeleteRoute;
    get?: StrictGetRoute;
    head?: StrictHeadRoute;
    patch?: StrictPatchRoute;
    post?: StrictPostRoute;
    put?: StrictPutRoute;
    options?: StrictOptionsRoute;
}
interface FastifyAutoroutesOptions {
    dir: string;
    log?: boolean;
}
declare const _default: import("fastify").FastifyPluginCallback<FastifyAutoroutesOptions, import("http").Server>;
export default _default;
