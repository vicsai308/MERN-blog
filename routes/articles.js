const express = require('express') //seup express
const article = require('./../models/article')
const Article = require('./../models/article')
const router = express.Router() //this gives router to create views


router.get('/new', (req,res) => {
    res.render('articles/new', {article: new Article()})
})

//to get id and to redirect to show article page
// router.get('/:id', async (req, res)=>{
//     const article = await Article.findById(req.params.id)
//     if(article == null) res.redirect('/')
//     res.render('articles/show', {article: article})

// })

// after slugifi integrated find my id rout modified

router.get('/:slug', async (req, res)=>{
    // const article = await Article.find({slug: req.params.slug}) //fetch an array of mattching values based on matching slug
    const article = await Article.findOne({slug: req.params.slug}) //fetch an one mattching values based on matching slug
    if(article == null) res.redirect('/')
    res.render('articles/show', {article: article})

})


router.get('/edit/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

router.post('/', async (req,res,next)=>{
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//we cant use delete method since form and link supports only post and get, hence we need 'method-override' library to use delete, put methods

router.delete('/:id', async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//middleware
function saveArticleAndRedirect(path){
    return async (req,res) => {

        let article = req.article
        article.title = req.body.title
        article.descriptio = req.body.description
        article.markdown = req.body.markdown
    
        // res.send(req.body)
        try{
        // to save article & below is async fuction
        article = await article.save()
        // redirect to article id
        res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`,{article: article})
        }
    }
}

module.exports = router