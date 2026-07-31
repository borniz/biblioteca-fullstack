import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Inicio } from "./pages/Inicio";
import Usuarios from "./pages/Usuarios";
import Libros from "./pages/Libros";
import Ejemplares from "./pages/Ejemplar";
import Prestamos from "./pages/Prestamos";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>
        
       <Navbar />

        <main style={{ flexGrow: 1, marginLeft: "260px" }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/ejemplares" element={<Ejemplares />} />
            <Route path="/prestamos" element={<Prestamos />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
