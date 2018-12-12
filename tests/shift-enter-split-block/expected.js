/** @jsx hyperscript */
import hyperscript from '../hyperscript';

const info = [];
const rowNums = 3;
const colNums = 3;
for (let i = 0; i < rowNums; i += 1) {
    const rowInfo = [];
    for (let j = 0; j < colNums; j += 1) {
        rowInfo.push({
            cellIndex: j,
            colIndex: j,
            colSpan: 1,
            rowIndex: i,
            rowSpan: 1
        });
    }
    info.push(rowInfo);
}
export default (
    <value>
        <document>
            <table info={info}>
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
                    <table_cell>
                        <paragraph>Col 1, Row 1</paragraph>
                        <paragraph />
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
        </document>
    </value>
);
