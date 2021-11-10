if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const indexRouter = require('./controllers/index')
const authorRouter = require('./controllers/authors')
const subjectRouter = require('./controllers/subjects')
const bookRouter = require('./controllers/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({limit: '30mb', extended:false})); 
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/library", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err)
      console.error(err);
  else
      console.log("Connected to the mongodb"); 
});


app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/subjects', subjectRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 9000)