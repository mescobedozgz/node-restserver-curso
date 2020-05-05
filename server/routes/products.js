const express = require('express');
const _ = require('underscore');

let {verifyToken, verifyAdminRole} = require('../middlewares/authentication');

let app = express();

let Product = require('../models/product');

// ================
// Mostrar todas las productos
// ================
app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    Product.find({available: true})
        .sort('name')
        .skip(from)
        .limit(limit)
        .populate('category')
        .populate('user', 'email')
        .exec((err, products) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            Product.count((err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                });
            });


        });

});

// ================
// Mostrar un producto por ID
// ================
app.get('/product/:id', verifyToken, (req, res) => {


    let id = req.params.id;


    Product.findById(id)
        .populate('category')
        .populate('user', 'email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                productDB
            });
        });
});

// ================
// Buscar producto
// ================
app.get('/product/buscar/:search', verifyToken, (req, res) => {

    let search = req.params.search;

    let regex  = new RegExp(search,'i');

    Product.find({name: regex})
        .populate('category')
        .populate('user', 'email')
        .exec( (err, products)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok:true,
                products
            });
        });
});

// ================
// Crear un nuevo producto
// ================
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        user: req.user._id,
        priceUni: body.priceUni,
        description: body.description,
        available: body.available,
        category: body.category,
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
                ok: true,
                productDB
            }
        );
    });

});

// ================
// Actualizar un producto por ID
// ================
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, [
        'name',
        'priceUni',
        'description',
        'available',
        'category',
    ]);

    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            productDB
        })
    });
});

// ================
// Eliminar el producto por ID
// ================
app.delete('/product/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    let body = {
        'available': false
    };

    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            productDB
        })
    });

});

module.exports = app;