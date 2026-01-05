import React from 'react';
import PropTypes from 'prop-types';

/**
 * ConfigForm Component
 * Handles user input for schedule configuration
 */
const ConfigForm = ({ config, onChange, onCalculate }) => {
    const handleInputChange = (field, value) => {
        onChange({
            ...config,
            [field]: parseInt(value) || 0
        });
    };

    const isValid = () => {
        return (
            config.workDays > 0 &&
            config.restDays > 0 &&
            config.inductionDays >= 1 &&
            config.inductionDays <= 5 &&
            config.totalDrillingDays > 0 &&
            config.workDays > config.inductionDays
        );
    };

    return (
        <div className="card">
            <h2 className="card-title">Configuración del Régimen</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label" htmlFor="workDays">
                        Días de Trabajo (N)
                    </label>
                    <input
                        id="workDays"
                        type="number"
                        className="form-input"
                        value={config.workDays}
                        onChange={(e) => handleInputChange('workDays', e.target.value)}
                        min="1"
                        max="30"
                        placeholder="Ej: 14"
                    />
                    <span className="form-help">Días de trabajo en el régimen NxM</span>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="restDays">
                        Días de Descanso Total (M)
                    </label>
                    <input
                        id="restDays"
                        type="number"
                        className="form-input"
                        value={config.restDays}
                        onChange={(e) => handleInputChange('restDays', e.target.value)}
                        min="1"
                        max="30"
                        placeholder="Ej: 7"
                    />
                    <span className="form-help">
                        Días totales de descanso (incluye subida y bajada)
                    </span>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="inductionDays">
                        Días de Inducción
                    </label>
                    <input
                        id="inductionDays"
                        type="number"
                        className="form-input"
                        value={config.inductionDays}
                        onChange={(e) => handleInputChange('inductionDays', e.target.value)}
                        min="1"
                        max="5"
                        placeholder="Ej: 5"
                    />
                    <span className="form-help">Entre 1 y 5 días de capacitación</span>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="totalDrillingDays">
                        Total Días de Perforación
                    </label>
                    <input
                        id="totalDrillingDays"
                        type="number"
                        className="form-input"
                        value={config.totalDrillingDays}
                        onChange={(e) => handleInputChange('totalDrillingDays', e.target.value)}
                        min="1"
                        max="365"
                        placeholder="Ej: 30"
                    />
                    <span className="form-help">Días totales requeridos de perforación</span>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{config.workDays}x{config.restDays}</div>
                    <div className="stat-label">Régimen</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{Math.max(0, config.restDays - 2)}</div>
                    <div className="stat-label">Días Descanso Real</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{Math.max(0, config.workDays - config.inductionDays)}</div>
                    <div className="stat-label">Días Perforación/Ciclo</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {config.workDays > config.inductionDays
                            ? Math.ceil(config.totalDrillingDays / (config.workDays - config.inductionDays))
                            : 0
                        }
                    </div>
                    <div className="stat-label">Ciclos Estimados</div>
                </div>
            </div>

            <div className="btn-container">
                <button
                    className="btn btn-primary"
                    onClick={onCalculate}
                    disabled={!isValid()}
                >
                    🔄 Calcular Cronograma
                </button>
            </div>

            {!isValid() && (
                <div className="alert alert-warning" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">
                        <div className="alert-title">Configuración Incompleta</div>
                        <div className="alert-message">
                            Por favor, completa todos los campos correctamente. Los días de trabajo deben ser mayores que los días de inducción.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ConfigForm.propTypes = {
    config: PropTypes.shape({
        workDays: PropTypes.number.isRequired,
        restDays: PropTypes.number.isRequired,
        inductionDays: PropTypes.number.isRequired,
        totalDrillingDays: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onCalculate: PropTypes.func.isRequired
};

export default ConfigForm;
