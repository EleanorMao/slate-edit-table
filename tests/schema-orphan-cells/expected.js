/** @jsx hyperscript */
import hyperscript from '../hyperscript';

export default (
    <state>
        <document>
            <table presetAlign={['left']}>
                <table_row>
                    <table_cell>
                        <paragraph>Cell 1</paragraph>
                    </table_cell>
                </table_row>
            </table>
            <table presetAlign={['left']}>
                <table_row>
                    <table_cell>
                        <paragraph>Cell 2</paragraph>
                    </table_cell>
                </table_row>
            </table>
        </document>
    </state>
);