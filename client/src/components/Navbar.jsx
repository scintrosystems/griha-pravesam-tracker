import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// File imports
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <header className="sticky-top shadow-sm py-2 app-header" style={{ zIndex: 1030 }}>
            <div className="container px-2 px-sm-3 d-flex align-items-center justify-content-between">

                {/* Left: Menu Toggle + Title */}
                <div className="d-flex align-items-center gap-1 min-w-0">
                    {isAdmin && isAdminPage && onToggleSidebar && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-light d-lg-none me-1 p-1"
                            onClick={onToggleSidebar}
                            title="Toggle Menu"
                        >
                            <i className="bi bi-list fs-5"></i>
                        </button>
                    )}

                    <Link to="/" className="text-white text-decoration-none d-flex align-items-center gap-1">
                        <i className="bi bi-house-door-fill fs-5 text-warning-subtle shrink-0"></i>
                        <h1 className="h6 mb-0 fw-bold text-white" style={{ maxWidth: '200px' }}>
                            Griha Pravesam
                        </h1>
                    </Link>
                </div>

                {/* Right: Desktop Actions */}
                <div className="d-none d-sm-flex align-items-center gap-1 shrink-0">
                    {isAdmin ? (
                        <>
                            {isAdminPage ? (
                                <Link to="/" className="btn btn-sm btn-outline-light text-nowrap px-2 py-1">
                                    <i className="bi bi-eye me-1"></i> Public
                                </Link>
                            ) : (
                                <Link to="/admin" className="btn btn-sm btn-light fw-bold text-dark text-nowrap px-2 py-1 shadow-xs">
                                    <i className="bi bi-speedometer2 me-1 text-amber"></i> Admin
                                </Link>
                            )}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-light text-nowrap px-2 py-1"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm btn-outline-light fw-semibold text-nowrap px-2 py-1" title="Admin Login">
                            <i className="bi bi-shield-lock-fill me-1"></i> Portal
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}