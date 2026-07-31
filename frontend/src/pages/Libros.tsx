import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";

import {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
} from "../services/libroService";

import "../assets/Libros.css";

interface LibroFormulario {
  titulo: string;
  isbn: string;
  edicion: string;
  fechaPublicacion: string;
  autor: string;
}

const formularioInicial: LibroFormulario = {
  titulo: "",
  isbn: "",
  edicion: "",
  fechaPublicacion: "",
  autor: "",
};

function Libros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  const [libroSeleccionado, setLibroSeleccionado] =
    useState<LibroFormulario>(formularioInicial);

  const [libroEditandoId, setLibroEditandoId] =
    useState<number | null>(null);

  const cargarLibros = async () => {
    try {
      setError("");
      const datos = await obtenerLibros();
      setLibros(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los libros.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
  let activo = true;

  const ejecutarCarga = async () => {
    try {
      setError("");
      const datos = await obtenerLibros();
      if (activo) {
        setLibros(datos);
      }
    } catch (err) {
      console.error(err);
      if (activo) setError("No se pudieron cargar los libros.");
    } finally {
      if (activo) setCargando(false);
    }
  };

  ejecutarCarga();

  return () => {
    activo = false; 
  };
}, []);


  const abrirModalCrear = () => {
    setLibroEditandoId(null);
    setLibroSeleccionado({ ...formularioInicial });
    setError("");
    setModalAbierto(true);
  };

  const abrirModalEditar = (libro: Libro) => {
    setLibroEditandoId(libro.id);
    setLibroSeleccionado({
      titulo: libro.titulo,
      isbn: libro.isbn,
      edicion: libro.edicion,
      fechaPublicacion: libro.fechaPublicacion,
      autor: libro.autor,
    });
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (procesando) return;
    setModalAbierto(false);
    setLibroEditandoId(null);
    setLibroSeleccionado({ ...formularioInicial });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLibroSeleccionado((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !libroSeleccionado.titulo.trim() ||
      !libroSeleccionado.autor.trim() ||
      !libroSeleccionado.isbn.trim() ||
      !libroSeleccionado.edicion.trim() ||
      !libroSeleccionado.fechaPublicacion
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setProcesando(true);
      setError("");

      if (libroEditandoId !== null) {
        await actualizarLibro(libroEditandoId, libroSeleccionado);
      } else {
        await crearLibro(libroSeleccionado);
      }

      setModalAbierto(false);
      setLibroEditandoId(null);
      setLibroSeleccionado({ ...formularioInicial });
      await cargarLibros();
    } catch (err: unknown) {
      console.error(err);
      setError("No se pudo guardar el libro. Verifique los datos enviados.");
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este libro?");
    if (!confirmar) return;

    try {
      setError("");
      await eliminarLibro(id);
      setLibros((actuales) => actuales.filter((libro) => libro.id !== id));
    } catch (err: unknown) {
      console.error(err);
      setError("No se pudo eliminar el libro. Puede tener ejemplares o préstamos asociados.");
    }
  };

  const librosFiltrados = libros.filter((libro) => {
    const texto = filtro.toLowerCase().trim();
    return (
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto) ||
      libro.isbn.toLowerCase().includes(texto)
    );
  });

  if (cargando) {
    return <div className="loading-state">Cargando libros...</div>;
  }

  return (
    <div className="libros-page">
      <div className="libros-header">
        <div>
          <h1 style={{color:"#fff"}}>Gestión de Libros</h1>
          <p className="subtext-header">Catálogo de libros de la biblioteca</p>
        </div>
        <button type="button" className="btn-add-global" onClick={abrirModalCrear}>
          + Nuevo Libro
        </button>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍 Buscar por título, autor o ISBN..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-search"
        />
        <span className="user-counter">{librosFiltrados.length} encontrados</span>
      </div>

      {librosFiltrados.length === 0 ? (
        <p className="no-data">No se encontraron libros registrados.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-libros">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Edición</th>
                <th>Publicación</th>
                <th>Ejemplares</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {librosFiltrados.map((libro) => {
                const cantidadEjemplares = Array.isArray(libro.ejemplares)
                  ? libro.ejemplares.length
                  : 0;

                return (
                  <tr key={libro.id}>
                    <td><span className="badge-id">#{libro.id}</span></td>
                    <td className="titulo-libro">{libro.titulo}</td>
                    <td>{libro.autor}</td>
                    <td className="isbn-libro">{libro.isbn}</td>
                    <td>{libro.edicion}</td>
                    <td>{libro.fechaPublicacion}</td>
                    <td><span className="badge-ejemplares">{cantidadEjemplares}</span></td>
                    <td>
                      <div className="acciones-celda">
                        <button
                          type="button"
                          className="btn-tabla-edit"
                          onClick={() => abrirModalEditar(libro)}
                          title="Editar libro"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-tabla-delete"
                          onClick={() => handleEliminar(libro.id)}
                          title="Eliminar libro"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <div className="fondo-modal">
          <div className="div-card-editar">
            <button
              type="button"
              className="btnEditar-Exit"
              onClick={cerrarModal}
              disabled={procesando}
            >
              &times;
            </button>

            <h1 className="h1-Editar">
              {libroEditandoId !== null ? "Modificar Libro" : "Registrar Libro"}
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="div-editar">
                <label className="label-editar">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={libroSeleccionado.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">Autor</label>
                <input
                  type="text"
                  name="autor"
                  value={libroSeleccionado.autor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={libroSeleccionado.isbn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">Edición</label>
                <input
                  type="text"
                  name="edicion"
                  value={libroSeleccionado.edicion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="div-editar">
                <label className="label-editar">Fecha de publicación</label>
                <input
                  type="date"
                  name="fechaPublicacion"
                  value={libroSeleccionado.fechaPublicacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="div-actions-save">
                <button
                  type="submit"
                  className="btnEditar-Save"
                  disabled={procesando}
                >
                  {procesando ? "..." : "✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Libros;
