package com.biblioteca.backend.exception;

public class EjemplarNoEncontradoException extends RuntimeException {

    public EjemplarNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}