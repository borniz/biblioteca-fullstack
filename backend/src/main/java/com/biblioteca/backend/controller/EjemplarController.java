package com.biblioteca.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.backend.entity.Ejemplar;
import com.biblioteca.backend.service.EjemplarService;

@RestController
@RequestMapping("/libreria/ejemplar")
public class EjemplarController {

    private final EjemplarService ejemplarservice;

    public EjemplarController(EjemplarService ejemplarService) {
        this.ejemplarservice = ejemplarService;
    }

    @PostMapping
    public ResponseEntity<Ejemplar> CrearEjemplar(@RequestParam String codigoEjemplar, @RequestParam Long libroId) {
        Ejemplar nuevoEjemplar = ejemplarservice.crearEjemplar(codigoEjemplar, libroId);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEjemplar);
    }

    @GetMapping
    public ResponseEntity<List<Ejemplar>> MostarEjemplares() {
        return ResponseEntity.ok(ejemplarservice.obtenerEjemplares());
    }

    @GetMapping("/{EjemplarId}")
    public ResponseEntity<Ejemplar> BuscarEjemplarId(@PathVariable Long EjemplarId) {
        return ResponseEntity.ok(ejemplarservice.buscarEjemplarPorId(EjemplarId));
    }

    @DeleteMapping("/{EjemplarId}")
    public ResponseEntity<Void> EliminarEjemplar(@PathVariable Long EjemplarId) {
        ejemplarservice.eliminarEjemplar(EjemplarId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disponibles/isbn/{isbn}")
    public ResponseEntity<List<Ejemplar>> obtenerDisponiblesPorIsbn(
            @PathVariable String isbn) {
        return ResponseEntity.ok(
                ejemplarservice.obtenerDisponiblesPorIsbn(isbn));
    }
}
