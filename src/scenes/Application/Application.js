import React, { Component } from 'react'
//import { HashRouter, Route } from 'react-router-dom'
//import { Provider } from 'mobx-react'
import MobxReactDevTools from 'mobx-react-devtools'
import { observer } from 'mobx-react'

//import Header from '../Header'
import ApplicationHeader from './ApplicationHeader'
import Scene from './Scene'

// Components
//import Sidebar from './components/Sidebar'

// Our scenes
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
//import Wallet from '../Wallet'

class Application extends Component {

    constructor(props) {
        super(props)

        this.state = {activeScene : Scene.Downloading}
    }

    setActiveScene(s) {
        this.setState({activeScene : s})
    }

    render () {

        console.log(this.state)

        return (

            <div className="app-container">

                <ApplicationHeader balance={13333337}
                                   activeScene={this.state.activeScene}
                                   onSceneSelected={(s) => {this.setActiveScene(s)}}/>

                {this.getRenderedScene()}

                <div><MobxReactDevTools/></div>

            </div>
        )
    }

    getRenderedScene() {

        if(this.state.activeScene == Scene.Downloading) {
            return <Downloading torrents={[]}
                                revenue={123}
                                downloadSpeed={77777}
                                onStartDownloadClicked={() => { console.log(" start download clicked")}}/>
        } else if(this.state.activeScene == Scene.Seeding) {
            return <h1>put new uploading scene component here</h1>
        } else {
            return <h1>put new completed scene component here</h1>
        }
    }
}

export default Application
