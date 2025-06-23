// frontend/src/game/Main.jsx
import React, { useState, useEffect } from 'react';
import { createInitialBoard, renderBoard, activarPrimeraFila} from './Tablero';
import { generateMockSession } from './generateMockSession';
import { handleSquareClick, handleKeyPress } from './ManejarInputs';
import { COLUMNAS, FILAS } from './Constantes';
import { UpdateSquareProps } from './UpdateSquareProps';
import { compararPalabras } from './compararPalabras';

const Main = () => {
  const [board, setBoard] = useState([]);
  const [palabraDelDia, setPalabraDelDia] = useState('');
  const [filaActual, setFilaActual] = useState(0);
  const [activeSquareId, setActiveSquareId] = useState(null);
  const [intentoEnviado, setIntentoEnviado] = useState(null); 

  useEffect(() => {
    const fetchPalabraDelDia = async () => {
      try {
        const response = await fetch('http://localhost/juegoDeLetras/backend/obtener_palabra.php');
        const data = await response.json();

        if (data.success) {
          const palabraApi = data.palabra.toUpperCase();
          console.log("Palabra del día obtenida de la API:", palabraApi);
          setPalabraDelDia(palabraApi);

          const cachedSessionString = localStorage.getItem('sesionPrevia');
          let currentBoard = createInitialBoard();
          let currentFilaActual = 0;
          let currentActiveSquareId = 0;

          if (cachedSessionString) {
            try {
              const cachedSession = JSON.parse(cachedSessionString);
              console.log("Sesión previa encontrada en caché:", cachedSession);

              if (cachedSession.palabra === palabraApi) {
                console.log("Palabra del caché coincide. Cargando sesión previa...");
                currentBoard = cachedSession.board;
                currentFilaActual = cachedSession.filaActual;
                
                const existingActiveSquare = currentBoard.find(s => s.isActive === 1);
                if (!existingActiveSquare) {
                  currentActiveSquareId = (currentFilaActual * COLUMNAS); 
                  currentBoard = UpdateSquareProps(currentBoard, currentFilaActual, 0, { isActive: 1 });
                } else {
                  currentActiveSquareId = existingActiveSquare.id;
                }

              } else {
                console.log("Palabra del caché es diferente. Borrando caché 'sesionPrevia'.");
                localStorage.removeItem('sesionPrevia');
                currentBoard = activarPrimeraFila(createInitialBoard());
                currentFilaActual = 0;
                currentActiveSquareId = 0;
              }
            } catch (parseError) {
              console.error("Error al parsear el JSON del caché. Borrando caché.", parseError);
              localStorage.removeItem('sesionPrevia');
              currentBoard = activarPrimeraFila(createInitialBoard());
              currentFilaActual = 0;
              currentActiveSquareId = 0;
            }
          } else {
            console.log("No se encontró sesión previa en caché. Iniciando juego nuevo.");
            currentBoard = activarPrimeraFila(createInitialBoard());
            currentFilaActual = 0;
            currentActiveSquareId = 0;
          }

          setBoard(currentBoard);
          setFilaActual(currentFilaActual);
          setActiveSquareId(currentActiveSquareId);

        } else {
          console.error("Error del backend al obtener la palabra:", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el backend para obtener la palabra:", error);
      }
    };

    fetchPalabraDelDia();
  }, []);

  const handleIntentoEnviado = (ArrayIntento) => {
    console.log("Recibido intento en Main.jsx:", ArrayIntento);
    setIntentoEnviado(ArrayIntento); 

    compararPalabras(ArrayIntento, palabraDelDia, filaActual, board, setBoard);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(
        event,
        board,
        setBoard,
        activeSquareId,
        setActiveSquareId,
        filaActual,
        setFilaActual,
        handleIntentoEnviado
      );
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    board,
    activeSquareId,
    setBoard,
    setActiveSquareId,
    filaActual,
    setFilaActual,
    handleIntentoEnviado,
    palabraDelDia,
  ]);

  return (
    <div className="board-grid">
      {renderBoard(board, (fila, columna, id) => handleSquareClick(fila, columna, id, board, setBoard, activeSquareId, setActiveSquareId))}
    </div>
  );
};

export default Main;