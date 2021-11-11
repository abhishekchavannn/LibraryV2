const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const Subject = require('../models/subject');


// GET All the books
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  
  try {
    const books = await query.exec()
      res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// Calling the function to render the page
router.get('/add', async (req, res) => {
  renderPage(res, new Book())
})

// POST the details (ADDING BOOKS)
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    subject: req.body.subject,
    copyCount: req.body.copyCount,
    edition: req.body.edition,
    description: req.body.description
  })


  try {
    const addBook = await book.save()
    res.redirect(`books/${addBook.id}`)
  } catch {
    renderPage(res, book, true)
  }
})

// Show Book Route
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
                           .populate('author')
      .exec()
    const sub = await Subject.findById(book.subject)

    res.render('books/show', { book: book, sub: sub})
  } catch {
    res.redirect('/')
  }
})

// Update Book 
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch {
    res.redirect('/')
  }
})

router.put('/:id', async (req, res) => {
  let book

  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.subject = req.body.subject
    book.copyCount = req.body.copyCount
    book.edition = req.body.edition
    book.description = req.body.description
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch {
    if (book != null) {
      renderEditPage(res, book, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Book Page
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderPage(res, book, errorr = false) {
  renderForm(res, book, 'add', errorr)
}

async function renderEditPage(res, book, errorr = false) {
  renderForm(res, book, 'edit', errorr)
}

async function renderForm(res, book, form, errorr = false) {
  try {
    const authors = await Author.find({})
    const subjects = await Subject.find({})
    const params = {
      authors: authors,
      subjects:subjects,
      book: book
    }
    if (errorr) {
      if (form === 'edit') {
        params.errorMessage = 'ERROR: Cannot update the details, try again'
      } else {
        params.errorMessage = 'ERROR: Fill the appropriate details'
      }
    }
    res.render(`books/${form}`, params)
  } catch {
    res.redirect('/books')
  }
}

module.exports = router