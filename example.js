const low = require('lowdb')
const GhStorage = require('lowdb/adapters/FileSync')

const adapter = new GhStorage({
  file: 'db.json',
  repo: 'lowdb-gh-adapter',
  user: 'YerkoPalma',
  token: process.env.TOKEN
})
const db = low(adapter)

// Set some defaults
db.defaults({ posts: [], user: {} })
  .write()
  .then(() => {
    // Add a post
    db.get('posts')
      .push({ id: 1, title: 'lowdb is awesome'})
      .write()
      .then(() => {
        // Set a user using Lodash shorthand syntax
        db.set('user.name', 'yerkopalma')
          .write()
      })
  })
