const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos autenticar
const Usuarios = require('../models/Usuarios');

passport.use(
    new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
           try {
            const usuario = await Usuarios.findOne({
                where: {
                    email
                }
            })
            //el usuario existe, password incorrecto
            if(!usuario.verificarPassword(password)){
                return done(null, false, {
                    message: 'Password Incorrecto'
                })
            }
            //el email existe, y el password correcto
            return done(null, usuario);

           }catch(error) {
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                });
           }
        }
    )
)

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});


module.exports = passport;