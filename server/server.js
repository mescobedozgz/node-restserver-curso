require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta publi
app.use(express.static(path.resolve(__dirname , '../public')));
//Configutacion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err ,resp)=>{
        if(err)  throw err;
        console.log('Base de datos ONLINE');
    }
);

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000')
});
