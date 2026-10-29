# 📊 Módulo de Informes & Analítica de Negocio - SmartBakery

Este documento detalla la arquitectura, funcionamiento, colecciones de MongoDB y métricas de cada uno de los reportes implementados en el sistema **SmartBakery**.

---

## 🚀 Cómo verlo en modo local

Ambos servidores ya han sido levantados y se encuentran en ejecución:

1. **Frontend (Vite + React 19):**  
   👉 **[http://localhost:5173/reports](http://localhost:5173/reports)**
2. **Backend (Node.js + Express + Mongoose):**  
   👉 **`http://localhost:3000/api/reports/analytics`**  
   👉 **`http://localhost:3000/api/reports/inventory-valuation`**

*(Si en algún momento deseas reiniciar los servidores manualmente, puedes ejecutar en terminales separadas: `npm run dev:backend` y `npm run dev:frontend`).*

---

## 📑 Estructura de los Informes Implementados

El módulo cuenta con **6 pestañas interactivas** y una barra superior con **KPIs ejecutivos** y filtros dinámicos.

---

### 1. 🎯 Barra de KPIs Ejecutivos (Cabecera Principal)

En la parte superior de la pantalla se calculan en tiempo real los indicadores clave del negocio:

| Métrica | Cálculo / Origen en MongoDB | Propósito de Negocio |
| :--- | :--- | :--- |
| **Ingresos Totales** | `∑ total_venta` en la colección `ventas` | Facturación neta del período filtrado |
| **Tickets Cobrados** | Conteo de ventas en el período | Volumen total de pedidos facturados |
| **Ticket Promedio** | `Ingresos Totales / Conteo de Ventas` | Gasto medio por cliente/pedido |
| **Hora Pico de Ventas** | Agrupación de `fecha_hora` por hora (0-23 hrs) | Detección de la hora con mayor afluencia |
| **Alertas de Stock** | Conteo de productos donde `stock <= minStock` | Alerta temprana para reposición o producción |

---

### 2. 📊 Pestaña 1: Resumen & Ventas
* **Tendencia Diaria de Ventas:**  
  Gráfico de barras interactivo que muestra la evolución de las ventas día a día dentro del período seleccionado con tooltips y montos formateados en COP.
* **Curva Horaria de Ventas (Mapa de Demanda):**  
  Desglose de 00:00 a 23:00 hrs destacando en rojo la **Hora Pico**. Permite al maestro panadero programar las tandas de pan recién horneado justo antes del momento de mayor afluencia.
* **Canal de Venta (Consumo en Mesa vs Para Llevar):**  
  Comparativa en porcentaje y en dinero entre el consumo en mesas (`tipo_venta: 'mesa'`) y pedidos para llevar (`tipo_venta: 'de_paso'`).
* **Rotación y Ventas por Mesa:**  
  Ranking de productividad que identifica cuáles mesas del salón generan mayor facturación y número de pedidos.

---

### 3. 💵 Pestaña 2: Cierre de Caja & Arqueo Diario
Diseñado para el control de efectivo y la conciliación bancaria al final de cada turno o jornada:

* **Arqueo Físico de Efectivo:**
  - **Total Efectivo Recibido:** Billetes y monedas entregados por clientes (`monto_recibido`).
  - **Cambio / Vueltas Entregadas:** Dinero devuelto al cliente (`vueltas`).
  - **Saldo Neto en Caja:** Efectivo exacto que debe haber físicamente en el cajón de dinero.
* **Desglose de Métodos de Pago:**
  - Participación porcentual de **Efectivo**, **Transferencias** (Nequi / Daviplata), **Bolsillos Virtuales** y **Tarjetas**.
* **Auditoría de Consecutivos:**
  - Identifica el **primer recibo** y el **último recibo** emitidos en el período para verificar que no haya saltos en la numeración correlativa.
* **Tabla de Soportes de Transferencias Electrónicas:**
  - Listado con el número de recibo, cliente, canal (Nequi, Daviplata, Bancolombia), número de comprobante o código de aprobación y monto, permitiendo cotejar contra el extracto de la app bancaria.

---

### 4. 🥐 Pestaña 3: Productos & Categorías
* **Top 10 Productos Más Vendidos:**
  - Permite alternar la vista entre **Por Cantidad** (unidades) y **Por Ingresos** ($).
  - Muestra la medalla de ranking (🥇, 🥈, 🥉), categoría y total recaudado.
* **Ventas por Categoría / Departamento:**
  - Gráfico de barras horizontales con el porcentaje de aportación de cada categoría (Panes, Repostería, Bebidas Calientes, Bebidas Frías, Pasabocas, etc.).
* **Alerta de Baja Rotación ("Pan Frío / Huesos"):**
  - Detecta productos del catálogo con **cero o una sola venta** en el período para sugerir promociones, combos o reducción del gramaje de masa diaria, evitando mermas.

---

### 5. 📦 Pestaña 4: Inventario & Stock Crítico
* **Métricas de Inventario:**
  - **Unidades Totales:** Suma de existencias de todo el catálogo en vitrinas y bodega.
  - **Valor Total a Precio de Venta:** Ingresos proyectados al comercializar el inventario disponible.
  - **Referencias en Catálogo:** Conteo de productos activos en la panadería.
  - **Alertas de Stock Crítico:** Conteo de productos en nivel bajo o agotados.
* **Tabla de Alertas de Stock Crítico:**
  - Productos con stock en cero (❌ **Agotado**) o por debajo del umbral mínimo de seguridad (⚠️ **Stock Bajo**).
* **Distribución por Departamento:**
  - Conteo de referencias, unidades y valor económico agrupado por departamento.

---

### 6. 👥 Pestaña 5: Personal & Turnos
* **Rendimiento por Empleado / Cajero:**
  - Muestra el nombre del empleado, cargo, turno (Mañana, Tarde, Completa), cantidad de tickets cobrados, ticket promedio facturado y porcentaje de contribución a la venta total.
* **Permite auditar la productividad** de los cajeros en las horas pico y equilibrar la carga operativa del equipo.

---

### 7. 🧾 Pestaña 6: Auditoría de Recibos & Exportación
* **Buscador en Tiempo Real:**
  - Filtrado instantáneo por número consecutivo de recibo, nombre del cliente, mesa o método de pago.
* **Visualizador de Ticket / Modal:**
  - Al hacer clic en **"👁️ Ver Ticket"**, se despliega el recibo fiscal con el encabezado de la panadería, cliente, fecha/hora, detalle ítem por ítem con valores y total pagado.
  - Botón directo para **reimprimir el ticket**.
* **Exportación y Formatos:**
  - **📥 Exportar Excel (CSV):** Genera un archivo CSV con codificación **UTF-8 con BOM** para que Microsoft Excel lo abra directamente con tildes y caracteres especiales correctos.
  - **🖨️ Imprimir / PDF:** Hoja de estilos de impresión (`@media print`) configurada para generar informes limpios en PDF sin menús laterales ni botones de interfaz.

---

## 🎛️ Filtros Rápidos Disponibles

El usuario puede alternar la información con un solo clic:
- ☀️ **Hoy** (Día en curso, seleccionado automáticamente al entrar).
- ⏪ **Ayer** (Día anterior inmediato).
- 📈 **Últimos 7 Días** (Semana móvil).
- 🗓️ **Este Mes** (Desde el primer día del mes actual hasta hoy).
- ⚙️ **Personalizado** (Permite especificar cualquier rango con los selectores `Desde` y `Hasta`).
- Filtros adicionales combinables por **Método de Pago** y **Canal de Venta** (Mesas vs Para llevar).

---

## 🗄️ Colecciones de MongoDB Utilizadas

1. **`ventas`**: Documentos de venta con ítems embebidos, método de pago, canal, cliente, empleado y fecha/hora.
2. **`productos`**: Catálogo con precios (venta y costo), departamento, existencias (`stock`) y umbral de alerta (`minStock`).
3. **`empleados`**: Personal registrado con cargo, turno y estado laboral.
4. **`inventarios`**: Control de cantidad disponible por producto.
5. **`metodopagos`**: Lista maestra de métodos habilitados en caja.

---

## ⏰ Manejo de Zona Horaria (Colombia UTC-5)

Las consultas por fecha en [reportRoutes.js](file:///c:/Users/NANA/panaderia/backend/routes/reportRoutes.js) delimitan el inicio del día a las `00:00:00` y el fin a las `23:59:59` en hora local de Colombia (`America/Bogota` / `UTC-5`), además de verificar la concordancia directa con el campo `fecha_texto` (`DD/MM/YYYY`) que registra el punto de venta. Esto asegura que ventas realizadas en horas de la tarde o noche no queden desfasadas por la hora UTC.

