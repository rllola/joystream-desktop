/**
 * Created by bedeho on 06/05/17.
 */

import React from 'react'
import {observer} from "mobx-react";

const Field = (props) => {
    return <div className="field"> {props.children} </div>
}

const ObserverField = observer(Field)

export default Field
export {ObserverField}