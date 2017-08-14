import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Some components use react-tap-event-plugin to listen for touch events because onClick is not
 * fast enough This dependency is temporary and will eventually go away.
 * Until then, be sure to inject this plugin at the start of your app.
 *
 * NB:! Can only be called once per application lifecycle
 */
var injectTapEventPlugin = require('react-tap-event-plugin')
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