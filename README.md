# Calendar

## Instrucciones de instalación:

1a. Descargar el repositorio en su equipo.
1b. Forkear el repositorio y descargarlo en su equipo.
2. Correr ```npm install``` para instalar dependencias. Si no puede correr comandos con npm, debe instalar node.js desde este link: https://nodejs.org/en/download/
3. Para correr el servidor local, correr ```npm run parcel```.
4. Ir a la dirección indicada por la consola.

## Erorres conocidos o aún no soportados:
- Al crear eventos a las 23 horas, despues de interactuar un par de veces se bugea un listener. Cambiar "bottom" por "top" en linea 69 de la prueba de Cypress para reproducir el bug.
- Eventos que transcurren a lo largo de 3 dias
- Superposicion de mas de 3 eventos simultaneos
- No avisa cuando no modifica un evento por poner una fecha de fin anterior a fecha de inicio
