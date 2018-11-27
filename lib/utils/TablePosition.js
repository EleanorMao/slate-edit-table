// @flow
import { Record } from 'immutable';
import { Block, type Node } from '@gitbook/slate';

import Options from '../options';
import getTableInfo from './getTableInfo';

class TablePosition extends Record({
    tableBlock: null,
    rowBlock: null,
    cellBlock: null,
    contentBlock: null,
    opts: Options
}) {
    opts: Options;
    // Block container for the table
    tableBlock: ?Block;

    // Block for current row
    rowBlock: ?Block;

    // Block for current cell
    cellBlock: ?Block;

    // Current content block in the cell
    contentBlock: ?Block;

    /**
     * Create a new instance of a TablePosition from a Slate document
     * and a node key.
     */
    static create(
        opts: Options,
        containerNode: Node,
        key: string
    ): TablePosition {
        const node = containerNode.getDescendant(key);
        const ancestors = containerNode.getAncestors(key).push(node);
        const tableBlock = ancestors.findLast(p => p.type === opts.typeTable);
        const rowBlock = ancestors.findLast(p => p.type === opts.typeRow);

        const cellBlock = ancestors.findLast(p => p.type === opts.typeCell);
        const contentBlock = ancestors
            .skipUntil(ancestor => ancestor === cellBlock)
            .skip(1)
            .first();

        return new TablePosition({
            tableBlock,
            rowBlock,
            cellBlock,
            contentBlock,
            opts
        });
    }

    get table(): Block {
        if (!this.tableBlock) {
            throw new Error('Not in a table');
        }
        return this.tableBlock;
    }

    get row(): Block {
        if (!this.rowBlock) {
            throw new Error('Not in a row');
        }
        return this.rowBlock;
    }

    get cell(): Block {
        if (!this.cellBlock) {
            throw new Error('Not in a cell');
        }
        return this.cellBlock;
    }

    /**
     * Check to see if this position is within a cell
     */
    isInCell(): boolean {
        return Boolean(this.cellBlock);
    }

    /**
     * Check to see if this position is within a row
     */
    isInRow(): boolean {
        return Boolean(this.rowBlock);
    }

    /**
     * Check to see if this position is within a table
     */
    isInTable(): boolean {
        return Boolean(this.tableBlock);
    }

    /**
     * Check to see if this position is at the top of the cell.
     */
    isTopOfCell(): boolean {
        const { contentBlock, cellBlock } = this;

        if (!contentBlock || !cellBlock) {
            return false;
        }

        const { nodes } = cellBlock;
        const index = nodes.findIndex(block => block.key == contentBlock.key);

        return index == 0;
    }

    /**
     * Check to see if this position is at the bottom of the cell.
     */
    isBottomOfCell(): boolean {
        const { contentBlock, cellBlock } = this;

        if (!contentBlock || !cellBlock) {
            return false;
        }

        const { nodes } = cellBlock;
        const index = nodes.findIndex(block => block.key == contentBlock.key);

        return index == nodes.size - 1;
    }

    /**
     * Get count of columns
     */
    getWidth(): number {
        const { table, opts } = this;
        const countCells = row => row.nodes.count(opts.isCell);
        return Math.max(1, table.nodes.map(countCells).max());
    }

    /**
     * Get count of rows
     */
    getHeight(): number {
        const { table } = this;
        const rows = table.nodes;

        return rows.size;
    }

    getTableInfo() {
        const { table, opts } = this;
        return table.getIn(['data', 'info']) || getTableInfo(opts, table.nodes);
    }

    /**
     * Get index of current row in the table.
     */
    getRowIndex(): number {
        const { table, row } = this;
        const rows = table.nodes;

        return rows.findIndex(x => x === row);
    }

    /**
     * Get index of current column in the row.
     */
    getCellIndex(): number {
        const { row, cell } = this;
        const cells = row.nodes;

        return cells.findIndex(x => x === cell);
    }

    /**
     * 获取单元格信息
     */
    getCellInfo(): number {
        const rowIndex = this.getRowIndex();
        const cellIndex = this.getCellIndex();
        const tableInfo = this.getTableInfo();
        return tableInfo[rowIndex].find(
            cell => cell.cellIndex === cellIndex && cell.rowIndex === rowIndex
        );
    }

    /**
     * 获取单元格列号
     */
    getColumnIndex(): number {
        const cellInfo = this.getCellInfo();
        return cellInfo ? cellInfo.colIndex : null;
    }

    getCellInfoNextRow(): number {
        const tableInfo = this.getTableInfo();
        const cellInfo = this.getCellInfo();
        const rowIndex = this.getRowIndex();
        if (!cellInfo) return null;
        const targetRowIndex = rowIndex + cellInfo.rowSpan;
        if (targetRowIndex >= tableInfo.length) return null;
        return tableInfo[targetRowIndex][cellInfo.colIndex];
    }

    getCellInfoNextCol(): number {
        const tableInfo = this.getTableInfo();
        const cellInfo = this.getCellInfo();
        const rowIndex = this.getRowIndex();
        if (!cellInfo) return null;
        const targetColIndex = cellInfo.colIndex + cellInfo.colSpan;
        if (
            !tableInfo[rowIndex] ||
            targetColIndex >= tableInfo[rowIndex].length
        )
            return null;
        return tableInfo[rowIndex][targetColIndex];
    }

    /**
     * True if on first cell of the table
     */
    isFirstCell(): boolean {
        return this.isFirstRow() && this.isFirstColumn();
    }

    /**
     * True if on last cell of the table
     */
    isLastCell(): boolean {
        return this.isLastRow() && this.isLastColumn();
    }

    /**
     * True if on first row
     */
    isFirstRow(): boolean {
        return this.getRowIndex() === 0;
    }

    /**
     * True if on last row
     */
    isLastRow(): boolean {
        const cellInfo = this.getCellInfo();
        return (
            cellInfo &&
            cellInfo.rowIndex + cellInfo.rowSpan === this.getHeight()
        );
    }

    /**
     * True if on first column
     */
    isFirstColumn(): boolean {
        return this.getCellIndex() === 0;
    }

    /**
     * True if on last column
     */
    isLastColumn(): boolean {
        const cellInfo = this.getCellInfo();
        return (
            cellInfo && cellInfo.colIndex + cellInfo.colSpan === this.getWidth()
        );
    }
}

export default TablePosition;
