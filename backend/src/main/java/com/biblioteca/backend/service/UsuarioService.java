package com.biblioteca.backend.service;

import com.biblioteca.backend.exception.EmailDuplicadoException;
import com.biblioteca.backend.exception.UsuarioNoEncontradoException;

import java.util.List;

import org.springframework.stereotype.Service;

import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> ObtenerUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario CrearUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new EmailDuplicadoException("El email ya está registrado");
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario BuscarUsuarioId(Long usuario_id) {
        return usuarioRepository.findById(usuario_id)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

    }

    public Usuario ActualizarUsuario(Usuario nuevoUsuario, Long usuario_id) {

        Usuario usuario = BuscarUsuarioId(usuario_id);
        if (usuarioRepository.existsByEmailAndIdNot(
                nuevoUsuario.getEmail(),
                usuario_id)) {
            throw new EmailDuplicadoException("El email ya está registrado por otro usuario");
        }
        usuario.setNombre(nuevoUsuario.getNombre());
        usuario.setApellido(nuevoUsuario.getApellido());
        usuario.setEmail(nuevoUsuario.getEmail());
        usuario.setFechaNacimiento(nuevoUsuario.getFechaNacimiento());
        return usuarioRepository.save(usuario);

    }

    public void eliminarUsuario(Long usuario_id) {
        Usuario usuario = BuscarUsuarioId(usuario_id);
        usuarioRepository.delete(usuario);
    }

}
