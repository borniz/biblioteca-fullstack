import React, { useEffect, useState } from "react";
import type { IEjemplar } from "../types/Ejemplar";
import type { Libro } from "../types/Libro";

import {
  obtenerEjemplares,
  crearEjemplar,
  eliminarEjemplar,
} from "../services/ejemplarService";

import { obtenerLibros } from "../services/libroService";
import "../assets/Ejemplares.css";

function Ejemplares() {
  // 🔑 SE CORRIGE: Estados inicializados en null para derivar la carga de forma limpia
  const [ejemplares, setEjemplares] = useState<IEjemplar[] | null>(null);
  const [libros, setLibros] = useState<Libro[] | null>(null);

  const [codigoEjemplar, setCodigoEjemplar] = useState("");
  const [libroId, setLibroId] = useState<number | "">("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  // 🔄 ESTADO DERIVADO: Elimina la necesidad de un setCargando síncrono en el useEffect
  const cargando = ejemplares === null || libros === null;

  const cargarDatosUnificados = async (isActivo: boolean) => {
    try {
      setError("");
      const [datosEjemplares, datosLibros] = await Promise.all([
        obtenerEjemplares(),
        obtenerLibros(),
      ]);

      if (isActivo) {
        setEjemplares(datosEjemplares);
        setLibros(datosLibros);
      }
    } catch (err) {
      console.error(err);
      if (isActivo) {
        setError("No se pudieron sincronizar los datos de la biblioteca.");
        setEjemplares([]);
        setLibros([]);
      }
    }
  };

  useEffect(() => {
  let activo = true;

  // 🔑 Declaramos la petición DIRECTAMENTE adentro del efecto
  const ejecutarPeticionAPI = async () => {
    try {
      setError("");
      
      const [datosEjemplares, datosLibros] = await Promise.all([
        obtenerEjemplares(),
        obtenerLibros(),
      ]);

      // Solo si el componente sigue montado, actualizamos la interfaz
      if (activo) {
        setEjemplares(datosEjemplares);
        setLibros(datosLibros);
      }
    } catch (err) {
      console.error(err);
      if (activo) {
        setError("No se pudieron sincronizar los datos de la biblioteca.");
        setEjemplares([]);
        setLibros([]);
      }
    }
  };

  ejecutarPeticionAPI();

  return () => {
    activo = false; // Limpieza en caso de desmontaje rápido
  };
}, []); // Array de dependencias completamente limpio y seguro


  const handleCrearEjemplar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!codigoEjemplar.trim() || !libroId) {
      alert("Por favor, complete todos los campos mandatorios.");
      return;
    }

    try {
      setProcesando(true);
      setError("");

      await crearEjemplar(codigoEjemplar.trim(), Number(libroId));

      setCodigoEjemplar("");
      setLibroId("");

      await cargarDatosUnificados(true);
    } catch (err) {
      console.error(err);
      setError("Error del servidor: No se pudo generar la copia del ejemplar.");
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea retirar esta copia física?")) return;

    try {
      setProcesando(true);
      setError("");

      await eliminarEjemplar(id);
      await cargarDatosUnificados(true);
    } catch (err) {
      console.error(err);
      setError("Restricción de integridad: El ejemplar cuenta con un préstamo activo.");
    } finally {
      setProcesando(false);
    }
  };

  const obtenerNombreLibro = (id?: number) => {
    if (!id || !libros) return "No asignado";
    const libro = libros.find((l) => l.id === id);
    return libro ? `${libro.titulo} (${libro.autor})` : `Libro ID: #${id}`;
  };

  if (cargando) {
    return <div className="ejemplares-loading">Sincronizando inventario...</div>;
  }

  return (
    <div className="ejemplares-page">
      <header className="ejemplares-header">
        <div>
          <h1 style={{color:"#fff"}}>Gestión de Ejemplares</h1>
          <p className="subtext-header">Terminal de control de copias físicas y estantería</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="ejemplares-grid">
        {/* PANEL DE REGISTRO */}
        <section className="panel-card-ejemplar">
          <div className="panel-card-header">
            <h2>Registrar Ejemplar</h2>
            <p className="card-description">Asigne un identificador de inventario a un tomo existente.</p>
          </div>

          <form onSubmit={handleCrearEjemplar} className="formulario-ejemplar">
            <div className="control-grupo-ejemplar">
              <label>Seleccionar Libro Base</label>
              <select
                value={libroId}
                onChange={(e) => setLibroId(e.target.value ? Number(e.target.value) : "")}
                className="input-ejemplar"
                required
              >
                <option value="">-- Buscar catálogo --</option>
                {libros?.map((libro) => (
                  <option key={libro.id} value={libro.id}>
                    {libro.titulo} — {libro.autor}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-grupo-ejemplar">
              <label>Código de Barra / Estante</label>
              <input
                type="text"
                value={codigoEjemplar}
                onChange={(e) => setCodigoEjemplar(e.target.value)}
                className="input-ejemplar"
                placeholder="Ej: VOL-001-N1"
                required
              />
            </div>

            <button type="submit" className="btn-crear-ejemplar" disabled={procesando}>
              {procesando ? "Procesando..." : "✓ Emitir Copia"}
            </button>
          </form>
        </section>

        {/* PANEL DE REGISTROS (TABLA) */}
        <section className="panel-card-ejemplar">
          <div className="ejemplares-table-header">
            <div>
              <h2>Copias en Circulación</h2>
              <span className="contador-ejemplares">{(ejemplares || []).length} unidades</span>
            </div>
            <button
              type="button"
              className="btn-recargar-ejemplares"
              onClick={() => cargarDatosUnificados(true)}
              disabled={procesando}
            >
              🔄 Actualizar
            </button>
          </div>

          {(ejemplares || []).length === 0 ? (
            <div className="no-ejemplares">
              <p>No se registran copias físicas en esta terminal.</p>
            </div>
          ) : (
            <div className="tabla-ejemplares-container">
              <table className="tabla-ejemplares">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código Estante</th>
                    <th>Título del Libro</th>
                    <th style={{ textAlign: "center" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ejemplares?.map((ejemplar) => (
                    <tr key={ejemplar.id}>
                      <td>
                        <span className="badge-id-ejemplar">#{ejemplar.id}</span>
                      </td>
                      <td>
                        <span className="codigo-destacado-ejemplar">{ejemplar.codigoEjemplar}</span>
                      </td>
                      <td>
  {obtenerNombreLibro(
    (ejemplar as unknown as Record<string, number>).libroId || 
    (ejemplar as unknown as { libro?: { id: number } }).libro?.id
  )}
</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="btn-eliminar-ejemplar"
                          onClick={() => handleEliminar(ejemplar.id)}
                          disabled={procesando}
                        >
                          <svg xmlns="http://w3.org" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Ejemplares;
