/**
 * Created by bedeho on 10/05/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

class ContextMenu extends Component {

    constructor(props) {
        super(props)

    }

    // Inspired by https://github.com/vkbansal/react-contextmenu/blob/master/src/ContextMenu.js

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    handleOutsideClick = (e) => {
        if (!this.menu.contains(e.target))
            this.props.onHide()
    }

    render() {

        const style = {
            position : absolute,
            top : props.top,
            right : props.right
        }

        return (
            <div className="context-menu" style={style}>
                {props.children}
            </div>
        )

    }

}

ContextMenu.propTypes = {
    top : PropTypes.number.isRequired,
    right : PropTypes.number.isRequired,
    onHide : PropTypes.func
}

export default ContextMenu