const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = async (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = async (req, res) => {
    const {error} = res.locals.mensajes;

    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Uptask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //leer los datos 
    const {email, password} = req.body;

   try {
    //crear el usuario
    await Usuarios.create({
        email,
        password
    })

    //crear una url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    //crear el objecto de usuario
    const usuario = {
        email
    }
    //enviar email
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirmar tu cuenta Uptask',
        confirmarUrl,
        archivo: 'confirmar-cuenta'
    }) 

    //redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');

   }catch(error) {
       req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
   }

}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}