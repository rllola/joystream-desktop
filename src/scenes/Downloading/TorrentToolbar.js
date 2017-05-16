
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Toolbar, {Separator, Section} from '../../components/Toolbar'

import IconButton from 'material-ui/IconButton'

const TorrentToolbar = (props) => {

    return (
        <Toolbar>

            <Section>
                <div className="button">asdfasfdf</div>
            </Section>

            <IconButton
                iconClassName="muidocs-icon-custom-github" tooltip="bottom-right"
                tooltipPosition="bottom-right"
            />


        </Toolbar>
    )
}

export default TorrentToolbar


/**

    <div class="section speedup">
        <div class="button"></div>
    </div>

    <div class="section open-folder">
    <div class="button"></div>
    </div>

    <div class="section separator">
    </div>

    <div class="section more">
    <div class="button"></div>
    </div>
 */