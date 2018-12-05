const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');

const app = express();
const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    operatorsAliases: false,
    define: {
        freezeTableName: true
    }
});

const User = connection.define('User', {
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        }
    }
});

app.post('/post',(req, res) => {
    const newUser = req.body.user;
    User.create({
        name: newUser.name,
        email: newuser.email,
    })
    .then((user) => {
        res.json(user);
    })
    .catch(error => {
        console.log('Error caught', error);
        res.status(404).send(error);
    });
});

connection
    .sync({
        // logging: console.log,
        // force: true
    })
    .then(() => {
        User.bulkCreate(_USERS)
            .then(users => {
                console.log('Successfully added users.')
            })
            .catch(err => {
                console.log(err);
            });
    })
    .then(() => {
        console.log('Connection to database established successfully.');
    }).catch(err => {
        console.log('Unable to connect to the database', err);
});

app.listen(port, () => {
    console.log('Running web server on port ' + port);
})