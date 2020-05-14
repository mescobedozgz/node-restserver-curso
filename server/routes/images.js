const express = require('express');

const fs = require('fs');
const path = require('path');

let {verifyTokenImage} = require('../middlewares/authentication');

let app = express();


app.get('/image/:type/:img',verifyTokenImage,(req,res) =>{
    let type = req.params.type;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    let pathNoImage = path.resolve(__dirname, `../assets/original.jpg`);

    if(fs.existsSync(pathImage)){
        return res.sendFile(pathImage)
    }else{
        return res.sendFile(pathNoImage)
    }

    //Validar tipo
    let typesValids = ['products','users'];

    if(typesValids.indexOf(type) < 0){
        return res.sendFile(pathNoImage)
    }

});



module.exports = app;