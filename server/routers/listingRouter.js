const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const cors = require('cors');


const {IsLoggedIn, isAuthor, validateListing, validateReview, isReviewAuthor } = require('../../middlewares')



//listing routers
router.get('',listingController.homepage);
router.get('/listings',listingController.allListings);
router.get('/listings/new-listing-form',IsLoggedIn,listingController.newListing);
router.post('/listings',validateListing, IsLoggedIn, listingController.saveListing);
router.get('/listings/:id', listingController.showListing);
router.get('/listings/:id/update-listing',IsLoggedIn, isAuthor, listingController.updateListingForm);
router.put('/listings/:id', validateListing, isAuthor, IsLoggedIn, listingController.updateListing)
router.delete('/listings/:id',isAuthor, IsLoggedIn, listingController.deleteListing);
//review routers
router.post('/listings/:id/reviews', validateReview, IsLoggedIn, listingController.saveReview);
router.delete('/listings/:id/reviews/:reviewId', IsLoggedIn ,isReviewAuthor, listingController.deleteReview);
module.exports = router;