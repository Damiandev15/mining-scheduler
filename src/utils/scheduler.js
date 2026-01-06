/**
 * ALGORITMO DE PLANIFICACIÓN DE TURNOS MINEROS - VERSIÓN 10.0 VARIABLE
 * 
 * ALGORITMO DE DESFASE VARIABLE CON RESTRICCIÓN DE MÁXIMO 2 SUPERVISORES
 * 
 * Este algoritmo cumple con la cláusula contractual:
 * "NO PUEDEN ESTAR 3 SUPERVISORES PERFORANDO AL MISMO TIEMPO"
 * 
 * Principio Clave:
 * - Sistema VARIABLE: permite 0, 1 o 2 supervisores perforando
 * - NUNCA permite 3 supervisores perforando simultáneamente
 * - Cada supervisor sigue su propio ciclo de trabajo/descanso
 * - Los desfases se calculan para optimizar cobertura sin violar la restricción
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

    // PASO 1: Generar S1 (comienza en día 0)
    generateSupervisor(schedule.S1, 0, workDays, restDays, inductionDays, totalDrillingDays, true);

    // PASO 2: Calcular desfase para S2
    // S2 comienza después de que S1 haya terminado su inducción
    // Esto crea variabilidad en la cantidad de supervisores perforando
    const s2Offset = Math.floor(cycleLength / 3);
    generateSupervisor(schedule.S2, s2Offset, workDays, restDays, inductionDays, totalDrillingDays, true);

    // PASO 3: Calcular desfase para S3
    // S3 debe estar desfasado de tal manera que NUNCA coincidan los 3 perforando
    // Usamos 2/3 del ciclo para maximizar la separación
    const s3Offset = Math.floor((cycleLength * 2) / 3);
    generateSupervisor(schedule.S3, s3Offset, workDays, restDays, inductionDays, totalDrillingDays, true);

    // PASO 4: Encontrar último día relevante
    const lastDay = findLastDrillingDay(schedule);
    const actualDays = lastDay + restDays + 10;

    const trimmed = {
        S1: schedule.S1.slice(0, actualDays),
        S2: schedule.S2.slice(0, actualDays),
        S3: schedule.S3.slice(0, actualDays)
    };

    // PASO 5: Validar que NUNCA haya 3 supervisores perforando
    const validation = validateSchedule(trimmed);

    return {
        schedule: trimmed,
        validation,
        totalDays: actualDays,
        offsets: {
            S1: 0,
            S2: s2Offset,
            S3: s3Offset
        }
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

    // Contadores para estadísticas
    let daysWithZero = 0;
    let daysWithOne = 0;
    let daysWithTwo = 0;
    let daysWithThree = 0;

    // VALIDACIÓN PRINCIPAL: NUNCA 3 SUPERVISORES PERFORANDO
    for (let day = 0; day < totalDays; day++) {
        const count = countDrilling(schedule, day);

        // Contar distribución
        if (count === 0) daysWithZero++;
        if (count === 1) daysWithOne++;
        if (count === 2) daysWithTwo++;
        if (count === 3) daysWithThree++;

        // ERROR CRÍTICO: 3 supervisores perforando (VIOLA LA CLÁUSULA)
        if (count === 3) {
            errors.push({
                day,
                type: 'THREE_DRILLING',
                severity: 'CRITICAL',
                message: `Día ${day}: 3 supervisores perforando - VIOLA CLÁUSULA CONTRACTUAL`,
                supervisors: [
                    schedule.S1[day] === STATUS.PERFORACION ? 'S1' : null,
                    schedule.S2[day] === STATUS.PERFORACION ? 'S2' : null,
                    schedule.S3[day] === STATUS.PERFORACION ? 'S3' : null
                ].filter(s => s !== null)
            });
        }

        // Verificar patrones inválidos en cada supervisor
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
        distribution: {
            daysWithZero,
            daysWithOne,
            daysWithTwo,
            daysWithThree
        },
        compliance: {
            contractClause: daysWithThree === 0,
            message: daysWithThree === 0
                ? '✓ Cumple cláusula: NUNCA 3 supervisores perforando simultáneamente'
                : `✗ VIOLA cláusula: ${daysWithThree} día(s) con 3 supervisores perforando`
        }
    };
}

export function getScheduleStats(schedule) {
    const totalDays = schedule.S1.length;
    let totalDrillingDays = 0;
    let daysWithZeroDrilling = 0;
    let daysWithOneDrilling = 0;
    let daysWithTwoDrilling = 0;
    let daysWithThreeDrilling = 0;

    for (let day = 0; day < totalDays; day++) {
        const count = countDrilling(schedule, day);
        if (count === 0) daysWithZeroDrilling++;
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
        distribution: {
            zero: daysWithZeroDrilling,
            one: daysWithOneDrilling,
            two: daysWithTwoDrilling,
            three: daysWithThreeDrilling
        },
        compliance: {
            meetsContractClause: daysWithThreeDrilling === 0,
            violationDays: daysWithThreeDrilling
        },
        // Mantener compatibilidad con código existente
        daysWithTwoDrilling,
        daysWithOneDrilling,
        daysWithThreeDrilling
    };
}

export { STATUS };
