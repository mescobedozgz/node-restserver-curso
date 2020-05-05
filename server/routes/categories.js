const express = require('express');
const _ = require('underscore');

let {verifyToken, verifyAdminRole} = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// ================
// Mostrar todas las categorias
// ================
app.get('/category', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    Category.find({})
        .sort('name')
        .populate('user', 'email')
        .exec((err, categories) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            Category.count((err, count) => {
                res.json({
                    ok: true,
                    categories,
                    count
                });
            });


        });

});

// ================
// Mostrar una categoria por ID
// ================
app.get('/category/:id', verifyToken, (req, res) => {


    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoryDB
        });
    });
});

// ================
// Crear una nueva categoría
// ================
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

            return res.json({
                ok: true,
                categoryDB
            }
        );
    });

});

// ================
// Actualizar una categoría por ID
// ================
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['name'
    ]);

    Category.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoryDB
        })
    });
});

// ================
// Eliminar la categoría por ID
// ================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría eliminada'
        })
    });
});

module.exports = app;