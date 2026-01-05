import { useState } from 'react';
import Swal from 'sweetalert2';
import './index.css';
import ConfigForm from './components/ConfigForm';
import ScheduleTable from './components/ScheduleTable';
import ValidationAlerts from './components/ValidationAlerts';
import { generateSchedule, getScheduleStats } from './utils/scheduler';

function App() {
  // Estado de configuración
  const [config, setConfig] = useState({
    workDays: 14,
    restDays: 7,
    inductionDays: 5,
    totalDrillingDays: 90
  });

  // Estado del cronograma
  const [scheduleData, setScheduleData] = useState(null);

  // Manejar cambio de configuración
  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
  };

  // Calcular cronograma
  const handleCalculate = () => {
    try {
      const result = generateSchedule(
        config.workDays,
        config.restDays,
        config.inductionDays,
        config.totalDrillingDays
      );

      const stats = getScheduleStats(result.schedule);

      setScheduleData({
        schedule: result.schedule,
        validation: result.validation,
        stats: stats,
        totalDays: result.totalDays
      });

      // Mostrar mensaje de éxito
      Swal.fire({
        title: '✅ Cronograma Generado Exitosamente',
        text: 'El cronograma de turnos ha sido creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      });

      // Desplazar a resultados
      setTimeout(() => {
        const scheduleElement = document.querySelector('.schedule-container');
        if (scheduleElement) {
          scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating schedule:', error);
      Swal.fire({
        title: '❌ Error',
        text: 'Error al generar el cronograma. Por favor, verifica los parámetros.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="container">
      {/* Encabezado */}
      <header className="app-header">
        <h1>⛏️ Sistema de Planificación de Turnos Mineros</h1>
        <p>Gestión inteligente de supervisores de perforación</p>
      </header>

      {/* Formulario de Configuración */}
      <ConfigForm
        config={config}
        onChange={handleConfigChange}
        onCalculate={handleCalculate}
      />

      {/* Resultados */}
      {scheduleData && (
        <>
          {/* Estadísticas (sin alertas de errores) */}
          <ValidationAlerts
            validation={scheduleData.validation}
            stats={scheduleData.stats}
          />

          {/* Tabla de Cronograma */}
          <ScheduleTable
            schedule={scheduleData.schedule}
            validation={scheduleData.validation}
          />
        </>
      )}

      {/* Pie de página */}
      <footer style={{
        textAlign: 'center',
        marginTop: 'var(--spacing-2xl)',
        padding: 'var(--spacing-xl)',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <p style={{ marginTop: 'var(--spacing-sm)' }}>
          Desarrollado con React.js
        </p>
      </footer>
    </div>
  );
}

export default App;
