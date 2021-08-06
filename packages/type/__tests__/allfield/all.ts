import { INumbers, Numbers } from './numbers';
import { IStrings, Strings } from './strings';
import { Flags, IFlags } from './flags';
import { Dates, IDates } from './dates';
import { Blobs, IBlobs } from './blobs';
import { Identifiers, IIdentifiers } from './identifiers';
import { IObjects, Objects } from './objects';
import { Arrays, IArrays } from './arrays';
import { Hashes, IHashes } from './hashes';
import { assignTest, type, expectTypeOf, __ } from './stuff';

export const All = {
    ...new Numbers(),
    ...new Strings(),
    ...new Flags(),
    ...new Dates(),
    ...new Blobs(),
    ...new Identifiers(),
    ...new Objects(),
    ...new Arrays(),
    //    ...new Hashes(),
};
export type All = typeof All;

export interface IAll extends INumbers, IStrings, IFlags, IDates, IBlobs, IIdentifiers, IObjects, IArrays {}

assignTest<type.Initial<All>>(__ as IAll);
assignTest<IAll>(__ as type.Initial<All>);
expectTypeOf<type.Initial<All>>().toEqualTypeOf<IAll>();
