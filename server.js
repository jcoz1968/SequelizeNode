const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _USERS = require('./users.json');

const app = express();
const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    operatorsAliases: false
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

const Post = connection.define('Post', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT
});

const Comment = connection.define('Comment', {
    the_comment: Sequelize.STRING
});

const Project = connection.define('Project', {
    title: Sequelize.STRING
});

app.get('/allposts', (req, res) => {
    Post.findAll({
        include: [{
            model: User, as: 'UserRef'
        }]
    }).then(posts => {
        res.json(posts);
    })
    .catch(error => {
        console.log('Error caught', error);
        res.status(404).send(error);
    });
});

app.get('/getUserProjects', (req, res) => {
    User.findAll({
        attributes: ['name'],
        include: [{
            model: Project, as: 'Tasks',
            attributes: ['title']
        }]
    }).then(posts => {
        res.json(posts);
    })
    .catch(error => {
        console.log('Error caught', error);
        res.status(404).send(error);
    });
});

app.put('/addworker', (req, res) => {
    Project.findById(2).then((project) => {
        project.addWorkers(5);
    })
    .then(() => {
        res.send('User added to project');
    })
    .catch(error => {
        console.log('Error caught', error);
        res.status(404).send(error);
    });
});

app.get('/singlepost', (req, res) => {
    Post.findById('1', {
        include: [{
            model: Comment, as: 'All_Comments',
            attributes: ['the_comment']
        }, {
            model: User, as: 'UserRef'
        }]
    }).then(posts => {
        res.json(posts);
    })
    .catch(error => {
        console.log('Error caught', error);
        res.status(404).send(error);
    });
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

Post.belongsTo(User, { 
    as: 'UserRef',
    foreignKey: 'userId' // puts foreign key in UserId in Post Table
}); 

Post.hasMany(Comment, { 
    as: 'All_Comments' // foreignKey = PostId in Comment table
});

// Cretes a UserProjects table with Ids for ProjectId and UserId
User.belongsToMany(Project, { as: 'Tasks', through: 'UserProjects' });
Project.belongsToMany(User, { as: 'Workers', through: 'UserProjects' });

connection
    .sync({
        // logging: console.log,
        // force: true
    })
    // .then(() =>{
    //     Project.create({
    //         title: 'project 1'
    //     }).then((project) => {
    //       project.setWorkers([4,5]);
    //     })
    // })
    // .then(() =>{
    //     Project.create({
    //         title: 'project 2'
    //     })
    // })    
    // .then(() => {
    //     User.bulkCreate(_USERS)
    //         .then(users => {
    //             console.log('Successfully added users.')
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // })
    // .then(() => {
    //     Post.create({
    //         userId: 1,
    //         title: 'First post',
    //         content: 'post content 1'
    //     })
    // })
    // .then(() => {
    //     Post.create({
    //         userId: 2,
    //         title: 'Second post',
    //         content: 'post content 2'
    //     })
    // })
    // .then(() => {
    //     Post.create({
    //         userId: 3,
    //         title: 'Third post',
    //         content: 'post content 3'
    //     })
    // })
    // .then(() => {
    //     Comment.create({
    //         PostId: 1,
    //         the_comment: 'first comment'
    //     })
    // })
    // .then(() => {
    //     Comment.create({
    //         PostId: 1,
    //         the_comment: 'second comment'
    //     })
    // })                
    .then(() => {
        console.log('Connection to database established successfully.');
    }).catch(err => {
        console.log('Unable to connect to the database', err);
});

app.listen(port, () => {
    console.log('Running web server on port ' + port);
})