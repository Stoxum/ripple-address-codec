/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const assert = require('assert')
const api = require('../')

function toHex(bytes) {
  return new Buffer(bytes).toString('hex').toUpperCase()
}

function toBytes(hex) {
  return new Buffer(hex, 'hex').toJSON().data
}

describe('stoxum-address-codec', function() {
  function makeTest(type, base58, hex) {
    it('can translate between ' + hex + ' and ' + base58, function() {
      const actual = api['encode' + type](toBytes(hex))
      assert.equal(actual, base58)
    })
    it('can translate between ' + base58 + ' and ' + hex, function() {
      const buf = api['decode' + type](base58)
      assert.equal(toHex(buf), hex)
    })
  }

  makeTest('AccountID', 'xjxnJ7hn7xfkyNTAF7dwNZ5UgWGBsQw9xC',
    'BA8E78626EE42C41B46D46C3048DF3A1C3C87072')

  makeTest(
    'NodePublic',
    'E2JZZdPrVQS6smQkNRJ1DQpYm1H8qLgCjsw16giBFSdsMbSeDSMm',
    '0388E5BA87A000CB807240DF8C848EB0B5FFA5C8E5A521BC8E105C0F0A44217828')

  makeTest('K256Seed', 'tEvw2x9TZx5xgWeQ5SZEPg1YikUqa',
    'CF2DE378FBDD7E2EE87D486DFB5A7BFF')

  makeTest('EdSeed', 't9UMJDdZVFdvUrwZRMEd8mkmtrdJXJv',
    '4C3A1D213FBDFB14C7C28D609469B341')

  it('can decode arbitray seeds', function() {
    const decoded = api.decodeSeed('t9UMJDdZVFdvUrwZRMEd8mkmtrdJXJv')
    assert.equal(toHex(decoded.bytes), '4C3A1D213FBDFB14C7C28D609469B341')
    assert.equal(decoded.type, 'ed25519')

    const decoded2 = api.decodeSeed('tEvw2x9TZx5xgWeQ5SZEPg1YikUqa')
    assert.equal(toHex(decoded2.bytes), 'CF2DE378FBDD7E2EE87D486DFB5A7BFF')
    assert.equal(decoded2.type, 'secp256k1')
  })

  it('can pass a type as second arg to encodeSeed', function() {
    const edSeed = 't9UMJDdZVFdvUrwZRMEd8mkmtrdJXJv'
    const decoded = api.decodeSeed(edSeed)
    assert.equal(toHex(decoded.bytes), '4C3A1D213FBDFB14C7C28D609469B341')
    assert.equal(decoded.type, 'ed25519')
    assert.equal(api.encodeSeed(decoded.bytes, decoded.type), edSeed)
  })

  it('isValidAddress - secp256k1 address valid', function() {
    assert(api.isValidAddress('rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'))
  })
  it('isValidAddress - ed25519 address valid', function() {
    assert(api.isValidAddress('rLUEXYuLiQptky37CqLcm9USQpPiz5rkpD'))
  })
  it('isValidAddress - invalid', function() {
    assert(!api.isValidAddress('rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw2'))
  })
  it('isValidAddress - empty', function() {
    assert(!api.isValidAddress(''))
  })

})
