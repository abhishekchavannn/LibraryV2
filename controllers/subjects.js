const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Subject = require('../models/subject')

// All Subjects Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.subjectName != null && req.query.subjectName !== '') {
    searchOptions.subjectName = new RegExp(req.query.subjectName, 'i')
  }
  try {
    const subjects = await Subject.find(searchOptions)
    res.render('subjects/index', {
      subjects: subjects,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Subject Route
router.get('/add', (req, res) => {
  res.render('subjects/add', { subject: new Subject() })
})

// Create Subject Route
router.post('/', async (req, res) => {
  const subject = new Subject({
    subjectName: req.body.subjectName
  })
  try {
    const addSubject = await subject.save()
    res.redirect(`subjects/${addSubject.id}`)
  } catch {
    res.render('subjects/add', {
      subject: subject,
      errorMessage: 'Error creating Topic'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    const books = await Book.find({ subject: subject.id }).limit(10).exec()

    res.render('subjects/show', {
      subject: subject,
      booksBySubject: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    res.render('subjects/edit', { subject: subject })
  } catch {
    res.redirect('/subjects')
  }
})

router.put('/:id', async (req, res) => {
  let subject
  try {
    subject = await Subject.findById(req.params.id)
    subject.subjectName = req.body.subjectName
    await subject.save()
    res.redirect(`/subjects/${subject.id}`)
  } catch {
    if (subject == null) {
      res.redirect('/')
    } else {
      res.render('subjects/edit', {
        subject: subject,
        errorMessage: 'Error updating subject'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let subject
  try {
    subject = await Subject.findById(req.params.id)
    await subject.remove()
    res.redirect('/subjects')
  } catch {
    if (subject == null) {
      res.redirect('/')
    } else {
      res.redirect(`/subjects/${subject.id}`)
    }
  }
})

module.exports = router