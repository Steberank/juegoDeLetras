// frontend/src/game/compararPalabras.jsx
import { UpdateSquareProps } from './UpdateSquareProps';
import { COLORS, FILAS } from './Constantes'; // Agregar FILAS a la importación

/**
 * Compara el intento del usuario con la palabra del día y actualiza los colores de los Squares.
 * @param {Array<string>} intentoEnviado - Array de letras del intento del usuario (ej: ['H', 'O', 'L', 'A', 'S'])
 * @param {string} palabraApi - La palabra del día (ej: "CASAS")
 * @param {number} filaActual - El índice de la fila que se está evaluando
 * @param {Array<Object>} board - El estado actual del tablero
 * @param {Function} setBoard - La función para actualizar el estado del tablero
 */
export const compararPalabras = (intentoEnviado, palabraApi, filaActual, board, setBoard) => {
  let newBoard = [...board]; // Crear una copia mutable del tablero

  // Convertir palabraApi a un array de caracteres para facilitar la comparación
  const palabraApiArray = palabraApi.split('');

  // Identificar los Squares de la fila actual que deben ser actualizados
  const squaresToUpdate = newBoard.filter(square => square.fila === filaActual);

  // Paso 1: Identificar letras VERDES (correctas en posición correcta)
  // Usamos un array para llevar un control de las letras ya "emparejadas" en palabraApi
  // para evitar reusarlas para coincidencias amarillas.
  const palabraApiTemp = [...palabraApiArray]; // Copia para modificar

  squaresToUpdate.forEach((square, index) => {
    if (intentoEnviado[index] === palabraApiTemp[index]) {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.VERDE });
      // Marcar la letra como usada en palabraApiTemp para que no se use para coincidencias amarillas
      palabraApiTemp[index] = null; // Usar null o un carácter no válido
      console.log(`Square ${square.id} (columna ${square.columna}) es VERDE: ${intentoEnviado[index]}`);
    }
  });

  // Paso 2: Identificar letras AMARILLAS (correctas pero en posición incorrecta) y GRIS OSCURO
  squaresToUpdate.forEach((square, index) => {
    // Si ya es VERDE, no lo procesamos de nuevo
    const currentSquareInBoard = newBoard.find(s => s.id === square.id);
    if (currentSquareInBoard.colorType === COLORS.VERDE) {
      return;
    }

    const letraIntento = intentoEnviado[index];
    const indexOfMatch = palabraApiTemp.indexOf(letraIntento);

    if (indexOfMatch !== -1) {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.AMARILLO });
      // Marcar la letra como usada en palabraApiTemp para que no se re-use
      palabraApiTemp[indexOfMatch] = null;
      console.log(`Square ${square.id} (columna ${square.columna}) es AMARILLO: ${letraIntento}`);
    } else {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.GRIS_OSCURO });
      console.log(`Square ${square.id} (columna ${square.columna}) es GRIS_OSCURO: ${letraIntento}`);
    }
  });

  // Paso 3: Si es la última fila, deshabilitar la fila actual
  if (filaActual === FILAS - 1) {
    squaresToUpdate.forEach(square => {
      newBoard = UpdateSquareProps(newBoard, square.fila, square.columna, { isActive: 0, isEditable: 0 });
    });
    console.log(`Fila ${filaActual} (última fila) deshabilitada. Juego terminado.`);
  }

  setBoard(newBoard); // Actualiza el estado del tablero con los nuevos colores y estado final
  console.log("Colores de los Squares actualizados.");
};