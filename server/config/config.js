// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000;
// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ======================
// Expiracion del Token
// ======================
// 60 segundos
process.env.TOKEN_EXPIRED_TIME = 60 * 60 * 24 * 30;
// ======================
// Seed de autenticacion
// ======================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'secret';
// ======================
// BBDD
// ======================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.BBDD_URL;
}

process.env.URLDB = urlDB;

