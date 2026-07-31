package com.biblioteca.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.biblioteca.backend.entity.Ejemplar;
import com.biblioteca.backend.entity.Libro;
import com.biblioteca.backend.exception.CodigoEjemplarDuplicadoException;
import com.biblioteca.backend.exception.EjemplarNoEncontradoException;
import com.biblioteca.backend.exception.LibroNoEncontradoException;
import com.biblioteca.backend.repository.EjemplarRepository;
import com.biblioteca.backend.repository.LibroRepository;

@Service
public class EjemplarService {

    private final EjemplarRepository ejemplarRepository;
    private final LibroRepository libroRepository;

    public EjemplarService(
            EjemplarRepository ejemplarRepository,
            LibroRepository libroRepository) {
        this.ejemplarRepository = ejemplarRepository;
        this.libroRepository = libroRepository;
    }

    public Ejemplar crearEjemplar(
            String codigoEjemplar,
            Long libroId) {

        if (ejemplarRepository.existsByCodigoEjemplar(codigoEjemplar)) {
            throw new CodigoEjemplarDuplicadoException(
                    "El código del ejemplar ya está registrado");
        }

        Libro libro = libroRepository.findById(libroId)
                .orElseThrow(() -> new LibroNoEncontradoException(
                        "Libro no encontrado con id: " + libroId));

        Ejemplar ejemplar = new Ejemplar();

        ejemplar.setCodigoEjemplar(codigoEjemplar);
        ejemplar.setLibro(libro);

        return ejemplarRepository.save(ejemplar);
    }

    public List<Ejemplar> obtenerEjemplares() {
        return ejemplarRepository.findAll();
    }

    public Ejemplar buscarEjemplarPorId(Long id) {

        return ejemplarRepository.findById(id)
                .orElseThrow(() -> new EjemplarNoEncontradoException(
                        "Ejemplar no encontrado con id: " + id));
    }

    public void eliminarEjemplar(Long id) {

        Ejemplar ejemplar = buscarEjemplarPorId(id);

        ejemplarRepository.delete(ejemplar);
    }

    public List<Ejemplar> obtenerDisponiblesPorIsbn(String isbn) {
        return ejemplarRepository.findDisponiblesPorIsbn(isbn);
    }
}