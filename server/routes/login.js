const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Users = require('../models/user');


app.post('/login', (req, res) => {

    let body = req.body;

    Users.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
                user: userDB
            }, process.env.TOKEN_SEED
            , {expiresIn: process.env.TOKEN_EXPIRED_TIME});

        return res.json({
            ok: true,
            userDB,
            token
        });
    });

});

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    try {
        let googleUser = await verify(token);

        Users.findOne({email: googleUser.email}, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (userDB) {
                if (!userDB.google) {
                     return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe de usar su autenticacón normal'
                        }
                    });
                } else {
                    let token = jwt.sign({
                            user: userDB
                        }, process.env.TOKEN_SEED
                        , {expiresIn: process.env.TOKEN_EXPIRED_TIME});


                     return res.json({
                        ok: true,
                        user: userDB,
                        token,
                    })
                }
            } else {
                //Si el usuario no existe en nuestra BBDD
                let user = new Users();
                user.name = googleUser.name;
                user.email = googleUser.email;
                user.google = true;
                user.img = googleUser.image;
                user.password = ':)';

                user.save((err, userDB) => {
                    if (err) {
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                    return res.json({
                            ok: true,
                            userDB,
                            token
                        }
                    );
                });
            }
        });
    } catch (e) {
        return  res.status(403).json({
            ok: false,
            err: e
        });
    }


});

module.exports = app;
