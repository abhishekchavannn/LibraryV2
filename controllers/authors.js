const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// GET all authors list
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// add Author routing
router.get('/add', (req, res) => {
  res.render('authors/add', { author: new Author() })
})

// Add author (POST)
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/add', {
      author: author,
      errorMessage: 'ERROR: Enter valid input'
    })
  }
})
// Show author on search
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()

    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})
// Update author details
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'ERROR: Cannot update, please try again'
      })
    }
  }
})
// Delete author details
router.delete('/:id', async (req, res) => {
  let author
  let authName;
  
  try {
    author = await Author.findById(req.params.id)
    authName = await Book.find({
      author: author
    })
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (authName != 0) {
      res.render('authors/show', {
        author: author,
        booksByAuthor: authName,
        errorMessage: 'ERROR: You need to delete the books first!'
      })
    }
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})

module.exports = router