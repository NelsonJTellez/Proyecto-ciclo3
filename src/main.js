const express = require('express');
const path = require('path');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database');
require('./passport')(passport);

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Se configura  para enviar delete, put, a travez de los forms
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, ContentType, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
//Se configura la sesión
app.use(
  expressSession({
    secret: 'MySecret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Settings
//Se configura el puerto
app.set('port', 8080);
//Se configura el directorio de las vistas
app.set('views', path.join(__dirname, 'views'));
// Se configra View engine
app.engine(
  '.hbs',
  expressHbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
  })
);

app.set('view engine', '.hbs');

//Routes
//Se configura las rutas para la navegación
app.use(require('./routes/index.js'));
app.use(require('./routes/books.js'));
app.use(require('./routes/users.js'));

//Static files
//Se establece la configuración donde van a estar los archivos estaticos
app.use(express.static(path.join(__dirname, 'resources')));

//Server listenning
//app.listen(app.get('port'), ()=> {console.log(app.get('port'));});

app.set('PORT', process.env.PORT || 3000);
app.listen(app.get('PORT'), () => {
  console.log(`Server started on port: ${app.get('PORT')}`);
});
