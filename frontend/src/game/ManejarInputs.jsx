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
        console.log(`Desactivado Square ID: ${prevActiveSquare.id}`);
      }
    }

    // Paso 2: Activar el Square en el que se hizo clic
    // Siempre activamos el Square clicado si es editable. Si ya estaba activo, se mantiene activo (o podrías añadir lógica para desactivarlo si quieres un toggle)
    newBoard = UpdateSquareProps(newBoard, clickedSquare.fila, clickedSquare.columna, { isActive: 1 });
    console.log(`Activado Square ID: ${clickedId}`);

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
  setBoard,
  activeSquareId,
  setActiveSquareId,
  filaActual, // Usamos directamente este prop
  setFilaActual,
  onAttemptSubmit
) => {
  if (activeSquareId === null) {
    console.log("No hay Square activo. Ignorando entrada de teclado.");
    return;
  }

  const keyPressed = event.key.toUpperCase();
  let newBoard = [...board];
  const activeSquare = newBoard.find(square => square.id === activeSquareId);

  if (!activeSquare || activeSquare.isEditable === 0) {
    console.log(`El Square activo (ID: ${activeSquareId}) no es editable o no se encontró.`);
    return;
  }

  // --- Lógica para ENTER ---
  if (event.key === 'Enter') {
    const squaresInCurrentRow = newBoard.filter(s => s.fila === filaActual);
    const allSpacesFilled = squaresInCurrentRow.every(s => s.letter !== '');

    if (!allSpacesFilled) {
      console.log(`Fila ${filaActual} no completada. No se puede avanzar.`);
      return;
    }

    console.log(`Fila ${filaActual} completada.`);

    // 1. Crear el array "intentoEnviado" con las letras de la fila actual
    const intentoEnviado = squaresInCurrentRow
      .sort((a, b) => a.columna - b.columna)
      .map(s => s.letter);
    console.log("Intento enviado:", intentoEnviado);

    // 2. Enviar el array "intentoEnviado" a Main.jsx a través del callback
    if (onAttemptSubmit) {
      onAttemptSubmit(intentoEnviado);
    }

    // 3. Modificar isEditable a 0 para la filaActual y desactivar los cuadrados
    squaresInCurrentRow.forEach(square => {
      newBoard = UpdateSquareProps(newBoard, square.fila, square.columna, { isActive: 0, isEditable: 0 });
    });
    console.log(`Fila ${filaActual} ahora es no editable.`);

    // 4. Verificar si la fila actual es la última
    if (filaActual === FILAS - 1) {
      console.log(`La fila ${filaActual} es la última. Juego terminado (lógica por implementar).`);
      setBoard(newBoard); // Actualiza el tablero con la fila deshabilitada
      setActiveSquareId(null); // Desactivar cualquier cuadrado activo si el juego termina
      return; // Fin del juego por ahora
    }

    // 5. Si no es la última fila: filaActual = filaActual + 1
    // La actualización real se hace al final con setFilaActual
    // Para las operaciones intermedias, podemos usar (filaActual + 1)
    const proximaFila = filaActual + 1; // Variable temporal para referenciar la próxima fila en esta ejecución

    // 6. Para la próxima fila (proximaFila), modificar isEditable = 1
    const squaresInNextRow = newBoard.filter(s => s.fila === proximaFila); // Usamos proximaFila aquí
    squaresInNextRow.forEach(square => {
      newBoard = UpdateSquareProps(newBoard, square.fila, square.columna, { isEditable: 1 });
    });
    console.log(`Fila ${proximaFila} ahora es editable.`);

    // 7. Activar el cuadrado en la columna 0 de la nueva fila
    const firstSquareOfNextRowId = (proximaFila * COLUMNAS) + 0; // Usamos proximaFila aquí
    const firstSquareOfNextRow = newBoard.find(s => s.id === firstSquareOfNextRowId);

    if (firstSquareOfNextRow && firstSquareOfNextRow.isEditable === 1) {
      newBoard = UpdateSquareProps(newBoard, firstSquareOfNextRow.fila, firstSquareOfNextRow.columna, { isActive: 1 });
      setFilaActual(proximaFila); // <-- ¡Aquí actualizamos el estado filaActual en Main.jsx!
      setActiveSquareId(firstSquareOfNextRowId);
      console.log(`Nuevo Square activo: ID ${firstSquareOfNextRowId} en Fila: ${proximaFila}, Columna: 0`);
    } else {
      console.error(`Error: No se encontró o no es editable el primer Square de la fila ${proximaFila}.`);
      newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
      setActiveSquareId(null);
    }
    
    setBoard(newBoard);
    return;
  }

  // --- Lógica para BACKSPACE (sin cambios) ---
  if (event.key === 'Backspace') {
    if (activeSquare.letter !== '') {
      newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { letter: '' });
      console.log(`Letra borrada de Square ID: ${activeSquareId}.`);
    } else {
      if (activeSquare.columna === 0) {
        console.log(`Square ID: ${activeSquareId} está en la columna 0 y no tiene letra. No se retrocede.`);
        setBoard(newBoard);
        return;
      }

      newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
      console.log(`Desactivado Square ID: ${activeSquareId}.`);

      const prevColumn = activeSquare.columna - 1;
      const prevSquareId = (activeSquare.fila * COLUMNAS) + prevColumn;
      const prevSquare = newBoard.find(s => s.id === prevSquareId);

      if (prevSquare && prevSquare.isEditable === 1) {
        newBoard = UpdateSquareProps(newBoard, prevSquare.fila, prevSquare.columna, { isActive: 1 });
        setActiveSquareId(prevSquareId);
        console.log(`Activado Square ID anterior: ${prevSquareId}.`);
      } else {
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 1 });
        setActiveSquareId(activeSquareId);
        console.log(`Error: No se pudo retroceder a Square anterior editable. Manteniendo activo en ID: ${activeSquareId}`);
      }
    }
    
    setBoard(newBoard);
    return;
  }

  // --- Lógica para Letras (sin cambios) ---
  const isLetter = /^[A-Z]$/.test(keyPressed);

  if (isLetter) {
    newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { letter: keyPressed });
    console.log(`Letra "${keyPressed}" ingresada en Square ID: ${activeSquareId}`);

    if (activeSquare.columna < COLUMNAS - 1) {
      const nextColumn = activeSquare.columna + 1;
      const nextSquareId = (activeSquare.fila * COLUMNAS) + nextColumn;
      const nextSquare = newBoard.find(s => s.id === nextSquareId);

      if (nextSquare && nextSquare.isEditable === 1) {
        newBoard = UpdateSquareProps(newBoard, activeSquare.fila, activeSquare.columna, { isActive: 0 });
        newBoard = UpdateSquareProps(newBoard, nextSquare.fila, nextSquare.columna, { isActive: 1 });
        setActiveSquareId(nextSquareId);
        console.log(`Moviendo activo de ID ${activeSquareId} a ID ${nextSquareId}`);
      } else {
        console.log(`No se puede mover a un Square siguiente editable. Permanece en ID: ${activeSquareId}`);
      }
    } else {
      console.log(`Square ID: ${activeSquareId} está en la última columna. No se mueve al siguiente.`);
    }
    
    setBoard(newBoard);
    return;
  }

  console.log(`Tecla "${keyPressed}" no reconocida o no es una letra válida. Ignorando.`);
};