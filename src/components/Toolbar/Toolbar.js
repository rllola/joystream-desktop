/**
 * Created by bedeho on 09/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const Toolbar = (props) => {

    return (
        <div className="toolbar">
            <div className="section-container">
                { props.children}
            </div>
        </div>
    )

    // { props.children.map((c) => { console.log(c); return c }
}

export default Toolbar