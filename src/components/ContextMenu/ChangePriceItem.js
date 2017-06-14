import React from 'react'
import Item from './Item'

const ChangePriceItem = (props) => {

    var changePriceProps

    if(props.changePriceEnabled) {

        changePriceProps = {
            onClick : props.onChangePriceClicked,
            className : "change-price-item"
        }

    } else {

        changePriceProps = {
            onClick: null,
            className: "change-price-disabled-item item-disabled"
        }
    }

    return (
        <Item {...changePriceProps}
              label="Change price" />
    ) // description="Only possible before paid download starts."

}

export default ChangePriceItem
