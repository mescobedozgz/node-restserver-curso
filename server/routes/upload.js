const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/user');
const Product = require('../models/product');
const app = express();

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo
    let typesValids = ['products','users'];

    if(typesValids.indexOf(type) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las tipos permitidos son: '+ typesValids.join(','),
                type
            }
        });
    }

    let file = req.files.file;

    //Extensiones permitidas
    let extensionsValids = ['png', 'jpg', 'gif', 'jpeg'];
    let nameFileAux = file.name.split('.');

    let extension = nameFileAux[nameFileAux.length-1];

    if(extensionsValids.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las extensionas permitidas son: '+ extensionsValidate.join(','),
                extension
            }
        });
    }

    //Cambiar nombre al archivo
    let nameFile =  `${id}-${new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${nameFile}`, (err) => {
        if (err)
            return res.status(500).json({
                ok:false,
                err
            });

        if(type == 'products'){
            imageProduct(id,res,nameFile);
        }else if(type == 'users'){
            imageUser(id,res,nameFile);
        }
    });


});

function imageProduct(id, res, nameFile){
    Product.findById(id, (err, productDB) =>{
        if(err) {
            deleteFile(nameFile,'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productDB){
            deleteFile(nameFile,'products');
            return res.status(400).json({
                ok: false,
                err:{
                    meesage: 'Producto no existe'
                }
            });
        }

        deleteFile(productDB.img,'products');

        productDB.img = nameFile;

        productDB.save((err, productDB) =>{
            res.json({
                ok:true,
                productDB,
                img: nameFile
            })
        });

    });
}

function imageUser(id, res, nameFile){
    User.findById(id, (err, userDB) =>{
       if(err) {
           deleteFile(nameFile,'users');
           return res.status(500).json({
              ok: false,
              err
           });
       }

       if(!userDB){
           deleteFile(nameFile,'users');
           return res.status(400).json({
               ok: false,
               err:{
                   meesage: 'Usuario no existe'
               }
           });
       }

       deleteFile(userDB.img,'users');

       userDB.img = nameFile;

       userDB.save((err, userDB) =>{
           res.json({
               ok:true,
               userDB,
               img: nameFile
           })
       });

    });
}

function deleteFile(nameFile,type){
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);

    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;
