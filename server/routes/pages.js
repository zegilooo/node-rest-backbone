/**
 * pages.js
 *
 * Routes to site pages.
 */

module.exports = function(app){
    /**
     * GET home page.
     */
    app.get('/', function (req, res) {
        res.render('index.ejs', { title: 'The Hackerati' });
    });

    /**
     * GET about page.
     */
    app.get('/about', function (req, res) {
        res.render('about.ejs', { title: 'About' });
    });

    /**
     * GET contact page.
     */
    app.get('/contact', function (req, res) {
        res.render('contact.ejs', { title: 'Contact' });
    });

    /**
     * GET Backbone app container page.
     */
    app.get('/app', function (req, res) {
        res.render('app.ejs', { title: 'Application' });
    });
}
