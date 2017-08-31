import React, { Component } from 'react'
import {Button, Sidebar} from '../../../../components/Sidebar'

/**
 * Buttons
 */

const ChangeTermsButton = (props) => {
    return (
        <Button title="Balance" {...props}>
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
        <Button title="uploads" {...props}>
            <path d="M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"></path>
        </Button>
    )
}

const DowloadButton = (props) => {

    return (
        <Button title="downloads" {...props}>
            <path d="M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"></path>
        </Button>
    )
}

const FinishedButton = (props) => {

    return (
        <Button title="finished" {...props}>
            <polygon points="9,20 2,13 5,10 9,14 19,4 22,7 "></polygon>
        </Button>
    )
}

const WalletButton = (props) => {

    /**

     **/

    return (
        <Button title="wallet" {...props} viewBox={'0 0 48 48'}>
            <g className="nc-icon-wrapper" >
                <path d="M46,26h-9c-2.206,0-4,1.794-4,4s1.794,4,4,4h9c0.552,0,1-0.448,1-1v-6 C47,26.448,46.552,26,46,26z"></path>
                <path d="M38,1H10C9.447,1,9,1.447,9,2v7c0,0.553,0.447,1,1,1h28c0.553,0,1-0.447,1-1V2 C39,1.447,38.553,1,38,1z"></path>
                <path d="M43,13H6c-1.654,0-3-1.346-3-3s1.346-3,3-3h1V5H6c-2.757,0-5,2.243-5,5v30c0,3.86,3.14,7,7,7h35 c0.552,0,1-0.448,1-1V36h-7c-3.309,0-6-2.691-6-6s2.691-6,6-6h7V14C44,13.448,43.552,13,43,13z"></path>
            </g>
        </Button>
    )
}

const CommunityButton = (props) => {
    /**
     <g class="nc-icon-wrapper">
     <path d="M12,6L12,6c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,4.657,13.657,6,12,6z"></path>
     <path d="M4,19v-8c0-1.13,0.391-2.162,1.026-3H2c-1.105,0-2,0.895-2,2v6h2v5c0,0.552,0.448,1,1,1h2 c0.552,0,1-0.448,1-1v-2H4z"></path> <path fill="#444444" d="M14,24h-4c-0.552,0-1-0.448-1-1v-6H6v-6c0-1.657,1.343-3,3-3h6c1.657,0,3,1.343,3,3v6h-3v6 C15,23.552,14.552,24,14,24z"></path> <path data-color="color-2" fill="#444444" d="M4,7L4,7C2.895,7,2,6.105,2,5v0c0-1.105,0.895-2,2-2h0c1.105,0,2,0.895,2,2v0 C6,6.105,5.105,7,4,7z"></path> <path data-color="color-2" fill="#444444" d="M20,19v-8c0-1.13-0.391-2.162-1.026-3H22c1.105,0,2,0.895,2,2v6h-2v5c0,0.552-0.448,1-1,1h-2 c-0.552,0-1-0.448-1-1v-2H20z"></path> <path data-color="color-2" fill="#444444" d="M20,7L20,7c1.105,0,2-0.895,2-2v0c0-1.105-0.895-2-2-2h0c-1.105,0-2,0.895-2,2v0 C18,6.105,18.895,7,20,7z"></path>
     </g>
     */

    return (
        <Button title="community" {...props} viewBox={'0 0 48 48'}>
            <g className="nc-icon-wrapper">
                <circle data-color="color-2" cx="9" cy="10" r="5"></circle>
                <circle cx="24" cy="8" r="7"></circle>
                <path d="M13.272,35.911C11.934,35.576,11,34.379,11,33V22c0-1.906,0.768-3.634,2.008-4.898 C12.682,17.035,12.345,17,12,17H6c-2.757,0-5,2.243-5,5v9c0,0.431,0.275,0.812,0.684,0.949l2.38,0.793l0.94,10.349 C5.051,43.605,5.483,44,6,44h6c0.517,0,0.949-0.395,0.996-0.91l0.644-7.088L13.272,35.911z"></path>
                <circle cx="39" cy="10" r="5"></circle>
                <path d="M34.728,35.911C36.066,35.576,37,34.379,37,33V22c0-1.906-0.768-3.634-2.008-4.898 C35.318,17.035,35.655,17,36,17h6c2.757,0,5,2.243,5,5v9c0,0.431-0.275,0.812-0.684,0.949l-2.38,0.793l-0.94,10.349 C42.949,43.605,42.517,44,42,44h-6c-0.517,0-0.949-0.395-0.996-0.91l-0.644-7.088L34.728,35.911z"></path>
                <path d="M30,17H18c-2.757,0-5,2.243-5,5v11c0,0.459,0.312,0.859,0.757,0.97l3.306,0.826l0.94,11.287 C18.047,46.602,18.48,47,19,47h10c0.52,0,0.953-0.398,0.997-0.917l0.94-11.287l3.306-0.826C34.688,33.859,35,33.459,35,33V22 C35,19.243,32.757,17,30,17z"></path>
            </g>
        </Button>
    )
}

const LivestreamButton = (props) => {

    return (
        <Button title="livestreams" {...props}>
            <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path>
        </Button>
    )
}

/**
 * ApplicationSidebar
 */

function getStyle(props) {

    return {
        padding : '20px',
        paddingTop : '40px',
        backgroundColor : "#202F53"
    }
}

const ApplicationSidebar = (props) => {

    var style = getStyle(props)

    return (
        <Sidebar style={style}>

            <UploadButton
                onClick={() => { console.log("click: hello 1")}}
            />

            <DowloadButton
                onClick={() => { console.log("click: hello 2")}}
            />

            <FinishedButton
                selected={true}
                onClick={() => { console.log("click: hello 2")}}
            />

            <WalletButton
                onClick={() => { console.log("click: hello 2")}}
            />

            <CommunityButton
                selected={true}
                onClick={() => { console.log("click: hello 2")}}
            />

            <LivestreamButton
                onClick={() => { console.log("click: hello 3")}}
            />

        </Sidebar>
    )

}

export default ApplicationSidebar
