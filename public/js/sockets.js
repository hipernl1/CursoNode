socket = io();

socket.on("mensaje", (informacion) => {
    console.log(informacion);

});

socket.emit("mensaje", "estoy conectado");

socket.emit("contador")

socket.on("contador", (contador) => {
    console.log(contador);
});

const formulario = document.querySelector('#chat')
const mensaje = formulario.querySelector('#texto')
const mensajes = document.querySelector('#mensajes')

formulario.addEventListener('submit', (datos) => {
    datos.preventDefault()    
    const nombre = datos.target.elements.nombre.value;
    const texto = datos.target.elements.texto.value;
    socket.emit("texto", 
        {   nombre:nombre, 
            mensaje:texto
        }, () => {
            
            mensaje.value ='';
            mensaje.focus()
        });
})

socket.on("texto", (texto) => {
    console.log(texto);
    mensajes.innerHTML = mensajes.innerHTML + texto.nombre+' : ' +texto.mensaje +'<br>'
});

socket.on("inicio", (texto) => {
    console.log(texto);
    mensajes.innerHTML = mensajes.innerHTML +'<b>' + texto+'</b><br>'
});