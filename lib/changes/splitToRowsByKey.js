// @flow
import { type Change } from '@gitbook/slate';
import type Options from '../options';
import { TablePosition, createCell } from '../utils';

function splitToRowsByKey(opts: Options, change: Change, key: string): Change {
    const { value } = change;

    const pos = TablePosition.create(opts, value.document, key);
    const { table, cell } = pos;
    const tableInfo = pos.getTableInfo();
    const { rowIndex, colIndex, rowSpan } = pos.getCellInfo();
    const data = cell.get('data').toJSON();

    if (rowSpan > 1) {
        tableInfo.slice(rowIndex, rowIndex + rowSpan).forEach((rowInfo, i) => {
            const realRowIndex = i + rowIndex;
            if (realRowIndex === rowIndex) return;
            let index = 0;
            for (let j = 0; j < colIndex; ) {
                const crtCellInfo = rowInfo[j];
                index +=
                    crtCellInfo.colSpan -
                    (crtCellInfo.rowIndex === rowIndex ? 1 : 0);
                j += crtCellInfo.colSpan;
            }
            change.insertNodeByKey(
                table.nodes.get(realRowIndex).key,
                index,
                createCell(opts, undefined, {
                    ...data,
                    rowSpan: 1
                })
            );
        });
        change
            .setNodeByKey(cell.key, {
                data: {
                    ...data,
                    rowSpan: 1
                }
            })
            .setNodeByKey(table.key, {
                data: {
                    ...table.get('data').toJSON(),
                    info: undefined
                }
            });
    }

    return change;
}

export default splitToRowsByKey;
