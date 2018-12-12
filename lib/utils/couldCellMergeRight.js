// @flow
import { type Value } from '@gitbook/slate';

import type Options from '../options';
import TablePosition from './TablePosition';

/**
 * Create a new cell
 */
function couldCellMergeRight(opts: Options, value: Value): Boolean {
    const startKey = value.selection.startKey;
    if (!startKey) return false;
    const pos = TablePosition.create(opts, value.document, startKey);
    const nextCellInfo = pos.getCellInfoNextCol();
    const rowSpan = parseInt(pos.cell.getIn(['data', 'rowSpan']), 10) || 1;
    if (nextCellInfo && nextCellInfo.rowSpan === rowSpan) return true;
    return false;
}

export default couldCellMergeRight;
