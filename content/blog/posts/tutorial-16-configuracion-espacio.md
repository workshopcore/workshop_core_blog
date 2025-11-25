---
title: "Tutorial 16: Configuración Avanzada del Espacio"
date: 2025-11-24T16:00:00-03:00
draft: false
description: "Aprendé a configurar permisos y restricciones en tu espacio: controlá qué pueden hacer los alumnos con sus suscripciones y créditos."
tags: ["tutorial", "configuración", "permisos", "administración"]
categories: ["Tutoriales"]
series: ["Configuración"]
featured_image: "/images/tutoriales/tutorial_16_config_panel.png"
---

# Tutorial 16: Configuración Avanzada del Espacio

Ya conocés lo básico de la configuración de tu espacio en TuTaller. En este tutorial vamos a profundizar en las opciones avanzadas que te permiten controlar qué pueden y qué no pueden hacer tus alumnos, especialmente en lo relacionado con la gestión de sus suscripciones y el uso de créditos.

## Accediendo a la Configuración

Desde el panel de administración, hacé clic en **"Configuración"** en el menú lateral. Vas a ver tanto las opciones básicas (nombre, precios, colores) como las opciones avanzadas de permisos al final del formulario.

![Panel de Configuración](/images/tutoriales/tutorial_16_config_panel.png)

## Opciones de Configuración Básica

En la parte superior del panel encontrás las opciones que ya vimos en el Tutorial 2:

* **Nombre del espacio**: El nombre comercial de tu taller
* **Descripción**: Un texto que aparece en la bienvenida a nuevos usuarios
* **Alias**: El identificador único en la URL
* **Precio de suscripción mensual**: El valor que cobras por mes
* **Créditos incluidos en la suscripción**: Cuántos créditos recibe cada alumno mensualmente
* **Colores primario y secundario**: La paleta de marca de tu espacio

Estas opciones definen la identidad y el modelo de negocio de tu taller.

## Configuración de Permisos

Al final del formulario encontrás dos toggles críticos que determinan el nivel de autonomía que le das a tus alumnos:

![Opciones de Permisos](/images/tutoriales/tutorial_16_config_toggles.png)

### Permitir que los alumnos administren suscripciones

**Toggle**: "Permitir que los alumnos administren subscripciones"

Esta opción controla si los alumnos pueden **editar sus propias clases recurrentes** (suscripciones).

**Cuando está ACTIVADA** (recomendado para la mayoría):
* Los alumnos pueden agregar, modificar o cancelar sus suscripciones a clases recurrentes
* Tienen autonomía para elegir a qué clases quieren suscribirse cada semana
* Reduce tu carga administrativa porque no tenés que hacer cada cambio manualmente

**Cuando está DESACTIVADA**:
* Los alumnos NO pueden tocar sus suscripciones
* Ves el mensaje de error si intentan editar
* Solo vos (como admin) podés suscribirlos o desuscribirlos de clases recurrentes
* Útil para talleres con estructura muy rígida o programas obligat orios

**¿Cuándo desactivarla?**

* Si tenés un sistema de "paquetes obligatorios" donde elegís vos qué clases hace cada alumno
* Si querés tener control total sobre quién asiste a cada clase fija
* Si tus alumnos suelen cometer errores al gestionar sus suscripciones

**Ejemplo práctico**:

Imaginá un taller de crosstraining donde cada alumno debe hacer exactamente 3 clases por semana según un programa personalizado que vos armás. En ese caso, desactivarías esta opción para que los alumnos no puedan cambiarse de plan por su cuenta.

### Permitir uso de créditos sin pago mensual

**Toggle**: "Permitir que los alumnos usen créditos para recuperar clases aunque el mes actual no esté pago"

Esta opción está directamente vinculada con la funcionalidad de "Marcar mes como pagado" que vimos en el Tutorial 15.

**Cuando está DESACTIVADA** (recomendado para control de pagos):
* Si un alumno NO tiene marcado el mes actual como pagado, el sistema le bloquea el uso de créditos para recuperar clases
* El alumno ve un mensaje indicando que debe ponerse al día con el pago
* Es una forma de "soft enforcement" - no lo bloqueás completamente, pero sí le recordás que debe pagar

**Cuando está ACTIVADA**:
* Los alumnos pueden usar los créditos sin restricciones, aunque no hayan pagado el mes actual
* Útil si tenés un sistema de pagos muy flexibles o no querés bloquear a nadie

**¿Cómo funciona en la práctica?**

1. A principio de mes, marcás como pagado a todos los que te transfirieron (desde el Tutorial 15)
2. Si esta opción está desactivada, los que NO tienen el mes marcado como pagado no pueden usar "créditos a recuperar"
3. Cuando finalmente te pagan y les marcás el mes, automáticamente se les desbloquea el uso de esos créditos

**Diferencia entre "créditos normales" y "créditos a recuperar"**:

* **Créditos normales**: Los que asignás mensualmente, se usan para reservar clases nuevas - siempre disponibles
* **Créditos a recuperar**: Créditos extras para recuperar una clase que cancelaron o perdieron - estos son los que se pueden bloquear con esta config

**Ejemplo práctico**:

Tenés un alumno que canceló una clase la semana pasada (perdió 1 crédito) y ahora quiere recuperarla. Si no tiene el mes marcado como pagado y esta opción está desactivada, no va a poder usar sus créditos para recuperar. Cuando te pague y lo marques como pagado, podrá recuperar sin problemas.

## Combinaciones Comunes de Configuración

### Gimnasio Flexible (Más Común)

* ✅ Alumnos administran suscripciones: **ACTIVADO**
* ✅ Uso de créditos sin pago: **DESACTIVADO**

**Filosofía**: Libertad para elegir clases, pero deben estar al día con el pago para recuperar.

### Taller con Programa Fijo

* ❌ Alumnos administran suscripciones: **DESACTIVADO**
* ✅ / ❌ Uso de créditos sin pago: **Variable** según tu política de pagos

**Filosofía**: Vos controlás la programación y asignación de clases.

### Sistema Ultra-Flexible

* ✅ Alumnos administran suscripciones: **ACTIVADO**
* ✅ Uso de créditos sin pago: **ACTIVADO**

**Filosofía**: Máxima autonomía para los alumnos, confiás en que van a pagar sin necesidad de bloqueos.

## Guardando los Cambios

Una vez que ajustaste las opciones según tu modelo de negocio, no te olvides de hacer clic en el botón **"Guardar"** al final del formulario. Los cambios se aplican de inmediato y afectan el comportamiento de todos tus alumnos.

## Impacto en la Experiencia del Alumno

Estas configuraciones cambian directamente lo que los usuarios ven y pueden hacer en la app:

**Con suscripciones desactivadas**:
* Los alumnos ven sus clases recurrentes pero no pueden editarlas
* El botón de "editar suscripción" aparece deshabilitado o no existe
* Deben contactarte a vos para cualquier cambio

**Con créditos bloqueados sin pago**:
* Los alumnos ven sus créditos a recuperar en el panel lateral
* Cuando intentan usarlos sin tener el mes pagado, aparece un mensaje indicando que deben tener el pago al día
* El sistema no los deja proceder con la reserva de recuperación
* Los créditos normales siguen funcionando, solo se bloquean los de recuperación

**Vista del alumno - Créditos a recuperar**:

<img src="/images/tutoriales/tutorial_16_student_credits.png" alt="Panel del alumno mostrando créditos a recuperar" width="300"/>

**Vista del alumno - Mensaje de bloqueo**:

<img src="/images/tutoriales/tutorial_16_student_blocked.png" alt="Mensaje cuando el alumno no tiene el mes pagado" width="300"/>

## Próximos Pasos

Con tu espacio completamente configurado, tenés control total sobre cómo se comporta la plataforma. En el próximo tutorial vamos a ver los diferentes tipos de **emails automáticos** que envía el sistema, para que sepas qué comunicaciones están recibiendo tus alumnos.

---

*Continuá con el Tutorial 17: Emails Enviados por la Aplicación (próximamente) para conocer todas las notificaciones automáticas del sistema.*

## Resumen

En este tutorial aprendiste a:

✅ Comprender las opciones avanzadas de configuración del espacio  
✅ Controlar si los alumnos pueden gestionar sus propias suscripciones  
✅ Bloquear el uso de créditos a recuperar para alumnos sin pago del mes  
✅ Combinar estas opciones según tu modelo de negocio  
✅ Entender cómo estas configuraciones impactan en la experiencia del alumno  

Estas opciones te dan flexibilidad para adaptar TuTaller a tu forma particular de gestionar el taller, desde modelos ultra-flexibles hasta estructuras muy controladas.
