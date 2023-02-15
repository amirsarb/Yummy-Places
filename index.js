const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session = require('express-session');
const methodoverride = require('method-override')
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodoverride('_method'))
const yummyplaceRouter = require('./router/yummyplace')
const reviewsRouter = require('./router/reviews')
const flash = require('connect-flash')
const ejsMate = require('ejs-mate')
const { nextTick } = require('process')
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const errorExpress = require('./utility/errorExpress');


app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yummyplaces', {


})

const db = mongoose.connection

db.on("error", () => { console.log(`mongoose connection error`) })
db.once("open", () => {
    console.log("connection is open")
})


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/yummyplaces', yummyplaceRouter)
app.use('/yummyplaces/:id/reviews', reviewsRouter)

app.set()



app.get('/', async (req, res) => {
    // const place = new Yummyplace({ title: 'yummyOne', price: 1200, description: 'this is very cheap and delicious' })
    // await place.save()
    // res.send('Place added')
    res.redirect('/yummyplaces')
})



app.all('*', (req, res, next) => {
    next(new errorExpress('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(8080, () => {
    console.log("App is running on port 8080")
})


