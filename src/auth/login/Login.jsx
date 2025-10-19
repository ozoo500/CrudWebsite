/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../rtk/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        // If already logged in, redirect to home
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const resultAction = await dispatch(loginUser({ email, password }));


            if (loginUser.fulfilled.match(resultAction)) {
                navigate('/home');
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Unexpected login error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
            <h2>Login to Your Account</h2>

            <div className="form-group">
                <label>Email Address</label>
                <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                />
            </div>

            <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && <p className="error-message">{error}</p>}
            {user && <p className="success-message">Login successful!</p>}

            <p className="switch-auth-text">
                Don't have an account? <Link to="/">Register here</Link>
            </p>
        </form>
    );
};

export default Login;
*/
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../rtk/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const hasSubmitted = useRef(false); // prevent duplicate submits

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasSubmitted.current) return;
        hasSubmitted.current = true;

        try {
            const result = await dispatch(loginUser(formData));

            if (loginUser.fulfilled.match(result)) {
                navigate('/home');
            } else {
                console.error('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            hasSubmitted.current = false;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
            <h2>Login to Your Account</h2>

            <div className="form-group">
                <label>Email Address</label>
                <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                />
            </div>

            <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="switch-auth-text">
                Don't have an account? <Link to="/">Register here</Link>
            </p>
        </form>
    );
};

export default Login;
