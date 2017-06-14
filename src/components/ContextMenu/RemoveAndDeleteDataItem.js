import React from 'react'
import Item from './Item'

const RemoveAndDeleteDataItem = (props) => {

    return (
        <Item onClick={props.onRemoveAndDeleteDataClicked}
              className="remove-and-delete-data-item"
              label="Remove & delete data" />
    )
    // description="Removes item from application, and all downloaded data is deleted."
}

export default RemoveAndDeleteDataItem
