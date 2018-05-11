const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { User } = require('./lib/model/user');
const { auhenticate } = require('./middleware/authenticate');
const validator = require('express-validator');

var app = express();

app.use(bodyParser.json());
app.use(validator());

// app.get('/api/v1/users', auhenticate , (req,res) =>{
//     res.send(req.user);
// });

// sign up 
app.post('/api/v1/users', (req, res) => {

    var body = _.pick(req.body, ['firstName', 'lastName', 'email','password']);
    console.log(req.body);
    var newUser = new User({body});
   // console.log(user);
    newUser.save().then((users)=>{
        res.send(users);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


app.get('api/v1/users', (req, res) => {
    console.log('hi');
});

app.listen('3000', () => {
    console.log('Listening on port 3000');
})
