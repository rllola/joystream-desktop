import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Button, Sidebar} from '../../../../components/Sidebar'

import Scene from '../../../../core/Application/Scene'

/**
 * Buttons
 */

const ChangeTermsButton = (props) => {

    return (
        <Button title="Balance" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M17,16c-2.951,0-5.403-0.639-7-1.712c0,0.746,0,1.238,0,1.712c0,1.657,3.134,3,7,3s7-1.343,7-3 c0-0.474,0-0.966,0-1.712C22.403,15.361,19.951,16,17,16z"></path>
            <path d="M17,21c-2.951,0-5.403-0.639-7-1.712c0,0.746,0,1.238,0,1.712c0,1.657,3.134,3,7,3s7-1.343,7-3 c0-0.474,0-0.966,0-1.712C22.403,20.361,19.951,21,17,21z"></path>
            <ellipse cx="17" cy="11" rx="7" ry="3"></ellipse>
            <ellipse cx="7" cy="3" rx="7" ry="3"></ellipse>
            <path d="M8,17.973C7.673,17.989,7.341,18,7,18c-2.951,0-5.403-0.639-7-1.712C0,17.034,0,17.526,0,18 c0,1.657,3.134,3,7,3c0.34,0,0.673-0.014,1-0.034V17.973z"></path>
            <path d="M8,12.973C7.673,12.989,7.341,13,7,13c-2.951,0-5.403-0.639-7-1.712C0,12.034,0,12.526,0,13 c0,1.657,3.134,3,7,3c0.34,0,0.673-0.014,1-0.034V12.973z"></path>
            <path d="M9.92,7.766C9.018,7.916,8.042,8,7,8C4.049,8,1.597,7.361,0,6.288C0,7.034,0,7.526,0,8 c0,1.657,3.134,3,7,3c0.341,0,0.674-0.014,1.003-0.034C8.015,9.703,8.71,8.606,9.92,7.766z"></path>
        </Button>
    )
}

const UploadButton = (props) => {

    return (
        <Button title="UPLOADS" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"></path>
        </Button>
    )
}

const DowloadButton = (props) => {

    return (
        <Button title="DOWNLOADS" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"></path>
        </Button>
    )
}

const FinishedButton = (props) => {

    return (
        <Button title="FINISHED" {...props}
                viewBox={'0 0 24 24'}>
            <polygon points="9,20 2,13 5,10 9,14 19,4 22,7 "></polygon>
        </Button>
    )
}

const WalletButton = (props) => {

    return (
        <Button title="WALLET" {...props}
                viewBox={'0 0 24 24'}>

            <g className="nc-icon-wrapper" >
                <rect x="6"  width="16" height="4"></rect>
                <path d="M23,6H3C2.449,6,2,5.551,2,5s0.449-1,1-1h1V2H3C1.343,2,0,3.343,0,5v15c0,2.209,1.791,4,4,4h19 c0.552,0,1-0.448,1-1V7C24,6.448,23.552,6,23,6z M18,17c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2 C20,16.105,19.105,17,18,17z"></path>
            </g>
        </Button>
    )
}

const CommunityButton = (props) => {

    return (
        <Button title="COMMUNITY" {...props}
                viewBox={'0 0 24 24'}>

            <g className="nc-icon-wrapper" >
                <path d="M12,6L12,6c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,4.657,13.657,6,12,6z"></path>
                <path d="M4,19v-8c0-1.13,0.391-2.162,1.026-3H2c-1.105,0-2,0.895-2,2v6h2v5c0,0.552,0.448,1,1,1h2 c0.552,0,1-0.448,1-1v-2H4z"></path>
                <path d="M14,24h-4c-0.552,0-1-0.448-1-1v-6H6v-6c0-1.657,1.343-3,3-3h6c1.657,0,3,1.343,3,3v6h-3v6 C15,23.552,14.552,24,14,24z"></path>
                <path d="M4,7L4,7C2.895,7,2,6.105,2,5v0c0-1.105,0.895-2,2-2h0c1.105,0,2,0.895,2,2v0 C6,6.105,5.105,7,4,7z"></path>
                <path d="M20,19v-8c0-1.13-0.391-2.162-1.026-3H22c1.105,0,2,0.895,2,2v6h-2v5c0,0.552-0.448,1-1,1h-2 c-0.552,0-1-0.448-1-1v-2H20z"></path>
                <path d="M20,7L20,7c1.105,0,2-0.895,2-2v0c0-1.105-0.895-2-2-2h0c-1.105,0-2,0.895-2,2v0 C18,6.105,18.895,7,20,7z"></path>
            </g>

        </Button>
    )
}

const LivestreamButton = (props) => {

    return (
        <Button title="LIVESTREAMS" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path>
        </Button>
    )
}

/**
 * ApplicationSidebar
 */

function getStyle(props) {

    return {

        root : {
            backgroundColor: props.baseColor,
            borderBottom: '5px solid ' + props.accentColor,
            flex: '0 0 85px'
        },

        buttonGroup : {
            display : 'flex',
            flexDirection : 'row'
        },

        spacer: {
            flexGrow: 1
        },

        balance : {
            color : 'white',
            flex: '0 0 220px',
            backgroundColor: props.balanceColor,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        },

        button : {
            //marginRight : '30px',
        }
    }
}

const ApplicationSidebar = (props) => {

    var style = getStyle(props)

    var buttonColorProps = {
        rootColors : {
            normal : props.baseColor,
            hover : props.attentionColor,
            selected : props.accentColor
        },
        contentColors : {
            normal : 'white',
            hover : 'white',
            selected : 'white',
        },
        notificationColor : props.notificationColor
    }

    return (
        <Sidebar style={style.root}>

            <div style={style.buttonGroup}>

                <DowloadButton
                    selected={props.app.activeScene == Scene.Downloading}
                    onClick={() => { props.app.moveToScene(Scene.Downloading)}}
                    style={style.button}
                    {...buttonColorProps}
                />

                <UploadButton
                    selected={props.app.activeScene == Scene.Uploading}
                    onClick={() => { props.app.moveToScene(Scene.Uploading)}}
                    style={style.button}
                    {...buttonColorProps}
                />

                <FinishedButton
                    selected={props.app.activeScene == Scene.Completed}
                    notificationCount={7}
                    onClick={() => { props.app.moveToScene(Scene.Completed)}}
                    style={style.button}
                    {...buttonColorProps}
                />

                <WalletButton
                    onClick={() => { console.log("click: hello 2")}}
                    style={style.button}
                    {...buttonColorProps}
                />

                <CommunityButton
                    onClick={() => { console.log("click: hello 2")}}
                    style={style.button}
                    {...buttonColorProps}
                />

                <LivestreamButton
                    onClick={() => { console.log("click: hello 3")}}
                    style={style.button}
                    {...buttonColorProps}
                />

            </div>

            <div style={style.spacer}></div>

            <div style={style.balance}>
                <div>
                    <span style={{marginRight : '10px', fontSize : '25px', fontWeight: 'bold'}}>{props.balance}</span>
                    <span>{props.balanceUnits}</span>
                    <div style={{
                        fontSize: '10px',
                        top: '-3px',
                        position: 'relative'}}>UNCONFIRMED BALANCE</div>
                </div>

            </div>

        </Sidebar>
    )

}

ApplicationSidebar.propTypes = {
    app : PropTypes.object.isRequired,
    baseColor : PropTypes.string,
    attentionColor : PropTypes.string,
    accentColor : PropTypes.string,
    notificationColor : PropTypes.string,
    balance : PropTypes.string.isRequired,
    balanceUnits : PropTypes.string.isRequired,
    balanceColor : PropTypes.string.isRequired
}

ApplicationSidebar.defaultProps = {
    baseColor : '#11153b', // '#414a56'
    attentionColor : '#5c8ff7',
    accentColor : '#f2b925',
    notificationColor : '#c52578',
    balance : '8,112,300',
    balanceUnits : 'bits',
    balanceColor : '#414a56' //'#65aaf9'
}


export default ApplicationSidebar
