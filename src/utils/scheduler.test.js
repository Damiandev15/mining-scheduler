/**
 * TEST CASES FOR MINING SCHEDULER ALGORITHM
 * 
 * These test cases validate the scheduler algorithm against the requirements
 */

import { generateSchedule, validateSchedule, STATUS } from './scheduler.js';

// Test Case 1: Régimen 14x7 con 5 días de inducción
export function testCase1() {
    console.log('=== TEST CASE 1: Régimen 14x7 con 5 días de inducción ===');

    const result = generateSchedule(14, 7, 5, 30);
    const validation = validateSchedule(result.schedule);

    console.log('Configuración:');
    console.log('- Días de trabajo: 14');
    console.log('- Días de descanso: 7');
    console.log('- Días de inducción: 5');
    console.log('- Total días perforación: 30');
    console.log('');

    console.log('Resultados:');
    console.log('- Total días: ' + result.totalDays);
    console.log('- S3 entra día: ' + validation.s3ActiveDay);
    console.log('- Errores: ' + validation.errors.length);
    console.log('- Advertencias: ' + validation.warnings.length);
    console.log('- Válido: ' + validation.isValid);

    // Verificaciones
    const checks = {
        s3EntersDayCorrect: validation.s3ActiveDay === 9,
        noErrors: validation.errors.length === 0,
        isValid: validation.isValid
    };

    console.log('');
    console.log('Verificaciones:');
    console.log('✓ S3 entra día 9:', checks.s3EntersDayCorrect ? 'PASS' : 'FAIL');
    console.log('✓ Sin errores:', checks.noErrors ? 'PASS' : 'FAIL');
    console.log('✓ Cronograma válido:', checks.isValid ? 'PASS' : 'FAIL');
    console.log('');

    return checks;
}

// Test Case 2: Régimen 21x7 con 3 días de inducción
export function testCase2() {
    console.log('=== TEST CASE 2: Régimen 21x7 con 3 días de inducción ===');

    const result = generateSchedule(21, 7, 3, 30);
    const validation = validateSchedule(result.schedule);

    console.log('Configuración:');
    console.log('- Días de trabajo: 21');
    console.log('- Días de descanso: 7');
    console.log('- Días de inducción: 3');
    console.log('- Total días perforación: 30');
    console.log('');

    console.log('Resultados:');
    console.log('- Total días: ' + result.totalDays);
    console.log('- S3 entra día: ' + validation.s3ActiveDay);
    console.log('- Errores: ' + validation.errors.length);
    console.log('- Advertencias: ' + validation.warnings.length);
    console.log('- Válido: ' + validation.isValid);

    const checks = {
        s3EntersDayCorrect: validation.s3ActiveDay === 18,
        noErrors: validation.errors.length === 0,
        isValid: validation.isValid
    };

    console.log('');
    console.log('Verificaciones:');
    console.log('✓ S3 entra día 18:', checks.s3EntersDayCorrect ? 'PASS' : 'FAIL');
    console.log('✓ Sin errores:', checks.noErrors ? 'PASS' : 'FAIL');
    console.log('✓ Cronograma válido:', checks.isValid ? 'PASS' : 'FAIL');
    console.log('');

    return checks;
}

// Test Case 3: Régimen 10x5 con 2 días de inducción
export function testCase3() {
    console.log('=== TEST CASE 3: Régimen 10x5 con 2 días de inducción ===');

    const result = generateSchedule(10, 5, 2, 30);
    const validation = validateSchedule(result.schedule);

    console.log('Configuración:');
    console.log('- Días de trabajo: 10');
    console.log('- Días de descanso: 5');
    console.log('- Días de inducción: 2');
    console.log('- Total días perforación: 30');
    console.log('');

    console.log('Resultados:');
    console.log('- Total días: ' + result.totalDays);
    console.log('- S3 entra día: ' + validation.s3ActiveDay);
    console.log('- Errores: ' + validation.errors.length);
    console.log('- Advertencias: ' + validation.warnings.length);
    console.log('- Válido: ' + validation.isValid);

    const checks = {
        s3EntersDayCorrect: validation.s3ActiveDay === 8,
        noErrors: validation.errors.length === 0,
        isValid: validation.isValid
    };

    console.log('');
    console.log('Verificaciones:');
    console.log('✓ S3 entra día 8:', checks.s3EntersDayCorrect ? 'PASS' : 'FAIL');
    console.log('✓ Sin errores:', checks.noErrors ? 'PASS' : 'FAIL');
    console.log('✓ Cronograma válido:', checks.isValid ? 'PASS' : 'FAIL');
    console.log('');

    return checks;
}

// Test Case 4: Verificar que nunca hay 3 perforando
export function testNeverThreeDrilling() {
    console.log('=== TEST CASE 4: Nunca 3 supervisores perforando ===');

    const testConfigs = [
        { workDays: 14, restDays: 7, inductionDays: 5, totalDays: 30 },
        { workDays: 21, restDays: 7, inductionDays: 3, totalDays: 30 },
        { workDays: 10, restDays: 5, inductionDays: 2, totalDays: 30 },
        { workDays: 7, restDays: 7, inductionDays: 1, totalDays: 30 }
    ];

    let allPass = true;

    testConfigs.forEach((config, index) => {
        const result = generateSchedule(
            config.workDays,
            config.restDays,
            config.inductionDays,
            config.totalDays
        );

        const validation = validateSchedule(result.schedule);
        const hasThreeDrilling = validation.errors.some(e => e.type === 'THREE_DRILLING');

        console.log(`Config ${index + 1} (${config.workDays}x${config.restDays}):`,
            hasThreeDrilling ? 'FAIL ❌' : 'PASS ✓');

        if (hasThreeDrilling) {
            allPass = false;
        }
    });

    console.log('');
    console.log('Resultado general:', allPass ? 'PASS ✓' : 'FAIL ❌');
    console.log('');

    return { allPass };
}

// Test Case 5: Verificar que siempre hay 2 perforando (después de S3)
export function testAlwaysTwoDrilling() {
    console.log('=== TEST CASE 5: Siempre 2 supervisores perforando (después S3) ===');

    const testConfigs = [
        { workDays: 14, restDays: 7, inductionDays: 5, totalDays: 30 },
        { workDays: 21, restDays: 7, inductionDays: 3, totalDays: 30 },
        { workDays: 10, restDays: 5, inductionDays: 2, totalDays: 30 }
    ];

    let allPass = true;

    testConfigs.forEach((config, index) => {
        const result = generateSchedule(
            config.workDays,
            config.restDays,
            config.inductionDays,
            config.totalDays
        );

        const validation = validateSchedule(result.schedule);
        const hasOneDrilling = validation.errors.some(e => e.type === 'ONE_DRILLING');

        console.log(`Config ${index + 1} (${config.workDays}x${config.restDays}):`,
            hasOneDrilling ? 'FAIL ❌' : 'PASS ✓');

        if (hasOneDrilling) {
            allPass = false;
        }
    });

    console.log('');
    console.log('Resultado general:', allPass ? 'PASS ✓' : 'FAIL ❌');
    console.log('');

    return { allPass };
}

// Test Case 6: Verificar que S1 mantiene régimen estricto
export function testS1StrictRegime() {
    console.log('=== TEST CASE 6: S1 mantiene régimen estricto ===');

    const result = generateSchedule(14, 7, 5, 30);
    const schedule = result.schedule;

    // Verificar primer ciclo de S1
    let day = 0;

    // Debe empezar con Subida
    const startsWithSubida = schedule.S1[day] === STATUS.SUBIDA;
    console.log('✓ Inicia con Subida:', startsWithSubida ? 'PASS' : 'FAIL');
    day++;

    // Debe tener 5 días de inducción
    let inductionDays = 0;
    while (day < schedule.S1.length && schedule.S1[day] === STATUS.INDUCCION) {
        inductionDays++;
        day++;
    }
    const correctInduction = inductionDays === 5;
    console.log('✓ 5 días de inducción:', correctInduction ? 'PASS' : 'FAIL');

    // Debe tener días de perforación
    let drillingDays = 0;
    while (day < schedule.S1.length && schedule.S1[day] === STATUS.PERFORACION) {
        drillingDays++;
        day++;
    }
    const hasDrilling = drillingDays > 0;
    console.log('✓ Tiene días de perforación:', hasDrilling ? 'PASS' : 'FAIL');

    // Debe terminar con Bajada
    const endsWithBajada = schedule.S1[day] === STATUS.BAJADA;
    console.log('✓ Termina con Bajada:', endsWithBajada ? 'PASS' : 'FAIL');

    const allChecks = startsWithSubida && correctInduction && hasDrilling && endsWithBajada;
    console.log('');
    console.log('Resultado general:', allChecks ? 'PASS ✓' : 'FAIL ❌');
    console.log('');

    return { allChecks };
}

// Run all tests
export function runAllTests() {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  MINING SCHEDULER - SUITE DE PRUEBAS                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    const results = {
        test1: testCase1(),
        test2: testCase2(),
        test3: testCase3(),
        test4: testNeverThreeDrilling(),
        test5: testAlwaysTwoDrilling(),
        test6: testS1StrictRegime()
    };

    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  RESUMEN DE RESULTADOS                                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    let totalTests = 0;
    let passedTests = 0;

    Object.entries(results).forEach(([testName, result]) => {
        const passed = Object.values(result).every(v => v === true);
        totalTests++;
        if (passed) passedTests++;
        console.log(`${testName}: ${passed ? '✓ PASS' : '❌ FAIL'}`);
    });

    console.log('');
    console.log(`Total: ${passedTests}/${totalTests} pruebas pasadas`);
    console.log('');

    return results;
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
    window.runSchedulerTests = runAllTests;
}
