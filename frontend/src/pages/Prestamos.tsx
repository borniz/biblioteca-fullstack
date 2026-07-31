
import { useEffect, useState } from "react";
import type { IPrestamos } from "../types/Prestamos";
import type { Usuario } from "../types/Usuario";
import type { IEjemplar } from "../types/Ejemplar";

import { obtenerUsuarios } from "../services/usuarioService";
import {
  crearPrestamos,
  obtenerPrestamosPorUsuario,
  devolverPrestamos,
} from "../services/prestamoService";

import { obtenerEjemplaresDisponiblesPorIsbn } from "../services/ejemplarService";
import "../assets/Prestamo.css";

function Prestamos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ejemplares, setEjemplares] = useState<IEjemplar[]>([]);
  const [prestamos, setPrestamos] = useState<IPrestamos[]>([]);

  const [usuarioId, setUsuarioId] = useState<number | "">("");
  const [isbn, setIsbn] = useState("");
  const [ejemplarId, setEjemplarId] = useState<number | "">("");

  const [fechaPrestamo, setFechaPrestamo] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [fechaDevolucion, setFechaDevolucion] = useState("");

  const [cargando, setCargando] = useState(false);
  const [buscandoEjemplares, setBuscandoEjemplares] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const datos = await obtenerUsuarios();
        setUsuarios(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios");
      }
    };

    cargarUsuarios();
  }, []);

  const buscarEjemplares = async () => {
    if (!isbn.trim()) {
      alert("Ingrese un ISBN");
      return;
    }

    try {
      setBuscandoEjemplares(true);
      setError("");

      const datos =
        await obtenerEjemplaresDisponiblesPorIsbn(isbn.trim());

      setEjemplares(datos);
      setEjemplarId("");

      if (datos.length === 0) {
        alert("No hay ejemplares disponibles para este ISBN");
      }
    } catch (err) {
      console.error(err);
      setError(
        "No se pudieron consultar los ejemplares disponibles"
      );
      setEjemplares([]);
      setEjemplarId("");
    } finally {
      setBuscandoEjemplares(false);
    }
  };

  const buscarPrestamosUsuario = async (idAEvaluar?: number) => {
    const id = idAEvaluar ?? Number(usuarioId);

    if (!id) {
      alert("Seleccione un usuario");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const datos = await obtenerPrestamosPorUsuario(id);

      setPrestamos(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los préstamos");
    } finally {
      setCargando(false);
    }
  };

  const registrarPrestamo = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!usuarioId || !ejemplarId || !fechaPrestamo) {
      alert("Por favor, complete todos los campos obligatorios");
      return;
    }

    try {
      setCargando(true);
      setError("");
      await crearPrestamos(
        
        Number(usuarioId),
        Number(ejemplarId),
        fechaPrestamo,
        fechaDevolucion || undefined
      );

      alert("Préstamo registrado correctamente");

      setIsbn("");
      setEjemplares([]);
      setEjemplarId("");
      setFechaDevolucion("");

      await buscarPrestamosUsuario(Number(usuarioId));
    } catch (err) {
      console.error(err);

      alert(
        "No se pudo registrar el préstamo. Verifique que el usuario no tenga otro préstamo activo y que el ejemplar esté disponible."
      );
    } finally {
      setCargando(false);
    }
  };

  const devolver = async (prestamoId: number) => {
    if (!window.confirm("¿Desea devolver este préstamo?")) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      await devolverPrestamos(prestamoId);

      alert("Préstamo devuelto correctamente");

      await buscarPrestamosUsuario();
    } catch (err) {
      console.error(err);
      setError("No se pudo devolver el préstamo");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="prestamos-container">

      <header className="prestamos-header">
        <div>
          <h1 style={{color:"#fff"}}>Gestión de Préstamos</h1>
          <p className="subtext-header">
            Terminal de control de circulación y biblioteca
          </p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="dashboard-grid">

        {/* REGISTRAR PRÉSTAMO */}

        <section className="panel-card">

          <h2>Registrar Préstamo</h2>

          <form
            onSubmit={registrarPrestamo}
            className="formulario-prestamo"
          >

            <div className="control-grupo">

              <label className="label-moderno">
                Usuario beneficiario
              </label>

              <select
                value={usuarioId}
                className="input-moderno"
                onChange={(e) => {

                  const id = e.target.value;

                  setUsuarioId(
                    id ? Number(id) : ""
                  );

                  setPrestamos([]);
                }}
                required
              >

                <option value="">
                  Seleccione un usuario
                </option>

                {usuarios.map((usuario) => (

                  <option
                    key={usuario.id}
                    value={usuario.id}
                  >
                    {usuario.nombre} {usuario.apellido}
                  </option>

                ))}

              </select>

            </div>


            <div className="control-grupo">

              <label className="label-moderno">
                ISBN del libro
              </label>

              <div className="search-input-wrapper">

                <input
                  type="text"
                  value={isbn}
                  className="input-moderno"
                  onChange={(e) =>
                    setIsbn(e.target.value)
                  }
                  placeholder="Ej: 978-3-16-148410-0"
                />

                <button
                  type="button"
                  onClick={buscarEjemplares}
                  disabled={buscandoEjemplares}
                  className="btn-buscar-inline"
                >
                  {buscandoEjemplares
                    ? "..."
                    : "Buscar"}
                </button>

              </div>

            </div>


            <div className="control-grupo">

              <label className="label-moderno">
                Ejemplar disponible
              </label>

              <select
                value={ejemplarId}
                className="input-moderno"
                onChange={(e) =>
                  setEjemplarId(
                    e.target.value
                      ? Number(e.target.value)
                      : ""
                  )
                }
                required
                disabled={ejemplares.length === 0}
              >

                <option value="">

                  {ejemplares.length === 0
                    ? "Busca un ISBN primero"
                    : "Seleccione un ejemplar"}

                </option>

                {ejemplares.map((ejemplar) => (

                  <option
                    key={ejemplar.id}
                    value={ejemplar.id}
                  >
                    Código: {ejemplar.codigoEjemplar}
                  </option>

                ))}

              </select>

            </div>


            <div className="form-row">

              <div className="control-grupo">

                <label className="label-moderno">
                  Fecha inicial
                </label>

                <input
                  type="date"
                  value={fechaPrestamo}
                  className="input-moderno"
                  onChange={(e) =>
                    setFechaPrestamo(e.target.value)
                  }
                  required
                />

              </div>


              <div className="control-grupo">

                <label className="label-moderno">
                  Devolución prevista
                </label>

                <input
                  type="date"
                  value={fechaDevolucion}
                  className="input-moderno"
                  onChange={(e) =>
                    setFechaDevolucion(e.target.value)
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              disabled={cargando}
              className="btn-submit-prestamo"
            >
              {cargando
                ? "Procesando..."
                : "Confirmar Préstamo"}
            </button>

          </form>

        </section>


        {/* HISTORIAL */}

        <section className="panel-card">

          <div className="panel-right-header">

            <h2>Historial en Circulación</h2>

            <button
              type="button"
              onClick={() =>
                buscarPrestamosUsuario()
              }
              disabled={!usuarioId || cargando}
              className="btn-secundario"
            >
              🔄 Sincronizar
            </button>

          </div>


          {prestamos.length === 0 ? (

            <div className="no-data-placeholder">

              <p>
                Seleccione un usuario para
                visualizar su historial de préstamos.
              </p>

            </div>

          ) : (

            <div className="tabla-responsive-prestamos">

              <table className="tabla-moderna">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Emisión</th>

                    <th>Prevista</th>

                    <th>Devolución</th>

                    <th>Estado</th>

                    <th style={{ textAlign: "center" }}>
                      Acción
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {prestamos.map((prestamo) => (

                    <tr key={prestamo.id}>

                      <td>

                        <span className="badge-id-prestamo">
                          #{prestamo.id}
                        </span>

                      </td>


                      <td>
                        {prestamo.fechaPrestamo}
                      </td>


                      <td>
                        {prestamo.fechaDevolucionPrevista}
                      </td>


                      <td>
                        {prestamo.fechaDevolucionReal || "-"}
                      </td>


                      <td>

                        <span
                          className={`badge-status ${prestamo.estadoPrestamo.toLowerCase()}`}
                        >
                          {prestamo.estadoPrestamo}
                        </span>

                      </td>


                      <td>

                        <div className="acciones-celda-prestamo">

                          {prestamo.estadoPrestamo !==
                          "DEVUELTO" ? (

                            <button
                              type="button"
                              onClick={() =>
                                devolver(prestamo.id)
                              }
                              className="btn-devolver-registro"
                              title="Registrar devolución"
                            >
                              Devolver
                            </button>

                          ) : (

                            <span className="texto-devuelto">
                              Devuelto
                            </span>

                          )}

                        </div>

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

export default Prestamos;
