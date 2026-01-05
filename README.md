# ⛏️ PRUEBA TECNICA - Sistema de Planificación de Turnos Mineros

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)

## 🎯 Características Principales

- ✅ **Algoritmo Avanzado**: Genera cronogramas cumpliendo reglas estrictas
- 🎨 **Interfaz Moderna**: Diseño premium con gradientes y animaciones
- 📊 **Validación en Tiempo Real**: Detecta y reporta errores automáticamente
- 📈 **Estadísticas Detalladas**: Métricas completas del cronograma
- 🎨 **Visualización Clara**: Código de colores para cada estado
- 📱 **Responsive**: Funciona en desktop, tablet y móvil

## 🔧 Reglas Fundamentales

El sistema garantiza:

1. **Siempre EXACTAMENTE 2 supervisores perforando** (una vez que S3 entró)
2. **NUNCA 3 supervisores perforando** simultáneamente
3. **NUNCA 1 supervisor perforando** (después que S3 entró)
4. **S1 SIEMPRE cumple el régimen completo** sin modificaciones
5. **S2 y S3 se ajustan** para cumplir las reglas

## 📋 Ciclo de un Supervisor

```
S  = Subida (viaje al campo) - siempre 1 día
I  = Inducción (capacitación) - configurable (1 a 5 días)
P  = Perforación (trabajo efectivo)
B  = Bajada (retorno) - siempre 1 día
D  = Descanso
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd mining-scheduler

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Uso de la Aplicación

1. **Configurar Parámetros**:

   - Días de trabajo (N en régimen NxM)
   - Días de descanso total (M en régimen NxM)
   - Días de inducción (1-5)
   - Total de días de perforación requeridos

2. **Generar Cronograma**:

   - Click en "Calcular Cronograma"
   - El sistema genera automáticamente el schedule

3. **Revisar Resultados**:
   - Tabla visual con código de colores
   - Alertas de validación
   - Estadísticas detalladas

## 🎨 Código de Colores

| Color      | Estado          | Descripción      |
| ---------- | --------------- | ---------------- |
| 🔵 Azul    | S - Subida      | Viaje al campo   |
| 🟠 Naranja | I - Inducción   | Capacitación     |
| 🟢 Verde   | P - Perforación | Trabajo efectivo |
| 🔴 Rojo    | B - Bajada      | Retorno          |
| ⚫ Gris    | D - Descanso    | Días libres      |
| ⚪ Blanco  | - - Vacío       | Sin actividad    |

## 📊 Ejemplos de Regímenes

### Régimen 14x7 con 5 días de inducción

```
Parámetros:
- Días de trabajo: 14
- Días de descanso: 7
- Días de inducción: 5
- Total días perforación: 30

Resultado:
- Días descanso real: 5 (7 - 2)
- Días perforación/ciclo: 9 (14 - 5)
- Ciclos estimados: 4
```

### Régimen 21x7 con 3 días de inducción

```
Parámetros:
- Días de trabajo: 21
- Días de descanso: 7
- Días de inducción: 3
- Total días perforación: 30

Resultado:
- Días descanso real: 5 (7 - 2)
- Días perforación/ciclo: 18 (21 - 3)
- Ciclos estimados: 2
```

## 🏗️ Arquitectura del Proyecto

```
mining-scheduler/
├── src/
│   ├── components/
│   │   ├── ConfigForm.jsx       # Formulario de configuración
│   │   ├── ScheduleTable.jsx    # Tabla de cronograma
│   │   └── ValidationAlerts.jsx # Alertas y validaciones
│   ├── utils/
│   │   └── scheduler.js         # Algoritmo principal
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── index.html                   # HTML base
├── package.json                 # Dependencias
└── README.md                    # Documentación
```

## 🧮 Algoritmo de Scheduling

El algoritmo implementa una estrategia de 3 fases:

### Fase 1: Generación de S1

- S1 sigue estrictamente el régimen NxM
- Nunca se modifica su cronograma
- Sirve como referencia para S2 y S3

### Fase 2: Generación de S2

- Inicia junto con S1
- Se ajusta para coordinar con S3
- Cubre cuando S1 está en descanso

### Fase 3: Generación de S3

- Entra cuando S1 va a descanso
- Mantiene siempre 2 supervisores perforando
- Se coordina con S2 para rotaciones

### Fase 4: Ajustes y Validación

- Corrige días con 1 o 3 perforando
- Valida patrones inválidos (S-S, S-B)
- Genera reporte de errores y advertencias

## 📈 Validaciones Implementadas

### Errores Críticos

- ❌ 3 supervisores perforando simultáneamente
- ❌ 1 supervisor perforando (después de S3 activo)

### Advertencias

- ⚠️ Subida consecutiva (S-S)
- ⚠️ Subida seguida de bajada (S-B)
- ⚠️ Perforación de 1 solo día
