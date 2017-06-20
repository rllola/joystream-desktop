
const ToolbarVisibilityType = {
    OnHover : 0,
    Hidden : 1,
    Visible : 2
}

function toolbarVisibilityState(visible) {
    return {toolbarVisible : visible}
}

export { ToolbarVisibilityType as default, toolbarVisibilityState }
