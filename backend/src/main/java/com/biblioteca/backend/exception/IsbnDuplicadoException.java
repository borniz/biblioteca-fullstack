package com.biblioteca.backend.exception;

public class IsbnDuplicadoException extends RuntimeException {

    public IsbnDuplicadoException(String mensaje) {
        super(mensaje);
    }
}
