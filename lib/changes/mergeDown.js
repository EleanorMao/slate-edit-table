// @flow

import type { Change } from '@gitbook/slate';
import type Options from '../options';
import TablePosition from '../utils/TablePosition';
import getTableInfo from '../utils/getTableInfo';

const getCellNextRow = (indexTable, rowIndex: number, cellIndex: number) => {
    const cellInfo = indexTable[rowIndex].find(
        c => c.rowIndex === rowIndex && c.cellIndex === cellIndex
    );
    if (!cellInfo) return null;
    const targetRowIndex = rowIndex + cellInfo.rowSpan;
    if (targetRowIndex >= indexTable.length) return null;
    return indexTable[targetRowIndex][cellInfo.colIndex];
};

function mergeDown(opts: Options, change: Change): Change {
    const { value } = change;
    const { startKey } = value;

    const pos = TablePosition.create(opts, value.document, startKey);
    const { table } = pos;
    let tableInfo = table.get('data').get('info');
    if (!tableInfo) {
        tableInfo = getTableInfo(opts, table.nodes);
        change.setNodeByKey(table.key, {
            data: { info: tableInfo }
        });
    }
    console.log(tableInfo);
    console.log(
        getCellNextRow(tableInfo, pos.getRowIndex(), pos.getCellIndex())
    );
    return change;
}

export default mergeDown;
