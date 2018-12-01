// @flow
import { type Change } from '@gitbook/slate';
import type Options from '../options';
import { TablePosition, isSelectionOutOfTable, createCell } from '../utils';

function splitToCells(opts: Options, change: Change): Change {
    const { value } = change;

    if (isSelectionOutOfTable(opts, value)) {
        return undefined;
    }

    const { startKey } = value;
    const pos = TablePosition.create(opts, value.document, startKey);
    const { table, cell } = pos;
    const tableInfo = pos.getTableInfo();
    const { rowIndex, colIndex, rowSpan, colSpan } = pos.getCellInfo();
    const data = cell.get('data').toJSON();

    if (rowSpan > 1 || colSpan > 1) {
        tableInfo.slice(rowIndex, rowIndex + rowSpan).forEach((rowInfo, i) => {
            const realRowIndex = i + rowIndex;
            rowInfo
                .slice(colIndex, colIndex + colSpan)
                .forEach((cellInfo, j) => {
                    const realColIndex = j + colIndex;
                    const isCrtCell =
                        cellInfo.colIndex === realColIndex &&
                        rowIndex === realRowIndex;
                    if (isCrtCell) return;
                    if (cellInfo.rowIndex === realRowIndex) {
                        change.insertNodeByKey(
                            table.nodes.get(realRowIndex).key,
                            realColIndex,
                            createCell(opts, undefined, {
                                ...data,
                                rowSpan: 1,
                                colSpan: 1
                            })
                        );
                    } else {
                        change.insertNodeByKey(
                            table.nodes.get(realRowIndex).key,
                            realColIndex,
                            createCell(opts, undefined, {
                                ...data,
                                rowSpan: 1,
                                colSpan: 1
                            })
                        );
                    }
                });
        });
        change
            .setNodeByKey(cell.key, {
                data: {
                    ...data,
                    rowSpan: 1,
                    colSpan: 1
                }
            })
            .setNodeByKey(table.key, {
                data: {}
            });
    }
    return change;
}

export default splitToCells;
