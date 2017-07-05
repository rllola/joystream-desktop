/* global it, describe */
import { assert, expect } from 'chai'

import net from 'net'

class C {
  constructor () {}
}

describe('ES6 support', function () {

  it('works', function () {
    // const keyword and arrow function
    const f = () => {}
    expect(f).to.be.an('function')

    assert(net)

    let c = new C()
    assert(c)
  })
})
