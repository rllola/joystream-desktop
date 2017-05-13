/**
 * Created by bedeho on 09/05/17.
 */

/**
 * A item separator
 */
const Separator = (props) => {
    return <div className="separator"></div>;
}

/**
 * A generic toolbar item
 */
const Item = (props) => {
    return (
        <div className={"item " + ( props.clickable)}>
            <div className="icon remove-and-delete-data"></div>
            <div className="explainer-column">
                <div className="label">{ props.label}</div>
                <div className="description"> {props.description }</div>
            </div>
        </div>
    )


}

Item.propTypes = {
    clickable :  // bool, default true, not required
    label : , //rquired
    description
}

/**
 * The toolbar
 */
const Toolbar = (props) => {

    // props about:

    re

}

Toolbar.propTypes  = {

}

Toolbar.Item = Item
Toolbar.Separator = Separator

export default Toolbar