const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const cors = require('cors');
const cortsOptions = require('../../config/corsOptions')

const {IsLoggedIn, isAuthor, validateListing, validateReview, isReviewAuthor } = require('../../middlewares')



//listing routers
router.get('', listingController.homepage);
router.get('/listings',cors(cortsOptions), listingController.allListings);
router.get('/listings/new-listing-form',IsLoggedIn, cors(cortsOptions),listingController.newListing);
router.post('/listings',validateListing, IsLoggedIn, cors(cortsOptions),listingController.saveListing);
router.get('/listings/:id', cors(cortsOptions),listingController.showListing);
router.get('/listings/:id/update-listing',IsLoggedIn, isAuthor , cors(cortsOptions),listingController.updateListingForm);
router.put('/listings/:id', validateListing, isAuthor, IsLoggedIn, cors(cortsOptions),listingController.updateListing)
router.delete('/listings/:id',isAuthor, IsLoggedIn, cors(cortsOptions),listingController.deleteListing);
//review routers
router.post('/listings/:id/reviews', validateReview, IsLoggedIn, cors(cortsOptions),listingController.saveReview);
router.delete('/listings/:id/reviews/:reviewId', IsLoggedIn ,isReviewAuthor, cors(cortsOptions), listingController.deleteReview);
module.exports = router;