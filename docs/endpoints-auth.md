# Endpoints de Consulta de Reservas — AndesTur

## Formato general de respuestas

Todas las respuestas deben seguir el formato que usa actualmente el backend:

```json
{
  "success": true,
  "data": { ... }
}
```

En caso de error:

```json
{
  "success": false,
  "message": "Mensaje de error descriptivo",
  "errors": [{ "field": "email", "message": "El correo es obligatorio" }]
}
```

> **Nota:** Ya no se usa autenticación JWT. Los endpoints de auth (`/api/customers/auth/*`) fueron eliminados del frontend.

---

## 1. Consultar reservas por email + cédula

**`POST /api/reservations/query`**

Busca todas las reservas que coincidan con el correo electrónico y número de cédula/DNI proporcionados.

No requiere autenticación. Cualquier usuario puede consultar sus reservas con estos datos.

### Request Body

```json
{
  "email": "juan@ejemplo.com",
  "dni": "12345678"
}
```

### Reglas de validación

| Campo | Regla |
|---|---|
| `email` | Obligatorio, formato email válido |
| `dni` | Obligatorio, string, mínimo 5 caracteres |

### Response (200 — con reservas)

```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id_reservation": 123,
        "pay_state": "pending",
        "packageName": "Mérida Clásica",
        "id_package": 1,
        "date": "2026-06-15",
        "people": "2",
        "dni": "12345678",
        "name": "Juan",
        "lastname": "Pérez",
        "email": "juan@ejemplo.com",
        "phone_number": "+584121234567",
        "created_at": "2026-06-01T12:00:00.000Z",
        "updated_at": "2026-06-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Response (200 — sin reservas)

```json
{
  "success": true,
  "data": {
    "reservations": []
  }
}
```

### Response (400 — validación)

```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    { "field": "email", "message": "El correo es obligatorio" },
    { "field": "dni", "message": "La cédula es obligatoria" }
  ]
}
```

---

## 2. Pre-reserva (sin cambios)

**`POST /api/reservations/pre-reservation`**

> Endpoint existente. No requiere cambios.

---

## 3. Obtener detalle de reserva (sin cambios)

**`GET /api/reservations/:id`**

> Endpoint existente. Se usa para el polling de notificaciones en el frontend.

---

## 4. Listar paquetes (sin cambios)

**`GET /api/packages`**

> Endpoint existente. Devuelve la lista de paquetes turísticos disponibles.

---

## Resumen de cambios en el backend

### Eliminar (ya no se usan desde el frontend)

| Endpoint | Método |
|---|---|
| `/api/customers/auth/login` | POST |
| `/api/customers/auth/register` | POST |
| `/api/customers/auth/me` | GET |
| `/api/customers/auth/reservations` | GET |

### Agregar (nuevo)

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/reservations/query` | POST | Busca reservas por email + cédula. No requiere autenticación. |

### Consideraciones de seguridad

- El endpoint `POST /api/reservations/query` debe validar que **ambos campos** (email y dni) coincidan con la reserva para evitar que alguien consulte reservas de otros solo con el email.
- Se recomienda aplicar **rate limiting** a este endpoint (ej. máx 10 solicitudes por minuto por IP) para prevenir fuerza bruta.
- No exponer información sensible del operador turístico en la respuesta.
