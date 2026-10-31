---
title: "Congelar Acciones de Alumnos al Organizar el Mes"
date: 2026-10-31T12:00:00-03:00
draft: false
description: "Aprendé a congelar temporalmente las reservas, cancelaciones y suscripciones de tus alumnos mientras organizás los horarios del nuevo mes en TuTaller."
tags: ["novedades", "admin", "configuración", "permisos", "turnos"]
categories: ["Blog"]
featured_image: "/images/tutoriales/blog_04_student_book_frozen.png"
---

# ¡Congelá Temporalmente las Modificaciones de Alumnos Mientras Organizás el Mes! 🛠️✨

Si administrás un taller con muchas clases semanales y decenas de alumnos, seguro conocés ese momento clave de cada mes: **habilitar el mes siguiente y dejar toda la grilla lista**.

Cuando habilitás un mes en TuTaller, el sistema crea automáticamente todos los turnos de tus [clases recurrentes]({{< ref "tutorial-03-clases-recurrentes.md" >}}) e inscribe a los alumnos suscriptos en sus horarios habituales. Sin embargo, en la práctica de cualquier taller real, inmediatamente después de habilitar el mes solés necesitar unos minutos para hacer ajustes manuales:

* Eliminar turnos que caen en **días feriados** o jornadas en las que el taller permanecerá cerrado.
* **Mover alumnos** que pidieron cambiar su suscripción de horario para el nuevo mes.
* Ajustar cupos o agregar excepciones puntuales en el [Panel de Turnos Reservados]({{< ref "tutorial-05-turnos-reservados.md" >}}).

## El Problema: Cambios simultáneos mientras estás organizando

Imaginá que acabás de habilitar el próximo mes y todavía tenés que borrar los turnos de un lunes feriado y reubicar a tres alumnos en otro horario. Si en ese mismo instante varios alumnos entran a la app, ven el mes recién habilitado y empiezan a cancelar clases, usar créditos de recuperación o modificar sus suscripciones, tus ajustes se pisan con las acciones de ellos.

Para resolver esto de raíz, sumamos una nueva herramienta pensada específicamente para estas ventanas de mantenimiento: **Congelar temporalmente las modificaciones de los alumnos**.

---

## ¿Cómo funciona esta configuración?

Desde la sección de [Configuración del Espacio]({{< ref "tutorial-16-configuracion-espacio.md" >}}), ahora contás con un nuevo interruptor que podés prender y apagar en cualquier momento con un solo clic:

> **🛠️ Congelar temporalmente las modificaciones de los alumnos (mientras organizás el mes)**

![Configuración del congelamiento temporal en el panel de administrador](/images/tutoriales/blog_04_config_toggle.png)
*Activá o desactivá el congelamiento temporal con un solo clic desde Configuración del Espacio.*

### 1. ¿Qué pasa cuando lo activás?

* **Los administradores siguen teniendo control total**: Vos y tu equipo pueden habilitar meses, crear o borrar turnos, inscribir o dar de baja alumnos, cargar pagos y modificar cualquier configuración sin ninguna restricción.
* **Se pausan todas las operaciones de escritura de los alumnos**: Mientras el interruptor esté encendido, los alumnos **no pueden**:
  * Reservar turnos nuevos.
  * Cancelar clases (ni con devolución ni con pérdida de crédito).
  * Suscribirse o darse de baja de clases recurrentes.
  * Crear o eliminar alertas de cupos libres.
  * Modificar datos de su perfil.
* **Los alumnos siguen pudiendo consultar sus horarios**: No se les cierra el acceso a la app; pueden entrar, ver el calendario y consultar sus clases, pero todos los botones de modificación quedan deshabilitados y protegidos también a nivel servidor.

### 2. Comunicación clara: Banner superior para los alumnos

Para evitar que tus alumnos piensen que hay un error en su cuenta o te escriban por WhatsApp preguntando por qué no pueden tocar un botón, cuando activás esta opción aparece automáticamente un **banner destacado en la parte superior de la aplicación**:

> **🛠️ ¡Estamos organizando los horarios del mes! ✨**  
> *Por el momento las reservas, cancelaciones y cambios en suscripciones están pausados temporalmente mientras el equipo del taller acomoda las clases. ¡En breve vas a poder gestionar tus turnos nuevamente! 🙌*

![Vista de Reservar una Clase con las modificaciones pausadas](/images/tutoriales/blog_04_student_book_frozen.png)
*Los alumnos ven el banner superior informativo y el botón de reserva pausado temporalmente.*

![Vista de Mis Clases con los botones de cancelación deshabilitados](/images/tutoriales/blog_04_student_appointments_frozen.png)
*En "Mis clases", los alumnos pueden consultar sus próximos turnos mientras los botones de cancelación permanecen bloqueados.*

De esta forma, cualquier alumno que ingrese mientras estás armando los horarios entiende al instante qué está pasando y sabe que en unos minutos volverá a tener habilitadas las reservas.

---

## El Flujo Recomendado para Abrir Cada Mes en 4 Pasos

Para que la apertura de cada mes sea ordenada y libre de estrés, te recomendamos seguir esta secuencia:

1. **Activá el congelamiento temporal**: Entrá a **Configuración** y encendé el switch *"Congelar temporalmente las modificaciones de los alumnos"*.
2. **Habilitá el mes**: Andá a la sección de clases recurrentes y habilitá el nuevo mes para que se generen los turnos y las inscripciones automáticas.
3. **Hacé tus ajustes finos con tranquilidad**:
   * Borrá las clases que caigan en feriados.
   * Mové a los alumnos que hayan coordinado un cambio de día u horario.
   * Revisá en el listado de turnos reservados que toda la grilla haya quedado tal como querés.
4. **Desactivá el congelamiento temporal**: Volvé a **Configuración** y apagá el switch. El banner desaparece al instante y tus alumnos ya pueden reservar recuperaciones o gestionar sus clases sobre la grilla definitiva.

---

## Disponible Ahora en tu Espacio

Esta funcionalidad ya está activa para todos los espacios de TuTaller. Podés encontrarla hoy mismo dentro del menú **Configuración** de tu panel de administración, o repasar todas las opciones disponibles en nuestro [Tutorial 16: Configuración Avanzada del Espacio]({{< ref "tutorial-16-configuracion-espacio.md" >}}).
