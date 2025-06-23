// frontend/src/game/compararPalabras.jsx
import { UpdateSquareProps } from './UpdateSquareProps';
import { COLORS } from './Constantes'; // FILAS ya no es estrictamente necesario aquí si la lógica de última fila se mueve

export const compararPalabras = (intentoEnviado, palabraApi, filaActual, board, setBoard, guardarSesion) => {
  // `board` aquí ya contiene los ajustes de `isActive` e `isEditable` hechos por `handleKeyPress`
  let newBoard = [...board]; 

  const palabraApiArray = palabraApi.split('');
  const squaresToUpdate = newBoard.filter(square => square.fila === filaActual);
  const palabraApiTemp = [...palabraApiArray]; 

  squaresToUpdate.forEach((square, index) => {
    if (intentoEnviado[index] === palabraApiTemp[index]) {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.VERDE });
      palabraApiTemp[index] = null;
    }
  });

  squaresToUpdate.forEach((square, index) => {
    const currentSquareInBoard = newBoard.find(s => s.id === square.id);
    if (currentSquareInBoard.colorType === COLORS.VERDE) {
      return;
    }

    const letraIntento = intentoEnviado[index];
    const indexOfMatch = palabraApiTemp.indexOf(letraIntento);

    if (indexOfMatch !== -1) {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.AMARILLO });
      palabraApiTemp[indexOfMatch] = null;
    } else {
      newBoard = UpdateSquareProps(newBoard, filaActual, square.columna, { colorType: COLORS.GRIS_OSCURO });
    }
  });

  // ¡Única llamada a setBoard!
  setBoard(newBoard); 
  
  if(guardarSesion){
    guardarSesion(newBoard, filaActual, palabraApi)
  }
};