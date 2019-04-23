const hbs = require('hbs');
var fs = require('fs');
const mogoose = require('mongoose')
const Curso = require('./models/curso')
const Aspirante = require('./models/aspirante')

hbs.registerHelper('obtenerPromedio',(nota1, nota2, nota3) => {
    return (nota1+nota2+nota3)/3;
});

hbs.registerHelper('listar', () => {
    listaEstudiantes = require('./listado.json');
    let texto = '<table class="table table-striped"> \
                    <thead class="thead-dark"> \
                     <th> Nombre </th> \
                     <th> Matemáticas </th> \
                     <th> Inglés </th> \
                     <th> Programación </th> \
                    </thead> \
                    <tbody> ';
    listaEstudiantes.forEach(est => {
        texto = texto +
            " <tr> \
                <td>"+ est.nombre+'</td>'+
            "   <td>"+ est.matematicas+'</td>'+
            "   <td>"+ est.programacion+'</td>'+
            "   <td>"+ est.ingles+'</td> </tr>'
        

    });
    texto = texto + " </tbody> </table>";
    return texto;
});

hbs.registerHelper('listar2', () => {
    listaEstudiantes = require('./listado.json');
    let texto = '<div class="accordion" id="accordionExample"> ';
    i = 1;
    listaEstudiantes.forEach(est => {
        texto = texto +
            `<div class="card">
            <div class="card-header" id="heading${i}">
              <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                  ${est.nombre}
                </button>
              </h2>
            </div>
        
            <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
              <div class="card-body">
               Matematicas:   ${est.matematicas} <br>
               Programación:  ${est.programacion} <br>
               Ingles:        ${est.ingles} <br>              
              </div>
            </div>
          </div>`
        i++;

    });
    texto = texto + "</div>";
    return texto;
});

hbs.registerHelper('crearCurso',(id, nombre, descripcion, valor, modalidad, intensidad, estado) => {
  if(crear(id , nombre, descripcion, valor, modalidad, intensidad, estado)){
    let texto = '<table class="table table-striped"> \
                      <thead class="thead-dark"> \
                      <th> id </th> \
                      <th> Nombre </th> \
                      <th> Descripcion </th> \
                      <th> Valor </th> \
                      <th> Modalidad </th> \
                      <th> Intensidad (Horas) </th> \
                      <th> Estado </th> \
                      </thead> \
                      <tbody> \
              <tr> \
                <td>'+ id+'</td>\
                <td>'+ nombre+'</td>\
                <td>'+ descripcion+'</td>\
                <td>'+ valor+'</td>\
                <td>'+ modalidad+'</td>\
                <td>'+ intensidad+'</td>\
                <td>'+ estado+'</td> </tr>\
                  </tbody> </table>';
      
      return texto; 
  }else{
    return '<h1> El curso ya se encuentra registrado.</h1>';
  }
});

hbs.registerHelper('listarCursos', (rol, cursos) => {
    if(rol == 'interesado'|| rol == 'Aspirante'){
      cursos = cursos.filter(curso => curso.estado == 'Disponible');
    }    
    let texto = '<div class="accordion" id="accordionExample"> ';
    i = 1;
    cursos.forEach(curso => {
        texto = texto +
            `<div class="card">
            <div class="card-header" id="heading${i}">
              <h2 class="mb-0">`
                if(rol == 'Aspirante'){
                  texto = texto +
                    `<a href="/inscribir?curso=${curso.id}&nombre=${curso.nombreCurso}" class="btn btn-secondary btn-lg" role="button" aria-disabled="true">Inscribir</a>
                    
                    `
                }
                texto = texto + `    
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                  Nombre: ${curso.nombreCurso} - Descripción: ${curso.descripcion} - Valor: ${curso.valor} 
                </button>
              </h2>
            </div>
        
            <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
              <div class="card-body">
               Id         :  ${curso.id} <br>
               Nombre     :  ${curso.nombreCurso} <br>
               Descripción:  ${curso.descripcion} <br>
               Valor      :  ${curso.valor} <br>              
               Modalidad  :  ${curso.modalidad} <br>              
               Intensidad :  ${curso.intensidad} <br>`
        if(curso.estado == 'Disponible'){
          texto = texto + ` Estado     :  Disponible <br> `
        }else{
          texto = texto + ` Estado     :  Cerrado <br> `
        }
        texto = texto + `
              </div>
            </div>
          </div>`
        i++;
    });    
    texto = texto + "</div>";
    
    return texto;

});

hbs.registerHelper('listarCursosEstudiantes', (cursoId, cursos, aspirantes, asociaciones) => {
  //let cursos = listarCursos();  
  //listarAspirantes();
  let texto = '<div class="accordion" id="accordionExample"> ';
  i = 1;
  cursos.forEach(curso => {
     //listarAsociacion();
      texto = texto +
          `<div class="card">
          <div class="card-header" id="heading${i}">
            <h2 class="mb-0">`
              if(curso.estado == 'Disponible'){    
                texto = texto + `
                <form class="form-inline my-2 my-lg-0" action="/cerrarCurso" method="POST">
                  <div class="form-group">
                      <input type="hidden" name="cursoId" id="cursoId" value=${curso.id}>
                  </div>               
                  <button type="submit" class="btn btn-dark">Cerrar curso</button>
                </form>
                `
              }
              texto = texto + `
              <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}"                   
              aria-expanded="true" aria-controls="collapse${i}">
                Nombre: ${curso.nombreCurso} - Descripción: ${curso.descripcion} `
                if(curso.estado == 'Disponible'){
                  texto = texto + ` - Estado     :  Disponible `
                }else{
                  texto = texto + ` - Estado     :  Cerrado `
                }
      texto = texto + `
              </button>
            </h2>
          </div>
      
          <div id="collapse${i}" class="collapse `           
          if(cursoId == curso.id){
            texto = texto + ` show `
          }
          texto = texto + `" aria-labelledby="heading${i}" data-parent="#accordionExample">
            <div class="card-body"> 
              <table class="table table-striped"> 
              <thead class="thead-dark"> 
              <th> Documento </th> 
              <th> Nombre </th> 
              <th> Email </th> 
              <th> Telefono </th> 
              <th> Accion </th>
              </thead> 
              <tbody> `
                asociacionesFilter = asociaciones.filter(aso => aso.cursoId == curso.id);
                asociacionesFilter.forEach(aso => {
                  let aspirante = aspirantes.find(asp => asp.documento == aso.documento);
                  if(aspirante){
                    texto = texto +
                  `<tr> 
                    <td> ${aspirante.documento} </td>
                    <td> ${aspirante.nombre}</td>
                    <td> ${aspirante.email} </td>
                    <td> ${aspirante.telefono} </td> 
                    <td> 
                    
                    <form action="/borrarEstudiante" method="POST">
                      <div class="form-group">
                          <input type="hidden" name="cursoId" id="cursoId" value=${curso.id}>
                          <input type="hidden" name="documento" id="documento" value=${aspirante.documento}>
                      </div>               
                      <button type="submit" class="btn btn-dark">Borrar aspirante</button>
                    </form>
                    </td>

                    </tr>`        
                  }
              });
              texto = texto + ` </tbody> </table>`                  
          
      texto = texto + `
            </div>
          </div>
        </div>`
      i++;
  });    
  texto = texto + "</div>";
  
  return texto;

});

hbs.registerHelper('inscribirCurso', (id, documento, nombre, email, telefono) => {
  listarCursos();
  let curso = cursos.find(cur => cur.id == id);
  console.log("Curso encontrado "+curso.nombreCurso);
  if(!curso){
    return "<h1> El curso no existe </h1>";
  }else{
    agregarAspirante(documento, nombre, email, telefono);
    if(asociarAspiranteACurso(id, documento)){
      return `<h1>¡El aspirante ${nombre} fué inscrito al curso ${curso.nombreCurso} Correctamente! </h1>`;     
    }
    return "<h1> El aspirante ya esta inscrito en el curso! </h1>";     
  }  
});

hbs.registerHelper('cerrarCurso', (id) => {
  listarCursos();
  let curso = cursos.find(cur => cur.id == id);
  console.log("Curso encontrado "+curso.nombreCurso);
  if(!curso){
    return "<h1> El curso no existe </h1>";
  }else{
    cursos = cursos.filter(cur => cur.id != id);
    curso.estado = 'off';
    cursos.push(curso);
    guardar();    
    return `<h1>¡El curso fue cerrado correctamente! </h1>`;         
  }
});

hbs.registerHelper('borrarEstudiante', (cursoId, documento) => {
  listarAsociacion();
  let asociacion = asociaciones.find(aso => aso.cursoId == cursoId && aso.documento == documento);
  console.log("Asociacion encontrada "+asociacion);
  if(!asociacion){
    return "<h1> El aspirante no esta en el Curso </h1>";
  }else{
    let index = asociaciones.indexOf(asociacion);
    if(index > -1){
      asociaciones.splice(index, 1);
    }
    guardarAsociacion();    
    return `<h1>¡El aspirante fue eliminado del curso! </h1>`;         
  }
});

hbs.registerHelper('mensaje', (mensaje) => {
  return `<h1>${mensaje} </h1>`;
});

hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {
  var operators, result;
  if (arguments.length < 3) {
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  }
  if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
  }
  operators = {
      '==': function (l, r) { return l == r; },
      '===': function (l, r) { return l === r; },
      '!=': function (l, r) { return l != r; },
      '!==': function (l, r) { return l !== r; },
      '<': function (l, r) { return l < r; },
      '>': function (l, r) { return l > r; },
      '<=': function (l, r) { return l <= r; },
      '>=': function (l, r) { return l >= r; },
      'typeof': function (l, r) { return typeof l == r; }
  };
  if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }
  result = operators[operator](lvalue, rvalue);
  if (result) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});

hbs.registerHelper('misCursos', (cursos, documento, nombre, rol) => {
  let texto = `<table class="table table-striped"> 
                <thead class="thead-dark"> 
                <th> Id curso </th> 
                <th> Curso </th> 
                <th> Descripción </th> 
                <th> Acción </th>
                </thead> 
                <tbody> `;
  cursos.forEach(curso => {
     //listarAsociacion();
      texto = texto +
          ` <tr> 
                    <td> ${curso.id} </td>
                    <td> ${curso.nombreCurso}</td>
                    <td> ${curso.descripcion} </td>
                    <td>                     
                      <form action="/chat" method="POST" target="${curso.id}-chatForm" onsubmit="window.open('', '${curso.id}-chatForm','toolbars=no, scrollbars=no,resizable=no,width=200,height=500')">
                        <div class="form-group">
                            <input type="hidden" name="cursoId" id="cursoId" value=${curso.id}>
                            <input type="hidden" name="nombre" id="nombre" value=${nombre}>
                            <input type="hidden" name="documento" id="documento" value=${documento}>
                            <input type="hidden" name="rol" id="rol" value=${rol}>
                        </div>               
                        <button type="submit" class="btn btn-dark">Chat estudiantes</button>
                      </form>
                    </td>

            </tr>` 
  });    
  texto = texto + "</tbody> </table>";  
  return texto;

});


let archivoCurso = "cursos.json";
let archivoAspirantes = "aspirantes.json";
let archivoAsociacion = "asociacion.json";

cursos = [];
aspirantes = [];
asociaciones = [];

const asociarAspiranteACurso = (cursoId, documento) => {
  listarAsociacion();
  let asociacion = {
    cursoId: cursoId,              
    documento: documento
  }   
  let duplicado = asociaciones.find(aso => aso.cursoId == cursoId && aso.documento == documento);
  if(!duplicado){
    asociaciones.push(asociacion);
    guardarAsociacion();
    return true;
  }else{
    console.log('Estudiante ya se encuentra en curso');
    return false;
  }
};



const crear = (id , nombre, descripcion, valor, modalidad, intensidad, estado) => {
  listarCursos();
  let curso = {
    id: id,              
    nombre: nombre,
    descripcion: descripcion,
    valor: valor,
    modalidad: modalidad,
    intensidad: intensidad,
    estado: estado
  }   
  let duplicado = cursos.find(cur => cur.id == id);
  if(!duplicado){
    cursos.push(curso);
    guardar();
    return true;
  }else{
    console.log('Identificador Duplicado');
    return false;
  }
}

const listarCursos = () => {
  try{
    Curso.find({}).exec((err, respuesta)=>{
      if(err){
        return console.log("Error al consultar los cursos: "+err);
      }
      //cursos = respuesta;
      console.log("Cursos encontrados: "+respuesta);
      return respuesta;      
    });    
  }catch(error){
    console.log('No encontro cursos '+error);
    cursos = [];
  }
}

const listarAspirantes = () => {
  try{
    aspirantes = require('../aspirantes.json');
  }catch(error){
    console.log('No encontro Aspirantes.json');
    aspirantes = [];
  }
}

const listarAsociacion = () => {
  try{
    asociaciones = require('../asociacion.json');
  }catch(error){
    console.log('No encontro asociacion.json');
    asociaciones = [];
  }
}

const guardar=() => {
  let datos = JSON.stringify(cursos);
  fs.writeFile(archivoCurso, datos, (err) => {
    if (err) throw err;
    console.log("Curso almacenado Correctamente!");
  });
}

const guardarAspirantes = () => {
  let datos = JSON.stringify(aspirantes);
  fs.writeFile(archivoAspirantes, datos, (err) => {
    if (err) throw err;
    console.log("Aspirante almacenado Correctamente!");
  });
}

const guardarAsociacion = () => {
  let datos = JSON.stringify(asociaciones);
  fs.writeFile(archivoAsociacion, datos, (err) => {
    if (err) throw err;
    console.log("Asociacion almacenado Correctamente!");
  });
}

