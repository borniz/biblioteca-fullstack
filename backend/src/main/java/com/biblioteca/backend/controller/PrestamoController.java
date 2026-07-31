package com.biblioteca.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.backend.entity.Prestamo;
import com.biblioteca.backend.service.PrestamoService;

@RestController
@RequestMapping("/libreria/prestamos")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Prestamo>> BusquedaUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(prestamoService.obtenerPrestamosPorUsuario(usuarioId));
    }

    @GetMapping("/libro/{libroId}")
    public ResponseEntity<List<Prestamo>> BuscarLibroPorId(@PathVariable Long libroId) {
        return ResponseEntity.ok(prestamoService.obtenerPrestamosPorLibro(libroId));
    }

    @PostMapping("")
    public ResponseEntity<Prestamo> CrearPrestamo(
            @RequestParam Long usuarioId,
            @RequestParam Long ejemplarId,
            @RequestParam LocalDate fechaPrestamo,
            @RequestParam LocalDate fechaDevolucionPrevista) {
        Prestamo prestamo = prestamoService.registrarPrestamo(
                usuarioId,
                ejemplarId,
                fechaPrestamo,
                fechaDevolucionPrevista);

        return ResponseEntity.status(HttpStatus.CREATED).body(prestamo);
    }

    @PutMapping("/{prestamoId}/devolver")
    public ResponseEntity<Prestamo> devolverPrestamo(
            @PathVariable Long prestamoId) {

        return ResponseEntity.ok(
                prestamoService.devolverPrestamo(prestamoId));
    }
}
