const mongoose = require('mongoose');
const Listing = require('../models/listing')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
const User = require('../models/user')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Success fully added");
    })
    .catch(err => {
        console.log("Error: ", err)
    })
    
  const randomNameNum = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async() => {
  await Listing.deleteMany({})
  for(let i = 0 ; i < 50; i++){
    const randomCityNum = Math.floor(Math.random() * 1006 + 1);
    const price = Math.floor(Math.random() * 10000);
   
    const user = await User.findById(`65f0631b109a4ec284c6a7cd`)
   
    const listing = new Listing ({
      author: user,
      location: `${cities[randomCityNum].city}, ${cities[randomCityNum].admin_name}`,
      image:`https://source.unsplash.com/collection/483251`,
      name: `${randomNameNum(descriptors)} ${randomNameNum(places)}`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nostrum necessitatibus nobis cum officiis mollitia recusandae voluptatibus non temporibus quaerat!`,
      price: price

    })
    await listing.save();
    console.log(listing)
  }
 
}


seedDB().then( () => {
  mongoose.connection.close();
})