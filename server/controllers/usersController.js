const mongoose = require('mongoose');
const User = require('../../models/user')
const catchAsync  = require('../../utils/catchAsync')



// mongoose.connect('mongodb://127.0.0.1:27017/newlisting')
//   .then(()=> {
//     console.log('Connection open')
//   })
//   .catch(err => {
//     console.log(`Error:${err}`)
//   }) 

exports.registrationForm = (req, res) => {
 res.render('users/registrationForm');
}

exports.saveUsers = catchAsync(async (req, res) => {
  try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, (err)=> {
      if(err){
        return next(err);
      } 
      req.flash('success', 'Welcome to Listing App!!')
      res.redirect('listings')
    });
  } catch(e){
    req.flash('error', e.message);
    res.redirect('/register')
  }
})

exports.loginForm = (req, res) => {
  res.render('users/loginForm')
}

exports.loginUser = catchAsync(async(req, res) => {
  req.flash('success', 'Welcome back!')
  const redirectUrl = res.locals.returnTo || '/listings';
  res.redirect(redirectUrl)
})

exports.logout = (req, res, next) => {
  req.logout((err)=> {
    if(err){ 
      return next(err);
    }
    req.flash('success', 'You are now logout.');
    res.redirect('/listings');
  })
  
  
}