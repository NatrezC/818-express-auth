const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    console.log('sign up form user input:', req.body)
    // if it does, throw an error message
    // otherwise create a new user and store them in the db
    db.user.findOrCreate({ // check if that email is already in db
        where: {email: req.body.email},
        defaults: {name: req.body.name, password: req.body.password}
    }) // create new user if email wasn't found
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log(`just created the following user:`, createdUser)
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created and logged in!' //-->FLASH
            })(req, res) //IIFE = immidate invoked function
        } else {
            req.flash('error', 'email already exists, try logggin in')
            res.redirect('/auth/login') // redirect to login page
            console.log(' An account associated with that email address already exists! Try loggin in.')
        }
        // redirect to login page
        //res.redirect('/auth/login')
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/auth/signup')
        console.log('Did not post to db!!! See error>>>>>>>>', err)
    })
})

router.get('/login', (req, res)=>{
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    failureFlash: 'Invalid email or password!', //---->FLASH
    successFlash: 'You are now logged in!' //--->FLASH
}))

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('Successfully logged out!') //-->FLASH
    res.redirect('/')
})

module.exports = router