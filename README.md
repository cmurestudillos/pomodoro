# Aplicación Pomodoro

## Descripción

Esta es una aplicación de temporizador Pomodoro desarrollada con Angular. La técnica Pomodoro es un método de gestión del tiempo que utiliza intervalos de trabajo cronometrados, tradicionalmente de 25 minutos de duración, separados por breves descansos. Esta aplicación ofrece una implementación flexible con intervalos de trabajo de 45 minutos, pausas cortas de 15 minutos y pausas largas de 30 minutos.

## Características

- Temporizador Pomodoro configurable (45 minutos de trabajo)
- Pausas cortas (15 minutos) y largas (30 minutos)
- Interfaz de usuario intuitiva con Angular Material
- Persistencia de datos con Dexie.js (IndexedDB)
- Sonido de notificación al finalizar cada intervalo
- Pruebas unitarias completas
- Configuración de linting y formateo de código

## Requisitos previos

- Node.js (versión 14.x o superior)
- npm (normalmente viene con Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Instalación

1. Clona este repositorio:

   ```
   git clone https://github.com/cmurestudillos/pomodoro.git
   ```

2. Navega al directorio del proyecto:

   ```
   cd pomodoro-app
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar la aplicación en modo de desarrollo:

```
ng serve
```

Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Pruebas

Para ejecutar las pruebas unitarias:

```
ng test
```

Para generar un informe de cobertura de código:

```
npm run test:coverage
```

## Linting y formateo

Para ejecutar el linter:

```
ng lint
```

Para formatear el código:

```
npm run format
```

## Estructura del proyecto

- `src/app/components/pomodoro`: Componente principal del Pomodoro
- `src/app/services/timer.service.ts`: Servicio para manejar la lógica del temporizador
- `src/app/services/db.service.ts`: Servicio para la persistencia de datos con Dexie.js

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios importantes antes de crear un pull request.

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Link del proyecto: [https://github.com/tu-usuario/pomodoro-app](https://github.com/tu-usuario/pomodoro-app)
