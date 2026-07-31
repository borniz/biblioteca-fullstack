package com.biblioteca.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.backend.entity.Libro;
import com.biblioteca.backend.service.LibroService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/libreria/libros")
public class LibroController {

    private final LibroService libroService;

    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    @GetMapping
    public ResponseEntity<List<Libro>> ObtenerLibros() {
        return ResponseEntity.ok(libroService.obtenerLibros());
    }

    @PostMapping
    public ResponseEntity<Libro> CrearLibro(@RequestBody @Valid Libro nuevoLibro) {
        return ResponseEntity.ok(libroService.crearLibro(nuevoLibro));
    }

    @GetMapping("/{libroId}")
    public ResponseEntity<Libro> BuscarLibroPorId(@PathVariable Long libroId) {
        return ResponseEntity.ok(libroService.buscarLibroPorId(libroId));
    }

    @PutMapping("/{libroId}")
    public ResponseEntity<Libro> ModificarLibro(@RequestBody @Valid Libro modificarLibro, @PathVariable Long libroId) {
        return ResponseEntity.ok(libroService.actualizarLibro(libroId, modificarLibro));
    }

    @DeleteMapping("/{libroId}")
    public ResponseEntity<Void> EliminarLibro(@PathVariable Long libroId) {
        libroService.eliminarLibro(libroId);
        return ResponseEntity.noContent().build();
    }
}
