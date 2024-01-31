const {listingSchemaValidation , reviewSchemaValidation} = require('./schemas')
const Listing = require('./models/listing')
const ExpressError = require('./utils/ExpressError')
const Review = require('./models/review')

module.exports.IsLoggedIn = (req,res, next) => {
  req.session.returnTo = req.originalUrl;
  if(!req.isAuthenticated()){
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if(req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}


module.exports.validateListing = (req, res, next) => {
  
  const {error} = listingSchemaValidation.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.validateReview = (req,res, next) => {
  const {error} = reviewSchemaValidation.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }

}

module.exports.isAuthor = async(req,res, next) => {
  const listingId = req.params.id
  const listing = await Listing.findById(listingId);
  if(!listing.author.equals(req.user._id)) {
    req.flash('error', 'You do not have the permission to do that.')
    return res.redirect(`/listings/${listingId}`);
  }
  next();
}
module.exports.isReviewAuthor = async(req,res, next) => {
  const listingId = req.params.id
  const reviewId = req.params.reviewId;
  const listing = await Listing.findById(listingId);
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have the permission to do that.')
    return res.redirect(`/listings/${listingId}`);
  }
  next();
}