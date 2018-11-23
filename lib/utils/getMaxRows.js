// @flow

import { type Node } from '@gitbook/slate';

function getMaxRows(rows: Node[]): number {
    let maxLen = 1;
    let i = 0;
    let row = rows.get(i);
    while (row) {
        let currentMax = 1;
        let j = 0;
        let cj = row.nodes.get(j);
        while (cj) {
            currentMax = Math.max(
                cj.getIn(['data', 'rowSpan']) || 1,
                currentMax
            );
            j += 1;
            cj = row.nodes.get((j += 1));
        }
        maxLen = Math.max(currentMax + i, maxLen);
        i += 1;
        row = rows.get(i);
    }
    return maxLen;
}

export default getMaxRows;
