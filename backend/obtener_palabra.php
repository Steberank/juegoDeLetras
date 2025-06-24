<?php

// =============================================================================
// 1. Configuración de CORS (Cross-Origin Resource Sharing)
// =============================================================================
// Esto es CRUCIAL para permitir que tu frontend (que se ejecuta en un dominio/puerto diferente,
// como http://localhost:5173 o 3000) pueda hacer solicitudes a tu backend PHP.
// Sin esto, el navegador bloqueará la solicitud por razones de seguridad.

// Permite solicitudes desde cualquier origen (*). En un entorno de producción,
// deberías reemplazar '*' con la URL específica de tu frontend (ej. 'http://localhost:5173').
header("Access-Control-Allow-Origin: *");

// Permite los métodos HTTP que tu frontend va a usar (GET, POST, OPTIONS, etc.)
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Permite ciertas cabeceras HTTP en la solicitud.
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Establece el tipo de contenido de la respuesta como JSON.
// Esto le dice al navegador y al frontend que la respuesta será datos JSON.
header('Content-Type: application/json');

// Manejo de solicitudes OPTIONS: Los navegadores a menudo envían una solicitud OPTIONS
// (conocida como "preflight request") antes de la solicitud real (ej. GET) para
// verificar los permisos CORS. Si es una solicitud OPTIONS, simplemente enviamos
// las cabeceras CORS y salimos.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // OK
    exit();
}

// =============================================================================
// 2. Incluir el archivo de conexión a la base de datos
// =============================================================================
// 'require_once' asegura que el script de conexión se incluya solo una vez y
// que el script se detenga si el archivo no se encuentra o hay un error fatal.
require_once __DIR__ . '/database/db_conectar.php';

// =============================================================================
// 3. Obtener la fecha actual para determinar la palabra del día
// =============================================================================
// Usamos la fecha actual en formato 'YYYY-MM-DD' para buscar la palabra.
// La función date('Y-m-d') nos da la fecha del servidor PHP.
$currentDate = date('Y-m-d');

// Para propósitos de prueba, si quieres probar una fecha específica sin cambiar la del servidor:
//$currentDate = '2025-06-16'; // Ejemplo: para probar la palabra del 16 de junio de 2025

// =============================================================================
// 4. Preparar y ejecutar la consulta SQL
// =============================================================================
try {
    // Consulta SQL para seleccionar la palabra donde fecha_amostrar coincida con la fecha actual.
    // LIMIT 1 asegura que solo obtenemos una palabra, incluso si hubiera múltiples (no debería con UNIQUE).
    $sql = "SELECT palabra FROM palabras WHERE fecha_amostrar = :current_date LIMIT 1";

    // Preparamos la sentencia SQL. Esto es parte de la seguridad de PDO contra SQL injection.
    // PDO analiza la consulta y la prepara para ejecutarla de forma segura.
    $stmt = $pdo->prepare($sql);

    // Vinculamos el parámetro ':current_date' con el valor de $currentDate.
    // Esto es cómo los valores se insertan de forma segura en la consulta preparada.
    $stmt->bindParam(':current_date', $currentDate);

    // Ejecutamos la consulta.
    $stmt->execute();

    // =============================================================================
    // 5. Obtener el resultado
    // =============================================================================
    // Obtenemos la primera fila del resultado. Si no hay coincidencias, fetch() devuelve false.
    $palabraDatos = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($palabraDatos) {
        // Si se encontró una palabra, la devolvemos en formato JSON.
        echo json_encode(['success' => true, 'palabra' => $palabraDatos['palabra']]);
    } else {
        // Si no se encontró ninguna palabra para la fecha actual.
        http_response_code(404); // Código de estado HTTP para "No Encontrado"
        echo json_encode(['success' => false, 'message' => 'No hay palabras para hoy.']);
    }

} catch (\PDOException $e) {
    // Si ocurre un error durante la ejecución de la consulta, capturamos la excepción.
    // Enviar un código de estado HTTP 500 (Internal Server Error) y un mensaje JSON.
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database query error: ' . $e->getMessage()]);
} catch (\Exception $e) {
    // Para otros tipos de errores inesperados.
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
}

?>