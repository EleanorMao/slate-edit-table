// @flow
import { type Change, type Block } from '@gitbook/slate';

import { TablePosition, createRow, getCell as getCellInTable } from '../utils';
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

    const cellIndex = pos.getCellIndex();

    const tableInfo = pos.getTableInfo();

    if (typeof at === 'undefined') {
        const rI = pos.getRowIndex();
        at = tableInfo[rI].reduce((max, cellInfo) => {
            if (
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
    const maxColNums = tableInfo[0].length;
    const settledKeys = [];
    const columns =
        at === tableInfo.length || at === 0
            ? maxColNums
            : tableInfo[preIndex].reduce((prev, cellInfo) => {
                  if (
                      cellInfo.rowSpan > 1 &&
                      cellInfo.rowIndex + cellInfo.rowSpan > at
                  ) {
                      // 更新rowSpan
                      const theCell = getCellInTable(
                          opts,
                          table,
                          cellInfo.rowIndex,
                          cellInfo.colIndex
                      );
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
        .setNodeByKey(table.key, {
            ...table.get('data').toJSON(),
            info: undefined
        });
}

export default insertRow;
