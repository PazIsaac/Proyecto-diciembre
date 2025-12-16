# VALIDAR USUARIOS (User Validation Service)

Este proyecto es un servicio backend (API) construido con Node.js y Express para la **validación y gestión básica de usuarios**.

##  Características Principales

* **Autenticación y Autorización:** Implementación de tokens para la gestión de sesiones.
* **Envío de Correos Electrónicos:** Funcionalidad para enviar emails.
* **Estructura Modular:** Organización clara del código usando Controladores, Rutas y Utilidades (`Utils`).
* **Configuración Ambiental:** Uso del archivo `.env` para gestionar variables de entorno sensibles (conexiones a DB, claves secretas, etc.).

## 🛠️ Tecnologías Utilizadas

* **Node.js**
* **Express** 
* **SQLite3** 
* **cors** 
* **jsonwebtoken** 
* **nodemailer** 


## Endpoints de la API

 - POST --> /api/registrousuario --> Crea un nuevo usuario.
 - GET --> /api/verificacion/:Token --> Validación de Usuario.
