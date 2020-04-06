const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Users = require('../models/user');
//Desestructuracion
const  {verifyToken, verifyAdminRole} = require('../middlewares/authentication');

app.get('/usuario', verifyToken,  (req, res) => {


    // return res.json({
    //     user: req.user,
    //     name: req.user.name,
    //     email: req.user.email
    // });

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    Users.find({state: false}, 'name email state role img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            Users.count({state:true}, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                });
            });


        });

});

app.post('/usuario', [verifyToken, verifyAdminRole], function (req, res) {
    let body = req.body;

    let user = new Users({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }


        return res.json({
                ok: true,
                userDB
            }
        );
    });


});

app.put('/usuario/:id',[verifyToken, verifyAdminRole], function (req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    Users.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            userDB
        })
    });
});

app.delete('/usuario/:id', [verifyToken, verifyAdminRole], function (req, res) {
    let id = req.params.id;
    // Users.findByIdAndRemove(id, (err, userDB) => {
    //     if (err) {
    //         return res.status(404).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //
    //     if(!userDB){
    //         return res.status(404).json({
    //             ok: false,
    //             err:{
    //                 message: 'Usuario no existe'
    //             }
    //         });
    //     }
    //
    //     res.json({
    //         ok:true,
    //         userDB
    //     });
    // });

    let body = {
        state: false
    };

    Users.findByIdAndUpdate(id, body, {new: true}, (err, userDB) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        res.json({
            ok: true,
            userDB
        })
    });

});

module.exports = app;