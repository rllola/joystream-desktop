/**
 * Created by bedeho on 05/05/17.
 */

import PropTypes from 'prop-types';

import Field from "./Field"

function to_header_elements(titles) {

    return titles.map((title) => {
        return <Field> {title} </Field>
    })
}

const Table = (props) => {

    return (
        <div className="table">
            <div className="column-headers"> {to_header_elements(props.column_titles)} </div>
            <div className="content"> {props.children} </div>
        </div>)

}

Table.propTypes = {
    column_titles : PropTypes.array.isRequired
}

export default Table