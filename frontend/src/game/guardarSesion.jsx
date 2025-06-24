// frontend/src/game/guardarSesion.jsx

import { use, useState } from "react";

/**
 * Guarda el estado actual del juego en el almacenamiento local del navegador.
 * Esto permite que el jugador retome la partida donde la dejó.
 * @param {Array<Object>} board - El array que representa el estado actual del tablero de juego.
 * @param {number} filaActual - El índice de la fila en la que el jugador se encuentra actualmente.
 * @param {string} palabraApi - La palabra secreta del día que se está jugando.
 * @param {number} gameOver
 */
export const guardarSesion = (board, filaActual, palabraApi, gameOver) => {
  const filaGuardada = filaActual + 1;

  console.log('=== DEBUGGING guardarSesion ===');
  console.log('Parámetros recibidos:');
  console.log('- board:', board?.length ? `Array con ${board.length} elementos` : 'undefined/null');
  console.log('- filaActual:', filaActual, 'tipo:', typeof filaActual);
  console.log('- palabraApi:', palabraApi, 'tipo:', typeof palabraApi);
  console.log('- gameOver:', gameOver, 'tipo:', typeof gameOver);
  console.log('================================');
  
  try {
    //const[filaGuardada, setFilaGuardada] = useState();
    //setFilaGuardada(filaActual + 1);
    const estadoJuego = {
      board: board,
      filaActual: filaGuardada,
      palabra: palabraApi,
      gameOver: gameOver,
      // Opcional: podrías añadir una marca de tiempo o un ID de juego para futuras expansiones
      // timestamp: new Date().toISOString(), 
    };

    // Convertimos el objeto a una cadena JSON antes de guardarlo
    localStorage.setItem('sesionPrevia', JSON.stringify(estadoJuego));
    console.log('Estado del juego guardado exitosamente en el cache.');

  } catch (error) {
    console.error('Error al guardar el estado del juego en el cache:', error);
    // Aquí podrías añadir una lógica para notificar al usuario que no se pudo guardar
  }
};