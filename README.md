# Aplicación de Mensajería

Esta es una aplicación de mensajería en tiempo real que te permite crear canales, registrar usuarios, editar usuarios, iniciar sesión, cerrar sesión y tener fotos de perfil. Está construida utilizando las siguientes tecnologías:

- HTML
- CSS
- JavaScript
- EJS (Embedded JavaScript)
- Socket.IO
- Express

## Funcionalidades

- Creación de canales: Puedes crear canales de chat para diferentes temas o grupos.
- Registro de usuarios: Los usuarios pueden registrarse en la aplicación proporcionando su nombre de usuario, correo electrónico y contraseña.
- Edición de usuarios: Los usuarios pueden editar su perfil, incluyendo su nombre de usuario, correo electrónico y foto de perfil.
- Inicio de sesión: Los usuarios pueden iniciar sesión en la aplicación utilizando su correo electrónico y contraseña.
- Cierre de sesión: Los usuarios pueden cerrar sesión en la aplicación para mantener su cuenta segura.
- Fotos de perfil: Los usuarios pueden cargar y mostrar fotos de perfil en su perfil de usuario.

## Tecnologías Utilizadas

### HTML
HTML se utiliza para crear la estructura y el contenido de las páginas web de la aplicación.

### CSS
CSS se utiliza para dar estilo y diseño a las páginas web de la aplicación, lo que permite personalizar la apariencia de los elementos y proporcionar una experiencia visual agradable.

### JavaScript
JavaScript se utiliza para agregar interactividad a la aplicación. Permite realizar acciones como enviar mensajes en tiempo real, validar formularios, gestionar eventos y actualizar dinámicamente el contenido de la página.

### EJS (Embedded JavaScript)
EJS es un motor de plantillas que permite generar dinámicamente HTML utilizando JavaScript. Se utiliza en esta aplicación para renderizar las vistas y mostrar los datos de manera dinámica.

### Socket.IO
Socket.IO es una biblioteca de JavaScript que facilita la comunicación bidireccional en tiempo real entre el servidor y el cliente. Se utiliza en esta aplicación para habilitar el chat en tiempo real entre los usuarios.

### Express
Express es un marco de aplicaciones web de Node.js que simplifica el desarrollo de aplicaciones web. Se utiliza en esta aplicación para crear el servidor, manejar las rutas y controlar las solicitudes y respuestas HTTP.

## Requisitos del Sistema

- Navegador web moderno compatible con HTML5, CSS3 y JavaScript.
- Node.js instalado en el entorno de desarrollo.

## Instalación

1. Clona o descarga el repositorio de la aplicación.
2. Abre una terminal y navega hasta el directorio raíz de la aplicación.
3. Ejecuta el siguiente comando para instalar las dependencias:

   ```
   npm install
   ```

4. Configura las variables de entorno necesarias, como la configuración de la base de datos o las claves de acceso.

5. Ejecuta el siguiente comando para iniciar la aplicación:

   ```
   npm start
   ```

6. Abre un navegador web y accede a la aplicación en `http://localhost:3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar en el desarrollo de esta aplicación, puedes enviar pull requests con tus mejoras, correcciones de errores u otras mejoras.

## Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE). Si utilizas este código fuente, se agradece un reconocimiento o enlace al repositorio original.