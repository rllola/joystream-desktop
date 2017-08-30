
function RectDiff(a,b) {

    return {
        top : a.top - b.top,
        right : a.right - b.right,
        bottom : a.bottom - b.bottom,
        left : a.left - b.left
    }
}

function contextMenuHiddenState() {

    return { contextMenu : null }
}

function contextMenuVisibleState(top, left, torrent, applicationStore) {

    return {
        contextMenu : {
            top: top,
            left : left,
            torrent : torrent,
            store : applicationStore
        }
    }
}

function contextMenuRect(moreButtonRect, tableContentRect) {

    var CONTEXT_MENU_WIDTH = 300
    var CONTEXT_MENU_HEIGHT = 555

    // More button dimensions w.r.t. table content
    var moreButtonRectWRTTableContent = RectDiff(moreButtonRect, tableContentRect)

    // Left position of context menu
    var left = moreButtonRectWRTTableContent.left - CONTEXT_MENU_WIDTH // offset is function of context menu width

    /// Right position of context menu

    // Decide location of context menu w.r.t. its parent, which is the table content
    var tableContentHeight = tableContentRect.bottom - tableContentRect.top

    var top =
        (moreButtonRectWRTTableContent.top < tableContentHeight/2)
        ?
        Math.max(0, moreButtonRectWRTTableContent.top - CONTEXT_MENU_HEIGHT/2)
        :
        Math.min(tableContentHeight, moreButtonRectWRTTableContent.top + CONTEXT_MENU_HEIGHT/2) - CONTEXT_MENU_HEIGHT

    return {left, top}
}

export {
  contextMenuHiddenState,
  contextMenuVisibleState,
  contextMenuRect
}
