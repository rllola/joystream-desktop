import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// First time render
render()

// Setup future rendering
if (module.hot) {
    module.hot.accept(render)
}

function render() {

    console.log("Trying to render app again")

    // NB: We have to re-require Application every time, or else this won't work
    var ComponentDevelopmentApplication = require('./App').default

    ReactDOM.render(
        <AppContainer>
            <ComponentDevelopmentApplication />
        </AppContainer>
        ,
        document.getElementById('root')
    )
}

window.render = render