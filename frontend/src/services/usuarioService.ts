import axios from "axios";
import type { Usuario } from "../types/Usuario";

const API_URL = "http://localhost:8080/libreria/usuarios";

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await axios.get<Usuario[]>(API_URL);

  return respuesta.data;
};

export const obtenerUsuarioId = async (usuarioID: number): Promise<Usuario> => {
  const respuesta = await axios.get<Usuario>(`${API_URL}/${usuarioID}`);
  return respuesta.data;
};

export const crearUsuario = async (
  usuario: Omit<Usuario, "id">,
): Promise<Usuario> => {
  const respuesta = await axios.post<Usuario>(API_URL, usuario);
  return respuesta.data;
};
export const actualizarUsuario = async(modUsuario:Omit<Usuario,"id">,usuarioId:number):Promise<Usuario>=>{
  const respuesta = await axios.put<Usuario>(`${API_URL}/${usuarioId}`,modUsuario)
  return respuesta.data
}

export const eliminarUsuario = async (usuarioId: number): Promise<void> => {
   await axios.delete(`${API_URL}/${usuarioId}`);
};
