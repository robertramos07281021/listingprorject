const mongoose = require('mongoose');
const Listing = require('../models/listing')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

// mongoose.connect('mongodb://127.0.0.1:27017/newlisting')
//   .then(()=> {
//     console.log('Connection open')
//   })
//   .catch(err => {
//     console.log(`Error:${err}`)
//   })

  const randomNameNum = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async() => {
  await Listing.deleteMany({})
  for(let i = 0 ; i < 50; i++){
    const randomCityNum = Math.floor(Math.random() * 1006 + 1);
    const price = Math.floor(Math.random() * 10000);

    const listing = new Listing ({
      author: '65b70a278726c1ddcf2365d0',
      location: `${cities[randomCityNum].city}, ${cities[randomCityNum].admin_name}`,
      image:`https://source.unsplash.com/collection/483251`,
      name: `${randomNameNum(descriptors)} ${randomNameNum(places)}`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nostrum necessitatibus nobis cum officiis mollitia recusandae voluptatibus non temporibus quaerat!`,
      price: price

    })
    await listing.save();
  }
}

seedDB().then( () => {
  mongoose.connection.close();
})