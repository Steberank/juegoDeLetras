import './App.css'; // Si tienes estilos globales para App
import Main from './game/Main.jsx'; // Importa el componente Main

function App() {
  return (
    <div className="App">
      <h1>¡Bienvenido a Adivina la Palabra!</h1>
      <Main />
    </div>
  );
}

export default App;