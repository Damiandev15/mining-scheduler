import React from 'react';
import PropTypes from 'prop-types';
import { STATUS } from '../utils/scheduler';

/**
 * ScheduleTable Component
 * Displays the schedule grid with color-coded cells
 */
const ScheduleTable = ({ schedule, validation }) => {
    if (!schedule || !schedule.S1) {
        return null;
    }

    const totalDays = schedule.S1.length;
    const supervisors = ['S1', 'S2', 'S3'];

    // Get cell class based on status
    const getCellClass = (status) => {
        switch (status) {
            case STATUS.SUBIDA:
                return 'cell-S';
            case STATUS.INDUCCION:
                return 'cell-I';
            case STATUS.PERFORACION:
                return 'cell-P';
            case STATUS.BAJADA:
                return 'cell-B';
            case STATUS.DESCANSO:
                return 'cell-D';
            case STATUS.VACIO:
                return 'cell-empty';
            default:
                return '';
        }
    };

    // Get full status name
    const getStatusName = (status) => {
        switch (status) {
            case STATUS.SUBIDA:
                return 'Subida';
            case STATUS.INDUCCION:
                return 'Inducción';
            case STATUS.PERFORACION:
                return 'Perforación';
            case STATUS.BAJADA:
                return 'Bajada';
            case STATUS.DESCANSO:
                return 'Descanso';
            case STATUS.VACIO:
                return 'Vacío';
            default:
                return status;
        }
    };

    // Count drilling supervisors for each day
    const getDrillingCount = (day) => {
        let count = 0;
        supervisors.forEach(supervisor => {
            if (schedule[supervisor][day] === STATUS.PERFORACION) {
                count++;
            }
        });
        return count;
    };

    // Check if drilling count is valid for a day
    const isDrillingCountValid = (day) => {
        const count = getDrillingCount(day);
        // Before S3 is active, any count is ok
        // After S3 is active, must be exactly 2
        if (validation && validation.s3ActiveDay !== undefined) {
            if (day >= validation.s3ActiveDay) {
                return count === 2;
            }
        }
        return true;
    };

    return (
        <div className="card" id="cronograma-generado">
            <h2 className="card-title">Cronograma Generado</h2>

            <div className="schedule-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Supervisor</th>
                            {Array.from({ length: totalDays }, (_, i) => (
                                <th key={i} className="day-header">
                                    D{i}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {supervisors.map(supervisor => (
                            <tr key={supervisor}>
                                <td className="supervisor-label">{supervisor}</td>
                                {schedule[supervisor].map((status, day) => (
                                    <td
                                        key={day}
                                        className={getCellClass(status)}
                                        title={`${supervisor} - Día ${day}: ${getStatusName(status)}`}
                                    >
                                        {status}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr className="drilling-count-row">
                            <td className="supervisor-label">#Perforando</td>
                            {Array.from({ length: totalDays }, (_, day) => {
                                const count = getDrillingCount(day);
                                const isValid = isDrillingCountValid(day);
                                return (
                                    <td
                                        key={day}
                                        className={isValid ? 'drilling-count-valid' : 'drilling-count-invalid'}
                                        title={`Día ${day}: ${count} supervisor(es) perforando`}
                                    >
                                        {count}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            <Legend />
        </div>
    );
};

/**
 * Legend Component
 * Shows color legend for status codes
 */
const Legend = () => {
    const legendItems = [
        { status: STATUS.SUBIDA, label: 'Subida', color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { status: STATUS.INDUCCION, label: 'Inducción', color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' },
        { status: STATUS.PERFORACION, label: 'Perforación', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { status: STATUS.BAJADA, label: 'Bajada', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        { status: STATUS.DESCANSO, label: 'Descanso', color: 'linear-gradient(135deg, #6b7280 0%, #52525b 100%)' },
        { status: STATUS.VACIO, label: 'Vacío', color: '#f3f4f6' }
    ];

    return (
        <div className="legend">
            {legendItems.map(item => (
                <div key={item.status} className="legend-item">
                    <div
                        className="legend-color"
                        style={{ background: item.color }}
                    />
                    <span className="legend-label">
                        {item.status} - {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

ScheduleTable.propTypes = {
    schedule: PropTypes.shape({
        S1: PropTypes.arrayOf(PropTypes.string).isRequired,
        S2: PropTypes.arrayOf(PropTypes.string).isRequired,
        S3: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    validation: PropTypes.shape({
        isValid: PropTypes.bool,
        errors: PropTypes.array,
        warnings: PropTypes.array,
        s3ActiveDay: PropTypes.number
    })
};

export default ScheduleTable;
