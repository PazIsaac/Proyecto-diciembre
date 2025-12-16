# 🐾 VetCare Backend API

Backend completo para sistema de veterinaria con Node.js, Express, MySQL y JWT.

## 🚀 Características

- ✅ **Autenticación JWT** con roles (admin, vendedor, cliente)
- ✅ **Base de datos MySQL** con Sequelize ORM
- ✅ **Validación de datos** con express-validator
- ✅ **Envío de emails** con Nodemailer
- ✅ **Seguridad** con Helmet y CORS
- ✅ **Gestión de usuarios** (CRUD completo)
- ✅ **Gestión de productos** con alertas de stock bajo
- ✅ **Verificación de email** y recuperación de contraseña
- ✅ **Middleware de autorización** por roles
- ✅ **API RESTful** bien estructurada

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
cd Server
npm install
```

### 2. Configurar MySQL

Crear base de datos en MySQL:

```sql
CREATE DATABASE veterinaria_db;
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.sample .env
```

Editar `.env` con tus configuraciones:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=veterinaria_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_gmail

# Admin por defecto
ADMIN_EMAIL=admin@vetcare.com
ADMIN_PASSWORD=Admin123!
```

### 4. Ejecutar migraciones

```bash
npm run migrate
```

### 5. Iniciar servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación de la API

### 🔐 Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "contraseña": "MiPassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "contraseña": "MiPassword123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "rol": "cliente",
    "verificado": true
  }
}
```

#### Verificar Email
```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Recuperar Contraseña
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "juan@email.com"
}
```

#### Restablecer Contraseña
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "contraseña": "NuevaPassword123"
}
```

### 👥 Gestión de Usuarios (Solo Admin)

#### Listar Usuarios
```http
GET /api/users?page=1&limit=10&search=juan&rol=cliente
Authorization: Bearer {token}
```

#### Obtener Usuario
```http
GET /api/users/1
Authorization: Bearer {token}
```

#### Actualizar Usuario
```http
PUT /api/users/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "rol": "vendedor",
  "verificado": true
}
```

#### Eliminar Usuario
```http
DELETE /api/users/1
Authorization: Bearer {token}
```

#### Estadísticas de Usuarios
```http
GET /api/users/stats
Authorization: Bearer {token}
```

### 📦 Gestión de Productos

#### Listar Productos (Público)
```http
GET /api/products?page=1&limit=10&search=vacuna&categoria=medicamentos&lowStock=true
```

#### Obtener Producto (Público)
```http
GET /api/products/1
```

#### Crear Producto (Admin/Vendedor)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Vacuna Triple",
  "categoria": "medicamentos",
  "precio": 35.50,
  "stock": 25,
  "descripcion": "Vacuna triple para perros",
  "stockMinimo": 5
}
```

#### Actualizar Producto (Admin/Vendedor)
```http
PUT /api/products/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "precio": 40.00,
  "stock": 30
}
```

#### Eliminar Producto (Admin/Vendedor)
```http
DELETE /api/products/1
Authorization: Bearer {token}
```

#### Actualizar Stock (Admin/Vendedor)
```http
PATCH /api/products/1/stock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 10,
  "operation": "add"  // o "subtract"
}
```

#### Productos con Stock Bajo (Admin/Vendedor)
```http
GET /api/products/reports/low-stock
Authorization: Bearer {token}
```

#### Estadísticas de Productos (Admin/Vendedor)
```http
GET /api/products/reports/stats
Authorization: Bearer {token}
```

## 🔒 Roles y Permisos

### Cliente
- Registro y login
- Ver productos (solo lectura)

### Vendedor
- Todo lo de Cliente +
- Gestión completa de productos
- Ver reportes de productos

### Admin
- Todo lo de Vendedor +
- Gestión completa de usuarios
- Acceso a todas las estadísticas

## 📧 Configuración de Email

### Gmail App Password

1. Activar verificación en 2 pasos en tu cuenta Gmail
2. Generar App Password:
   - Ve a Configuración de cuenta Google
   - Seguridad → Verificación en 2 pasos
   - Contraseñas de aplicaciones
   - Generar nueva contraseña
3. Usar esa contraseña en `EMAIL_PASS`

## 🗄️ Estructura de Base de Datos

### Tabla: usuarios
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(100), NOT NULL)
- email (VARCHAR(150), UNIQUE, NOT NULL)
- contraseña (VARCHAR(255), NOT NULL)
- rol (ENUM: 'admin', 'vendedor', 'cliente')
- verificado (BOOLEAN, DEFAULT false)
- tokenEmail (TEXT, NULLABLE)
- resetPasswordToken (TEXT, NULLABLE)
- resetPasswordExpires (DATETIME, NULLABLE)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

### Tabla: productos
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(150), NOT NULL)
- categoria (ENUM: 'medicamentos', 'alimentos', 'accesorios', 'juguetes', 'higiene', 'otros')
- precio (DECIMAL(10,2), NOT NULL)
- stock (INT, DEFAULT 0)
- descripcion (TEXT, NULLABLE)
- stockMinimo (INT, DEFAULT 5)
- activo (BOOLEAN, DEFAULT true)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

## 🚨 Alertas Automáticas

El sistema envía automáticamente emails cuando:

- **Stock Bajo**: Cuando un producto alcanza el stock mínimo
- **Verificación**: Al registrar una nueva cuenta
- **Recuperación**: Al solicitar reset de contraseña

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor (producción)
npm run dev        # Iniciar servidor (desarrollo con nodemon)
npm run migrate    # Ejecutar migraciones y crear datos iniciales
```

## 🛡️ Seguridad Implementada

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso entre dominios
- **Bcrypt**: Hash de contraseñas con salt rounds
- **JWT**: Tokens con expiración
- **Validación**: Sanitización de inputs
- **Rate Limiting**: (Recomendado agregar en producción)

## 🐛 Solución de Problemas

### Error de conexión MySQL
```bash
# Verificar que MySQL esté corriendo
mysql -u root -p

# Crear base de datos si no existe
CREATE DATABASE veterinaria_db;
```

### Error de autenticación JWT
- Verificar que `JWT_SECRET` esté configurado
- Verificar que el token no haya expirado
- Verificar formato: `Authorization: Bearer {token}`

### Error de envío de emails
- Verificar configuración Gmail App Password
- Verificar que `EMAIL_USER` y `EMAIL_PASS` estén correctos

## 📈 Próximas Mejoras

- [ ] Rate limiting con express-rate-limit
- [ ] Logging con Winston
- [ ] Tests unitarios con Jest
- [ ] Documentación con Swagger
- [ ] Caching con Redis
- [ ] Upload de imágenes para productos
- [ ] Sistema de órdenes/ventas

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para VetCare**