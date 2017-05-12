/**
 * Created by bedeho on 09/05/17.
 */


// Item

// is each one of these some sort of item subclass?

// Separator

// More-Item (the dot dot dot thing)
// Open-Folder-Item ()

<Toolbar>

    <Item icon_url="....png" icon_url_hover="" alt="This is the alt"  />

    <ClickableItem />
    <Separator />
</Toolbar>

//<DownloadingTorrentToolbar />
// we define this in the downloading component,
// which just has a set of items

// the basic styling is in Toolbar.scss

// the downloading specific styling, if any, is inthe dowonloaing.scss

// need to soem how define with of this thing

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
 * A clickable item
 */
const ClickableItem = (props) =>  {
    return <Item />
}

const Toolbar = (props) => {

    // props about:

    re

}

Toolbar.propTypes  = {

}

Toolbar.Item = Item
Toolbar.Separator = Separator

export default Toolbar