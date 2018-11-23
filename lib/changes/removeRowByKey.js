// @flow
import { type Change } from '@gitbook/slate';

import {
    TablePosition,
    createCell,
    getCellsAtRow,
    getTableInfo
} from '../utils';
import clearCell from './clearCell';
import type Options from '../options';

/**
 * Remove the row associated to a given key in a table.
 * Clear thw row if last remaining row
 */
function removeRowByKey(opts: Options, change: Change, key: string): Change {
    const { value } = change;

    const pos = TablePosition.create(opts, value.document, key);

    // Update table by removing the row
    if (pos.getHeight() > 1) {
        const table = pos.table;
        const rowIndex = pos.getRowIndex();
        const tableInfo =
            table.getIn(['data', 'info']) || getTableInfo(opts, table.nodes);
        const rowInfo = tableInfo[rowIndex];
        const deletes = [];
        rowInfo.forEach(cellInfo => {
            if (cellInfo.rowSpan <= 1) return;
            const cellKey = `${cellInfo.rowIndex},${cellInfo.colIndex},${
                cellInfo.cellIndex
            }`;
            if (cellInfo.rowIndex === rowIndex && deletes.indexOf(cellKey) === -1) {
                deletes.push(cellKey);
                const nextRow = pos.table.nodes.get(rowIndex + 1);
                change.insertNodeByKey(
                    nextRow.key,
                    cellInfo.cellIndex,
                    createCell(
                        opts,
                        null,
                        cellInfo.rowSpan - 1,
                        cellInfo.colSpan
                    )
                );
            } else {
                const theCell = getCellsAtRow(
                    opts,
                    pos.table,
                    cellInfo.rowIndex
                ).get(cellInfo.cellIndex);
                change.setNodeByKey(theCell.key, {
                    data: {
                        ...theCell.get('data').toJSON(),
                        rowSpan: cellInfo.rowSpan - 1
                    }
                });
            }
        });
        change.removeNodeByKey(key);
        change.setNodeByKey(pos.table.key, { data: {} });
    } else {
        // If last remaining row, clear it instead
        pos.row.nodes.forEach(cell => {
            cell.nodes.forEach(node => clearCell(opts, change, cell));
        });
    }

    return change;
}

export default removeRowByKey;
