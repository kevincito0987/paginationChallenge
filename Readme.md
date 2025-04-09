# 🌀 GALERÍA DE PERSONAJES DE NARUTO

### 📖 Una galería interactiva inspirada en el mundo shinobi.

------

## ✨ FRASE ESTELAR

> *"Cada personaje tiene una historia, esta galería te invita a descubrirlas una por una."* 🌌

------

## 📌 DESCRIPCIÓN GENERAL

Este proyecto muestra una galería elegante con personajes del anime **Naruto**, utilizando una API pública.
 Cada personaje aparece en una tarjeta personalizada con información clave como nombre, aldea, clan y una imagen representativa.

- 🎯 **Objetivo:** Mostrar **20 personajes** con paginación, estilo moderno y 100% funcionalidad frontend (HTML + CSS + JS).
- 🌐 **API utilizada:** https://dattebayo-api.onrender.com/characters

------

## 📚 CONTENIDO

- 🚀 Introducción
- ⚙️ Instalación
- 🧪 Uso
- 🌟 Características
- 📁 Estructura del Proyecto
- 🖼️ Vista Previa
- 🔌 Dependencias
- 🛠️ Configuración
- 📄 Documentación
- 🔄 Consumo de la API
- ✅ Criterios de Evaluación
- 📤 Condiciones de Entrega
- 👤 Contribuyentes
- 📝 Licencia

------

## ⚙️ INSTALACIÓN

1. Cloná el repositorio:

   ```
   bash
   
   
   CopiarEditar
   git clone https://github.com/tu-usuario/naruto-gallery.git
   ```

2. Abrí el archivo `index.html` directamente en tu navegador.

3. ¡Listo! No requiere instalación de paquetes.

------

## 🧪 USO

- Abrí `index.html` y navegá por las tarjetas de personajes.
- Usá los botones `Previous` y `Next` para paginar entre ellos.
- Las tarjetas están centradas para una mejor experiencia visual.

------

## 🌟 CARACTERÍSTICAS

- 💠 Diseño responsive y visualmente atractivo
- 🔄 Navegación por paginación
- 🔎 Carga dinámica de personajes
- 💾 Ligero y sin dependencias externas

------

## 📁 ESTRUCTURA DEL PROYECTO

```
plaintextCopiarEditar/assets/
  └── preview.png
/styles/
  └── style.css
/js/
  └── script.js
index.html
```

------

## 🖼️ VISTA PREVIA DEL PROYECTO

📂 Ubicación: `./assets/preview.png`
 🖥️ Asegurate de colocar la imagen dentro de la carpeta `assets/` para que se vea correctamente.

------

## 📄 DOCUMENTACIÓN

Cada página debe mostrar **4 personajes**, organizados en **tarjetas visuales** que presenten la información más relevante de cada uno. Las tarjetas deben incluir:

- 🖼️ **Imagen del personaje**
- 📝 **Nombre**
- 🧬 **Información clave adicional** (clan, aldea, habilidades o afiliación)

> ⚠️ *El diseño base del proyecto puede modificarse o mejorarse, siempre que las tarjetas incluyan la imagen y texto relevante para identificar al personaje.*

------

## 🔄 CONSUMO DE LA API

- Se debe utilizar `fetch()` para consultar los datos desde la API.
- Solo se deben mostrar los **primeros 20 personajes**, aunque la API contenga más.

```
jsCopiarEditarfetch("https://dattebayo-api.onrender.com/characters")
  .then(res => res.json())
  .then(data => {
    const firstTwenty = data.slice(0, 20);
    renderCharacters(firstTwenty);
  });
```

------

## ✅ CRITERIOS DE EVALUACIÓN

| Criterio          | Descripción                                                  |
| ----------------- | ------------------------------------------------------------ |
| **Funcionalidad** | Se visualizan correctamente los personajes en bloques de 4 por página. |
| **Navegación**    | Los botones permiten navegar fluidamente entre páginas.      |
| **Interfaz**      | Diseño limpio, con tarjetas bien estructuradas e información clara. |
| **Código**        | Código estructurado, comentado y que siga buenas prácticas.  |
| **Dinamismo**     | El paginado se adapta automáticamente según los datos recibidos. |

------

## 📤 CONDICIONES DE ENTREGA

📎 Se requiere que el estudiante adjunte el **enlace del repositorio público de GitHub** donde se pueda evidenciar la solución planteada o, en su defecto, el **fork** de este repositorio base.

------

## 👤 CONTRIBUYENTES

- 🧑‍💻 **kevincito0987**

------

## 📝 LICENCIA

Este proyecto está bajo la **Licencia MIT**. Libre para usar, modificar y compartir.

------

## 🌠 Y COMO DICEN LOS SABIOS DE KONOHA...

> *"Cuando mirás a los personajes desde otro ángulo, descubrís una nueva historia. Esa es la magia del frontend."* 🖥️🌀