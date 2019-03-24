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
    let resultado= "<p align='center'>**************************************************</p><br/>"+
           "<p align='center'>Listado de cursos disponibles</p><br/>"+
           "<p align='center'>**************************************************</p><br/>";
    for (var n in cursos) {    
        let curso = (cursos[n]);         
        resultado = resultado + mostrarCurso(curso);
    };
    return resultado;

}
function espera(curso,n) {
  setTimeout(() => 
     {
        return mostrarCurso(curso);
     }, n * 2000);    
}

function mostrarCurso(curso){
    if(curso == undefined){
        return "<p align='left'>Curso no Encontrado   **** \n" +   
               " *******************************</p><br/> "
    }else{
        return escribirCurso(curso)
    }
}


let buscarCurso = (identificador) => { 
    console.log(" Buscando Curso.. ");
    return cursos.find(curso => curso.id  == identificador);
}

function escribirCurso(curso){
     return " <p align='left'>Curso ID: "+curso.id+
            " Nombre curso: "+curso.nombre+
            " Duración curso: "+curso.duracion+
            " Valor curso: "+curso.valor+"</p><br/> "
}


let archivo = "inscripcion.txt";
var encoding = "utf8";

let crearContenidoSoporte = (nombre, cedula, idCurso) => {
    return " **********************************************\n"+
           " Estudiante: "+nombre+"\n"+
           " Cédula:     "+cedula+"\n\n"+
           " Se encuentra inscrito en el curso:\n"+
           mostrarCurso(cursos.find(curso => curso.id  === idCurso));
}


let generarSoporte = (nombre, cedula, idCurso) => fs.writeFile(archivo, crearContenidoSoporte(nombre,cedula, idCurso), encoding, (err) => {
    if (err) throw err;
    console.log("Archivo generado Correctamente!");
});

module.exports = {
    listarCursos,
    buscarCurso,
    mostrarCurso,
    generarSoporte
};