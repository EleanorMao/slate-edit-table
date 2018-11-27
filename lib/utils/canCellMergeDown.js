// @flow
import { type Value } from '@gitbook/slate';

import type Options from '../options';
import TablePosition from './TablePosition';

/**
 * Create a new cell
 */
function canCellMergeDown(opts: Options, value: Value): Boolean {
    const startKey = value.selection.startKey;
    if (!startKey) return false;
    const pos = TablePosition.create(opts, value.document, startKey);
    const nextCellInfo = pos.getCellInfoNextRow();
    const colSpan = parseInt(pos.cell.getIn(['data', 'colSpan']), 10) || 1;
    if (nextCellInfo && nextCellInfo.colSpan === colSpan) return true;
    return false;
}

export default canCellMergeDown;
