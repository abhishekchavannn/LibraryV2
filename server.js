if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const indexController = require('./controllers/index')
const authorController = require('./controllers/authors')
const subjectController = require('./controllers/subjects')
const bookController= require('./controllers/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/main')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({extended:false})); 
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/library", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err)
      console.error(err);
  else
      console.log("Connected to the Database Successfully!"); 
});

const port = 9000
app.use('/', indexController)
app.use('/authors', authorController)
app.use('/subjects', subjectController)
app.use('/books', bookController)
app.listen(process.env.PORT || `${port}`)
console.log(`Hosted on port ${port}`)