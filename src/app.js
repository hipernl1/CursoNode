const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose')
const mongodb = require('mongodb')

const bodyParser = require('body-parser')
const Curso = require('./models/curso')
const Aspirante = require('./models/aspirante')
const AspiranteCurso = require('./models/aspiranteCurso')
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
    console.log('Creando curso: ' +req.body.nombre);
    let modalidad = req.body.modalidad;
    if(req.body.modalidad == undefined){
        modalidad = '';
    }
    let estado = 'Disponible';

    let curso = new Curso({
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: modalidad,
        intensidad: req.body.intensidad,
        estado: estado
    });
    curso.save((err, result) => {
        if(err){
            res.render('error', {
                mensaje : err                
            });
            return console.log('Error: ' +err);
        }
        res.render('crear-curso', {
            titulo: 'Curso creado correctamente',
            id: result.id,
            nombre: result.nombre,
            descripcion: result.descripcion,
            valor: result.valor,
            modalidad: result.modalidad,
            intensidad: result.intensidad,
            estado: result.estado
        });
        return console.log('Curso Creado: ' +result);
    });

    
});

app.get('/cursos',(req, res) => {
    try{
        Curso.find({}).exec((err, respuesta)=>{
          if(err){
            return console.log("Error al consultar los cursos: "+err);
          }
          res.render('cursos',{
            titulo:'Cursos disponibles',
            rol: req.query.rol,
            listado : respuesta
            });
        });    
    }catch(error){
        console.log('No encontro cursos '+error);
        cursos = [];
    }

    
});

app.get('/inscribir',(req, res) => {
    res.render('inscribir',{
        titulo:'Inscribir al Curso',
        cursoId: parseInt(req.query.curso),
        curso: req.query.nombre
    });
});

app.post('/inscribirCurso',(req, res) => {
    console.log('Inscribir curso: ' +req.body.nombre);
    let aspirante = new Aspirante({
        documento: req.body.documento,
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono
    });
    aspirante.save((err, result) => {        
        let aspiranteCurso = new AspiranteCurso({
            cursoId : req.body.cursoId,
            documento : aspirante.documento
        });

        aspiranteCurso.save((err, resultado) => {
            if(err){
                res.render('error', {
                    mensaje : err                
                });
                return console.log('Error: ' +err);
            }
            res.render('inscribir', {
                titulo: '¡Estudiante inscrito correctamente!',
                cursoId : resultado.cursoId,
                curso : req.query.curso,
                documento: result.documento,
                nombre: result.nombre,
                email: result.email,
                telefono: result.telefono
            });
        });

        return console.log('ASpirante Creado: ' +result);
    });


});


app.get('/cursosEstudiantes',(req, res) => {
    consultarListadoEstudiantes(req, res, 'Cursos existentes');
});

function consultarListadoEstudiantes(req, res, titulo){
    try{
        Curso.find({}).exec((err, cursos)=>{
          if(err){
            return console.log("Error al consultar los cursos: "+err);
          }
          Aspirante.find({}).exec((error, aspirantes)=>{
            if(error){
              return console.log("Error al consultar los cursos: "+error);
            }
            AspiranteCurso.find({}).exec((errorr, asociaciones)=>{
                if(errorr){
                  return console.log("Error al consultar los cursos: "+errorr);
                }
                    res.render('cursos-estudiantes',{
                        titulo: titulo,
                        rol: req.query.rol,
                        cursos : cursos,
                        aspirantes : aspirantes,
                        asociaciones : asociaciones,
                        cursoId : req.body.cursoId
                    });
                });
            });
        });    
    }catch(error){
        console.log('No encontro cursos '+error);
        cursos = [];
    }
}  

app.post('/cerrarCurso', (req, res) => {
    Curso.findOneAndUpdate({id: parseInt(req.body.cursoId)}, { estado: 'Cerrado' },(err, curso)=>{
        if(err){
          return console.log("Error al actualizar el curso: "+err);
        }
    });
    consultarListadoEstudiantes(req, res, 'Curso cerrado correctamente');
});

app.post('/borrarEstudiante', (req, res) => {
    /*res.render('borrarEstudiante',{
        titulo:'Cursos y estudiantes inscritos',
        cursoId: parseInt(req.body.cursoId),
        documento: parseInt(req.body.documento)
    });*/
    AspiranteCurso.findOneAndDelete({ cursoId: req.body.cursoId, documento: req.body.documento}, req.body,         
        (err, result)=>{
            if(err){
                return console.log("Error al eliminar el aspirante: "+err);
              }
        });

    consultarListadoEstudiantes(req, res, 'Aspirante eliminado!');
});

app.get('*', (req, res) => {
    res.render('error', {
        titulo :'Pagina de error'
    })
});

const port = process.env.PORT || 3000;
//process.env.URLDB = 'mongodb://localhost:27017/asignaturas';
process.env.URLDB='mongodb+srv://prueba:prueba123@mongoremote-huptc.mongodb.net/asignaturas?retryWrites=true'
                   

mongoose.connect(process.env.URLDB, { useNewUrlParser:true }, (err, result) => {
	if(err){
		return console.log("No es posible conectar a la BD: "+err);
	}
	console.log("Conectado");
});



app.listen(port, () => {
    console.log('Escuchando por el puerto '+port);
});