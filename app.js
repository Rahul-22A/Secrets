//jshint esversion:6
require('dotenv').config();
// We need to put this at the top
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

// Use public folder as static to view
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});
// Make sure you add this before defining the new mongoose model

const User = new mongoose.model("User", userSchema);

app.get('/', function(req, res){
    res.render('home');
});
app.get('/login', function(req, res){
    res.render('login');
});
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });

});

app.post('/login', function(req,res){
    const username = req.body.username;
    const password = req.body.password

    User.findOne({email:username}, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser){
                if (foundUser.password === password) {
                    res.render('secrets');
                } else {
                    console.log("Incorrect password")
                }
            }
        }
    })
});



app.listen(3000, function(){
    console.log("Server started on port:3000")
})