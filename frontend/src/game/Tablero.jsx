import { FILAS, COLUMNAS, COLORS } from './Constantes'; // Importa las constantes
import Square from './../components/Square';
import { UpdateSquareProps } from "./UpdateSquareProps";

// Función helper para inicializar el tablero
export const createInitialBoard = () => {
  const board = [];
  let idCounter = 0;
  for (let r = 0; r < FILAS; r++) {
    for (let c = 0; c < COLUMNAS; c++) {
      board.push({
        id: idCounter++,
        fila: r,
        columna: c,
        letter: '',
        colorType: COLORS.GRIS,
        isEditable: 0, // Por defecto, ningún cuadrado es editable al inicio
        isActive: 0,
      });
    }
  }
  return board;
};

export const renderBoard = (board, onSquareClick) => {
  return board.map((elemento) => (
    <Square
      key={elemento.id}
      fila={elemento.fila}
      columna={elemento.columna}
      letter={elemento.letter}
      colorType={elemento.colorType}
      isEditable={elemento.isEditable}
      isActive={elemento.isActive}
      onSquareClick={() => onSquareClick(elemento.fila, elemento.columna, elemento.id)}
    />
  ));
};

export const activarPrimeraFila = (board) => {
  let newBoard = board;

  // Hacer editables todos los cuadrados de la fila 0
  for (let col = 0; col < COLUMNAS; col++) {
    newBoard = UpdateSquareProps(newBoard, 0, col, { isEditable: 1 });
  }

  // Activar visualmente el primer cuadrado (id === 0)
  newBoard = newBoard.map((elemento) =>
    elemento.id === 0 ? { ...elemento, isActive: 1 } : elemento
  );

  return newBoard;
};
