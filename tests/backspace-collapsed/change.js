export default function(plugin, change) {
    const { state } = change;
    const blockStart = state.document.getDescendant('anchor');

    const withCursor = change.collapseToStartOf(blockStart);

    plugin.onKeyDown(
        {
            key: 'Backspace',
            preventDefault() {},
            stopPropagation() {}
        },
        null,
        withCursor
    );

    return change;
}