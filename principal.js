const {listarCursos, buscarCurso,mostrarCurso, generarSoporte} = require('./Cursos');
const express = require('express')
const app = express()
 
const opciones = {
    seleccionCurso : {
        demand : true, 
        alias : 'i'
    },
    nombreEstudiante : {
        demand : true, 
        alias : 'n'
    },
    cedula : {
        demand : true, 
        alias : 'c'
    }
}

let resultado

const argv = require('yargs')
    .command('inscribir', 'Incripción al curso', opciones) 
    .argv

if(argv.nombreEstudiante === undefined){
    resultado = listarCursos(); 
    console.log(resultado)      
}    
    
let ejecutarComandos = () => {
        resultado = "Selecciono el curso con Id: "+argv.seleccionCurso+"<br/>"; 
        let busqueda = buscarCurso(argv.seleccionCurso);        
        console.log ("Resulyado: "+busqueda)
        if(busqueda == undefined){            
            resultado = resultado + "NO ESTAS INTERESADO"+ 
                        " Verifica nuestros cursos nuevamente "+
            listarCursos();        
        }else{
            resultado = resultado + " Quedaste Inscrito. " + 
                " Estudiante: "+argv.nombreEstudiante +
                " Cédula:     "+argv.cedula +
            mostrarCurso(busqueda)    
            generarSoporte(argv.nombreEstudiante, argv.cedula, argv.seleccionCurso);
        }        
        return resultado
}

if(argv.nombreEstudiante != undefined){
    ejecutarComandos();
}
    
app.get('/', function (req, res) {
    res.send(resultado)
})
   
  


app.listen(3000)