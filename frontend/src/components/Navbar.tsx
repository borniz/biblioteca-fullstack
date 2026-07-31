import { NavLink } from "react-router-dom";
import "../assets/Navbar.css";

export function Navbar() {
  return (
    <aside className="vgn-sidebar">
      <div className="sidebar-brand">
        <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14H4L8 6Z"/><path d="M12 2v4"/></svg>
        <span>Libreria</span>
      </div>
      
      <nav className="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} end>
          📊 Dashboard
        </NavLink>
        <NavLink to="/usuarios" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          👥 Usuarios
        </NavLink>
        <NavLink to="/libros" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          📚 Libros
        </NavLink>
        <NavLink to="/ejemplares" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          🏷️ Ejemplares
        </NavLink>
        <NavLink to="/prestamos" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          🔄 Préstamos
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        
      </div>
    </aside>
  );
}
