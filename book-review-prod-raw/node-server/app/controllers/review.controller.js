const db = require('../models/index');
const Review = db.reviews;

const logger = require('../config/logger.config');

// create a new review
exports.createReview = (req, res) => {
    // Validate request
    if (!req.body.asin) {
        res.status(400).send({
            message: 'asin can not be empty!',
        });
        logger.error('Error empty asin when create review');
        return;
    }

    // Create a review
    const review = {
        asin: req.body.asin,
        helpful: req.body.helpful,
        overall: req.body.overall,
        reviewText: req.body.reviewText,
        reviewTime: req.body.reviewTime,
        reviewerID: req.body.reviewerID,
        reviewerName: req.body.reviewerName,
        summary: req.body.summary,
        unixReviewTime: Math.floor(new Date().getTime() / 1000),
    };

    // Save book in the database
    Review.create(review)
        .then((data) => {
            res.send(data);
            // TODO log review id
            logger.info(
                `Successfully created review: asin:${review.asin} reviewerID: ${review.reviewerID}`
            );
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the book.',
            });
            logger.error(`Error when creating review: ${err.message}`);
        });
};

// all reviews
exports.findAllReviews = (req, res) => {
    Review.findAll({ limit: 100 })
        .then((data) => {
            res.send(data);
            logger.info('Successfully find all reviews');
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while finding all reviews',
            });
            logger.error(`Error when find al reviews: ${err.message}`);
        });
};

// get review for review id
exports.findReviewById = (req, res) => {
    const id = req.params.id;

    Review.findByPk(id, { include: ['reviewer'] })
        .then((data) => {
            res.send(data);
            logger.info(`Successfully find review by id: ${id}`);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the review.',
            });
            logger.error(`Error when find review by id ${err.message}`);
        });
};

exports.findReviewByAsin = (req, res) => {
    const asin = req.query.asin;

    Review.findAll({ where: { asin: asin }, limit: 100 })
        .then((data) => {
            if (data == []) {
                res.status(400).send({
                    message: `asin: ${asin}, not found.`,
                });
            } else {
                res.status(200).send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while finding reivew by asin',
            });
        });
};

// update review for review id
exports.updateReviewById = (req, res) => {
    const id = req.params.id;

    const newReview = {
        helpful: req.body.helpful,
        overall: req.body.overall,
        reviewIext: req.body.reviewText,
        summary: req.body.summary,
    };

    Review.update(newReview, { where: { id: id } })
        .then((result) => {
            res.send(result);
            logger.info(`Successfully update review by id: ${id}`);
        })
        .catch((err) => {
            res.status(500),
                send({
                    message: err.message || 'Some error occurred while updating review',
                });
            logger.error(`Error when update review by id: ${err.message}`);
        });
};
