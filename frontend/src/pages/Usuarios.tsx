import { useEffect, useState } from "react";
import { type Usuario } from "../types/Usuario";
import {
  obtenerUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
} from "../services/usuarioService";
import "../assets/Usuarios.css";
import { obtenerPrestamosPorUsuario } from "../services/prestamoService";
import { type IPrestamos } from "../types/Prestamos";
function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Partial<Usuario> | null>(null);
  const [prestamos, setPrestamos] = useState<IPrestamos[]>([]);
  const [modalPrestamosAbierto, setModalPrestamosAbierto] = useState(false);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerUsuarios();
        setUsuarios(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []); // <-- Array de dependencias limpio

  const abrirModal = (usuario?: Usuario) => {
    setUsuarioSeleccionado(
      usuario || {
        nombre: "",
        apellido: "",
        email: "",
        fechaNacimiento: "",
      },
    );
    setModalAbierto(true);
  };

  const modificarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioSeleccionado) return;

    try {
      if (usuarioSeleccionado.id) {
        const modUsuario = usuarioSeleccionado;
        await actualizarUsuario(
          modUsuario as Omit<Usuario, "id">,
          usuarioSeleccionado.id,
        );
      } else {
        await crearUsuario(usuarioSeleccionado as Omit<Usuario, "id">);
      }
      setModalAbierto(false);
      setUsuarioSeleccionado(null);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al procesar el usuario");
    }
  };

  const EliminarUsuario = async (id: number) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este usuario de la librería?",
      )
    )
      return;
    try {
      await eliminarUsuario(id);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el registro.");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (e) =>
      e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      e.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
      e.email.toLowerCase().includes(filtro.toLowerCase()),
  );

  const verPrestamos = async (usuarioId: number) => {
    try {
      if (usuarioId) {
        const datosPrestamos = await obtenerPrestamosPorUsuario(usuarioId);
        if(!datosPrestamos.length) {
            return alert("No tiene Prestamos")
        }
        setPrestamos(datosPrestamos);
        setModalPrestamosAbierto(true);
      }
    } catch (error) {
      console.error(error);
      alert("Error al ver los prestamos del usuario.");
    }
  };

  if (cargando)
    return <div className="loading-state">Cargando usuarios...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <div>
          <h1 style={{color:"#fff"}}>Gestión de Usuarios</h1>
          <p className="subtext-header">
            Panel de Control de Clientes de la Librería
          </p>
        </div>
        <button className="btn-add-global" onClick={() => abrirModal()}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, apellido o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-search"
        />
        <span className="user-counter">
          {usuariosFiltrados.length} encontrados
        </span>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <p className="no-data">No se encontraron usuarios registrados.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Fecha Nacimiento</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
                <th style={{ textAlign: "center" }}>Prestamos</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <span className="badge-id">#{usuario.id}</span>
                  </td>
                  <td className="codigo-destacado">{usuario.nombre}</td>
                  <td className="codigo-destacado">{usuario.apellido}</td>
                  <td className="email-texto">{usuario.email}</td>
                  <td className="codigo-destacado">{usuario.fechaNacimiento}</td>
                  <td>
                    <div className="acciones-celda">
                      <button
                        className="btn-tabla-edit"
                        onClick={() => abrirModal(usuario)}
                        title="Editar"
                      >
                        <svg
                          xmlns="http://w3.org"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        className="btn-tabla-delete"
                        onClick={() => EliminarUsuario(usuario.id)}
                        title="Eliminar"
                      >
                        <svg
                          xmlns="http://w3.org"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.34 9m-4.72 0-.34-9m9.27-2-1.31 13.56a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.5 6.63m11.4 0V4.5A2.25 2.25 0 0 0 13.5 2.25h-3a2.25 2.25 0 0 0-2.25 2.25V6.63m10.5 0H4.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-tabla-edit"
                      onClick={() => {
                        verPrestamos(usuario.id);
                      }}
                    >
                      <svg
                        xmlns="http://w3.org"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="vgn-search-icon"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && usuarioSeleccionado && (
        <div className="fondo-modal">
          <div className="div-card-editar">
            <button
              className="btnEditar-Exit"
              onClick={() => setModalAbierto(false)}
              type="button"
            >
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h1 className="h1-Editar">
              {usuarioSeleccionado.id
                ? "Modificar Usuario"
                : "Registrar Usuario"}
            </h1>

            <form onSubmit={modificarUsuario}>
              <div className="div-editar">
                <label className="label-editar">Nombre</label>
                <input
                  type="text"
                  required
                  value={usuarioSeleccionado.nombre || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">Apellido</label>
                <input
                  type="text"
                  required
                  value={usuarioSeleccionado.apellido || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      apellido: e.target.value,
                    })
                  }
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">E-mail</label>
                <input
                  type="email"
                  required
                  value={usuarioSeleccionado.email || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">F. Nacimiento</label>
                <input
                  type="date"
                  required
                  value={usuarioSeleccionado.fechaNacimiento || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      fechaNacimiento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="div-actions-save">
                <button type="submit" className="btnEditar-Save">
                  <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalPrestamosAbierto && prestamos && (
        <div className="fondo-modal">
          <div className="div-card-editar">
            <h1 className="h1-Editar">Préstamos del Usuario</h1>
            <button
              className="btnEditar-Exit"
              onClick={() => setModalPrestamosAbierto(false)}
              type="button"
            >
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            {prestamos.map((prestamo) => (
                
              <div key={prestamo.id} className="tarjeta-prestamo div-prestamo" >
                <h3 className="prestamo-titulo">Préstamo #{prestamo.id}</h3>

                <div className="div-prestamo">
                  <label>Fecha del Préstamo: </label>
                  <span >{prestamo.fechaPrestamo}</span>{" "}
                  {/* Se cambió <td> por <span> */}
                </div>

                <div className="div-prestamo">
                  <label>Fecha de Devolución Prevista: </label>
                  <span>{prestamo.fechaDevolucionPrevista}</span>
                </div>
                {prestamo.fechaDevolucionReal && (
                  <div className="div-prestamo">
                    <label>Fecha de Devolución Real: </label>
                    <span>{prestamo.fechaDevolucionReal}</span>
                  </div>
                )}

                <div className="div-prestamo">
                  <label>Estado: </label>
                  <span
                    className={`badge-estado ${prestamo.estadoPrestamo.toLowerCase()}`}
                  >
                    {prestamo.estadoPrestamo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
