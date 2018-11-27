// @flow
import { type Block } from '@gitbook/slate';
import { type List } from 'immutable';

import type Options from '../options';

/**
 * Returns the list of cells at the given column index
 */
function getCellByCellIndex(
    opts: Options,
    // The table
    table: Block,
    cellIndex: number
): List<Block> {
    return table.nodes.map(row => row.nodes.get(cellIndex));
}

export default getCellByCellIndex;
