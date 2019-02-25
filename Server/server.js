const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => res.send('hello!'));

// Passport Middleware
app.use(passport.initialize());

//Pasport Config
require('./config/passport')(passport)

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));