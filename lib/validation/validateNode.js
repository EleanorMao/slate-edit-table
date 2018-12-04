// @flow

import type Options from '../options';
import { getTableInfo } from '../utils';
import createRow from '../../dist/utils/createRow';
import createCell from '../../dist/utils/createCell';

/*
 * Ensure each row has the same number of columns.
 */
function validateNode(opts: Options) {
    const isRow = node => node.type === opts.typeRow;
    const colSize = rowInfo => rowInfo.filter(c => c).length;
    return node => {
        if (node.type !== opts.typeTable) {
            return undefined;
        }

        if (node.getIn(['data', 'info'])) {
            return undefined;
        }

        const rows = node.nodes.filter(isRow);
        const rowsSize = rows.size || 1;
        const tableInfo = getTableInfo(opts, rows);
        return change => {
            change.setNodeByKey(node.key, {
                data: { ...node.get('data').toJSON(), info: tableInfo }
            });
            tableInfo.forEach((rowInfo, rowIndex) => {
                const isMissingRow = rowIndex + 1 > rowsSize;
                if (isMissingRow) {
                    const rowNode = createRow(opts, colSize(rowInfo));
                    change.insertNodeByKey(node.key, rowIndex + 1, rowNode);
                }
                for (
                    let colIndex = 0;
                    colIndex < rowInfo.length;
                    colIndex += 1
                ) {
                    const cellInfo = rowInfo[colIndex];
                    if (!cellInfo) {
                        if (!isMissingRow) {
                            const row = rows.get(rowIndex);
                            change.insertNodeByKey(
                                row.key,
                                row.nodes.size,
                                createCell(opts)
                            );
                        }
                        const prevNode = rowInfo[colIndex - 1];
                        rowInfo[colIndex] = {
                            rowIndex,
                            colIndex,
                            rowSpan: 1,
                            colSpan: 1,
                            cellIndex:
                                prevNode && prevNode.rowIndex === rowIndex
                                    ? prevNode.cellIndex + 1
                                    : 0
                        };
                    }
                }
            });
        };
    };
}

export default validateNode;
