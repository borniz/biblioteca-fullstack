package com.biblioteca.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.biblioteca.backend.entity.Ejemplar;
import com.biblioteca.backend.entity.EstadoPrestamo;
import com.biblioteca.backend.entity.Prestamo;
import com.biblioteca.backend.entity.Usuario;
import com.biblioteca.backend.exception.PrestamoNoPermitidoException;
import com.biblioteca.backend.repository.EjemplarRepository;
import com.biblioteca.backend.repository.PrestamosRepository;
import com.biblioteca.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class PrestamoServiceTest {

    @Mock
    private PrestamosRepository prestamosRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EjemplarRepository ejemplarRepository;

    @InjectMocks
    private PrestamoService prestamoService;

    private Usuario usuario;
    private Ejemplar ejemplar;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Yaro");
        usuario.setApellido("Perez");
        usuario.setEmail("yaro@gmail.com");

        ejemplar = new Ejemplar();
        ejemplar.setId(1L);
        ejemplar.setCodigoEjemplar("LIB-001");
    }

    @Test
    void debeRegistrarPrestamoCorrectamente() {
        when(usuarioRepository.findById(1L))
                .thenReturn(java.util.Optional.of(usuario));

        when(ejemplarRepository.findById(1L))
                .thenReturn(java.util.Optional.of(ejemplar));

        // Corregido: Coincide con la firma 'In' de tu PrestamoService
        when(prestamosRepository.existsByUsuarioAndEstadoPrestamoIn(
                usuario, List.of(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO)))
                .thenReturn(false);

        // Corregido: Coincide con la firma 'In' de tu PrestamoService
        when(prestamosRepository.existsByEjemplarAndEstadoPrestamoIn(
                ejemplar, List.of(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO)))
                .thenReturn(false);

        when(prestamosRepository.save(any(Prestamo.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Prestamo resultado = prestamoService.registrarPrestamo(
                1L,
                1L,
                LocalDate.now(),
                LocalDate.now().plusDays(7)
        );

        assertNotNull(resultado);
        assertEquals(usuario, resultado.getUsuario());
        assertEquals(ejemplar, resultado.getEjemplar());
        assertEquals(EstadoPrestamo.ACTIVO, resultado.getEstadoPrestamo());

        verify(prestamosRepository).save(any(Prestamo.class));
    }

    @Test
    void noDebePermitirPrestamoSiUsuarioYaTienePrestamoActivo() {
        when(usuarioRepository.findById(1L))
                .thenReturn(java.util.Optional.of(usuario));

        when(ejemplarRepository.findById(1L))
                .thenReturn(java.util.Optional.of(ejemplar));

        // Corregido: Cambiado al método 'In' devolviendo 'true' para forzar la excepción
        when(prestamosRepository.existsByUsuarioAndEstadoPrestamoIn(
                usuario, List.of(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO)))
                .thenReturn(true);

        assertThrows(
                PrestamoNoPermitidoException.class,
                () -> prestamoService.registrarPrestamo(
                        1L,
                        1L,
                        LocalDate.now(),
                        LocalDate.now().plusDays(7)
                )
        );

        verify(prestamosRepository, never()).save(any());
    }

    @Test
    void noDebePermitirPrestarEjemplarYaPrestado() {
        when(usuarioRepository.findById(1L))
                .thenReturn(java.util.Optional.of(usuario));

        when(ejemplarRepository.findById(1L))
                .thenReturn(java.util.Optional.of(ejemplar));

        when(prestamosRepository.existsByUsuarioAndEstadoPrestamoIn(
                usuario, List.of(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO)))
                .thenReturn(false);

        // Corregido: Cambiado al método 'In' devolviendo 'true' para forzar la excepción
        when(prestamosRepository.existsByEjemplarAndEstadoPrestamoIn(
                ejemplar, List.of(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO)))
                .thenReturn(true);

        assertThrows(
                PrestamoNoPermitidoException.class,
                () -> prestamoService.registrarPrestamo(
                        1L,
                        1L,
                        LocalDate.now(),
                        LocalDate.now().plusDays(7)
                )
        );

        verify(prestamosRepository, never()).save(any());
    }

    @Test
    void debeDevolverPrestamoCorrectamente() {
        Prestamo prestamo = new Prestamo();
        prestamo.setId(1L);
        prestamo.setEstadoPrestamo(EstadoPrestamo.ACTIVO);

        when(prestamosRepository.findById(1L))
                .thenReturn(java.util.Optional.of(prestamo));

        when(prestamosRepository.save(prestamo))
                .thenReturn(prestamo);

        Prestamo resultado = prestamoService.devolverPrestamo(1L);

        assertEquals(EstadoPrestamo.DEVUELTO, resultado.getEstadoPrestamo());
        verify(prestamosRepository).save(prestamo);
    }
}
