const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const bcrypt = require('bcrypt')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)


const bodyParser = require('body-parser')
const Curso = require('./models/curso')
const Aspirante = require('./models/aspirante')
const AspiranteCurso = require('./models/aspiranteCurso')
require('./helpers');

const directorioModulos = path.join(__dirname, '../node_modules');
const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');

app.use(session({
    cookie: { maxAge: 86400000},
    store : new MemoryStore({
        checkPeriod: 86400000
    }),
    secret:'node-Basico',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if(req.session.usuario){
        res.locals.session = true
        res.locals.nombre = req.session.nombre
        res.locals.rol = req.session.rol
    }
    next()
});

app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}))

app.use('/css', express.static(directorioModulos + '/bootstrap/dist/css'));
app.use('/js', express.static(directorioModulos + '/jquery/dist'));
app.use('/js', express.static(directorioModulos + '/popper.js/dist'));
app.use('/js', express.static(directorioModulos + '/bootstrap/dist/js'));


app.get('/',(req, res) => {
    res.render('registro', {
        titulo: 'Registro de usuario'
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
        nombreCurso: req.body.nombreCurso,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: modalidad,
        intensidad: req.body.intensidad,
        estado: estado
    });

    Curso.findOne({ id : curso.id } , (err, resultado) => {
        if(err){
            console.log('Error: ' +err);
            return res.render('error', {
                mensaje : err                
            });            
        }

        if(resultado){
            console.log('curso existente: ' +resultado.id);
            return res.render('error', {
                mensaje : 'El curso con id '+resultado.id+' ya se encuentra creado'                
            });            
        }

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
                nombreCurso: result.nombreCurso,
                descripcion: result.descripcion,
                valor: result.valor,
                modalidad: result.modalidad,
                intensidad: result.intensidad,
                estado: result.estado
            });
            return console.log('Curso Creado: ' +result);
        });
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
    Aspirante.findById(req.session.usuario, (error, aspirante) => {
        if(error){
            return res.render('error', {
                mensaje : 'Usuario no encontrado'
            }); 
        }
        if(aspirante){
            res.render('inscribir', {
                titulo:'Inscribir al Curso',
                cursoId: parseInt(req.query.curso),
                curso: req.query.nombre,
                documento: aspirante.documento,              
                nombre: aspirante.nombre,
                email: aspirante.email,
                telefono: aspirante.telefono,
                rol: aspirante.rol
            })
        }
    });    

});

app.post('/inscribirCurso',(req, res) => {
    console.log('Inscribir curso: ' +req.body.nombre);
    Aspirante.findById(req.session.usuario, (error, aspirante) => {
        let aspiranteCurso = new AspiranteCurso({
            cursoId : req.body.cursoId,
            documento : aspirante.documento
        });
        console.log('Inscribir: '+ aspiranteCurso);
        // Validacion registro curso
        AspiranteCurso.findOne({ cursoId : aspiranteCurso.cursoId, documento : aspiranteCurso.documento }, (error, result) =>{
            if(error){
                console.log('Error: ' +error);
                return res.render('error', {
                    mensaje : error                
                });                
            }
            if(result){
                console.log('El aspirante ya se encuentra registrado: ' +result);
                return res.render('error', {
                    mensaje : 'El aspirante ya se encuentra registrado al curso '
                });                
            }
            aspiranteCurso.save((err, resultado) => {
                if(err){
                    res.render('error', {
                        mensaje : err                
                    });
                    return console.log('Error: ' +err);
                }
                return res.render('inscribir', {
                    titulo: '¡Estudiante inscrito correctamente!',
                    cursoId : resultado.cursoId,
                    curso : aspirante.curso,
                    documento: aspirante.documento,
                    nombre: aspirante.nombre,
                    email: aspirante.email,
                    telefono: aspirante.telefono
                });
            });
        });
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
                        cursoId : req.body.cursoId,
                        nombre : req.session.nombre,
                        rol : req.session.rol
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
    AspiranteCurso.findOneAndDelete({ cursoId: req.body.cursoId, documento: req.body.documento}, req.body,         
        (err, result)=>{
            if(err){
                return console.log("Error al eliminar el aspirante: "+err);
              }
        });

    consultarListadoEstudiantes(req, res, 'Aspirante eliminado!');
});

app.get('/registro', (req, res) => {
    res.render('registro', {
        titulo :'Página de registro'
    })
})


app.post('/registro', (req, res) => {    
    let aspirante = new Aspirante({
        documento: req.body.documento,              
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena : bcrypt.hashSync(req.body.contrasena, 10),
        rol: req.body.rol
    })
    Aspirante.findOne({ documento : aspirante.documento }).exec((err, respuesta)=>{
        if(err){
            res.render('error', {
                titulo :'Pagina de error',
                mensaje: 'Error al registrar al usuario '+err
            });
          return console.log("Error al consultando aspirante: "+err);
        }   
        if(respuesta){
          console.log("El aspirante ya esta registrado: "+respuesta);
          return res.render('error', {
                mensaje : 'El usuario con documento '+ respuesta.documento +' ya esta registrado.'
            });          
        } 
        aspirante.save((err, resultado)=>{
            if(err){
                res.render('error', {
                    titulo :'Pagina de error',
                    mensaje: 'Error al registrar al usuario '+err
                })
              return console.log("Error al crear al aspirante: "+err);
            }
            res.render('registro',{
                titulo : '!El usuario fue registrado correctamente!',
                documento: resultado.documento,              
                nombre: resultado.nombre,
                email: resultado.email,
                telefono: resultado.telefono,
                rol: resultado.role
            })   
          });   
      }); 
});

app.post('/login', (req, res) => {    
    Aspirante.findOne({ nombre : req.body.usuario }).exec((err, respuesta)=>{
        if(err){
            res.render('error', {
                titulo :'Pagina de error',
                mensaje: 'Error al registrar al usuario '+err,
                session : false
            });
          return console.log("Error al consultando aspirante: "+err);
        }   
        if(!respuesta){
          console.log("Usuario no encontrado");
          return res.render('error', {
                mensaje : 'El usuario no fue encontrado',
                session : false
            });          
        } 

        if(!bcrypt.compareSync(req.body.contrasena, respuesta.contrasena)){
            console.log("La contraseña no es valida");
            return res.render('error', {
                  mensaje : 'La contraseña no es valida',
                  session : false
              }); 
        }
        req.session.usuario = respuesta._id
        req.session.nombre = respuesta.nombre
        req.session.rol = respuesta.rol        
        res.render('login',{
            mensaje : '!Bienvenido !'+respuesta.nombre,
            session : true,
            nombre : req.session.nombre,
            rol : req.session.rol
        })
        console.log(req.session.nombre +" - "+ req.session.usuario + " - " +req.session.rol)
      }); 
});

app.get('/actualizar',(req , res) => {    
    Aspirante.findById(req.session.usuario, (error, aspirante) => {
        if(error){
            return res.render('error', {
                mensaje : 'Usuario no encontrado'
            }); 
        }
        if(aspirante){
            res.render('actualizar', {
                titulo :'Actualizar Aspirante',
                documento: aspirante.documento,              
                nombre: aspirante.nombre,
                email: aspirante.email,
                telefono: aspirante.telefono,
                rol: aspirante.rol
            })
        }
    });    
});

app.post('/actualizar',(req , res) => {
    console.log("Actualizar usuario: "+req.session.usuario);
    Aspirante.findOneAndUpdate({_id : req.session.usuario }, {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,        
        rol: req.body.rol
    }, (error, aspirante) => {        
        if(error){
            console.log("Error al actualizar: "+error);
            return res.render('error', {
                mensaje : 'error al actualiza el usuario'
            }); 
        }
        req.session.nombre = req.body.nombre, 
        req.session.rol = req.body.rol
        if(aspirante){
            console.log("Actualizado usuario: "+aspirante.documento);
            return res.render('error', {
                mensaje : '¡El usuario se actualizó correctamente!',
                nombre : req.session.nombre,
                rol : req.session.rol
            }); 
        }
    });    
    console.log("Actualizar finalizado... ");
    
});

app.get('/salir', (req, res) => {
    req.session.destroy((error) => {
        if(error){
            return res.render('error', {
                mensaje : 'Usuario no encontrado'
            }); 
        }
    })
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.render('error', {
        titulo :'Pagina de error'
    })
});

const port = process.env.PORT || 3000;
process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/asignaturas';
//process.env.URLDB='mongodb+srv://prueba:prueba123@mongoremote-huptc.mongodb.net/asignaturas?retryWrites=true'
                   

mongoose.connect(process.env.URLDB, { useNewUrlParser:true }, (err, result) => {
	if(err){
		return console.log("No es posible conectar a la BD: "+err);
	}
	console.log("Conectado");
});



app.listen(port, () => {
    console.log('Escuchando por el puerto '+port);
});