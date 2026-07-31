# API REST - Sistema de Gestión de Biblioteca

API REST desarrollada con Spring Boot para gestionar usuarios, libros, ejemplares y préstamos de una biblioteca.

## Tecnologías

* Java 17
* Spring Boot 3.5.4
* Spring Data JPA
* Hibernate
* PostgreSQL 17
* Maven
* Docker
* Docker Compose
* Swagger / OpenAPI
* JUnit 5
* Mockito

## Funcionalidades

### Usuarios

* Crear usuario
* Consultar todos los usuarios
* Buscar usuario por ID
* Actualizar usuario
* Eliminar usuario
* Validación de email único
* Validación de datos obligatorios

### Libros

* Crear libros
* Consultar libros
* Buscar libro por ID
* Actualizar libros
* Eliminar libros
* Gestión de ejemplares asociados

### Ejemplares

* Crear ejemplares de un libro
* Consultar ejemplares
* Buscar ejemplar por ID
* Eliminar ejemplares
* Consultar ejemplares disponibles por ISBN

### Préstamos

* Registrar préstamos
* Consultar préstamos de un usuario
* Consultar préstamos relacionados con un libro
* Devolver préstamos
* Controlar que un usuario no tenga más de un préstamo activo
* Controlar que un ejemplar no pueda estar prestado a dos usuarios simultáneamente
* Determinar automáticamente si un préstamo está vencido

## Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Capas

**Controller**

Expone los endpoints REST.

**Service**

Contiene las reglas de negocio y validaciones.

**Repository**

Gestiona el acceso a la base de datos mediante Spring Data JPA.

**Entity**

Representa las entidades de la base de datos.

## Base de datos

PostgreSQL se ejecuta mediante Docker.

La base de datos utiliza un volumen persistente para evitar la pérdida de información cuando los contenedores se detienen.

## Variables de entorno

La aplicación utiliza variables de entorno para configurar la conexión con PostgreSQL:

```env
DB_URI=jdbc:postgresql://postgres:5432/biblioteca
DB_USER=biblioteca_user
DB_PASSWORD=biblioteca_password
DB_DRIVER=org.postgresql.Driver
```

Docker Compose proporciona estas variables al contenedor de Spring Boot.

Las credenciales y valores utilizados en el entorno de ejecución pueden modificarse mediante el archivo `.env`.

## Ejecución con Docker

### Requisitos

* Docker Desktop
* Git

### Configuración

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias para PostgreSQL y los puertos de exposición.

Ejemplo:

```env
POSTGRES_DB=biblioteca
POSTGRES_USER=biblioteca_user
POSTGRES_PASSWORD=biblioteca_password
DB_PORT=5432
BACKEND_PORT=8080
```

### Levantar el proyecto

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar los contenedores:

```bash
docker compose ps
```

Deben encontrarse activos los servicios de PostgreSQL y Spring Boot.

### Detener el proyecto

```bash
docker compose down
```

El volumen de PostgreSQL se mantiene y los datos no se eliminan.

## Swagger / OpenAPI

Una vez iniciado el proyecto, la documentación interactiva está disponible en:

```text
http://localhost:8080/swagger-ui/index.html
```

Desde Swagger se pueden consultar y probar los endpoints de la API.

## Endpoints principales

### Usuarios

```text
POST   /libreria/usuarios
GET    /libreria/usuarios
GET    /libreria/usuarios/{id}
PUT    /libreria/usuarios/{id}
DELETE /libreria/usuarios/{id}
```

### Ejemplares

```text
POST   /libreria/ejemplar
GET    /libreria/ejemplar
GET    /libreria/ejemplar/{id}
DELETE /libreria/ejemplar/{id}
GET    /libreria/ejemplar/disponibles/isbn/{isbn}
```

### Préstamos

```text
POST /libreria/prestamos
GET  /libreria/prestamos/usuario/{usuarioId}
GET  /libreria/prestamos/libro/{libroId}
PUT  /libreria/prestamos/{prestamoId}/devolver
```

## Pruebas

El proyecto incluye pruebas unitarias utilizando JUnit 5 y Mockito.

Para ejecutar las pruebas:

```bash
mvn test
```

Las pruebas cubren:

* Creación de usuarios
* Validación de email duplicado
* Creación de préstamos
* Restricción de préstamos activos por usuario
* Restricción de ejemplares ya prestados
* Devolución de préstamos

## Backup de base de datos

El proyecto incluye un backup de PostgreSQL con datos de prueba.

El archivo se encuentra en:

```text
database/biblioteca.dump
```

El backup contiene la estructura y los datos necesarios para realizar pruebas de la API.

El archivo fue generado mediante `pg_dump` en formato custom y puede ser restaurado utilizando `pg_restore`.

Ejemplo:

```bash
pg_restore -U biblioteca_user -d biblioteca biblioteca.dump
```

## Estructura del proyecto

```text
backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/biblioteca/backend/
│   │   │       ├── controller/
│   │   │       ├── entity/
│   │   │       ├── exception/
│   │   │       ├── repository/
│   │   │       └── service/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── database/
│   └── biblioteca.dump
│
├── pom.xml
└── Dockerfile
```

## Autor

Proyecto desarrollado como prueba técnica de desarrollo Full Stack.


