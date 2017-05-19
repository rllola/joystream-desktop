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

    menuRef = (c) => {
        this.menu = c
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick)
    }

    handleOutsideClick = (e) => {
        if (!this.menu.contains(e.target) && this.props.onHide)
            this.props.onHide()
    }

    render() {

        return (
            <div className="context-menu" ref={this.menuRef}>
                {this.props.children}
            </div>
        )
    }
}

ContextMenu.propTypes = {
    onHide : PropTypes.func
}

export default ContextMenu