# API de tareas

Curso Javascript Intermedio II del [CETAV](http://parquelalibertad.org/cetav/).

URL base: `https://js2-tareas-api.netlify.app/`

## Documentación

### Aspectos generales

Es necesario agregar un parámetro al final de todas las URL para indicar el ID de usuario:

```
https://js2-tareas-api.netlify.app/api/tareas?uid=[ID]
```

Ninguna petición funcionará (Error **403 ACCESS DENIED**) si no se indica el user ID.

### Obtener el listado de tareas

Enviar petición `GET` a `https://js2-tareas-api.netlify.app/api/tareas?uid=[ID]`

Resultado (**200 OK**):

```
[
  {
    "_id": "280497767550288393",
    "userId": 1,
    "name": "Tarea de prueba 1",
    "complete": false,
    "date": "2020-10-27"
  },
  {
    "_id": "280505790262936070",
    "userId": 1,
    "name": "Tarea de prueba 2",
    "complete": false,
    "date": "2020-10-27"
  },
  ...
]
```

### Crear una tarea

Enviar petición `POST` a `https://js2-tareas-api.netlify.app/api/tareas?uid=[ID]`.

Cuerpo (JSON):

```
{
  "name": "Tarea de prueba 1",
  "complete": false,
  "date": "2020-10-27"
}
```

Resultado (**201 CREATED**):

```
{
  "_id": "280560014216659465",
  "name": "Tarea de prueba 3",
  "complete": false,
  "date": "2020-10-27"
}
```

Posibles errores:

- Si hay algún error en el JSON del cuerpo (ej. campos faltantes) se produce un error **502 BAD GATEWAY**.

### Modificar una tarea

Enviar petición `PUT` a `https://js2-tareas-api.netlify.app/api/tareas/[ID_TAREA]?uid=[ID]`.

Cuerpo (JSON):

```
{
  "name": "Tarea de prueba 1",
  "complete": true,
  "date": "2020-10-27"
}
```

Resultado (**200 OK**):

```
{
  "_id": "280560014216659465",
  "name": "Tarea de prueba 3",
  "complete": true,
  "date": "2020-10-27"
}
```

Posibles errores:

- Si no se especifica el ID de la tarea se produce un error **400 BAD REQUEST**.
- Si hay algún error en el JSON del cuerpo (ej. campos faltantes) se produce un error **502 BAD GATEWAY**.

### Eliminar una tarea:

Enviar petición `DELETE` a `https://js2-tareas-api.netlify.app/api/tareas/[ID_TAREA]?uid=[ID]`.

Resultado (**200 OK**):

```
{
  "_id": "280560014216659465"
}
```

Posibles errores:

- Si no se especifica el ID de la tarea se produce un error **400 BAD REQUEST**.
