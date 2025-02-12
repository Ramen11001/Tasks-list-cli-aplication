// Importar los módulos necesarios
const fs = require('fs'); // Módulo de sistema de archivos para leer y escribir archivos
const readline = require('readline'); // Módulo para interactuar con el usuario a través de la terminal
const colors = require('colors'); // Extensión para cambiar colores de los mensajes en consola.
colors.enable();

/**
 * Ruta del archivo JSON donde se almacenan las tareas.
 * Si el archivo no existe, se creará automáticamente.
 */
const TASK_FILE = 'task.json'; // Nombre del archivo para almacenar las tareas

//** Crear una interfaz de readline para interactuar con el usuario. 
// Esto permite capturar entradas y mostrar mensajes en la terminal. */
const rl = readline.createInterface({
    input: process.stdin, // Flujo de entrada (teclado)
    output: process.stdout // Flujo de salida (pantalla)
});
/** 
 * Función para cargar las tareas desde el archivo JSON.
 * Si el archivo no existe o está vacío, se devuelve un array vacío.
*/
function loadTasks() {
    try {
        // Leer el archivo y convertir el contenido JSON a un objeto de JavaScript
        const data = fs.readFileSync(TASK_FILE, 'UTF-8');
        return JSON.parse(data); // Devolver las tareas como un array
    } catch (error) {
        // Si hay un error (por ejemplo, el archivo no existe), devolver un array vacío
        return [];
    }
}

/** Función para guardar las tareas en el archivo JSON.
 * Recibe un array de tareas y lo escribe en el archivo
*/
function saveTasks(tasks) {
    try {
        // Convertir el array de tareas a formato JSON legible
        const data = JSON.stringify(tasks, null, 2);
        // Escribir el JSON en el archivo
        fs.writeFileSync(TASK_FILE, data, 'utf8');
        console.log('Tareas guardadas correctamente.'.green); // Mensaje de éxito
    } catch (error) {
        console.error('Error al guardar las tareas:'.red, error); // Mensaje de error
    }
}

// Función para mostrar el menú principal y gestionar las opciones del usuario.
function showMenu() {
    console.log('\n=== Lista de Tareas CLI ==='.rainbow);
    console.log('1. Ver tareas'.blue); // Opción para ver tareas
    console.log('2. Agregar tarea'.blue); // Opción para agregar una tarea
    console.log('3. Eliminar tarea'.blue); // Opción para eliminar una tarea
    console.log('4. Salir'.blue); // Opción para salir de la aplicación

    // Solicitar al usuario que elija una opción del menú.
    rl.question('\nElige una opción: '.green, (option) => {
        switch (option) {
            case '1':
                viewTasks(); // Ver tareas
                break;
            case '2':
                addTask(); // Agregar tarea
                break;
            case '3':
                deleteTask(); // Eliminar tarea
                break;
            case '4':
                console.log("\n¡¡¡¡ADIÓS!!!!".rainbow); // Mensaje de despedida
                rl.close(); // Cerrar la interfaz readline
                break;
            default:
                console.log('\nOpción no válida. Intenta de nuevo'.red); // Manejo de opción no válida
                showMenu(); // Volver a mostrar el menú
        }
    });
}

// Función para ver las tareas actuales.
function viewTasks() {
    const tasks = loadTasks(); // Cargar las tareas desde el archivo

    console.log('\n=== Lista de Tareas :) ==='.rainbow);

    if (tasks.length === 0) {
        // Si no hay tareas, mostrar un mensaje indicando que no hay tareas pendientes.
        console.log("\nNo hay tareas pendientes".green);
    } else {
        // Iterar sobre las tareas y mostrarlas con sus respectivos índices.
        tasks.forEach((t, index) => {
            console.log(`${index + 1}. ${t.description}`);
        });
    }

    // Volver a mostrar el menú principal después de ver las tareas.
    showMenu();
}

// Función para agregar una nueva tarea.
function addTask() {
    // Solicitar la descripción de la tarea al usuario.
    rl.question('\nEscribe la descripción de la tarea: '.green, (description) => {
        if (!description.trim()) {
            // Validar que la descripción no esté vacía
            console.log('\nLa descripción no puede estar vacía'.red);
            return showMenu(); // Volver al menú
        }

        const tasks = loadTasks(); // Cargar las tareas existentes
        // Agregar la nueva tarea al array de tareas
        tasks.push({ description });
        saveTasks(tasks); // Guardar las tareas actualizadas en el archivo

        console.log('\nTarea Agregada!!!'.green); // Mensaje de éxito
        showMenu(); // Volver al menú
    });
}

// Función para eliminar una tarea por su ID.
function deleteTask() {
    const tasks = loadTasks(); // Cargar las tareas desde el archivo

    if (tasks.length === 0) {
        // Si no hay tareas, mostrar un mensaje indicándolo.
        console.log("\nNo hay tareas para eliminar".red);
        return showMenu(); // Volver al menú
    }

    // Mostrar las tareas que el usuario puede elegir para eliminar
    console.log('\n=== Lista de Tareas ==='.rainbow);
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description}`);
    });

    // Solicitar el ID de la tarea que se desea eliminar.
    rl.question('\nEscriba el ID de la tarea que desea eliminar: '.green, (id) => {
        const taskIndex = parseInt(id - 1); // Convertir el ID ingresado a un índice

        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            console.log('\nID no es válido. Intenta de nuevo'.red); // Manejo de ID no válido
            return showMenu(); // Volver al menú
        }

        // Eliminar la tarea del array
        tasks.splice(taskIndex, 1); // Eliminar la tarea en taskIndex
        saveTasks(tasks); // Guardar las tareas actualizadas

        console.log('\nTarea eliminada con éxito!!'.green); // Mensaje de éxito
        showMenu(); // Volver al menú
    });
}

// Mostrar el menú principal al iniciar la aplicación
showMenu();