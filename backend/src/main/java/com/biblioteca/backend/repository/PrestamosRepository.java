package com.biblioteca.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biblioteca.backend.entity.Prestamo;
import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.entity.Ejemplar;
import com.biblioteca.backend.entity.EstadoPrestamo;

public interface PrestamosRepository extends JpaRepository<Prestamo, Long> {

        List<Prestamo> findByUsuario(Usuario usuario);

        List<Prestamo> findByEjemplar_Libro_Id(Long libroId);

        boolean existsByUsuarioAndEstadoPrestamo(
                        Usuario usuario,
                        EstadoPrestamo estadoPrestamo);

        boolean existsByEjemplarAndEstadoPrestamo(
                        Ejemplar ejemplar,
                        EstadoPrestamo estadoPrestamo);

        boolean existsByUsuarioAndEstadoPrestamoIn(
                        Usuario usuario,
                        List<EstadoPrestamo> estados);

        boolean existsByEjemplarAndEstadoPrestamoIn(
                        Ejemplar ejemplar,
                        List<EstadoPrestamo> estados);
}