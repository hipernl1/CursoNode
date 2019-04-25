Una vez instalados los paquetes correspondientes puede ejecutar:

// Para Iniciar el servidor ejecute
nodemon src/app -e js,hbs

En el menu se presentan 3 roles

Para minimizar errores humanos los cursos se cierran con un simple click al igual que al eliminar estudiantes

    Coordinador: - Puede crear cursos (Crear curso) (Deberías ser la primera accion a realizar)
                 - Puede listar cursos con sus estudiantes (Administrar cursos y estudiantes)
                 - Puede Cerrar cursos  (Listar cursos y estudiantes - cerrar curso)
                 - Puede eliminar aspirantes (Listar cursos y estudiantes - borrar aspirante) 
                 - Actualizar su usuario
    
    Interesado: - Puede listar cursos (Listar cursos)
                - Registrarse

    Aspirante:  - Puede listar cursos (Listar cursos)
                - Puede Inscribirse a cursos (Listar cursos - inscribir)
                - Actualizar su usuario

La contraseña de todos los usuarios es 789456

Una vez iniciada la apĺicacion dirijase a http://localhost:3000/
