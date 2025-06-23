export const UpdateSquareProps = (board, fila, columna, newProps) => {
  return board.map((cell) =>
    cell.fila === fila && cell.columna === columna
      ? { ...cell, ...newProps }
      : cell
  );
};
