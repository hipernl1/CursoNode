Una vez instalados los paquetes correspondientes puede ejecutar:

// Para visulizar los cursos disponibles
node principal 

// Para inscribir un curso
node principal inscribir -i 1 -n Leonardo -c 8001

// Para tratar de incribir un curso que no esta disponible
node principal inscribir -i 10 -n Leonardo -c 8001

Y ver los resultados de cada operacion en http://localhost:3000/