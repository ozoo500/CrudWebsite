import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../rtk/slices/authSlice';
import './RegisterUser.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const RegisterUser = () => {
  const dispatch = useDispatch();
  const { loading, error, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage('');

    const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email);
    if (!isGmail) {
      toast.error("Only Gmail addresses are allowed.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password_confirmation);
    if (photo) data.append('photo', photo);

    // Show loading toast
    const loadingToast = toast.loading('Registering your account...');

    try {
      // Wait for the registration to complete
      const resultAction = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(resultAction)) {
        // Successful registration
        toast.success('Registration successful! Redirecting...', {
          id: loadingToast,
        });

        const registeredToken = resultAction.payload.data.user?.original.access_token;

        if (registeredToken) {
          localStorage.setItem('authToken', registeredToken);
        }
        
        // Navigate after a brief delay
      
          navigate('/verify', { state: { email: formData.email } });
       
      } else {
        // Handle registration failure
        const errorMsg = resultAction.payload || "Registration failed. Please try again.";
        toast.error(errorMsg, {
          id: loadingToast,
        });
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Unexpected registration error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="register-form">
        <h2>Create Your Account</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="password_confirmation"
            type="password"
            placeholder="Re-enter password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>

        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="switch-auth-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

      
       
      </form>
    </>
  );
};

export default RegisterUser;