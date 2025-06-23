// frontend/src/game/generateMockSession.js

import { createInitialBoard } from './Tablero';
import { UpdateSquareProps } from './UpdateSquareProps';
import { FILAS, COLUMNAS, COLORS } from './Constantes';

export const generateMockSession = () => {
  // 1. Crear un tablero inicial vacío
  let board = createInitialBoard();

  // 2. Modificar la fila 0 con "FAROL" y colores específicos
  const palabraFila0 = "FAROL";
  const fila0 = 0;
  board = board.map(square => {
    if (square.fila === fila0) {
      const letterIndex = square.columna;
      if (letterIndex < palabraFila0.length) {
        let newProps = { letter: palabraFila0[letterIndex] };
        if (square.id === 1 || square.id === 2) {
          newProps.colorType = COLORS.AMARILLO;
        }
        return { ...square, ...newProps };
      }
    }
    return square;
  });

  // 3. Modificar la fila 1 con "ROSAS" y colores específicos
  const palabraFila1 = "ROSAS";
  const fila1 = 1;
  board = board.map(square => {
    if (square.fila === fila1) {
      const letterIndex = square.columna;
      if (letterIndex < palabraFila1.length) {
        let newProps = { letter: palabraFila1[letterIndex] };
        if (square.id === 5) {
          newProps.colorType = COLORS.VERDE;
        }
        if (square.id === 8) {
          newProps.colorType = COLORS.AMARILLO;
        }
        return { ...square, ...newProps };
      }
    }
    return square;
  });

  // 4. Modificar la fila 2 para que todos sus squares sean editables
  const fila2 = 2;
  for (let col = 0; col < COLUMNAS; col++) {
    board = UpdateSquareProps(board, fila2, col, { isEditable: 1 });
  }

  // 5. Definir la fila actual y la palabra del día de la sesión previa
  const filaActual = 2;
  const palabra = "RUBIA";

  // 6. Construir el objeto de caché de la sesión previa
  const sesionPrevia = {
    board: board,
    filaActual: filaActual,
    palabra: palabra
  };

  // 7. Guardar la información en localStorage
  // Convertimos el objeto JavaScript a una cadena JSON antes de guardarlo.
  try {
    localStorage.setItem('sesionPrevia', JSON.stringify(sesionPrevia));
    console.log("Sesión de prueba guardada en localStorage bajo la clave 'sesionPrevia'.");
  } catch (e) {
    console.error("Error al guardar la sesión de prueba en localStorage:", e);
  }

  return sesionPrevia;
};