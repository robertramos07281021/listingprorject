const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync')
const Listing = require('../../models/listing')
const Review = require('../../models/review')

// mongoose.connect('mongodb://127.0.0.1:27017/newlisting')
//   .then(()=> {
//     console.log('Connection open')
//   })
//   .catch(err => {
//     console.log(`Error:${err}`)
//   })


// For Listings ==========================================================================


exports.allListings = catchAsync(async(req, res) => {
  const listings = await Listing.find();
  res.status(200).render('listings/index',{listings})
})

exports.homepage = catchAsync(async(req, res) => {
  const listings = await Listing.find();
  res.status(200).render('listings/index',{listings})
})

exports.showListing = catchAsync(async(req, res) => {

  const {id} = req.params;

  const listing = await Listing.findById(id).populate({
    path: 'reviews',
    populate: {
      path:'author'
    }
  }).populate('author');
  if(!listing){
    req.flash('error','Listing does not exist')
    return res.redirect('/listings')
  }
  res.status(200).render('listings/show', {listing});
})

exports.newListing = (req, res) => {
  
  res.status(200).render('listings/new');
}


exports.saveListing = catchAsync(async(req, res) => {
    const newListing = new Listing(req.body);
    newListing.author = req.user._id;
    await newListing.save();
    req.flash('success', 'You have successfully added a listing');
    res.redirect(`/listings/${newListing._id}`)
})

exports.updateListingForm = catchAsync(async(req, res) => {
  const listingId = req.params.id;
  const listing = await Listing.findById(listingId);
  if(!listing) {
    req.flash('error','Listing does not exist!')
    return res.redirect('/listings')
  }
  res.status(200).render(`listings/edit`,{listing});
})

exports.updateListing = catchAsync(async(req, res) => {
  const {id} = req.params;
  // const newListinng = await Listing.findByIdAndUpdate(id, {name: req.body.listing.name, location: req.body.listing.location});
  // or
  const newListing = await Listing.findByIdAndUpdate(id, {...req.body});
  req.flash('success', 'You have successfully update a listing');
  res.redirect(`/listings/${id}`) 
  
})

exports.deleteListing = catchAsync(async(req, res) => {
  const {id} = req.params;
  const delListing = await Listing.findByIdAndDelete(id);
  if(!delListing){
    req.flash('error','Listing does not exist!')
    return res.redirect('/listings')
  }
  req.flash('deleted', 'You have successfully delete a listing');
  res.status(200).redirect('/listings')
})

// For Review =========================================================================================

exports.saveReview = catchAsync(async(req, res) => {
  const {id} = req.params
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await listing.save();
  await review.save();

  
  req.flash('success', 'You have successfully added a review');

  res.redirect(`/listings/${listing.id}`)
})

exports.deleteReview = catchAsync(async(req, res) => {
  const {id,reviewId} = req.params
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('deleted', 'You have successfully delete a review');
  res.redirect(`/listings/${id}`);
})