export type EstadoPrestamo=
    "ACTIVO"|
    "VENCIDO"|
    "DEVUELTO";

export interface IPrestamos{
    id:number;
    fechaPrestamo:string;
    fechaDevolucionPrevista:string;
    fechaDevolucionReal:string | null;
    estadoPrestamo:EstadoPrestamo;
}