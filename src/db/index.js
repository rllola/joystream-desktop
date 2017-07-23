import levelup from 'levelup'
import Store from './store'
import namespace from 'level-namespace'

// Returns instance of a store immedietly, get/set operations will be queued
function openImmediate (dbPath, namespaces) {
  let db = levelup(dbPath, {
    keyEncoding: 'utf8',
    valueEncoding: 'json',
    createIfMissing: true
  }, function (err, db) {
    if (err) return console.log('failed to open level db from: ', dbPath, err)
  })

  namespace(db)

  return new Store(db, namespaces)
}

// Returns a promise of a store which gets resolved when the database is successfully opened
function open (dbPath, namespaces) {
  return new Promise(function (resolve, reject) {
    levelup(dbPath, {
      keyEncoding: 'utf8',
      valueEncoding: 'json',
      createIfMissing: true
    }, function (err, db) {
      if (err) return reject(err)
      namespace(db)
      resolve(new Store(db, namespaces))
    })
  })
}

export default {openImmediate, open}
