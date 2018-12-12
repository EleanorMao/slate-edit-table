// @flow

import type { Change } from '@gitbook/slate';
import type Options from '../options';
import { TablePosition, getCell, couldCellMergeDown } from '../utils';

function mergeDown(opts: Options, change: Change): Change {
    const { value } = change;
    if (!couldCellMergeDown(opts, value)) {
        return undefined;
    }
    const { startKey } = value;

    const pos = TablePosition.create(opts, value.document, startKey);
    const { table, cell } = pos;
    const data = pos.cell.get('data').toJSON();
    const rowSpan = parseInt(data.rowSpan, 10) || 1;
    const nextCellInfo = pos.getCellInfoNextRow();
    const nextCell = getCell(
        opts,
        table,
        nextCellInfo.rowIndex,
        nextCellInfo.colIndex
    );
    const nodes = nextCell.get('nodes');
    if (nodes) {
        nodes.reduce((index, node) => {
            change.insertNodeByKey(cell.key, index, node);
            return index + 1;
        }, cell.nodes.size);
    }
    change.setNodeByKey(cell.key, {
        data: {
            ...data,
            rowSpan: rowSpan + nextCellInfo.rowSpan
        }
    });
    change.removeNodeByKey(nextCell.key);
    change.setNodeByKey(table.key, {
        data: {
            ...table.get('data').toJSON(),
            info: undefined
        }
    });
    return change;
}

export default mergeDown;
