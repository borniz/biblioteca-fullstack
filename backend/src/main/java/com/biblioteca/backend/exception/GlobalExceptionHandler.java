package com.biblioteca.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(EmailDuplicadoException.class)
        public ResponseEntity<Map<String, String>> manejarEmailDuplicado(
                        EmailDuplicadoException exception) {

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(UsuarioNoEncontradoException.class)
        public ResponseEntity<Map<String, String>> manejarUsuarioNoEncontrado(
                        UsuarioNoEncontradoException exception) {

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(LibroNoEncontradoException.class)
        public ResponseEntity<Map<String, String>> manejarLibroNoEncontrado(
                        LibroNoEncontradoException exception) {

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(IsbnDuplicadoException.class)
        public ResponseEntity<Map<String, String>> manejarIsbnDuplicado(
                        IsbnDuplicadoException exception) {

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(CodigoEjemplarDuplicadoException.class)
        public ResponseEntity<Map<String, String>> manejarCodigoEjemplarDuplicado(
                        CodigoEjemplarDuplicadoException exception) {

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(EjemplarNoEncontradoException.class)
        public ResponseEntity<Map<String, String>> manejarEjemplarNoEncontrado(
                        EjemplarNoEncontradoException exception) {

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(PrestamoNoPermitidoException.class)
        public ResponseEntity<Map<String, String>> manejarPrestamoNoPermitido(
                        PrestamoNoPermitidoException exception) {

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(Map.of(
                                                "error", exception.getMessage()));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> manejarValidaciones(
                        MethodArgumentNotValidException ex) {

                Map<String, String> campos = new HashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> campos.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                Map<String, Object> respuesta = new HashMap<>();

                respuesta.put("error", "Datos inválidos");
                respuesta.put("campos", campos);

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(respuesta);
        }

        
}
