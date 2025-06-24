// frontend/src/game/ManejarInputs.jsx
import { UpdateSquareProps } from './UpdateSquareProps';
import { COLUMNAS, FILAS } from './Constantes'; 

export const handleSquareClick = (
  fila,
  columna,
  clickedId,
  board,
  setBoard,
  activeSquareId,
  setActiveSquareId
) => {
  let newBoard = [...board]; // Crea una copia del tablero para no modificar el estado directamente

  // Encuentra el objeto del Square en el que se hizo clic usando su ID
  const clickedSquare = board.find(square => square.id === clickedId);

  // Asegúrate de que el Square clicado existe y es editable
  if (clickedSquare && clickedSquare.isEditable === 1) {

    // Paso 1: Desactivar el Square que estaba activo previamente. Solo si hay un Square activo previo Y no es el mismo Square en el que se hizo clic
    if (activeSquareId !== null && activeSquareId !== clickedId) {
      const prevActiveSquare = newBoard.find(square => square.id === activeSquareId);
      if (prevActiveSquare) {
        // Usa UpdateSquareProps para actualizar la copia del tablero
        newBoard = UpdateSquareProps(newBoard, prevActiveSquare.fila, prevActiveSquare.columna, { isActive: 0 });
      }
    }

    // Paso 2: Activar el Square en el que se hizo clic
    // Siempre activamos el Square clicado si es editable. Si ya estaba activo, se mantiene activo (o podrías añadir lógica para desactivarlo si quieres un toggle)
    newBoard = UpdateSquareProps(newBoard, clickedSquare.fila, clickedSquare.columna, { isActive: 1 });

    setActiveSquareId(clickedId);
    setBoard(newBoard);
  }
};


/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------AQUI COMIENZA LA FUNCION PARA LEER LOS INPUT DE TECLADO-----------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


export const handleKeyPress = (
  event,
  board,
  setBoard, // No lo usaremos directamente para setear el board con los colores, solo para pasar a onAttemptSubmit
  activeSquareId,
  setActiveSquareId,
  filaActual,
  setFilaActual,
  onAttemptSubmit,
  showMessage,
  onGameOverChange
) => {
  if (activeSquareId === null) {
    return;
  }

  const keyPressed = event.key.toUpperCase();
  let newBoard = [...board]; // Copia el board inicial que recibimos
  const activeSquare = newBoard.find(square => square.id === activeSquareId);

  if (!activeSquare || activeSquare.isEditable === 0) {
    return;
  }

  // --- Lógica para ENTER ---
  if (event.key === 'Enter') {
    const squaresInCurrentRow = newBoard.filter(s => s.fila === filaActual);
    const allSpacesFilled = squaresInCurrentRow.every(s => s.letter !== '');

    if (!allSpacesFilled) {
      showMessage('¡Debes ingresar 5 letras!')
      return;
    }


    const intentoEnviado = squaresInCurrentRow
      .sort((a, b) => a.columna - b.columna)
      .map(s => s.letter);

    // Desactivar todos los cuadrados de la fila actual y hacerlos no editables
    squaresInCurrentRow.forEach(square => {
        newBoard = UpdateSquareProps(newBoard, square.fila, square.columna, { isActive: 0, isEditable: 0 });
    });

    // Si no es la última fila, prepara la próxima fila
    if (filaActual < FILAS - 1) {
      const proximaFila = filaActual + 1;
      const squaresInNextRow = newBoard.filter(s => s.fila === proximaFila);
      squaresInNextRow.forEach(square => {
        newBoard = UpdateSquareProps(newBoard, square.fila, square.columna, { isEditable: 1 });
      });

      const firstSquareOfNextRowId = (proximaFila * COLUMNAS) + 0;
      const firstSquareOfNextRow = newBoard.find(s => s.id === firstSquareOfNextRowId);

      if (firstSquareOfNextRow && firstSquareOfNextRow.isEditable === 1) {
        newBoard = UpdateSquareProps(newBoard, firstSquareOfNextRow.fila, firstSquareOfNextRow.columna, { isActive: 1 });
        setFilaActual(proximaFila); 
        setActiveSquareId(firstSquareOfNextRowId);
      } else {
        // Si no se puede activar el siguiente, desactiva el actual
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
        setActiveSquareId(null);
      }
    } else {
        // Si es la última fila, solo desactiva el square actual y quita la edición
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0, isEditable: 0 });
        setActiveSquareId(null); // No hay más cuadrados activos al final del juego
        console.log(`La fila ${filaActual} es la última. Juego terminado.`);
        if(onGameOverChange){
          onGameOverChange(-1);
        }
    }

    // Ahora, pasa la 'newBoard' (con las actualizaciones de 'isActive' y 'isEditable')
    // a 'onAttemptSubmit', que a su vez llamará a 'compararPalabras'.
    // 'compararPalabras' será la ÚNICA que llame a 'setBoard' al final.
    if (onAttemptSubmit) {
      onAttemptSubmit(intentoEnviado, filaActual, newBoard); // Pasa también la newBoard
    }
    
    return;
  }

  // --- Lógica para BACKSPACE  ---
  if (event.key === 'Backspace') {
    if (activeSquare.letter !== '') {
      newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { letter: '' });
    } else {
      if (activeSquare.columna === 0) {
        console.log(`Square ID: ${activeSquareId} está en la columna 0 y no tiene letra. No se retrocede.`);
        setBoard(newBoard);
        return;
      }

      newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
      const prevColumn = activeSquare.columna - 1;
      const prevSquareId = (activeSquare.fila * COLUMNAS) + prevColumn;
      const prevSquare = newBoard.find(s => s.id === prevSquareId);

      if (prevSquare && prevSquare.isEditable === 1) {
        newBoard = UpdateSquareProps(newBoard, prevSquare.fila, prevSquare.columna, { isActive: 1 });
        setActiveSquareId(prevSquareId);
      } else {
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 1 });
        setActiveSquareId(activeSquareId);
      }
    }
    
    setBoard(newBoard);
    return;
  }

  // --- Lógica para Letras (sin cambios) ---
  const isLetter = /^[A-Z]$/.test(keyPressed);

  if (isLetter) {
    newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { letter: keyPressed });
    if (activeSquare.columna < COLUMNAS - 1) {
      const nextColumn = activeSquare.columna + 1;
      const nextSquareId = (activeSquare.fila * COLUMNAS) + nextColumn;
      const nextSquare = newBoard.find(s => s.id === nextSquareId);

      if (nextSquare && nextSquare.isEditable === 1) {
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
        newBoard = UpdateSquareProps(newBoard, nextSquare.fila, nextSquare.columna, { isActive: 1 });
        setActiveSquareId(nextSquareId);
      }
    }
    setBoard(newBoard);
    return;
  }

  console.log(`Tecla "${keyPressed}" no reconocida o no es una letra válida. Ignorando.`);
};