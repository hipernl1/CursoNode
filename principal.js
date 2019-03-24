const {listarCursos, buscarCurso, generarSoporte} = require('./Cursos');

const opciones = {
    seleccionCurso : {
        demand : true, 
        alias : 'id'
    },
    nombreEstudiante : {
        demand : true, 
        alias : 'nombre'
    },
    cedula : {
        demand : true, 
        alias : 'cc'
    },
    interesado: {
        default : true,
        alias : 'Int' 
    }
}


const argv = require('yargs')
    .command('inscribir', 'Incripción al curso', opciones) 
    .argv

if(argv.nombreEstudiante === undefined){
    listarCursos();        
}    
    
let ejecutarComandos = () => {
    //setTimeout(function(){
        console.log('**********************************************************'); 
        console.log('Selecciono el curso con Id: '+argv.seleccionCurso); 
        let busqueda = buscarCurso(argv.seleccionCurso);        
        if(busqueda){
            console.log('**** Quedaste Inscrito. ****'); 
            console.log(' Estudiante: '+argv.nombreEstudiante); 
            console.log(' Cédula:     '+argv.cedula); 
            console.log('**********************************************************'); 
            console.log('**** Generando Archivo  ****'); 
            generarSoporte(argv.nombreEstudiante, argv.cedula, argv.seleccionCurso);
        }else{
            console.log(''); 
            console.log('********         NO ESTAS INTERESADO         *******'); 
            console.log('******** Verifica nuestros cursos nuevamente *******'); 
            console.log(''); 
            listarCursos();        
        }        
   // }, 8000);
}

if(argv.nombreEstudiante != undefined){
    ejecutarComandos();
}
    

    