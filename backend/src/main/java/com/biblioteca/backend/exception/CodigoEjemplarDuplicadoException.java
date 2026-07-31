package com.biblioteca.backend.exception;

public class CodigoEjemplarDuplicadoException extends RuntimeException {

    public CodigoEjemplarDuplicadoException(String mensaje) {
        super(mensaje);
    }
}