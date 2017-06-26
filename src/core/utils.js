/**
 * Created by bedeho on 20/06/17.
 */

/**
 * Go decorator for machinajs machines for doing transitions through parents
 * @param client
 * @param path
 */
var go = function(client, path) {

    if(path.length == 0)
        throw Error('Invalid path provided')

    var direction = path[0]

    if(direction == "..") {
        this.parent_machine.go(client, path.shift()) // <== parent must also have go decorator
    } else {

        this.transition(client, direction)

        if(this.states[direction]._child != undefined) {
            this.states[direction]._child.instance.go(client, path.shift())
        }
    }

}

export {go}