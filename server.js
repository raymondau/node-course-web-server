const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// Heroku will set the port number. But in our machine it may not exist.
// So we will get the env variable or set to 3000 if not exist.
const port = process.env.PORT || 3000;


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append file');
        }
    });
    next(); 
});

// We can execute the below if the site is ever in maintenance mode,
// else we can comment it out.
//app.use((req, res, next) => {
//    res.render('maintenance.hbs');
//});

// The location where app.use is placed is important because it is
// executed in sequence. Hence the express.static page is placed
// AFTER the maintenance app.use statement above.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Welcome to my home page!'
    })
});

// This is using fixed send function
//app.get('/about', (req, res) => {
//    res.send('The about page');
//});

// This is using template from hbs
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Project page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Bad request',
        code: 404
    });
});

// Heroku will automatically set the port number in the environment variable
// so we use it here instead of hardcoding it.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});