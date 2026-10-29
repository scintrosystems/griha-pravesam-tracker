import React, { useState } from 'react';
import API from '../api/axiosClient';

const TYPE_CONFIG = {
    LOCATION: { single: 'Location', plural: 'Locations', icon: 'bi-geo-alt' },
    PERSON: { single: 'Contact / Person', plural: 'Contacts', icon: 'bi-person' },
    TRANSPORT_MODE: { single: 'Vehicle', plural: 'Vehicles', icon: 'bi-car-front' }
};

export default function LookupModal({ show, onClose, lookups, onLookupUpdated }) {
    const [type, setType] = useState('LOCATION');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [mapUrl, setMapUrl] = useState('');
    const [notes, setNotes] = useState('');

    if (!show) return null;

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await API.post('/lookups', { type, name, phone, mapUrl, notes });
            setName('');
            setPhone('');
            setMapUrl('');
            setNotes('');
            onLookupUpdated();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save lookup');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item from dropdowns?')) return;
        try {
            await API.delete(`/lookups/${id}`);
            onLookupUpdated();
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    const filteredLookups = lookups.filter((l) => l.type === type);
    const currentConfig = TYPE_CONFIG[type] || { single: 'Item', plural: 'Items', icon: 'bi-tag' };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-modern" style={{ maxWidth: '680px' }}>

                {/* Header */}
                <div className="modal-header-modern">
                    <div className="d-flex align-items-center gap-2">
                        <div className="header-icon">
                            <i className="bi bi-gear-fill"></i>
                        </div>
                        <div>
                            <h6 className="header-title">Master Dropdowns</h6>
                            <span className="text-muted" style={{ fontSize: '11px' }}>Manage locations, contacts & vehicles</span>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="p-3 overflow-y-auto" style={{ maxHeight: '72vh' }}>

                    {/* Navigation Category Pills */}
                    <div className="d-flex gap-1.5 p-1 bg-light rounded-3 mb-3 border">
                        <button
                            type="button"
                            className={`btn btn-sm flex-grow-1 fw-semibold ${type === 'LOCATION' ? 'btn-amber shadow-xs' : 'text-secondary'}`}
                            onClick={() => setType('LOCATION')}
                        >
                            <i className="bi bi-geo-alt me-1"></i> Locations
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm flex-grow-1 fw-semibold ${type === 'PERSON' ? 'btn-amber shadow-xs' : 'text-secondary'}`}
                            onClick={() => setType('PERSON')}
                        >
                            <i className="bi bi-person me-1"></i> Contacts / Persons
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm flex-grow-1 fw-semibold ${type === 'TRANSPORT_MODE' ? 'btn-amber shadow-xs' : 'text-secondary'}`}
                            onClick={() => setType('TRANSPORT_MODE')}
                        >
                            <i className="bi bi-car-front me-1"></i> Vehicles
                        </button>
                    </div>

                    {/* Clean Quick Add Form with properly styled Add button */}
                    <form onSubmit={handleCreate} className="p-2.5 rounded-3 border bg-light mb-3">
                        <span className="modal-label mb-1.5">
                            <i className="bi bi-plus-circle"></i> Add New {currentConfig.single}
                        </span>

                        <div className="row g-2 align-items-center">
                            {/* Field 1: Name */}
                            <div className={type === 'TRANSPORT_MODE' ? 'col-12 col-sm-5' : 'col-12 col-sm-4'}>
                                <input
                                    type="text"
                                    className="modal-input w-100"
                                    placeholder={type === 'TRANSPORT_MODE' ? 'Vehicle Model (e.g. Marazzo 7-Str) *' : 'Name / Title *'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Field 2: Conditional Phone or Map */}
                            {type === 'PERSON' && (
                                <div className="col-12 col-sm-3">
                                    <input
                                        type="tel"
                                        className="modal-input w-100"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            )}

                            {type === 'LOCATION' && (
                                <div className="col-12 col-sm-3">
                                    <input
                                        type="url"
                                        className="modal-input w-100"
                                        placeholder="Google Maps URL"
                                        value={mapUrl}
                                        onChange={(e) => setMapUrl(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Field 3: Notes / Rate */}
                            <div className={type === 'TRANSPORT_MODE' ? 'col-8 col-sm-5' : 'col-8 col-sm-3'}>
                                <input
                                    type="text"
                                    className="modal-input w-100"
                                    placeholder={type === 'TRANSPORT_MODE' ? 'Pricing (e.g. ₹3000/day + ₹13/KM)' : 'Notes (optional)'}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* Field 4: Styled Add Button */}
                            <div className="col-4 col-sm-2 text-end">
                                <button type="submit" className="btn-submit w-100 py-1.5">
                                    <i className="bi bi-plus-lg me-1"></i> Add
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Registered List Table */}
                    <span className="modal-label mb-1">
                        <i className="bi bi-list-check"></i> Registered {currentConfig.plural}
                    </span>
                    <div className="border rounded-3 overflow-hidden">
                        <table className="table table-sm table-hover align-middle mb-0">
                            <thead className="table-light small text-secondary">
                                <tr>
                                    <th className="py-2 px-2.5">Name</th>
                                    {type === 'PERSON' && <th className="py-2 px-2.5">Phone</th>}
                                    {type === 'LOCATION' && <th className="py-2 px-2.5">Map Link</th>}
                                    <th className="py-2 px-2.5">{type === 'TRANSPORT_MODE' ? 'Pricing / Details' : 'Notes'}</th>
                                    <th className="py-2 px-2.5 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {filteredLookups.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-3">
                                            No {currentConfig.plural.toLowerCase()} registered yet. Use the form above to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLookups.map((item) => (
                                        <tr key={item._id}>
                                            <td className="px-2.5 fw-semibold text-dark">{item.name}</td>
                                            {type === 'PERSON' && (
                                                <td className="px-2.5">
                                                    {item.phone ? (
                                                        <a href={`tel:${item.phone}`} className="text-success fw-bold text-decoration-none">
                                                            <i className="bi bi-telephone-fill me-1"></i>{item.phone}
                                                        </a>
                                                    ) : '—'}
                                                </td>
                                            )}
                                            {type === 'LOCATION' && (
                                                <td className="px-2.5">
                                                    {item.mapUrl ? (
                                                        <a href={item.mapUrl} target="_blank" rel="noreferrer" className="text-danger fw-semibold text-decoration-none">
                                                            <i className="bi bi-geo-alt-fill me-1"></i>Open Map
                                                        </a>
                                                    ) : '—'}
                                                </td>
                                            )}
                                            <td className="px-2.5 text-muted">{item.notes || '—'}</td>
                                            <td className="px-2.5 text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger py-0 px-2"
                                                    onClick={() => handleDelete(item._id)}
                                                    title="Delete from dropdowns"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer-modern">
                    <button type="button" className="btn-cancel px-3" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}