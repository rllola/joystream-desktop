/**
 * Created by bedeho on 06/05/17.
 */

import {observer} from "mobx-react";

const Field = (props) => {
    return <div className="field"> {props.children} </div>
}

// Turn into observer component
const ObserverField = observer(comp)

export default Field
export {ObserverField}