const hbs = require('hbs');

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