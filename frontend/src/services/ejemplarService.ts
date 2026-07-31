
import axios from "axios";
import type { IEjemplar } from "../types/Ejemplar";

const API_URL = "http://localhost:8080/libreria/ejemplar";

export const obtenerEjemplares = async (): Promise<IEjemplar[]> => {
  const respuesta = await axios.get<IEjemplar[]>(API_URL);

  return respuesta.data;
};

export const crearEjemplar = async (
  codigoEjemplar: string,
  libroId: number
): Promise<IEjemplar> => {
  const respuesta = await axios.post<IEjemplar>(
    API_URL,
    null,
    {
      params: {
        codigoEjemplar,
        libroId,
      },
    }
  );

  return respuesta.data;
};

export const obtenerEjemplarId = async (
  ejemplarId: number
): Promise<IEjemplar> => {
  const respuesta = await axios.get<IEjemplar>(
    `${API_URL}/${ejemplarId}`
  );

  return respuesta.data;
};

export const eliminarEjemplar = async (
  ejemplarId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${ejemplarId}`);
};

export const obtenerEjemplaresDisponiblesPorIsbn = async (
  isbn: string
): Promise<IEjemplar[]> => {
  const respuesta = await axios.get<IEjemplar[]>(
    `${API_URL}/disponibles/isbn/${isbn}`
  );

  return respuesta.data;
};
