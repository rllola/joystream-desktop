/**
 * Created by bedeho on 29/05/17.
 */
import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const ScenarioContainer = (props) => {

    return (
        <div style={{paddingBottom : 40}}>
            <Card>
                <CardTitle title={props.title} subtitle={props.subtitle} />
                {props.children}
            </Card>
        </div>
    )
}

export {ScenarioContainer}