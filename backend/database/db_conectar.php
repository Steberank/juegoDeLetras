<?php

// =============================================================================
// 1. Configuración de las credenciales de la base de datos
// =============================================================================
// Estas son las credenciales para que PHP sepa cómo y dónde conectar.
// ¡Importante!: En un entorno de producción, estas credenciales NO deben
// estar hardcodeadas así. Se usarían variables de entorno o un archivo de
// configuración seguro. Para desarrollo, está bien por ahora.

$host = 'localhost'; // El servidor de tu base de datos (generalmente 'localhost')
$db   = 'palabras_db';  // El nombre de la base de datos que creamos antes
$user = 'root';      // Tu nombre de usuario de MySQL (comúnmente 'root')
$pass = '';          // Tu contraseña de MySQL (si usas XAMPP/WAMP, puede que esté vacía)
$charset = 'utf8mb4';// Codificación de caracteres para soportar tildes, ñ, etc.

// =============================================================================
// 2. Configuración de las opciones de PDO
// =============================================================================
// PDO (PHP Data Objects) es la forma recomendada para interactuar con bases de datos en PHP.
// Ofrece una capa de abstracción y, crucialmente, ayuda a prevenir ataques de inyección SQL
// cuando se usan sentencias preparadas (prepared statements).
$options = [
    // Esto asegura que PDO lanzará una excepción (un error capturable) si algo sale mal
    // con una consulta SQL, lo cual es muy útil para depurar.
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // Establece el modo predeterminado para obtener los resultados de las consultas
    // como arrays asociativos (ej. ['nombre_columna' => 'valor']).
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // Deshabilita la emulación de sentencias preparadas por parte del driver.
    // Esto fuerza a PDO a usar sentencias preparadas nativas en el servidor MySQL,
    // que es más seguro y eficiente.
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// =============================================================================
// 3. Crear la cadena de conexión (DSN - Data Source Name)
// =============================================================================
// El DSN es la información compacta que PDO necesita para saber a dónde conectar.
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// =============================================================================
// 4. Intentar establecer la conexión
// =============================================================================
// Usamos un bloque try-catch para manejar cualquier problema que pueda surgir
// al intentar conectar a la base de datos (ej. credenciales incorrectas, DB offline).
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    // La variable $pdo ahora contiene el objeto de conexión a la base de datos.
    // echo "Conexión exitosa a la base de datos!"; // Línea de depuración, puedes borrarla después.
} catch (\PDOException $e) {
    // Si la conexión falla, mostramos un mensaje de error y terminamos el script.
    // En un entorno de producción, registrarías el error sin mostrar detalles sensibles
    // al usuario.
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

?>