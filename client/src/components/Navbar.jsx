import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky-top shadow-sm py-2 bg-theme-amber" style={{ zIndex: 1030 }}>
            <div className="container px-2 px-sm-3 d-flex align-items-center justify-content-between">

                {/* Brand */}
                <div className="d-flex align-items-center gap-1.5 min-w-0">
                    {isAdmin && onToggleSidebar && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-light d-lg-none me-1 p-1"
                            onClick={onToggleSidebar}
                            title="Toggle Menu"
                        >
                            <i className="bi bi-list fs-6"></i>
                        </button>
                    )}
                    <Link to="/" className="text-white text-decoration-none d-flex align-items-center gap-1.5 text-truncate">
                        <i className="bi bi-house-door-fill fs-6 text-warning-subtle shrink-0"></i>
                        <h1 className="h6 mb-0 fw-bold text-white text-truncate" style={{ maxWidth: '170px' }}>
                            Griha Pravesam
                        </h1>
                    </Link>
                </div>

                {/* Actions */}
                <div className="d-flex align-items-center gap-1 shrink-0">
                    {isAdmin ? (
                        <>
                            <Link to="/admin" className="btn btn-sm btn-light fw-bold text-dark text-nowrap px-2 py-1">
                                <i className="bi bi-speedometer2 me-1 text-warning"></i>
                                <span className="d-none d-sm-inline">Admin</span>
                            </Link>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-light text-nowrap px-2 py-1"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                            >
                                <i className="bi bi-box-arrow-right d-sm-none"></i>
                                <span className="d-none d-sm-inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm btn-outline-light fw-semibold text-nowrap px-2 py-1">
                            <i className="bi bi-shield-lock-fill me-1"></i>
                            <span>Portal</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}