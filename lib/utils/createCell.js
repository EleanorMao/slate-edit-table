// @flow
import { Block, Text, type Node } from '@gitbook/slate';

import type Options from '../options';

/**
 * Create a new cell
 */
function createCell(
    opts: Options,
    nodes?: Node[],
    rowSpan?: number,
    colSpan?: number
): Block {
    return Block.create({
        type: opts.typeCell,
        data: { rowSpan: formatSpan(rowSpan), colSpan: formatSpan(colSpan) },
        nodes: nodes || [createEmptyContent(opts)]
    });
}

/**
 * Create a new default content block
 */
function createEmptyContent(opts: Options): Block {
    return Block.create({
        type: opts.typeContent,
        nodes: [Text.create()]
    });
}

function formatSpan(span) {
    return span >= 1 ? span : undefined;
}
export default createCell;
