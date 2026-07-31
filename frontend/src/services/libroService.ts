import axios from "axios";
import type { Libro } from "../types/Libro";

const API_URL = "http://localhost:8080/libreria/libros";

export const obtenerLibros = async (): Promise<Libro[]> => {
  const respuesta = await axios.get<Libro[]>(API_URL);
  return respuesta.data;
};

export const obtenerLibroId = async (
  libroId: number
): Promise<Libro> => {
  const respuesta = await axios.get<Libro>(
    `${API_URL}/${libroId}`
  );

  return respuesta.data;
};

export const crearLibro = async (
  libro: Omit<Libro, "id"|"ejemplares">
): Promise<Libro> => {
  const respuesta = await axios.post<Libro>(
    API_URL,
    libro
  );

  return respuesta.data;
};

export const actualizarLibro = async (
  libroId: number,
  libro: Omit<Libro, "id"|"ejemplares">
): Promise<Libro> => {
  const respuesta = await axios.put<Libro>(
    `${API_URL}/${libroId}`,
    libro
  );

  return respuesta.data;
};

export const eliminarLibro = async (
  libroId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${libroId}`);
};