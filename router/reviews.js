const express = require('express')
//const reviewsRouter = express.Router()
const Yummyplace = require('../models/yummyplace');
const Review = require('../models/reviews');
const reviewsRouter = express.Router({ mergeParams: true });
const { reviewSchemaJoi } = require('../schemasJoi');


const errorAsync = require('../utility/errorAsync');
const errorExpress = require('../utility/errorExpress');

const validateReview = (req, res, next) => {
    const { error } = reviewSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new errorExpress(msg, 400)
    } else {
        next();
    }
}

reviewsRouter.post('/', validateReview, errorAsync(async (req, res) => {
    const thisPlace = await Yummyplace.findById(req.params.id);
    const review = new Review(req.body.review);
    thisPlace.reviews.push(review);
    await review.save();
    await thisPlace.save();
    req.flash('success', 'Review deleted !')
    res.redirect(`/yummyplaces/${thisPlace._id}`);
}))

reviewsRouter.delete('/:reviewId', errorAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Yummyplace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Created deleted review!');
    res.redirect(`/yummyplaces/${id}`);
}))

module.exports = reviewsRouter;