// @flow
import { type Change } from '@gitbook/slate';
import type Options from '../options';
import { TablePosition, createCell } from '../utils';

function splitToColsByKey(opts: Options, change: Change, key: string): Change {
    const { value } = change;

    const pos = TablePosition.create(opts, value.document, key);
    const { table, cell } = pos;
    const tableInfo = pos.getTableInfo();
    const { rowIndex, colIndex, colSpan, rowSpan } = pos.getCellInfo();
    const data = cell.get('data').toJSON();

    if (colSpan > 1) {
        tableInfo.slice(rowIndex, rowIndex + rowSpan).forEach((rowInfo, i) => {
            const realRowIndex = i + rowIndex;
            rowInfo
                .slice(colIndex, colIndex + colSpan)
                .forEach((cellInfo, j) => {
                    const realColIndex = j + colIndex;
                    if (cellInfo.rowIndex === realRowIndex) {
                        if (
                            cellInfo.colIndex !== realColIndex ||
                            rowIndex !== realRowIndex
                        ) {
                            change.insertNodeByKey(
                                table.nodes.get(realRowIndex).key,
                                realColIndex,
                                createCell(opts, undefined, {
                                    ...data,
                                    colSpan: 1
                                })
                            );
                        }
                    }
                });
        });
        change
            .setNodeByKey(cell.key, {
                data: {
                    ...data,
                    colSpan: 1
                }
            })
            .setNodeByKey(table.key, {
                data: {}
            });
    }
    return change;
}

export default splitToColsByKey;
