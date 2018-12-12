// @flow
import { type Change } from '@gitbook/slate';

import { TablePosition, getCellsAtRow, createCell } from '../utils';
import clearCell from './clearCell';
import type Options from '../options';

/**
 * Delete the column associated with the given cell key in a table
 */
function removeColumnByKey(opts: Options, change: Change, key: string): Change {
    const { value } = change;

    const pos = TablePosition.create(opts, value.document, key);
    const { table } = pos;

    const rows = table.nodes;

    // Remove the cell from every row
    if (pos.getWidth() > 1) {
        const tableInfo = pos.getTableInfo();
        const colIndex = pos.getColumnIndex();
        const deleteRows = [];
        const deleteCells = [];

        const removeRow = (rowKey: string) => {
            if (deleteRows.indexOf(rowKey) === -1) {
                deleteRows.push(rowKey);
                change.removeNodeByKey(rowKey);
            }
        };

        const removeCell = (cellKey: string) => {
            if (deleteCells.indexOf(cellKey) === -1) {
                deleteCells.push(cellKey);
                change.removeNodeByKey(cellKey);
            }
        };

        rows.forEach((row, rI) => {
            const rowInfo = tableInfo[rI];
            const cellInfo = tableInfo[rI][colIndex];
            const cell = getCellsAtRow(opts, table, cellInfo.rowIndex).get(
                cellInfo.cellIndex
            );
            if (
                rowInfo[colIndex].rowIndex === rI &&
                rowInfo.filter(c => c.rowIndex === rI).length === 1
            ) {
                // 如果该列只有一个cell，就删掉这行，同时更新rowSpan
                rowInfo.forEach(c => {
                    if (c.rowIndex !== rI && c.rowSpan > 1) {
                        const theCell = getCellsAtRow(
                            opts,
                            table,
                            c.rowIndex
                        ).get(c.cellIndex);
                        if (deleteCells.indexOf(theCell.key) === -1) {
                            change.setNodeByKey(theCell.key, {
                                data: {
                                    ...theCell.get('data').toJSON(),
                                    rowSpan: (c.rowSpan -= 1) || 1
                                }
                            });
                        }
                    }
                });
                removeRow(row.key);
            } else if (cellInfo.colSpan > 1) {
                // 如果有colSpan
                if (cellInfo.colSpan > 1) {
                    if (cellInfo.cellIndex !== colIndex) {
                        change.setNodeByKey(cell.key, {
                            data: {
                                ...cell.get('data').toJSON(),
                                colSpan: cellInfo.colSpan - 1
                            }
                        });
                    } else {
                        const nextCellInfo =
                            rowInfo[colIndex + cellInfo.rowSpan];
                        if (nextCellInfo) {
                            const nextCell = getCellsAtRow(
                                opts,
                                table,
                                nextCellInfo.rowIndex
                            ).get(nextCellInfo.cellIndex);
                            change.setNodeByKey(nextCell.key, {
                                data: {
                                    ...nextCell.get('data').toJSON(),
                                    colSpan: cellInfo.colSpan - 1
                                }
                            });
                            removeCell(cell.key);
                        } else {
                            change.insertNodeByKey(
                                row.key,
                                createCell(opts, undefined, 1, {
                                    rowSpan: cellInfo.colSpan - 1
                                })
                            );
                        }
                    }
                } else {
                    removeCell(cell.key);
                }
            } else {
                removeCell(cell.key);
            }
        });
        change.setNodeByKey(table.key, {
            data: {
                ...table.get('data').toJSON(),
                info: undefined
            }
        });
    } else {
        // If last column, clear text in cells instead
        rows.forEach(row => {
            row.nodes.forEach(cell => {
                cell.nodes.forEach(node => clearCell(opts, change, cell));
            });
        });
    }

    // Replace the table
    return change;
}

export default removeColumnByKey;
