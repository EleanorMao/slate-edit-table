// @flow

import { type Node } from '@gitbook/slate';
import type Options from '../options';
import getMaxRows from './getMaxRows';

function getTableInfo(opts: Options, rows: Node[]) {
    const isCell = node => node.type === opts.typeCell;
    const isRow = node => node.type === opts.typeRow;
    rows = rows.filter(isRow);
    if (!rows.size) return [];
    const countCells = row => row.nodes.count(isCell);
    const rowsSize = getMaxRows(rows);
    const maxColumns = Math.max(1, rows.map(countCells).max());
    const indexTable = [];
    for (let i = 0; i < rowsSize; i += 1) {
        indexTable[i] = new Array(maxColumns);
    }
    rows.forEach((row, rowIndex) => {
        row.nodes.filter(isCell).forEach((cell, cellIndex) => {
            let colIndex = cellIndex;
            const data = cell.get('data');
            const rowSpan = parseInt(data.get('rowSpan'), 10) || 1;
            const colSpan = parseInt(data.get('colSpan'), 10) || 1;
            while (indexTable[rowIndex][colIndex]) colIndex += 1;
            for (let i = 0; i < rowSpan; i += 1) {
                for (let j = 0; j < colSpan; j += 1) {
                    indexTable[rowIndex + i][colIndex + j] = {
                        rowIndex,
                        cellIndex,
                        colIndex,
                        rowSpan,
                        colSpan
                    };
                }
            }
        });
    });
    return indexTable;
}

export default getTableInfo;
