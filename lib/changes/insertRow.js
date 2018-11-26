// @flow
import { type Change, type Block } from '@gitbook/slate';

import {
    TablePosition,
    createRow,
    getTableInfo,
    getCellsAtRow
} from '../utils';
import type Options from '../options';

/**
 * Insert a new row in current table
 */
function insertRow(
    opts: Options,
    change: Change,
    at?: number, // row index
    getRow?: (columns: number) => Block // Generate the row yourself
) {
    const { value } = change;
    const { startKey } = value;

    const pos = TablePosition.create(opts, value.document, startKey);
    const { table } = pos;

    const cellIndex = typeof at === 'undefined' ? pos.getColumnIndex() : null;

    const tableInfo =
        table.getIn(['data', 'info']) || getTableInfo(opts, table.nodes);

    if (typeof at === 'undefined') {
        const rI = pos.getRowIndex();
        at = tableInfo[rI].reduce((max, cellInfo) => {
            if (
                cellIndex !== null &&
                cellInfo.rowSpan > 1 &&
                cellInfo.rowIndex === rI &&
                cellInfo.cellIndex === cellIndex
            ) {
                return Math.max(max, cellInfo.rowIndex + cellInfo.rowSpan);
            }
            return max;
        }, rI + 1);
    } else if (at > tableInfo.length) {
        at = tableInfo.length;
    }
    const preIndex = at - 1;
    const preRowInfo = tableInfo[preIndex];
    const maxColNums = preRowInfo.length;
    const settledKeys = [];
    const columns =
        at === tableInfo.length
            ? maxColNums
            : preRowInfo.reduce((prev, cellInfo) => {
                  if (
                      cellInfo.rowSpan > 1 &&
                      cellInfo.rowIndex + cellInfo.rowSpan > at
                  ) {
                      // 更新rowSpan
                      const theCell = getCellsAtRow(
                          opts,
                          table,
                          cellInfo.rowIndex
                      ).get(cellInfo.cellIndex);
                      if (settledKeys.indexOf(theCell.key) === -1) {
                          settledKeys.push(theCell.key);
                          const data = theCell.get('data').toJSON();
                          change.setNodeByKey(theCell.key, {
                              data: {
                                  ...data,
                                  rowSpan: (data.rowSpan || 1) + 1
                              }
                          });
                      }
                      return prev - 1;
                  }
                  if (cellInfo.colSpan > 1 && cellInfo.rowIndex === preIndex) {
                      return prev - 1;
                  }
                  return prev;
              }, maxColNums);
    const newRow = getRow ? getRow(columns) : createRow(opts, columns);
    return change
        .insertNodeByKey(table.key, at, newRow)
        .collapseToEndOf(newRow.nodes.get(cellIndex >= columns ? 0 : cellIndex))
        .setNodeByKey(table.key, { data: {} });
}

export default insertRow;
