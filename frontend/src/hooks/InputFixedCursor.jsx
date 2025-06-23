import { useRef } from "react";

function InputFixedCursor() {
  const inputRef = useRef(null);

  const handleInput = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, ""); // Filtra solo letras
    const length = event.target.value.length;
    setTimeout(() => event.target.setSelectionRange(length, length), 0); // Fija el cursor al final
  };

  const handleClick = (event) => {
    const length = event.target.value.length;
    setTimeout(() => event.target.setSelectionRange(length, length), 0);
  };

  const handleKeyDown = (event) => {
    if (!/^[a-zA-Z]$/.test(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
      event.preventDefault(); // Solo permite letras y la acción de borrar
    }

    setTimeout(() => {
      const length = event.target.value.length;
      event.target.setSelectionRange(length, length);
    }, 0); // Fija el cursor al final tras escribir o borrar
  };

  return (
    <input
      ref={inputRef}
      type="text"
      maxLength="1"
      className="square"
      onInput={handleInput}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
}

export default InputFixedCursor;
