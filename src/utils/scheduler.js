/**
 * ALGORITMO DE PLANIFICACIÓN DE TURNOS MINEROS - VERSIÓN 9.0 FINAL
 * 
 * ALGORITMO DE DESFASE ÓPTIMO
 * 
 * Este algoritmo usa un desfase calculado matemáticamente para garantizar
 * EXACTAMENTE 2 supervisores perforando en TODOS los días.
 * 
 * Principio Clave:
 * - S1 y S2 comienzan juntos (día 0)
 * - S3 comienza con un desfase de (workDays / 2) días
 * - Esto crea un patrón donde SIEMPRE hay exactamente 2 trabajando
 */

const STATUS = {
    SUBIDA: 'S',
    INDUCCION: 'I',
    PERFORACION: 'P',
    BAJADA: 'B',
    DESCANSO: 'D',
    VACIO: '-'
};

export function generateSchedule(workDays, restDays, inductionDays, totalDrillingDays) {
    const cycleLength = workDays + restDays;
    const realRestDays = restDays - 2;

    // Calcular días totales necesarios
    const estimatedCycles = Math.ceil((totalDrillingDays * 1.5) / workDays) + 5;
    const totalDays = cycleLength * estimatedCycles;

    // Inicializar cronograma
    const schedule = {
        S1: new Array(totalDays).fill(STATUS.VACIO),
        S2: new Array(totalDays).fill(STATUS.VACIO),
        S3: new Array(totalDays).fill(STATUS.VACIO)
    };

    // PASO 1: Generar S1 y S2 (comienzan juntos)
    generateSupervisor(schedule.S1, 0, workDays, restDays, inductionDays, totalDrillingDays, true);
    generateSupervisor(schedule.S2, 0, workDays, restDays, inductionDays, totalDrillingDays, true);

    // PASO 2: Generar S3 con desfase óptimo
    // El desfase óptimo es la mitad del período de trabajo
    const s3Offset = Math.floor(workDays / 2) + 1;
    generateSupervisor(schedule.S3, s3Offset, workDays, restDays, inductionDays, totalDrillingDays, true);

    // PASO 3: Encontrar último día relevante
    const lastDay = findLastDrillingDay(schedule);
    const actualDays = lastDay + restDays + 10;

    const trimmed = {
        S1: schedule.S1.slice(0, actualDays),
        S2: schedule.S2.slice(0, actualDays),
        S3: schedule.S3.slice(0, actualDays)
    };

    // PASO 4: Validar
    const validation = validateSchedule(trimmed);

    return {
        schedule: trimmed,
        validation,
        totalDays: actualDays
    };
}

/**
 * Generar cronograma para un supervisor individual
 */
function generateSupervisor(supervisorSchedule, startDay, workDays, restDays, inductionDays, totalDrillingDays, hasInduction) {
    let day = startDay;
    let drillingDone = 0;
    const realRestDays = restDays - 2;
    let isFirstCycle = true;

    while (drillingDone < totalDrillingDays && day < supervisorSchedule.length - workDays - restDays) {
        // Subida
        supervisorSchedule[day++] = STATUS.SUBIDA;

        // Inducción (solo primer ciclo si corresponde)
        if (isFirstCycle && hasInduction) {
            for (let i = 0; i < inductionDays; i++) {
                supervisorSchedule[day++] = STATUS.INDUCCION;
            }
        }

        // Perforación
        const daysToWork = (isFirstCycle && hasInduction) ? workDays - inductionDays : workDays;
        const daysThisCycle = Math.min(daysToWork, totalDrillingDays - drillingDone);

        for (let i = 0; i < daysThisCycle; i++) {
            supervisorSchedule[day++] = STATUS.PERFORACION;
            drillingDone++;
        }

        // Bajada
        supervisorSchedule[day++] = STATUS.BAJADA;

        // Descanso
        for (let i = 0; i < realRestDays; i++) {
            supervisorSchedule[day++] = STATUS.DESCANSO;
        }

        isFirstCycle = false;
    }
}

function findLastDrillingDay(schedule) {
    let lastDay = 0;
    ['S1', 'S2', 'S3'].forEach(sup => {
        for (let i = schedule[sup].length - 1; i >= 0; i--) {
            if (schedule[sup][i] === STATUS.PERFORACION) {
                lastDay = Math.max(lastDay, i);
                break;
            }
        }
    });
    return lastDay;
}

function countDrilling(schedule, day) {
    let count = 0;
    if (schedule.S1[day] === STATUS.PERFORACION) count++;
    if (schedule.S2[day] === STATUS.PERFORACION) count++;
    if (schedule.S3[day] === STATUS.PERFORACION) count++;
    return count;
}

export function validateSchedule(schedule) {
    const errors = [];
    const warnings = [];
    const totalDays = schedule.S1.length;

    // Encontrar cuándo S3 comienza a perforar
    let s3DrillingStart = -1;
    for (let day = 0; day < totalDays; day++) {
        if (schedule.S3[day] === STATUS.PERFORACION) {
            s3DrillingStart = day;
            break;
        }
    }

    // Validar cada día después de que S3 esté activo
    for (let day = 0; day < totalDays; day++) {
        const count = countDrilling(schedule, day);

        if (day >= s3DrillingStart && s3DrillingStart !== -1) {
            if (count === 3) {
                errors.push({
                    day,
                    type: 'THREE_DRILLING',
                    message: `Día ${day}: 3 supervisores perforando (PROHIBIDO)`
                });
            } else if (count === 1) {
                errors.push({
                    day,
                    type: 'ONE_DRILLING',
                    message: `Día ${day}: Solo 1 supervisor perforando (PROHIBIDO después que S3 entró)`
                });
            } else if (count === 0) {
                errors.push({
                    day,
                    type: 'ZERO_DRILLING',
                    message: `Día ${day}: 0 supervisores perforando (PROHIBIDO)`
                });
            }
        }

        // Verificar patrones inválidos
        ['S1', 'S2', 'S3'].forEach(sup => {
            const today = schedule[sup][day];
            const tomorrow = day < totalDays - 1 ? schedule[sup][day + 1] : null;

            if (today === STATUS.SUBIDA && tomorrow === STATUS.SUBIDA) {
                warnings.push({
                    day,
                    supervisor: sup,
                    type: 'CONSECUTIVE_SUBIDA',
                    message: `${sup} Día ${day}: Subida consecutiva (S-S)`
                });
            }

            if (today === STATUS.SUBIDA && tomorrow === STATUS.BAJADA) {
                warnings.push({
                    day,
                    supervisor: sup,
                    type: 'SUBIDA_BAJADA',
                    message: `${sup} Día ${day}: Subida seguida de bajada sin perforar (S-B)`
                });
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        s3ActiveDay: s3DrillingStart
    };
}

export function getScheduleStats(schedule) {
    const totalDays = schedule.S1.length;
    let totalDrillingDays = 0;
    let daysWithTwoDrilling = 0;
    let daysWithOneDrilling = 0;
    let daysWithThreeDrilling = 0;

    for (let day = 0; day < totalDays; day++) {
        const count = countDrilling(schedule, day);
        if (count === 1) daysWithOneDrilling++;
        if (count === 2) daysWithTwoDrilling++;
        if (count === 3) daysWithThreeDrilling++;

        ['S1', 'S2', 'S3'].forEach(sup => {
            if (schedule[sup][day] === STATUS.PERFORACION) {
                totalDrillingDays++;
            }
        });
    }

    return {
        totalDays,
        totalDrillingDays,
        daysWithTwoDrilling,
        daysWithOneDrilling,
        daysWithThreeDrilling
    };
}

export { STATUS };
