// frontend/src/components/Square.jsx
import React from 'react';

const Square = ({ colorType = 0, isEditable = 0, onSquareClick, isActive = 0, letter = '', fila, columna }) => {
  const colorMap = {
    0: '#222222',   // Gris, Square vacio o por defecto
    1: '#040404',   // Gris oscuro, la letra no se encuentra en la palabra
    2: '#E4A81D',   // Amarillo, letra correcta, posicion incorrecta
    3: '#28A745'    // Verde, letra correcta, posicion correcta.
  };

  const squareStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: colorMap[colorType] || colorMap[0],
    padding: '10px',
    color: 'white', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    cursor: isEditable === 1 ? 'pointer' : 'default', 
    transition: 'background-color 0.3s ease',
    boxSizing: 'border-box',
    fontSize: '2em',
    fontWeight: 'bold',
    outline: isActive ? '2px solid #87CEEB' : '2px solid #424242',
  };

  const handleClick = () => {
    if (isEditable === 1 && onSquareClick) {
      onSquareClick();
    }
  };

  return (
    <div style={squareStyle} onClick={handleClick}>
      {letter}
    </div>
  );
};

export default Square;