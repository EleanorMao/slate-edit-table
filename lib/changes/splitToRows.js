// @flow
import { type Change } from '@gitbook/slate';
import type Options from '../options';
import { isSelectionOutOfTable } from '../utils';
import splitToRowsByKey from './splitToRowsByKey';

function splitToRows(opts: Options, change: Change): Change {
    const { value } = change;
    if (isSelectionOutOfTable(opts, value)) {
        return undefined;
    }
    const { startKey } = value;
    return splitToRowsByKey(opts, change, startKey);
}

export default splitToRows;
