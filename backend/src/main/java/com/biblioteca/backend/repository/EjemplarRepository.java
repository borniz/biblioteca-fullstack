package com.biblioteca.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biblioteca.backend.entity.Ejemplar;

public interface EjemplarRepository extends JpaRepository<Ejemplar, Long> {
    boolean existsByCodigoEjemplar(String codigoEjemplar);
    List<Ejemplar> findByLibroIsbn(String isbn);

     @Query("""
        SELECT e
        FROM Ejemplar e
        WHERE e.libro.isbn = :isbn
        AND NOT EXISTS (
            SELECT p
            FROM Prestamo p
            WHERE p.ejemplar = e
            AND p.estadoPrestamo = com.biblioteca.backend.entity.EstadoPrestamo.ACTIVO
        )
    """)
    List<Ejemplar> findDisponiblesPorIsbn(@Param("isbn") String isbn);
}
