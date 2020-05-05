const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Objecto de tipo enumeración, que contiene los valores permitidos de una propiedad
// let rolesEnables = {
//     values: ['ADMIN_ROLE', 'USER_ROLE'],
//     message: '{VALUE} no es un rol válido'
// };

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name is required'],
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
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
categorySchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('category', categorySchema);

