Una vez instalados los paquetes correspondientes puede ejecutar:

// Para Iniciar el servidor ejecute
nodemon src/app -e js,hbs

En el menu se presentan 3 roles

Para minimizar errores humanos los cursos se cierran con un simple click al igual que al eliminar estudiantes

    Coordinador: - Puede crear cursos (Crear curso) (Deberías ser la primera accion a realizar)
                 - Puede listar cursos (Listar cursos)
                 - Puede listar cursos con sus estudiantes (Listar cursos y estudiantes)
                 - Puede Cerrar cursos  (Listar cursos y estudiantes - cerrar curso)
                 - Puede eliminar aspirantes (Listar cursos y estudiantes - borrar aspirante) 
    
    Interesado: - Puede listar cursos (Listar cursos)

    Aspirante:  - Puede listar cursos (Listar cursos)
                - Puede Inscribirse a cursos (Listar cursos - inscribir)


Una vez iniciada la apĺicacion dirijase a http://localhost:3000/