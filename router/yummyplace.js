const express = require('express');
const yummyplaceRouter = express.Router();

const errorAsync = require('../utility/errorAsync');
const { yummyplaceSchemaJoi } = require('../schemasJoi');

const errorExpress = require('../utility/errorExpress');
const Yummyplace = require('../models/yummyplace');

const validateYummyplaceJoi = (req, res, next) => {
    // console.log(req.body)
    const { error } = yummyplaceSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new errorExpress(msg, 400)
    } else {
        next();
    }
}


yummyplaceRouter.get('/new', (req, res) => {
    //const foundAll = await Yummyplace.find({})
    res.render('yummyplaces/new')

})


yummyplaceRouter.get('/:id', errorAsync(async (req, res) => {
    const thisplace = await Yummyplace.findById(req.params.id).populate('reviews');
    if (!thisplace) {
        req.flash('error', `This place doesnt' exist!`)
        return res.redirect('/yummyplaces')
    }
    res.render('yummyplaces/show', { thisplace });

}))




yummyplaceRouter.post('/new', validateYummyplaceJoi, errorAsync(async (req, res) => {

    const newPlace = new Yummyplace(req.body.yummyplace)
    await newPlace.save()
    req.flash('success', 'Place added successfully!')
    res.redirect(`/yummyplaces/${newPlace._id}`)


}))
yummyplaceRouter.post('/:id/edit', validateYummyplaceJoi, errorAsync(async (req, res) => {
    const { id } = req.params
    const foundOne = await Yummyplace.findByIdAndUpdate(id, { ...req.body.yummyplace });
    req.flash('success', 'Place updated successfully!')
    res.redirect(`/yummyplaces/${foundOne._id}`)


}))

yummyplaceRouter.get('/:id/edit', errorAsync(async (req, res, next) => {

    const { id } = req.params
    const foundOne = await Yummyplace.findById(id)
    if (!foundOne) {
        req.flash('error', "Not found")
        res.redirect('/yummyplaces')
    }
    res.render('yummyplaces/edit', { foundOne })
    // res.send('hello')


}))



yummyplaceRouter.delete('/:id', errorAsync(async (req, res, next) => {
    const { id } = req.params
    await Yummyplace.findOneAndDelete({ _id: id })
    res.redirect('/yummyplaces')
}))






yummyplaceRouter.get('/', async (req, res) => {
    const foundAll = await Yummyplace.find({})
    res.render('yummyplaces/index', { foundAll })

})

module.exports = yummyplaceRouter;