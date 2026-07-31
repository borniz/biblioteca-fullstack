package com.biblioteca.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/libreria/usuarios")
public class UsuarioControlle {

    private final UsuarioService usuarioService;

    public UsuarioControlle(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody @Valid Usuario usuario) {
        Usuario nuevUsuario = usuarioService.CrearUsuario(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevUsuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        return ResponseEntity.ok(usuarioService.ObtenerUsuarios());
    }

    @GetMapping("/{usuariId}")
    public ResponseEntity<Usuario> BuscarUsuarioId(@PathVariable Long usuariId) {
        return ResponseEntity.ok(usuarioService.BuscarUsuarioId(usuariId));
    }

    @PutMapping("/{usuariId}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @RequestBody @Valid Usuario actualizarUsuario,
            @PathVariable Long usuariId) {
        return ResponseEntity.ok(usuarioService.ActualizarUsuario(actualizarUsuario, usuariId));
    }

    @DeleteMapping("/{usuariId}")
    public ResponseEntity<Void> EliminarUsuario(@PathVariable Long usuariId) {
        usuarioService.eliminarUsuario(usuariId);
        return ResponseEntity.noContent().build();
    }

}
