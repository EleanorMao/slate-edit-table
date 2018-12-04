import expect from 'expect';

export default function(plugin, change) {
    const cursorBlock = change.value.document.getDescendant('anchor');
    change.moveToRangeOf(cursorBlock);

    plugin.onKeyDown(
        {
            key: 'Tab',
            preventDefault() {},
            stopPropagation() {}
        },
        change
    );

    const position = plugin.utils.getPosition(change.value);

    // Last row (new one)
    expect(position.getRowIndex()).toEqual(1);
    // First cell
    expect(position.getColumnIndex()).toEqual(2);

    return change;
}
