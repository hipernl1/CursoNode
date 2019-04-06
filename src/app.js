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
    res.render('crear-curso', {
        titulo: 'Creación de curso'
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

app.get('/crear-curso',(req, res) => {
    console.log(req.query);
    res.render('crear-curso', {
        titulo: 'Creación de curso'
    });
});

app.post('/crearCurso',(req, res) => {
    console.log(req.body);
    let modalidad = req.body.modalidad;
    if(req.body.modalidad == undefined){
        modalidad = '';
    }
    let estado = 'Disponible';

    res.render('crearCurso', {
        titulo: 'Curso creado correctamente',
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: modalidad,
        intensidad: req.body.intensidad,
        estado: estado
    });
});

app.get('/cursos',(req, res) => {
    res.render('cursos',{
        titulo:'Cursos disponibles',
        rol: req.query.rol
    });
});

app.get('/inscribir',(req, res) => {
    res.render('inscribir',{
        titulo:'Inscribir al Curso',
        curso: parseInt(req.query.curso),
        nombre: req.query.nombre
    });
});

app.post('/inscribirCurso',(req, res) => {
    console.log(req.body.cursoId+ " "+req.body.documento+" "+parseInt(req.body.documento) + " "+ req.body.nombre +" " +
        req.body.correo +" "+req.body.telefono)
    res.render('inscribirCurso',{
        titulo:'Inscribir al Curso',
        id: req.body.cursoId,
        documento: parseInt(req.body.documento),
        nombre: req.body.nombre,
        email: req.body.correo,
        telefono: req.body.telefono
    });
});


app.get('/cursosEstudiantes',(req, res) => {
    res.render('cursos-estudiantes',{
        titulo:'Cursos y estudiantes inscritos'
    });
});

app.post('/cerrarCurso', (req, res) => {
    res.render('cerrarCurso',{
        titulo:'Cursos y estudiantes inscritos',
        id: parseInt(req.body.cursoId),
    });
});

app.post('/borrarEstudiante', (req, res) => {
    res.render('borrarEstudiante',{
        titulo:'Cursos y estudiantes inscritos',
        cursoId: parseInt(req.body.cursoId),
        documento: parseInt(req.body.documento)
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        titulo :'Pagina de error'
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Escuchando por el puerto '+port);
});