import React, { useState, useEffect, useRef } from 'react';
import './mensajePopup.css'; // Asegúrate de que la ruta a tu CSS sea correcta

const MensajePopup = ({ message, duration = 3000, onTransitionEndCallback }) => {
  const [displayMessage, setDisplayMessage] = useState(null); // El mensaje que se está mostrando actualmente
  const [animationPhase, setAnimationPhase] = useState(''); // Controla las clases CSS: '', 'entering', 'exiting'

  const timerRef = useRef(null); // Referencia para el temporizador de duración de display

  useEffect(() => {
    // Limpia cualquier temporizador existente para evitar comportamientos inesperados
    clearTimeout(timerRef.current);

    if (message) {
      // Si hay un nuevo mensaje, prepáralo para mostrar
      setDisplayMessage(message);
      setAnimationPhase(''); // Resetea la fase para asegurar que la animación de entrada se dispare

      // Usa requestAnimationFrame para asegurar que el navegador ha pintado
      // el estado inicial (oculto) antes de aplicar la clase 'entering'.
      // Esto es crucial para que las transiciones CSS funcionen correctamente al montar/actualizar.
      requestAnimationFrame(() => {
        setAnimationPhase('entering'); // Inicia la animación de entrada
        
        // Programa un temporizador para iniciar la animación de salida después de 'duration'
        timerRef.current = setTimeout(() => {
          setAnimationPhase('exiting');
        }, duration);
      });

    } else {
      // Si el prop 'message' se ha vuelto null/vacío desde el componente padre,
      // y hay un mensaje actualmente en display, inicia la animación de salida.
      if (displayMessage) {
        setAnimationPhase('exiting');
      } else {
        // Si no hay mensaje y no hay nada que mostrar, asegura que todo esté reseteado
        setAnimationPhase('');
        setDisplayMessage(null);
      }
    }

    // Función de limpieza del efecto: se ejecuta cuando el componente se desmonta
    // o antes de que el efecto se ejecute nuevamente.
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [message, duration, displayMessage]); // Dependencias del efecto

  const handleTransitionEnd = (e) => {
    // *** MUY IMPORTANTE PARA DEPURAR: ***
    // Descomenta la siguiente línea para ver qué propiedad está terminando su transición.
    // console.log('Transition ended for property:', e.propertyName, 'on target:', e.target, 'Current animationPhase:', animationPhase);

    // Solo actuamos si la transición finalizada pertenece al contenedor principal del popup (no a un hijo)
    // y si estamos en la fase de salida ('exiting') y la propiedad que finalizó es 'opacity'.
    // La opacidad es la que indica que el popup ha terminado de desvanecerse.
    if (e.target === e.currentTarget && animationPhase === 'exiting' && e.propertyName === 'opacity') {
      setAnimationPhase('');    // Resetea la fase de animación
      setDisplayMessage(null);  // Borra el mensaje, lo que hará que el componente deje de renderizarse
      if (onTransitionEndCallback) {
        onTransitionEndCallback(); // Notifica al componente padre
      }
    }
  };

  // El componente solo renderiza si hay un mensaje para mostrar
  // o si está en alguna fase de animación (entrando o saliendo)
  if (!displayMessage && animationPhase === '') {
    return null;
  }

  return (
    <div
      className={`popup-message-container ${animationPhase}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="popup-message-content">
        {displayMessage}
      </div>
    </div>
  );
};

export default MensajePopup;