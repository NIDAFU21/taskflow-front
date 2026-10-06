# TaskFlow - Gestión de Proyectos y Tareas

Aplicación web desarrollada con React y TypeScript para la gestión de proyectos y tareas. El sistema permite a los usuarios registrarse, iniciar sesión y administrar sus proyectos y las tareas asociadas a cada uno.

El frontend consume una API REST para la autenticación y la gestión de la información.

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión mediante JWT.
- Protección de rutas privadas.
- Gestión de proyectos:
  - Crear proyectos.
  - Listar proyectos.
  - Editar proyectos.
  - Eliminar proyectos.
- Gestión de tareas asociadas a proyectos:
  - Crear tareas.
  - Listar tareas.
  - Editar tareas.
  - Eliminar tareas.
  - Cambiar el estado de las tareas.
- Manejo de estados de carga y errores.
- Formularios con validaciones.
- Navegación mediante React Router.
- Gestión del estado de autenticación mediante Context API.
- Interfaz responsive.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- React Router
- Context API
- Tailwind CSS
- Sonner
- Lucide React
- Fetch API

## Requisitos previos

Para ejecutar el proyecto se necesita tener instalado:

- Node.js
- npm
- El backend de TaskFlow ejecutándose y disponible para recibir las solicitudes de la aplicación.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/NIDAFU21/taskflow-front.git
```

Ingresar al directorio del proyecto:

```bash
cd taskflow-front
```

Instalar las dependencias:

```bash
npm install
```

## Configuración

Configurar la URL de la API de acuerdo con el entorno en el que se ejecute el proyecto.

La aplicación debe poder comunicarse con el backend de TaskFlow para realizar las operaciones de autenticación, proyectos y tareas.

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Una vez iniciado, Vite mostrará en la terminal la dirección local disponible para acceder a la aplicación.

## Flujo de uso

1. Registrar un nuevo usuario.
2. Iniciar sesión.
3. Acceder al dashboard.
4. Crear y administrar proyectos.
5. Seleccionar un proyecto para consultar sus tareas.
6. Crear, editar y eliminar tareas.
7. Cambiar el estado de las tareas.

## Arquitectura general

El proyecto utiliza componentes funcionales de React y organiza la aplicación en diferentes responsabilidades:

- `components/`: componentes reutilizables de la interfaz.
- `context/`: gestión del estado global mediante Context API.
- `hooks/`: hooks personalizados.
- `layouts/`: estructuras generales de las páginas.
- `lib/`: utilidades y configuración auxiliar.
- `pages/`: páginas principales de la aplicación.
- `services/`: comunicación con la API.

La autenticación se gestiona mediante JWT y la sesión se mantiene utilizando el almacenamiento local del navegador.

## Backend

El frontend consume el backend de TaskFlow, encargado de proporcionar los servicios de autenticación, proyectos y tareas.

El backend utiliza autenticación mediante JWT y expone los recursos necesarios para que el frontend pueda realizar las operaciones correspondientes.

## Compilación para producción

Para generar la versión de producción:

```bash
npm run build
```

Los archivos generados estarán disponibles en la carpeta `dist/`.

## Proyecto académico

Este proyecto fue desarrollado como parte del módulo de ReactJS del Diplomado de Desarrollo Web Full Stack, aplicando conceptos de:

- Componentes funcionales.
- Props.
- `useState`.
- `useEffect`.
- Context API.
- React Router.
- Formularios y validaciones.
- Consumo de APIs.
- Renderizado condicional.
- Manejo de estados de carga y errores.
