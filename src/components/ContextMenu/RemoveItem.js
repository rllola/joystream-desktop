import React from 'react'
import Item from './Item'

const RemoveItem = (props) => {
    return (
        <Item onClick={props.onRemoveClicked}
              className="remove-item"
              label="Remove" />
    ) // description="Remove from application only."
}

export default RemoveItem
