// @flow
import { type Change, type Block } from '@gitbook/slate';

import { TablePosition, createCell, getCell as getCellInTable } from '../utils';
import moveSelection from './moveSelection';

import type Options from '../options';

/**
 * Insert a new column in current table
 */
function insertColumn(
    opts: Options,
    change: Change,
    at?: number, // Column index
    getCell?: (cellIndex: number, rowIndex: number, colIndex: number) => Block
): Change {
    const { value } = change;
    const { startKey } = value;

    const pos = TablePosition.create(opts, value.document, startKey);
    const { table } = pos;

    const tableInfo = pos.getTableInfo();
    const maxColNums = tableInfo[0].length;
    const rowIndex = pos.getRowIndex();
    const cellIndex = pos.getCellIndex();
    if (typeof at === 'undefined') {
        at = tableInfo[rowIndex].reduce((max, cellInfo) => {
            if (
                cellIndex !== null &&
                cellInfo.colSpan > 1 &&
                cellInfo.rowIndex === rowIndex &&
                cellInfo.cellIndex === cellIndex
            ) {
                return Math.max(max, cellInfo.colIndex + cellInfo.colSpan);
            }
            return max;
        }, cellIndex + 1);
    } else if (at > maxColNums) {
        at = maxColNums;
    }

    if (at === 0) {
        table.nodes.forEach((row, rI) => {
            const newCell = getCell ? getCell(0, rI, 0) : createCell(opts);
            change.insertNodeByKey(row.key, 0, newCell, {
                normalize: false
            });
        });
    } else {
        const preIndex = at - 1;
        const preColInfo = tableInfo.map(row => row[preIndex]);
        // Insert the new cell
        preColInfo.forEach((cellInfo, realRowIndex) => {
            if (
                cellInfo.colSpan > 1 &&
                cellInfo.colIndex + cellInfo.colSpan > at
            ) {
                const theCell = getCellInTable(
                    opts,
                    table,
                    cellInfo.rowIndex,
                    cellInfo.colIndex
                );
                const data = theCell.get('data').toJSON();
                change.setNodeByKey(theCell.key, {
                    data: {
                        ...data,
                        colSpan: data.colSpan + 1
                    }
                });
            } else {
                const newCell = getCell
                    ? getCell(
                          cellInfo.cellIndex + 1,
                          realRowIndex,
                          cellInfo.colIndex + 1
                      )
                    : createCell(opts);
                const index =
                    cellInfo.rowIndex !== realRowIndex
                        ? (
                              tableInfo[realRowIndex]
                                  .slice(0, at)
                                  .reverse()
                                  .find(c => c.rowIndex === realRowIndex) || {
                                  cellIndex: -1
                              }
                          ).cellIndex + 1
                        : cellInfo.cellIndex + 1;
                change.insertNodeByKey(
                    table.nodes.get(realRowIndex).key,
                    index,
                    newCell,
                    {
                        normalize: false
                    }
                );
            }
        });
    }
    change.setNodeByKey(table.key, { data: {} });
    // Update the selection (not doing can break the undo)

    return moveSelection(opts, change, cellIndex + 1, rowIndex);
}

export default insertColumn;
