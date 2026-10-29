import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid username or password');
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="custom-card p-4 shadow-sm" style={{ maxWidth: '380px', width: '100%' }}>

                {/* Shield Icon in Brand Amber */}
                <div className="text-center mb-3">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-amber-subtle text-amber mb-2"
                        style={{ width: '64px', height: '64px' }}
                    >
                        <i className="bi bi-shield-lock-fill fs-2"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Admin Authentication</h5>
                    <p className="text-muted small mb-0">Sign in to manage records, dropdowns, and tabs</p>
                </div>

                {error && <div className="alert alert-danger py-1.5 small text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-2.5">
                        <label className="form-label small fw-semibold text-secondary mb-1">Username</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. admin"
                            required
                        />
                    </div>

                    {/* Password Field with Eye Show/Hide Toggle */}
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary mb-1">Password</label>
                        <div className="input-group input-group-sm">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control form-control-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash-fill text-amber' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-amber w-100 fw-bold shadow-sm py-2">
                        Login
                    </button>
                </form>

                <div className="text-center mt-3 pt-2 border-top">
                    <Link to="/" className="text-decoration-none small text-muted">
                        <i className="bi bi-arrow-left me-1"></i> Back to Public Tracker
                    </Link>
                </div>
            </div>
        </div>
    );
}