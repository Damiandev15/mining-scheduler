import PropTypes from 'prop-types';

/**
 * Componente de Estadísticas del Cronograma
 * Muestra métricas clave del cronograma generado
 */
function ValidationAlerts({ validation, stats }) {
    return (
        <div className="stats-container">
            <div className="stats-header">
                <h2>📊 Estadísticas del Cronograma</h2>
                <p className="stats-subtitle">Métricas clave del cronograma generado</p>
            </div>

            <div className="stats-grid-modern">
                {/* Días Totales */}
                <div className="stat-card-modern stat-primary">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{stats.totalDays}</div>
                        <div className="stat-label-modern">Días Totales</div>
                    </div>
                </div>

                {/* Días-Supervisor Perforando */}
                <div className="stat-card-modern stat-info">
                    <div className="stat-icon">⛏️</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{stats.totalDrillingDays}</div>
                        <div className="stat-label-modern">Días-Supervisor Perforando</div>
                    </div>
                </div>

                {/* Días con 2 Perforando */}
                <div className="stat-card-modern stat-success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{stats.daysWithTwoDrilling}</div>
                        <div className="stat-label-modern">Días con 2 Perforando</div>
                        <div className="stat-badge stat-badge-success">Óptimo</div>
                    </div>
                </div>

                {/* Días con 1 Perforando */}
                <div className="stat-card-modern stat-warning">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{stats.daysWithOneDrilling}</div>
                        <div className="stat-label-modern">Días con 1 Perforando</div>
                        {stats.daysWithOneDrilling > 0 && (
                            <div className="stat-badge stat-badge-warning">Revisar</div>
                        )}
                    </div>
                </div>

                {/* Días con 3 Perforando */}
                <div className="stat-card-modern stat-error">
                    <div className="stat-icon">🔴</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{stats.daysWithThreeDrilling}</div>
                        <div className="stat-label-modern">Días con 3 Perforando</div>
                        {stats.daysWithThreeDrilling > 0 && (
                            <div className="stat-badge stat-badge-error">Exceso</div>
                        )}
                    </div>
                </div>

                {/* Día Entrada S3 */}
                <div className="stat-card-modern stat-accent">
                    <div className="stat-icon">🚀</div>
                    <div className="stat-content">
                        <div className="stat-value-modern">{validation.s3ActiveDay}</div>
                        <div className="stat-label-modern">Día Entrada S3</div>
                        <div className="stat-badge stat-badge-accent">Inicio</div>
                    </div>
                </div>
            </div>

            {/* Resumen rápido */}
            <div className="stats-summary">
                <div className="summary-item">
                    <span className="summary-label">Eficiencia:</span>
                    <span className="summary-value">
                        {((stats.daysWithTwoDrilling / stats.totalDays) * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Promedio Supervisores/Día:</span>
                    <span className="summary-value">
                        {(stats.totalDrillingDays / stats.totalDays).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

ValidationAlerts.propTypes = {
    validation: PropTypes.shape({
        isValid: PropTypes.bool.isRequired,
        errors: PropTypes.array.isRequired,
        warnings: PropTypes.array.isRequired,
        s3ActiveDay: PropTypes.number
    }).isRequired,
    stats: PropTypes.shape({
        totalDays: PropTypes.number.isRequired,
        totalDrillingDays: PropTypes.number.isRequired,
        daysWithTwoDrilling: PropTypes.number.isRequired,
        daysWithOneDrilling: PropTypes.number.isRequired,
        daysWithThreeDrilling: PropTypes.number.isRequired
    }).isRequired
};

export default ValidationAlerts;
