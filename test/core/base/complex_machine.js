import base from '../../../src/core/BaseMachine'

//     X       Y         [root]
//    /|\     /|\
//   a b c   a b c       [substate1]
//  /|\       /|\
// A B C     A B C       [substate2]

var root = base.extend({
  initialState: 'X',
  initialize: function (options) {
    this.createSubMachine(options.states.X, substate1)
    this.createSubMachine(options.states.Y, substate1)
  },
  states: {
    'X': {
    },
    'Y': {
    }
  }
})

var substate1 = base.extend({
  initialState: 'a',
  initialize: function (options) {
    this.createSubMachine(options.states.a, substate2)
    this.createSubMachine(options.states.b, substate2)
  },
  states: {
    a: {
    },
    b: {
    },
    c: {
    }
  }
})

var substate2 = base.extend({
  initialState: 'A',
  states: {
    A: {
    },
    B: {
    },
    C: {
    }
  }
})

export default root
