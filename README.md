# 🛒 Mi Tienda Online - E-commerce SPA con Panel de Administración

Una aplicación web moderna de página única (**SPA**) desarrollada con **HTML5, Tailwind CSS y JavaScript vainilla**, diseñada para pequeños negocios. Cuenta con un catálogo interactivo, sistema de filtros, carrito de compras en tiempo real, control de stock y un **Panel de Administración protegido por contraseña** con persistencia local (`localStorage`).

---

## ✨ Características Principales

- **🛍️ Catálogo y Filtros:** Búsqueda en tiempo real por nombre/categoría y filtrado dinámico por secciones.
- **🛒 Carrito de Compras Lateral (Slide-over):** Permite sumar, restar cantidades, eliminar productos y calcular el total de forma fluida.
- **📉 Control de Stock en Vivo:** Al finalizar una compra simulada (*checkout*), el inventario se descuenta automáticamente de forma instantánea.
- **🔐 Panel de Administración Seguro:** Acceso restringido mediante usuario y contraseña predeterminados (`admin` / `admin123`).
- **🛠️ Gestión de Inventario para el Dueño:**
  - Agregar nuevos productos (nombre, categoría, precio, stock inicial e imagen).
  - Subir o bajar precios fácilmente.
  - Aumentar o reponer el stock disponible.
  - Eliminar productos de la tienda con un solo clic.
- **💾 Persistencia de Datos:** Todos los cambios se guardan automáticamente en el navegador (`localStorage`) para evitar pérdida de información al refrescar.
- **🎨 Configuración de Marca Sencilla:** Cambia el nombre y el logo de la tienda modificando una sola línea de código en el archivo de configuración.

---

## 📂 Estructura del Proyecto

El proyecto está estructurado de forma limpia y modular en tres archivos principales:

```text
MyCustomWebStore/
│
├── index.html       # Estructura HTML, cabecera, modales de login y admin, carrito y grilla
├── styles.css       # Estilos personalizados y animaciones complementarias
└── script.js        # Lógica de la tienda, estado global, pasarela y control de inventario
