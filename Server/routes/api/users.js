const express = require('express'),
    router = express.Router(),
    User = require('../../models/User'),
    gravatar = require('gravatar'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    keys = require('../../config/keys'),
    passport = require('passport');

router.get('/test', (req, res) => res.json({
    msg: 'Users works!'
}));

router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.error(err))
                })
            })
        }
    })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by Email
    User.findOne({
        email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                email: 'User not found'
            })
        }

        // Check Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {

                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    }

                    jwt.sign(payload, keys.secretOrKey, {
                        expiresIn: 3600
                    }, (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    });
                } else {
                    return res.status(400).json({
                        password: 'Password incorrect'
                    })
                }
            })
    });
})

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    })
})

module.exports = router;