const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar las variables
require('dotenv').config({path: 'variables.env'})

//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la base de datos
const db = require('./config/db');

require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//crear una app de express
const app = express();

//agregar los archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//agregamos express validator a toda la aplicacion
app.use(expressValidator());

//agregar la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser() );

//sessiones nos permite navegar entre distintas paginas sin volvernos autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//agregar flash messages
app.use(flash() );

app.use(passport.initialize() );
app.use(passport.session());

//pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    console.log(res.locals.usuario)
    next();
});

//crear las rutas del proyecto
app.use('/', routes() );

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('el servidor esta funcionando')
})