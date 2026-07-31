package com.biblioteca.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.biblioteca.backend.entity.Libro;
import com.biblioteca.backend.exception.EmailDuplicadoException;
import com.biblioteca.backend.exception.IsbnDuplicadoException;
import com.biblioteca.backend.exception.LibroNoEncontradoException;
import com.biblioteca.backend.repository.LibroRepository;

@Service
public class LibroService {

    private final LibroRepository libroRepository;

    public LibroService(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    public List<Libro> obtenerLibros() {
        return libroRepository.findAll();
    }

    public Libro crearLibro(Libro libro) {

        if (libroRepository.existsByIsbn(libro.getIsbn())) {
            throw new EmailDuplicadoException(
                    "El ISBN ya está registrado");
        }

        return libroRepository.save(libro);
    }

    public Libro buscarLibroPorId(Long id) {

        return libroRepository.findById(id)
                .orElseThrow(() -> new LibroNoEncontradoException(
                        "Libro no encontrado con id: " + id));
    }

    public Libro actualizarLibro(Long id, Libro nuevoLibro) {

        Libro libro = buscarLibroPorId(id);

        if (libroRepository.existsByIsbnAndIdNot(
                nuevoLibro.getIsbn(),
                id)) {
            throw new IsbnDuplicadoException(
                    "El ISBN ya está registrado por otro libro");
        }

        libro.setTitulo(nuevoLibro.getTitulo());
        libro.setIsbn(nuevoLibro.getIsbn());
        libro.setEdicion(nuevoLibro.getEdicion());
        libro.setFechaPublicacion(nuevoLibro.getFechaPublicacion());
        libro.setAutor(nuevoLibro.getAutor());

        return libroRepository.save(libro);
    }

    public void eliminarLibro(Long id) {

        Libro libro = buscarLibroPorId(id);

        libroRepository.delete(libro);
    }
}