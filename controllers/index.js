const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
router.get('/', async (req, res) => {
  let books
  let auth
  try {
    
    books = await Book.find().limit(10).exec()
    auth = await Author.find(books.author).limit(10).exec()
   
  } catch {
    books = []
    auth = []
  }
  res.render('index', { books: books, auth: auth})
})

module.exports = router