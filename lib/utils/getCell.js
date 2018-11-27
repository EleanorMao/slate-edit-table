// @flow
import { type Block } from '@gitbook/slate';

import type Options from '../options';
import getTableInfo from './getTableInfo';

/**
 * Returns the list of cells at the given column index
 */
function getCell(
    opts: Options,
    // The table
    table: Block,
    rowIndex: number,
    columnIndex: number
): Block {
    const tableInfo =
        table.getIn(['data', 'info']) || getTableInfo(opts, table.nodes);
    const cellInfo = tableInfo[rowIndex].find(
        c => c.rowIndex === rowIndex && c.colIndex === columnIndex
    );
    return table.nodes.get(cellInfo.rowIndex).nodes.get(cellInfo.cellIndex);
}

export default getCell;
