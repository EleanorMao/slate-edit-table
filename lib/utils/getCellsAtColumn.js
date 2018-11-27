// @flow
import { type Block } from '@gitbook/slate';
import { type List, List as L } from 'immutable';

import type Options from '../options';
import getTableInfo from './getTableInfo';

/**
 * Returns the list of cells at the given column index
 */
function getCellsAtColumn(
    opts: Options,
    // The table
    table: Block,
    columnIndex: number
): List<Block> {
    const result = [];
    const pick = [];
    const tableInfo =
        table.getIn(['data', 'info']) || getTableInfo(opts, table.nodes);
    tableInfo.forEach(row => {
        const cellInfo = row[columnIndex];
        const key = `${cellInfo.cellIndex},${cellInfo.rowIndex}`;
        if (pick.indexOf(key) === -1) {
            pick.push(key);
            result.push(
                table.nodes.get(cellInfo.rowIndex).nodes.get(cellInfo.cellIndex)
            );
        }
    });
    return L(result);
}

export default getCellsAtColumn;
