/**
 * Created by bedeho on 13/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

function getStyles(state, props) {

    return {

        root : {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '3px solid hsla(120, 39%, 47%, 1)',
            borderRadius: '6px',
            backgroundColor: state.mouseIsOver ? 'hsl(120, 39%, 55%)' : 'hsl(120, 39%, 65%)',
            padding: '14px 30px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            //width: '180px',
            //height: '65px',
            fontFamily: 'helvetica',
            //boxShadow: '1px 1px 2px hsla(219, 41%, 39%, 1)'
        }
    }
}

class ToolbarButton extends Component {

    constructor(props) {
        super(props)

        this.state = { mouseIsOver : false}
    }

    handleMouseEnter = (event) => {
        this.setState({ mouseIsOver : true})
    }

    handleMouseLeave = (event) => {
        this.setState({ mouseIsOver : false})
    }

    render() {

        let styles = getStyles(this.state, this.props)

        return (
            <span onClick={this.props.onClick}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  style={styles.root}>
                {this.props.iconNode ? this.props.iconNode : null}
                {this.props.title}
            </span>
        )
    }
}

ToolbarButton.propTypes = {
    iconNode: PropTypes.node,
    title : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired,
    //backgroundColor : PropTypes.string.isRequired,
    //textColor : PropTypes.string.isRequired
}

export default ToolbarButton