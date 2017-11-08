require('dotenv').config()

const low = require('lowdb')
const GhStorage = require('.')

const adapter = GhStorage({
  file: 'db.json',
  repo: 'lowdb-gh-adapter',
  user: 'YerkoPalma',
  token: process.env.TOKEN,
  branch: 'db'
})

low(adapter)
  .then(db => {
    // Set some defaults
    return db.defaults({ posts: [], user: {} })
      .write()
      .then(() => {
        // Add a post
        db.get('posts')
          .push({ id: 1, title: 'lowdb is awesome'})
          .write()
          .then(() => {
            // Set a user using Lodash shorthand syntax
            db.set('user.name', 'yerkopalma')
              .write().catch(console.error)
          }).catch(console.error)
      }).catch(console.error)
  })
  .catch(err => console.error(err))
