import type from "../../src";

export type FK<T, FK> = type.Compute<T & { __fk: FK }>;
