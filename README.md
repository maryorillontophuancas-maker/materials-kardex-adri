# Planificador de Materiales Maryori Llontop

## Autor y propósito
Autora: Maryori Adriany Llontop Huancas (Educación Tecnológica, ciclo V, UNIFSLB). Sistema: **Planificador de Materiales Maryori Llontop**. Actividad educativa: taller «Mi primer circuito con LED» para 5.º de secundaria, con 6 grupos de trabajo. El sistema sirve para organizar un pedido ficticio de materiales (LED, pilas, protoboards), calcular su costo y comprobar que no supere el presupuesto. Solo se usan datos ficticios.

## Ejecutar
Conserve juntos index.html, styles.css, app.js y kardex.js. Abra index.html en Chrome o Edge. Edite app.js, guarde (Ctrl+S) y recargue (Ctrl+R). No necesita instalar paquetes ni conectarse a internet.

## Responsabilidades
- index.html: estructura, textos y entradas de la pantalla.
- styles.css: apariencia (incluye los mensajes en rojo y verde).
- kardex.js: (S9) reglas del kardex (saldo, movimientos, CSV) y su pantalla; guarda en localStorage.
- app.js (sin cambios en S9): objeto `limites`, `calcularTotal` y `validarPedido` (sin acceso a la pantalla); después lectura de entradas y acciones de los botones.

## Mi personalización
- Nombre del sistema: Planificador de Materiales Maryori Llontop (pestaña y encabezado).
- Actividad: taller «Mi primer circuito con LED», 5.º de secundaria, 6 grupos.
- Materiales de ejemplo: LED de 5 mm, pila de 9 V, protoboard pequeña.
- Presupuesto propio: **S/ 120.00** (`limites.presupuestoCentimos = 12000`), igual en app.js y en el texto visible. Es múltiplo de S/ 10, está entre S/ 50 y S/ 300 y es distinto de S/ 150.
- Justificación: S/ 20.00 por grupo × 6 grupos = S/ 120.00.
- Se mantienen cantidad entera de 1 a 30 y precio de S/ 0.01 a S/ 50.00 con hasta dos decimales.

## Semana 9: Planificador con kardex
**Propósito de la mejora.** Mantengo el planificador de la S7 (cálculo, presupuesto S/ 120.00 y validación) y le añado un kardex ficticio: materiales con código estable (MAT-001...), búsqueda por nombre o código, cambio de nombre por id, entradas y salidas de unidades enteras, existencia = entradas − salidas, inactivar/eliminar, guardado en localStorage y exportación de movimientos a CSV.

**Existencia ≠ presupuesto.** La existencia son unidades físicas; el presupuesto del planificador está en céntimos. No se mezclan.

**Archivos finales (todos en la raíz del repositorio):** index.html, styles.css, app.js (sin cambios), kardex.js (nuevo) y README.md.

**Cómo se integró:** la sección `#kardex` (de kardex.html) está en index.html dentro de `<main>`, después del planificador; `<script src="./kardex.js" defer>` va después de app.js; las reglas de personalizacion.css están al final de styles.css. Se mantienen los ids `k-*`.

**Personalización:** etiqueta «Nombre del material del taller (ficticio)» con `font-size:1.25rem` (antes 1.1rem) y paleta propia rojo ladrillo rgb(156,43,27), el mismo #9C2B1B de los botones de la S7 (contraste con blanco ≈ 7,6:1).

**Uso:** abra index.html o el sitio publicado. Cree o elija un material, registre ENTRADA/SALIDA con enteros positivos y use «Exportar CSV» (separador «;», UTF-8; en Excel use Datos > Desde texto/CSV si ve una sola columna).

**Límites:** los datos se guardan sólo en este navegador y origen (localStorage); no hay base compartida ni multiusuario. El CSV es una copia, no una sincronización con Excel. Todos los datos son ficticios.

**Adaptaciones al fragmento:** formularios con `novalidate` para mostrar mensajes propios; códigos MAT-### en lugar de UUID; se evita repetir nombres activos; se limpia el campo al crear; mensaje al cancelar; fecha legible e indicación «(inactivo)» en el historial; 3 materiales ficticios iniciales.

## Pruebas
Planificador (S7), con presupuesto S/ 120.00:
1. Cable de conexión, 3 × S/ 19.99 → total S/ 59.97, saldo S/ 60.03.
2. Cantidad 2.5 y material vacío → error.
3. 10 × S/ 12.00 → total S/ 120.00 (se acepta).
4. 10 × S/ 12.01 → total S/ 120.10, exceso S/ 0.10 (se rechaza).
5. Conservar la ficha tras un error y Limpiar.
Kardex (S9): entrada 10 y salida 3 = 7; salida 8 rechazada (queda 7); 0, −1 y 1.5 rechazados; búsqueda vacía y sin coincidencia no cambian datos; edición por id; cancelar eliminación; inactivar conserva historial; recarga conserva datos; CSV con movimientos y cantidades correctos. Resultados completos en el PDF de entrega.

## Repositorio individual y GitHub Pages
Repositorio: [pegar aquí el enlace del repositorio]
Sitio GitHub Pages: [pegar aquí el enlace que GitHub muestre]
