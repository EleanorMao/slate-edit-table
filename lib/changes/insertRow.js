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

    const rowIndex = typeof at === 'undefined' ? pos.getRowIndex() : at - 1;
    const colIndex = pos.getColumnIndex();

    const tableInfo = table.getIn(['data', 'info']) || getTableInfo(table);
    const nextRowInfo = tableInfo[rowIndex];

    const maxColNums = nextRowInfo.length;
    const settledKeys = [];
    const columns =
        rowIndex === tableInfo.length - 1
            ? maxColNums
            : nextRowInfo.reduce((prev, cellInfo) => {
                  // 如果有rowSpan则更新rowSpan，有colSpan则少渲染一个columns
                  if (cellInfo.rowSpan > 1) {
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
                  }
                  if (cellInfo.colSpan > 1) {
                      return prev - 1;
                  }
                  return prev;
              }, maxColNums);

    const newRow = getRow ? getRow(columns) : createRow(opts, columns);
    if (typeof at === 'undefined') {
        at = rowIndex + 1;
    }
    return change
        .insertNodeByKey(table.key, at, newRow)
        .collapseToEndOf(newRow.nodes.get(colIndex >= columns ? 0 : colIndex))
        .setNodeByKey(table.key, { data: {} });
}

export default insertRow;
