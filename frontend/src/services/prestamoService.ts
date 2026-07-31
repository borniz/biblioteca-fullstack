import axios from "axios";
import type { IPrestamos } from "../types/Prestamos";

const API_URL = "http://localhost:8080/libreria/prestamos";

export const crearPrestamos = async (
  usuarioId: number,
  ejemplarId: number,
  fechaPrestamo: string,
  fechaDevolucionPrevista?: string
): Promise<IPrestamos> => {

  const params = new URLSearchParams();

  params.append("usuarioId", usuarioId.toString());
  params.append("ejemplarId", ejemplarId.toString());
  params.append("fechaPrestamo", fechaPrestamo);

  if (fechaDevolucionPrevista) {
    params.append("fechaDevolucionPrevista", fechaDevolucionPrevista);
  }

  const respuesta = await axios.post<IPrestamos>(
    API_URL,
    null,
    {
      params
    }
  );

  return respuesta.data;
};


export const obtenerPrestamosPorUsuario = async (
  usuarioId: number
): Promise<IPrestamos[]> => {

  const respuesta = await axios.get<IPrestamos[]>(
    `${API_URL}/usuario/${usuarioId}`
  );

  return respuesta.data;
};


export const obtenerPrestamosPorLibro = async (
  libroId: number
): Promise<IPrestamos[]> => {

  const respuesta = await axios.get<IPrestamos[]>(
    `${API_URL}/libro/${libroId}`
  );

  return respuesta.data;
};


export const devolverPrestamos = async (
  prestamoId: number
): Promise<IPrestamos> => {

  const respuesta = await axios.put<IPrestamos>(
    `${API_URL}/${prestamoId}/devolver`
  );

  return respuesta.data;
};