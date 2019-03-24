var fs = require('fs');

let cursos = [
    {
        id: 1,
        nombre: 'Node basico',
        duracion: '2 meses',
        valor: '150.000'
    },
    {
        id: 2,
        nombre: 'Node intermedio',
        duracion: '3 meses',
        valor: '250.000'
    },
    {
        id: 3,
        nombre: 'Node avanzado',
        duracion: '5 meses',
        valor: '500.000'
    },
    {
        id: 4,
        nombre: 'Node expertos',
        duracion: '4 meses',
        valor: '700.000'
    }
];

let listarCursos = () => {
    console.log('**************************************************');
    console.log('           Listado de cursos disponibles          ');
    console.log('**************************************************');
    for (var n in cursos) {    
        let curso = (cursos[n]);         
        espera(curso, n);
    };
}
function espera(curso,n) {
  setTimeout(() => 
     {
         mostrarCurso(curso);
     }, n * 2000);    
}

function mostrarCurso(curso){
    if(curso === undefined){
        console.log(" ******************************* ");    
        console.log(" ***  Curso no Encontrado   **** ");    
        console.log(" ******************************* ");   
        return false; 
    }else{
        console.log(" ******************************* ");
        console.log(" Curso ID: "+curso.id);
        console.log(" Nombre curso: "+curso.nombre);
        console.log(" Duración curso: "+curso.duracion);
        console.log(" Valor curso: "+curso.valor);
        console.log(" ******************************* ");
        console.log("");
        return true;
    }
}


let buscarCurso = (identificador) => { 
    console.log(" Buscando Curso.. ");
    return mostrarCurso(cursos.find(curso => curso.id  === identificador));
}

function escribirCurso(curso){
     return " ******************************* \n"+
            " Curso ID: "+curso.id+"\n"+
            " Nombre curso: "+curso.nombre+"\n"+
            " Duración curso: "+curso.duracion+"\n"+
            " Valor curso: "+curso.valor+"\n"+
            " ******************************* "
}


let archivo = "inscripcion.txt";
var encoding = "utf8";

let crearContenidoSoporte = (nombre, cedula, idCurso) => {
    return " **********************************************\n"+
           " Estudiante: "+nombre+"\n"+
           " Cédula:     "+cedula+"\n\n"+
           " Se encuentra inscrito en el curso:\n"+
           escribirCurso(cursos.find(curso => curso.id  === idCurso));
}


let generarSoporte = (nombre, cedula, idCurso) => fs.writeFile(archivo, crearContenidoSoporte(nombre,cedula, idCurso), encoding, (err) => {
    if (err) throw err;
    console.log("Archivo generado Correctamente!");
});

module.exports = {
    listarCursos,
    buscarCurso,
    generarSoporte
};