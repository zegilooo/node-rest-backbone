/**
 * api_v1.js
 *
 * Routes for REST api (version 1).
 */

var api_version = 1;
var api_root = '/api/v' + api_version;

module.exports = function(app, db_conn, passport) {
    var ProductModel = db_conn.model('Product');

    app.get(api_root, function (req, res) {
        res.send('Ecomm API version ' + api_version + ' is running');
    });
    
    // POST to CREATE
    app.post(api_root + '/products', function (req, res) {
        var product;

        console.log("POST: ");
        console.log(req.body);
        product = new ProductModel({
            title: req.body.title,
            description: req.body.description,
            style: req.body.style,
            images: req.body.images,
            categories: req.body.categories,
            catalogs: req.body.catalogs,
            variants: req.body.variants
        });
        product.save(function (err) {
            if (!err) {
                return console.log("created");
            } else {
                return console.log(err);
            }
        });
        return res.send(product);
    });
    
    // PUT to UPDATE
    
    // Bulk update
    app.put(api_root + '/products', function (req, res) {
        var i, len = 0;
        console.log("is Array req.body.products");
        console.log(Array.isArray(req.body.products));
        console.log("PUT: (products)");
        console.log(req.body.products);
        if (Array.isArray(req.body.products)) {
            len = req.body.products.length;
        }
        for (i = 0; i < len; i++) {
            console.log("UPDATE product by id:");
            for (var id in req.body.products[i]) {
                console.log(id);
            }
            ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
                if (err) {
                    console.log("Error on update");
                    console.log(err);
                } else {
                    console.log("updated num: " + numAffected);
                }
            });
        }
        return res.send(req.body.products);
    });
    
    // Single update
    app.put(api_root + '/products/:id', function (req, res) {
      return ProductModel.findById(req.params.id, function (err, product) {
        product.title = req.body.title;
        product.description = req.body.description;
        product.style = req.body.style;
        product.images = req.body.images;
        product.categories = req.body.categories;
        product.catalogs = req.body.catalogs;
        product.variants = req.body.variants;
        return product.save(function (err) {
          if (!err) {
            console.log("updated");
          } else {
            console.log(err);
          }
          return res.send(product);
        });
      });
    });
    
    // GET to READ
    
    // List products
    app.get(api_root + '/products', function (req, res) {
      return ProductModel.find(function (err, products) {
        if (!err) {
          return res.send(products);
        } else {
          return console.log(err);
        }
      });
    });
    
    // Single product
    app.get(api_root + '/products/:id', function (req, res) {
      return ProductModel.findById(req.params.id, function (err, product) {
        if (!err) {
          return res.send(product);
        } else {
          return console.log(err);
        }
      });
    });
    
    // DELETE to DESTROY
    
    // Bulk destroy all products
    app['delete'](api_root + '/products', function (req, res) {
      ProductModel.remove(function (err) {
        if (!err) {
          console.log("removed");
          return res.send('');
        } else {
          console.log(err);
        }
      });
    });
    
    // remove a single product
    app['delete'](api_root + '/products/:id', function (req, res) {
      return ProductModel.findById(req.params.id, function (err, product) {
        return product.remove(function (err) {
          if (!err) {
            console.log("removed");
            return res.send('');
          } else {
            console.log(err);
          }
        });
      });
    });
};
