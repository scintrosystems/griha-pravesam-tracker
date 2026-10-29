import React, { useState } from 'react';
import API from '../api/axiosClient';

const AVAILABLE_BASE_FIELDS = [
    { key: 'date', label: 'Date Picker', icon: 'bi-calendar3' },
    { key: 'time', label: 'Time (Start & End Clock)', icon: 'bi-clock' },
    { key: 'location', label: 'Location (Dropdown)', icon: 'bi-geo-alt' },
    { key: 'inCharge', label: 'In-Charge / Person (Dropdown)', icon: 'bi-person' },
    { key: 'transportMode', label: 'Transport Mode (Dropdown)', icon: 'bi-car-front' },
    { key: 'amount', label: 'Amount / Price', icon: 'bi-currency-rupee' },
    { key: 'details', label: 'Details / Specifications', icon: 'bi-tag' }
];

export default function NewTabModal({ show, onClose, onTabCreated }) {
    const [label, setLabel] = useState('');
    const [icon, setIcon] = useState('bi-folder');
    const [selectedBaseFields, setSelectedBaseFields] = useState(['date', 'inCharge']);
    const [customFields, setCustomFields] = useState([]);
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');

    if (!show) return null;

    const toggleBaseField = (key) => {
        setSelectedBaseFields(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleAddCustomField = () => {
        if (!newFieldName.trim()) return;
        const key = newFieldName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        setCustomFields([...customFields, { key, label: newFieldName.trim(), type: newFieldType }]);
        setNewFieldName('');
        setNewFieldType('text');
    };

    const handleRemoveCustomField = (index) => {
        setCustomFields(customFields.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!label.trim()) return;

        // Combine base selected + user created custom fields
        const finalFields = [
            ...selectedBaseFields.map(key => ({
                key,
                label: AVAILABLE_BASE_FIELDS.find(f => f.key === key)?.label || key,
                type: key === 'date' ? 'date' : key === 'time' ? 'time' : 'text'
            })),
            ...customFields
        ];

        try {
            const res = await API.post('/tabs', { label, icon, customFields: finalFields });
            setLabel('');
            setSelectedBaseFields(['date', 'inCharge']);
            setCustomFields([]);
            onTabCreated(res.data);
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create tab');
        }
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-modern" style={{ maxWidth: '480px' }}>
                <div className="modal-header-modern">
                    <div className="d-flex align-items-center gap-2">
                        <div className="header-icon">
                            <i className="bi bi-folder-plus"></i>
                        </div>
                        <div>
                            <h6 className="header-title">Create Custom Tab</h6>
                            <span className="text-muted" style={{ fontSize: '11px' }}>Pick or add input fields for this section</span>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden">
                    <div className="p-3 overflow-y-auto flex-grow-1" style={{ maxHeight: '72vh' }}>
                        {/* Tab Name & Icon */}
                        <div className="row g-2 mb-3">
                            <div className="col-8">
                                <label className="modal-label">Tab Name *</label>
                                <input
                                    type="text"
                                    className="modal-input w-100"
                                    placeholder="e.g. Photography, Gifts, Music"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-4">
                                <label className="modal-label">Icon</label>
                                <select className="modal-select w-100" value={icon} onChange={(e) => setIcon(e.target.value)}>
                                    <option value="bi-folder">📁 Folder</option>
                                    <option value="bi-camera">📷 Camera</option>
                                    <option value="bi-gift">🎁 Gifts</option>
                                    <option value="bi-music-note-beamed">🎵 Music</option>
                                    <option value="bi-cash-coin">💰 Finance</option>
                                    <option value="bi-stars">✨ Rituals</option>
                                </select>
                            </div>
                        </div>

                        {/* Select existing fields */}
                        <span className="modal-label mb-1.5"><i className="bi bi-check2-square"></i> Include Existing Fields:</span>
                        <div className="p-2 border rounded-3 bg-light mb-3">
                            <div className="row g-2">
                                {AVAILABLE_BASE_FIELDS.map(f => (
                                    <div key={f.key} className="col-6">
                                        <div className="form-check small mb-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`field_${f.key}`}
                                                checked={selectedBaseFields.includes(f.key)}
                                                onChange={() => toggleBaseField(f.key)}
                                            />
                                            <label className="form-check-label text-dark" htmlFor={`field_${f.key}`}>
                                                <i className={`bi ${f.icon} me-1 text-muted`}></i>{f.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add completely new custom field */}
                        <span className="modal-label mb-1.5"><i className="bi bi-plus-circle"></i> Add Completely New Custom Fields:</span>
                        <div className="p-2 border rounded-3 bg-light mb-2">
                            <div className="row g-1.5 mb-2">
                                <div className="col-7">
                                    <input
                                        type="text"
                                        className="modal-input w-100"
                                        placeholder="Field name (e.g. Photographers Count)"
                                        value={newFieldName}
                                        onChange={(e) => setNewFieldName(e.target.value)}
                                    />
                                </div>
                                <div className="col-3">
                                    <select
                                        className="modal-select w-100"
                                        value={newFieldType}
                                        onChange={(e) => setNewFieldType(e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                    </select>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-sm btn-outline-amber w-100 py-1" onClick={handleAddCustomField}>
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Added Custom Fields Badges */}
                            {customFields.length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                    {customFields.map((cf, idx) => (
                                        <span key={idx} className="badge bg-white text-dark border d-flex align-items-center gap-1">
                                            <span>{cf.label} ({cf.type})</span>
                                            <i className="bi bi-x text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveCustomField(idx)}></i>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer-modern">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Create Tab</button>
                    </div>
                </form>
            </div>
        </div>
    );
}