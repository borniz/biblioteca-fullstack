package com.biblioteca.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.biblioteca.backend.entity.Ejemplar;
import com.biblioteca.backend.entity.EstadoPrestamo;
import com.biblioteca.backend.entity.Prestamo;
import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.exception.EjemplarNoEncontradoException;
import com.biblioteca.backend.exception.PrestamoNoPermitidoException;
import com.biblioteca.backend.exception.UsuarioNoEncontradoException;
import com.biblioteca.backend.repository.EjemplarRepository;
import com.biblioteca.backend.repository.PrestamosRepository;
import com.biblioteca.backend.repository.UsuarioRepository;

@Service
public class PrestamoService {

        private final PrestamosRepository PrestamosRepository;
        private final UsuarioRepository usuarioRepository;
        private final EjemplarRepository ejemplarRepository;

        public PrestamoService(
                        PrestamosRepository PrestamosRepository,
                        UsuarioRepository usuarioRepository,
                        EjemplarRepository ejemplarRepository) {
                this.PrestamosRepository = PrestamosRepository;
                this.usuarioRepository = usuarioRepository;
                this.ejemplarRepository = ejemplarRepository;
        }

        public Prestamo registrarPrestamo(
                        Long usuarioId,
                        Long ejemplarId,
                        LocalDate fechaPrestamo,
                        LocalDate fechaDevolucionPrevista) {

                Usuario usuario = usuarioRepository.findById(usuarioId)
                                .orElseThrow(() -> new UsuarioNoEncontradoException(
                                                "Usuario no encontrado con id: " + usuarioId));

                Ejemplar ejemplar = ejemplarRepository.findById(ejemplarId)
                                .orElseThrow(() -> new EjemplarNoEncontradoException(
                                                "Ejemplar no encontrado con id: " + ejemplarId));

                boolean usuarioTienePrestamoActivo = PrestamosRepository.existsByUsuarioAndEstadoPrestamoIn(
                                usuario,
                                List.of(
                                                EstadoPrestamo.ACTIVO,
                                                EstadoPrestamo.VENCIDO));

                if (usuarioTienePrestamoActivo) {
                        throw new PrestamoNoPermitidoException(
                                        "El usuario ya tiene un préstamo activo");
                }

                boolean ejemplarEstaPrestado = PrestamosRepository.existsByEjemplarAndEstadoPrestamoIn(
                                ejemplar,
                                List.of(
                                                EstadoPrestamo.ACTIVO,
                                                EstadoPrestamo.VENCIDO));
                if (ejemplarEstaPrestado) {
                        throw new PrestamoNoPermitidoException(
                                        "El ejemplar ya se encuentra prestado");
                }

                Prestamo prestamo = new Prestamo();

                prestamo.setUsuario(usuario);
                prestamo.setEjemplar(ejemplar);
                prestamo.setFechaPrestamo(fechaPrestamo);
                prestamo.setfechaDevolucionPrevista(fechaDevolucionPrevista);
                prestamo.setfechaDevolucionReal(null);
                prestamo.setEstadoPrestamo(EstadoPrestamo.ACTIVO);

                return PrestamosRepository.save(prestamo);
        }

        public List<Prestamo> obtenerPrestamosPorUsuario(Long usuarioId) {

                Usuario usuario = usuarioRepository.findById(usuarioId)
                                .orElseThrow(() -> new UsuarioNoEncontradoException(
                                                "Usuario no encontrado con id: " + usuarioId));

                List<Prestamo> prestamos = PrestamosRepository.findByUsuario(usuario);

                prestamos.forEach(this::actualizarEstadoPorFecha);

                return prestamos;
        }

        public List<Prestamo> obtenerPrestamosPorLibro(Long libroId) {

                List<Prestamo> prestamos = PrestamosRepository.findByEjemplar_Libro_Id(libroId);

                prestamos.forEach(this::actualizarEstadoPorFecha);

                return prestamos;
        }

        private void actualizarEstadoPorFecha(Prestamo prestamo) {

                if (prestamo.getEstadoPrestamo() == EstadoPrestamo.DEVUELTO) {
                        return;
                }

                if (LocalDate.now().isAfter(prestamo.getfechaDevolucionPrevista())) {
                        prestamo.setEstadoPrestamo(EstadoPrestamo.VENCIDO);
                        PrestamosRepository.save(prestamo);
                }
        }

        public Prestamo devolverPrestamo(Long prestamoId) {

                Prestamo prestamo = PrestamosRepository.findById(prestamoId)
                                .orElseThrow(() -> new PrestamoNoPermitidoException(
                                                "Préstamo no encontrado con id: " + prestamoId));

                if (prestamo.getEstadoPrestamo() == EstadoPrestamo.DEVUELTO) {
                        throw new PrestamoNoPermitidoException(
                                        "El préstamo ya fue devuelto");
                }

                prestamo.setfechaDevolucionReal(LocalDate.now());
                prestamo.setEstadoPrestamo(EstadoPrestamo.DEVUELTO);

                return PrestamosRepository.save(prestamo);
        }

        @Scheduled(fixedRate = 60000)
        public void actualizarEstadosVencidos() {
                System.out.println("===== EJECUTANDO REVISIÓN DE PRÉSTAMOS =====");
                List<Prestamo> prestamos = PrestamosRepository.findAll();

                for (Prestamo prestamo : prestamos) {

                        if (prestamo.getEstadoPrestamo() == EstadoPrestamo.ACTIVO
                                        && LocalDate.now().isAfter(
                                                        prestamo.getfechaDevolucionPrevista())) {

                                prestamo.setEstadoPrestamo(EstadoPrestamo.VENCIDO);
                        }
                }

                PrestamosRepository.saveAll(prestamos);
        }
}