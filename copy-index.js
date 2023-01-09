const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const Yummyplace = require('./models/yummyplace')
const Review = require('./models/reviews')
const methodoverride = require('method-override')
app.use(methodoverride('_method'))

const ejsMate = require('ejs-mate')
const { nextTick } = require('process')
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const errorAsync = require('./utility/errorAsync');
const errorExpress = require('./utility/errorExpress');


app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yummyplaces', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true

})
// .then(() => {
//     console.log('mongo is connected')
// })
const { yummyplaceSchemaJoi } = require('./schemasJoi.js');

const validateYummyplaceJoi = (req, res, next) => {
    console.log(req.body)
    const { error } = yummyplaceSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new errorExpress(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.set()
const db = mongoose.connection
db.on("error", () => { console.log(`mongoose connection error`) })
db.once("open", () => {
    console.log("connection is open")
})

app.get('/', async (req, res) => {
    // const place = new Yummyplace({ title: 'yummyOne', price: 1200, description: 'this is very cheap and delicious' })
    // await place.save()
    // res.send('Place added')

})
app.post('/yummyplaces/:id/reviews', validateReview, errorAsync(async (req, res) => {
    const thisPlace = await Yummyplace.findById(req.params.id);
    const review = new Review(req.body.review);
    thisPlace.reviews.push(review);
    await review.save();
    await thisPlace.save();
    res.redirect(`/yummyplaces/${thisPlace._id}`);
}))

app.get('/yummyplaces/new', (req, res) => {
    //const foundAll = await Yummyplace.find({})
    res.render('yummyplaces/new')

})


app.post('/yummyplaces/new', validateYummyplaceJoi, errorAsync(async (req, res) => {
    // const { title, description, location, price } = req.body
    //res.send(`${title} - ${description} - ${location} - ${price}`)
    // console.log(req.body)

    //  console.log(req.body.yummyplace)
    const newPlace = new Yummyplace(req.body.yummyplace)
    await newPlace.save()
    res.redirect(`/yummyplaces/${newPlace._id}`)


}))

app.get('/yummyplaces/:id/edit', errorAsync(async (req, res, next) => {

    const { id } = req.params
    const foundOne = await Yummyplace.findById(id)
    res.render('yummyplaces/edit', { foundOne })
    // res.send('hello')


}))



app.delete('/yummyplaces/:id', errorAsync(async (req, res, next) => {
    const { id } = req.params
    await Yummyplace.findOneAndDelete({ _id: id })
    res.redirect('/yummyplaces')
}))


app.post('/yummyplaces/:id/edit', validateYummyplaceJoi, errorAsync(async (req, res) => {
    const { id } = req.params
    const foundOne = await Yummyplace.findOneAndUpdate({ _id: id }, req.body, { runValidators: true, context: 'query' })
    res.redirect(`/yummyplaces/${foundOne._id}`)


}))


app.get('/yummyplaces/:id', errorAsync(async (req, res) => {
    const thisplace = await Yummyplace.findById(req.params.id).populate('reviews');
    res.render('yummyplaces/show', { thisplace });

}))


app.get('/yummyplaces', async (req, res) => {
    const foundAll = await Yummyplace.find({})
    res.render('yummyplaces/index', { foundAll })

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