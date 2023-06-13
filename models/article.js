const mongoose = require('mongoose')
const { marked } = require('marked') //to create markdown and turn it into html
const slugify = require('slugify') //converts title into url friendly slug instead of article id in url
const createDomPurify = require('dompurify') // allows to sanitize HTML son malicious js scripts cannot run
const { JSDOM } = require('jsdom') // helps to render html inside a node js (node js do not know html!)
const dompurify = createDomPurify(new JSDOM().window) 

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    markdown:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true, //will make sure we cant have articles with same slug, we put this in database because we dont have to calculate everytime, we calculate it once and save it in database. 
    },
    sanitizedHtml:{
        type: String,
        required: true
    }
})

// To automatically calculate slug on saving the article we setup some validations and some before attributes 
articleSchema.pre('validate',function(next){
    //run this funtion right before the validation on our article every single time we do CRUD
    if(this.title){
        this.slug = slugify(this.title, {
            lower: true, // convert to lowercase 
            strict: true // remove special characters that dont fit in the URL from title
        })
    }
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown)) //purifies html to get rid of any malicious code (escapes all html characters)
    }
    next() //next must me called else throws an error
})

module.exports = mongoose.model('Article', articleSchema)