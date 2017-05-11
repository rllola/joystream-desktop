import levelup from 'levelup'
import Store from './store'
import namespace from 'level-namespace'

function open (dbPath, namespaces) {
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

export default {open}
