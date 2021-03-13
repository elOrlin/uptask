const express = require('express');
const router = express.Router();

//importar express validator
const { body } = require('express-validator/check');

const controller = require('../controller/proyectosController');
const tareasController = require('../controller/tareasController');
const usuariosController = require('../controller/usuariosController')
const authController = require('../controller/authController');

module.exports = function(){
    router.get('/',
    authController.usuarioAutenticado,
    controller.proyectosHome);

    router.get('/nuevo-proyecto',
    authController.usuarioAutenticado,
    controller.formularioProyecto);

    router.post('/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    controller.nuevoProyecto);

    //listar proyectos
    router.get('/proyectos/:url',
    authController.usuarioAutenticado,
    controller.proyectosPorUrl);

    //actualizar el proyecto
    router.get('/proyecto/editar/:id',
    authController.usuarioAutenticado,
    controller.formularioEditar);

    router.post('/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    controller.actualizarProyecto);

    //eliminar proyecto
    router.delete('/proyectos/:url', 
    controller.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea)

    //actualizar
    router.patch('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea)

    //eliminar tarea
    router.delete('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea)

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    router.get('/reestablecer', usuariosController.formRestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)
    
    return router;
}