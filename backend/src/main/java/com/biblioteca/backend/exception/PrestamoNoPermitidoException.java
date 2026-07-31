package com.biblioteca.backend.exception;

public class PrestamoNoPermitidoException extends RuntimeException {

    public PrestamoNoPermitidoException(String mensaje) {
        super(mensaje);
    }
}