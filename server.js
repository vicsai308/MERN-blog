const express = require('express') //import express from library
const mongoose = require('mongoose') //import mongoose to connect mongodb
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override') //to use put, delete methods
const app = express() //calling as a function 

//to connect mongodb
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost/blog')

// set view engine (uses ejs-> write all views using ejs)
//view engine converts ejs code to html
app.set('view engine', 'ejs')

//in order to access options from form from inside post request we nedd to tell express how to access them.
//it must be before article router
app.use(express.urlencoded({ extended: false }))

//we define '_method' to let the form know we use method override module 
app.use(methodOverride('_method'))


// index route
app.get('/', async(req,res) => {
    // res.send('hello world')
    // const articles =[{
    //     title: 'test article',
        // createdAt: Date.now(),
        // to use toLocaledateString()
    //     createdAt: new Date(),
    //     description: 'Test description'
    // },
    // {
    //     title: 'test article 2',
    //     createdAt: new Date(),
    //     description: 'Test description2'
    // }]
    
    //get all articles
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles:articles})  //Render will aceess views folder
})

//every page created will start with /articles in their routes
app.use('/articles', articleRouter)

app.listen(5000)//start application in port 5000