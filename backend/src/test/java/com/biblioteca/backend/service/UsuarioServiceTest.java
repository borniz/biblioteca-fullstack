package com.biblioteca.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.exception.EmailDuplicadoException;
import com.biblioteca.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Yaro");
        usuario.setApellido("Perez");
        usuario.setEmail("yaro@gmail.com");
        usuario.setFechaNacimiento(LocalDate.of(1997, 7, 13));
    }

    @Test
    void debeCrearUsuarioCorrectamente() {

        when(usuarioRepository.existsByEmail(usuario.getEmail()))
                .thenReturn(false);

        when(usuarioRepository.save(usuario))
                .thenReturn(usuario);

        Usuario resultado = usuarioService.CrearUsuario(usuario);

        assertNotNull(resultado);
        assertEquals("Yaro", resultado.getNombre());
        assertEquals("yaro@gmail.com", resultado.getEmail());

        verify(usuarioRepository).save(usuario);
    }

    @Test
    void noDebePermitirEmailDuplicado() {

        when(usuarioRepository.existsByEmail(usuario.getEmail()))
                .thenReturn(true);

        assertThrows(
                EmailDuplicadoException.class,
                () -> usuarioService.CrearUsuario(usuario)
        );

        verify(usuarioRepository, never()).save(any());
    }
}