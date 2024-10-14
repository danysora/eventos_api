**Aplicación de gestión de eventos y boletos**

Para clonar el repositorio, basta con elegir la opción "Fork" arriba a la derecha.
Si no desea hacerlo así, puede 	dar click en el botón verde que dice "Code". Ahí le desplegará varias opciones:
*Copiar el url del repositorio para usarlo en un cliente, como github desktop.
*Abrir directamente github desktop para clonarlo.
*Descargar el código fuente en forma de archivo comprimido.
*Copiar un comando para clonarlo en un cli de consola.

Por el momento, SSH no se recomienda debido a requerimientos extras que esto puede tener.

**USO**


Para instalar las dependencias, hay que ejecutar el siguiente script:
'npm install'

Esto instalará todo lo que necesitamos para ejecutar debidamente el servidor.
Nuestro script de migración está en la carpeta migrations, el cual puede ser usado para upgrades y downgrades.

Para ejecutar el servidor, basta con el comando:

node app.js

Para las pruebas con las rutas de API, se recomienda Insomnia o Postman.
Nuestro servidor se ejecuta en el puerto '8080'.
Para hacer una solicitud, basta con elegir "Nueva solicitud" en el programa de nuestra elección,
entonces especificar la ruta. Para eventos, es  http://localhost:8080/eventos. Para reservas, es:
http://127.0.0.1:8080/reservas . Para un solo evento, es /eventos/(id), donde id es un numero.
Para una sola reserva, es /reservas/(id), donde id es un numero.
Una vez hecho esto, si la ruta lo permite, en BODY se debe elegir JSON y enviar un JSON.
*Ejemplo*

*Ruta: http://127.0.0.1:8080/reservas/1
*Body:
    {
	"evento_id":1,
	"nombre_usuario":"Mariana",
	"cantidad_boletos":5,
	"fecha_reserva":"2023-03-03"
}

Esto buscará la reserva especificada y cambiará la información de esta.