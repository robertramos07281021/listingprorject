const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ListingSchema = new Schema({
  name: String,
  image: String,
  price: {
    type: Number,
    min: 0
  },
  description: String,
  location: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

ListingSchema.post('findOneAndDelete', async(data)=> {
  if(data){
    await Review.deleteMany({_id: {$in: data.reviews}})
  }
})


module.exports = mongoose.model('Listing', ListingSchema);