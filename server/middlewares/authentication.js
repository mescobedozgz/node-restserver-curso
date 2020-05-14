const jwt = require('jsonwebtoken');

// ================
// Verificar Token Image
// ================

let verifyTokenImage = (req, res, next) =>{

    let token = req.query.token;

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) =>{

        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};


// ================
// Verificar Token
// ================

let verifyToken = (req, res, next) =>{

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) =>{

        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};

// ================
// Verificar Admin Rol
// ================

let verifyAdminRole = (req, res, next) =>{

    let user = req.user;
    if(user.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err:{
                message: 'Rol no válido'
            }
        });
    }

    next();

};

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenImage
}