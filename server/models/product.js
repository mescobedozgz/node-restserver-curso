const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Objecto de tipo enumeración, que contiene los valores permitidos de una propiedad
// let rolesEnables = {
//     values: ['ADMIN_ROLE', 'USER_ROLE'],
//     message: '{VALUE} no es un rol válido'
// };

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name is required'],
    },
    img: {
        type: String,
        required: false
    },
    priceUni: {type: Number, required: [true, 'The price is required']},
    description: {type: String, required: false},
    available: {type: Boolean, required: true, default: true},
    category: {type: Schema.Types.ObjectId, ref: 'category', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'user'}
});


//Sobrescribir el JSON que devuelve el modelo tras guardar en BBDD
// categorySchema.methods.toJSON = function (){
//     let category = this;
//     let categoryObject = category.toObject();
//     delete categoryObject.password;
//
//     return categoryObject;
// };

//Mensaje de validación en las propiedades únicas
productSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('product', productSchema);

