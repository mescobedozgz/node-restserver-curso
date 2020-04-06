const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');


app.post('/login', (req, res) => {

    let body = req.body;

    Users.findOne({email: body.email}, (err, userDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!userDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password,userDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
           user: userDB
        }, process.env.TOKEN_SEED
        ,{expiresIn: process.env.TOKEN_EXPIRED_TIME});

        return res.json({
            ok:true,
            userDB,
            token
        });
    });

});

module.exports = app;