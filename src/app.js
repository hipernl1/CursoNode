const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
require('./helpers');

const directorioModulos = path.join(__dirname, '../node_modules');
const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');
app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}))

app.use('/css', express.static(directorioModulos + '/bootstrap/dist/css'));
app.use('/js', express.static(directorioModulos + '/jquery/dist'));
app.use('/js', express.static(directorioModulos + '/popper.js/dist'));
app.use('/js', express.static(directorioModulos + '/bootstrap/dist/js'));


app.get('/',(req, res) => {
    res.render('index', {
        titulo:'Inicio'
    });
});

app.get('/listado',(req, res) => {
    console.log(req.query);
    res.render('listado', {
        titulo: 'Listado de estudiantes'
    });
});

app.post('/calculos',(req, res) => {
    console.log(req.query);
    res.render('calculos', {
        titulo: "Calculo de promedio de: "+ req.body.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        titulo :'Pagina de error'
    })
})

app.listen(3000, () => {
    console.log('Escuchando ppor el puerto 30000');
});