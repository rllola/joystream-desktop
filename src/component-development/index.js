import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// First time render
render()

// Setup future rendering
if (module.hot) {
    module.hot.accept(render)
}

function render() {

    // NB: We have to re-require Application every time, or else this won't work
    var AppContainer = require('react-hot-loader').AppContainer
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