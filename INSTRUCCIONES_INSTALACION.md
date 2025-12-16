# 🚀 INSTRUCCIONES DE INSTALACIÓN - PROYECTO VETERINARIA

## ⚠️ IMPORTANTE: Sigue estos pasos EXACTAMENTE para evitar errores

### 📋 Requisitos Previos
1. **Node.js** (versión 16 o superior) - Descargar de: https://nodejs.org/
2. **Git** (opcional, para clonar el proyecto)

### 🔧 Instalación Paso a Paso

#### 1. Preparar el Proyecto
```bash
# Si tienes el proyecto en un ZIP, extráelo
# Si usas Git:
git clone [URL_DEL_REPOSITORIO]
cd Proyecto
```

#### 2. Instalar Backend (OBLIGATORIO)
```bash
# Navegar a la carpeta del servidor
cd Server

# Ejecutar instalación automática
node install.js

# O manualmente:
npm install
```

#### 3. Instalar Frontend
```bash
# Navegar a la carpeta del cliente (desde la raíz del proyecto)
cd Client

# Instalar dependencias
npm install
```

### 🚀 Ejecutar el Proyecto

#### Opción 1: Ejecución Automática (Recomendada)
```bash
# Desde la raíz del proyecto
npm run start:all
```

#### Opción 2: Ejecución Manual
```bash
# Terminal 1 - Backend
cd Server
npm start

# Terminal 2 - Frontend  
cd Client
npm run dev
```

### 🌐 URLs del Proyecto
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

### 🔍 Verificar que Todo Funciona
1. Abrir http://localhost:5173
2. Intentar registrar un usuario
3. Intentar hacer login
4. Si hay errores, revisar la consola del navegador y terminal

### 🆘 Solución de Problemas Comunes

#### Error: "Cannot find module"
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port already in use"
```bash
# Cambiar puerto en .env (Backend) o vite.config.js (Frontend)
# O matar procesos:
npx kill-port 3001
npx kill-port 5173
```

#### Error: "Database connection failed"
```bash
# Ejecutar migración manual
cd Server
npm run migrate
```

#### Error: "CORS policy"
- Verificar que el backend esté corriendo en puerto 3001
- Verificar archivo .env en Server

### 📁 Estructura del Proyecto
```
Proyecto/
├── Client/          # Frontend React
├── Server/          # Backend Node.js
├── README.md
└── INSTRUCCIONES_INSTALACION.md
```

### 🔧 Configuración Avanzada

#### Variables de Entorno (Server/.env)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
DB_PATH=./src/DataBase/veterinaria.db
CORS_ORIGIN=http://localhost:5173
```

### 📞 Contacto
Si sigues teniendo problemas, asegúrate de:
1. Tener Node.js instalado
2. Ejecutar `node install.js` en la carpeta Server
3. Verificar que ambos servidores estén corriendo
4. Revisar la consola del navegador para errores específicos

---
**Nota**: Este proyecto usa SQLite para la base de datos, por lo que NO necesitas instalar MySQL ni ningún otro servidor de base de datos.
Para ejecutar un email de prueba usar cd Server, node send_test_email.js