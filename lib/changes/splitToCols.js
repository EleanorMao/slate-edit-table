// @flow
import { type Change } from '@gitbook/slate';
import type Options from '../options';
import { isSelectionOutOfTable } from '../utils';
import splitToColsByKey from './splitToColsByKey';

function splitToCols(opts: Options, change: Change): Change {
    const { value } = change;
    if (isSelectionOutOfTable(opts, value)) {
        return undefined;
    }
    const { startKey } = value;
    return splitToColsByKey(opts, change, startKey);
}

export default splitToCols;
