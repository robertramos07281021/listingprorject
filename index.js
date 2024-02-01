
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const path = require('path');
const mongoose = require('mongoose')
const listingRouter = require('./server/routers/listingRouter')
const usersRouter = require('./server/routers/usersRouter')
const app = express();
const connectDB = require('./config/dbConn')
const MemoryStore = require('memorystore')(session);
require('dotenv').config()
const PORT = process.env.PORT

mongoose.set('strictQuery', false);
connectDB();
// mongoose.connect('mongodb://127.0.0.1:27017/newlisting', {useNewUrlParser: true, useUnifiedTopology: "true"})


app.set('trust proxy', 1);
app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, '/client/views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))


app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

const sessionConfig = {
  cookie: {
    maxAge: 86400000
  },
  secret: 'thisismysecret',
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  saveUninitialized: true,
  resave: false
}

app.use(session(sessionConfig));

app.use(flash());


app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/create-user', async(req,res) => {
//   const user = new User({email: 'test@gmail.com', username: 'TestUsername'})
//   const newUser = await User.register(user, 'TestPassword');
//   res.send(newUser);
// })




app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.deleted = req.flash('deleted');
  res.locals.currentUser = req.user;
  next()
})


app.use('', listingRouter);
app.use('', usersRouter);




app.use('*', (req, res, next) => {
  next(new ExpressError('Page not Found', 404));
})



app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error',{err});
})


// app.listen(8000, ()=> {
//   console.log("the server is up and running in port 8000")
// })


// mongoose.connect(process.env.MONGO_URI)
//     .then(()=> {
//         app.listen(process.env.PORT, () => {
//             console.log('connected to DB and listening on port', process.env.PORT);
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})