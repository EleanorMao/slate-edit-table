/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createHyperscript } from '@gitbook/slate-hyperscript';

const h = createHyperscript({
    blocks: {
        heading: 'heading',
        paragraph: 'paragraph',
        table: 'table',
        table_row: 'table_row',
        table_cell: 'table_cell'
    }
});

export default (
    <value>
        <document>
            <heading>Slate + Table Edition</heading>
            <paragraph>
                This page is a basic example of Slate + slate-edit-table plugin.
            </paragraph>
            <table>
                <table_row>
                    <table_cell>
                        <paragraph>Col 0, Row 0</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 0</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 0</paragraph>
                    </table_cell>
                </table_row>
                <table_row>
                    <table_cell>
                        <paragraph>Col 0, Row 1</paragraph>
                    </table_cell>
                    <table_cell key="anchor">
                        <paragraph>Col 1, Row 1</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 1</paragraph>
                    </table_cell>
                </table_row>
                <table_row>
                    <table_cell>
                        <paragraph>Col 0, Row 2</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 2</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 2, Row 2</paragraph>
                    </table_cell>
                </table_row>
            </table>
            <paragraph>
                Use Tab and Shift+Tab to move from cell to cells. Press Enter to
                go to next row. Press Up/Down to navigate the rows.
            </paragraph>
        </document>
    </value>
);
