// frontend/src/game/Main.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createInitialBoard, renderBoard, activarPrimeraFila} from './Tablero';
import { generateMockSession } from './generateMockSession';
import { handleSquareClick, handleKeyPress } from './ManejarInputs';
import { COLUMNAS, FILAS } from './Constantes';
import { UpdateSquareProps } from './UpdateSquareProps';
import { compararPalabras } from './compararPalabras';
import { guardarSesion } from './guardarSesion';
import MensajePopup from '../components/MensajePopup';

const Main = () => {
  const [board, setBoard] = useState([]);
  const [palabraDelDia, setPalabraDelDia] = useState('');
  const [filaActual, setFilaActual] = useState(0);
  const [activeSquareId, setActiveSquareId] = useState(null);
  const [intentoEnviado, setIntentoEnviado] = useState(null); 
  const [popupMessage, setPopupMessage] = useState(null);
  const [gameOver, setGameOver] = useState(0); // 0: juego activo, 1: gano, -1: perdio

  useEffect(() => {
    const fetchPalabraDelDia = async () => {
      try {
        const response = await fetch('http://localhost/juegoDeLetras/backend/obtener_palabra.php');
        const data = await response.json();

        if (data.success) {
          const palabraApi = data.palabra.toUpperCase();
          setPalabraDelDia(palabraApi);

          const cachedSessionString = localStorage.getItem('sesionPrevia');
          let currentBoard = createInitialBoard();
          let currentFilaActual = 0;
          let currentActiveSquareId = 0;
          let currentGameOver = 0;

          if (cachedSessionString) {
            try {
              const cachedSession = JSON.parse(cachedSessionString);
              console.log("Sesión previa encontrada en caché:", cachedSession);

              if (cachedSession.palabra === palabraApi) {
                console.log("Palabra del caché coincide. Cargando sesión previa...");
                currentBoard = cachedSession.board;
                currentFilaActual = cachedSession.filaActual;
                currentGameOver = cachedSession.gameOver || 0;
                
                if (currentGameOver !== 0) {
                  console.log("El juego ya había terminado. GameOver:", currentGameOver);
                  currentActiveSquareId = null;
                } else {
                  const existingActiveSquare = currentBoard.find(s => s.isActive === 1);
                  if (!existingActiveSquare) {
                    currentActiveSquareId = (currentFilaActual * COLUMNAS); 
                    currentBoard = UpdateSquareProps(currentBoard, currentFilaActual, 0, { isActive: 1 });
                  } else {
                    currentActiveSquareId = existingActiveSquare.id;
                  }
                }

              } else {
                console.log("Palabra del caché es diferente. Borrando caché 'sesionPrevia'.");
                localStorage.removeItem('sesionPrevia');
                currentBoard = activarPrimeraFila(createInitialBoard());
                currentFilaActual = 0;
                currentActiveSquareId = 0;
                currentGameOver = 0;
              }
            } catch (parseError) {
              console.error("Error al parsear el JSON del caché. Borrando caché.", parseError);
              localStorage.removeItem('sesionPrevia');
              currentBoard = activarPrimeraFila(createInitialBoard());
              currentFilaActual = 0;
              currentActiveSquareId = 0;
              currentGameOver = 0;
            }
          } else {
            console.log("No se encontró sesión previa en caché. Iniciando juego nuevo.");
            currentBoard = activarPrimeraFila(createInitialBoard());
            currentFilaActual = 0;
            currentActiveSquareId = 0;
            currentGameOver = 0;
          }

          setBoard(currentBoard);
          setFilaActual(currentFilaActual);
          setActiveSquareId(currentActiveSquareId);
          setGameOver(currentGameOver);

        } else {
          console.error("Error del backend al obtener la palabra:", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el backend para obtener la palabra:", error);
      }
    };

    fetchPalabraDelDia();
  }, []);

const handleGuardarJuego = useCallback((currentBoard, currentFilaActual, currentGameOver) => {
  guardarSesion(currentBoard, currentFilaActual, palabraDelDia, currentGameOver);
}, [palabraDelDia]);

const handleIntentoEnviado = useCallback((ArrayIntento, filaDelIntento, boardPreModificado) => {
    setIntentoEnviado(ArrayIntento);

    // Pasar el board que ya viene modificado por handleKeyPress
    // compararPalabras lo usará como base y le agregará los colores
    compararPalabras(ArrayIntento, palabraDelDia, filaDelIntento, boardPreModificado, setBoard, handleGuardarJuego, setGameOver);
},[palabraDelDia, setBoard, handleGuardarJuego]);

const handleGameOverManejarInputs = useCallback((newGameOverValue) => {
  setGameOver(newGameOverValue);
}, []);

  const showMessage = useCallback((msg) => {
    setPopupMessage(msg);
  }, []);

  // Función que se llamará cuando la animación de salida del popup termine
  const handlePopupClosed = useCallback(() => {
    setPopupMessage(null);
  }, []);

    useEffect(() => {
    // Si el juego terminó, no procesar eventos de teclado
    if (gameOver !== 0) {
      return;
    }
  });

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
        handleIntentoEnviado,
        showMessage,
        handleGameOverManejarInputs
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
    handleGameOverManejarInputs
  ]);

  return (
    <div className="board-grid">
      {renderBoard(board, (fila, columna, id) => {
        // Solo permitir clicks si el juego no ha terminado
        if (gameOver !== 0) return;
        handleSquareClick(fila, columna, id, board, setBoard, activeSquareId, setActiveSquareId);
      })}
      <MensajePopup 
        message={popupMessage} 
        duration={2000} // Opcional: 2 segundos de duración
        onTransitionEndCallback={handlePopupClosed} 
      />
    </div>
  );
};

export default Main;