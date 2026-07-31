import { useNavigate } from "react-router-dom";
import "../assets/Inicio.css";

export function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-page">
      <header className="inicio-header">
        <h1 style={{color:"#fff"}}>Panel de Control</h1>
        <p className="subtext-header">Sistema Centralizado de Administración de la Biblioteca</p>
      </header>

      <div className="dashboard-summary-grid">
        <div className="summary-card" onClick={() => navigate("/usuarios")}>
          <div className="card-icon-wrapper">👥</div>
          <div className="card-info">
            <h3>Usuarios</h3>
            <p>Gestionar usuarios registrados.</p>
            <span className="action-link">Ir a Usuarios &rarr;</span>
          </div>
        </div>

        <div className="summary-card" onClick={() => navigate("/libros")}>
          <div className="card-icon-wrapper">📚</div>
          <div className="card-info">
            <h3>Catálogo de Libros</h3>
            <p>Administrar títulos, autores y códigos ISBN generales.</p>
            <span className="action-link">Ver Catálogo &rarr;</span>
          </div>
        </div>

        <div className="summary-card" onClick={() => navigate("/ejemplares")}>
          <div className="card-icon-wrapper">🏷️</div>
          <div className="card-info">
            <h3>Control de Ejemplares</h3>
            <p>Supervisar las copias físicas en estantería.</p>
            <span className="action-link">Ver Inventario &rarr;</span>
          </div>
        </div>

        <div className="summary-card" onClick={() => navigate("/prestamos")}>
          <div className="card-icon-wrapper">🔄</div>
          <div className="card-info">
            <h3>Circulación de Préstamos</h3>
            <p>Emitir salidas de tomos y controlar devoluciones.</p>
            <span className="action-link">Terminal de Préstamos &rarr;</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFORMATIVA INFERIOR */}
      <footer className="terminal-logs-section">
        <h3>Terminal del Sistema</h3>
        <div className="terminal-box">
          <p className="log-line"><span className="log-time">[15:44:00]</span> Servidor de Base de Datos conectado exitosamente en puerto 8080.</p>
          <p className="log-line"><span className="log-time">[15:44:05]</span> Módulos cargados en memoria y tipados con TypeScript de forma segura.</p>
        </div>
      </footer>
    </div>
  );
}
