/** @jsx hyperscript */
import hyperscript from '../hyperscript';

const info = [];
const rowNums = 3;
const colNums = 2;
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
info[1][0].rowSpan = 2;
info[2][0] = { ...info[1][0] };

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
                </table_row>
                <table_row>
                    <table_cell rowSpan={2}>
                        <paragraph>Col 0, Row 1</paragraph>
                    </table_cell>
                    <table_cell>
                        <paragraph>Col 1, Row 1</paragraph>
                    </table_cell>
                </table_row>
                <table_row>
                    <table_cell custom="value">
                        <paragraph>Col 1, Row 2</paragraph>
                    </table_cell>
                </table_row>
            </table>
        </document>
    </value>
);
