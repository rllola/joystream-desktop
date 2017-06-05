import React, { Component } from 'react'
import { observer } from 'mobx-react'

//import Header from '../Header'
import ApplicationHeader from './ApplicationHeader'
import Scene from '../../core/Application/Scene'

// Components
//import Sidebar from './components/Sidebar'

// Our scenes
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
//import Wallet from '../Wallet'

let MobxReactDevTools
if (process.env.NODE_ENV === 'development') {
    MobxReactDevTools = require('mobx-react-devtools').default
}

@observer
class Application extends Component {

    constructor(props) {
        super(props)
    }

    render () {
        // during loading there is no active scene yet
        if (this.props.app.activeScene === Scene.NotStarted) return null
        if (this.props.app.activeScene === Scene.Loading) return <h1>Starting . . .</h1>
        if (this.props.app.activeScene === Scene.ShuttingDown) return <h1>Exiting . . .</h1>

        return null

            /**
             this.props.applicationStore.loadingTorrents
             ?
             this.getRenderedLoadingScene()
             :
             this.getRenderedActiveScene()
             **/
    }

    getRenderedLoadingScene() {

        return null
    }

    getRenderedActiveScene() {

        return (
            <div className="app-container">

                <ApplicationHeader balance={13333337}
                                   activeScene={this.props.app.activeScene}
                                   onSceneSelected={(s) => {this.props.app.moveToScene(s)}}/>

                {this.getRenderedScene()}

                {process.env.NODE_ENV === 'development' ? <div><MobxReactDevTools/></div> : null}

            </div>
        )

    }

    getRenderedScene () {
        if(this.props.app.activeScene === Scene.Downloading) {
            return <Downloading torrents={[]}
                                revenue={123}
                                downloadSpeed={77777}
                                onStartDownloadClicked={() => { console.log(" start download clicked")}}/>
        } else if (this.props.app.activeScene === Scene.Uploading) {
            return <h1>put new uploading scene component here</h1>
        } else {
            return <h1>put new completed scene component here</h1>
        }
    }
}

export default Application
