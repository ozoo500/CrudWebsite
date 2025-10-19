/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateUserData } from '../rtk/slices/profileSlice';


import './UpdateProfile.css' 
const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({ name: '', email: '', photo: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);


  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        photo: null,
      });
      setPreview(user.photo);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = new FormData();
    updatedForm.append('name', formData.name);
    updatedForm.append('email', formData.email);
    if (formData.photo) {
      updatedForm.append('photo', formData.photo);
    }

    const resultAction = await dispatch(updateUserData(updatedForm));

    if (updateUserData.fulfilled.match(resultAction)) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="update-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-form" encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Profile Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Profile Preview" />
          </div>
        )}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
*/
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateUserData } from '../rtk/slices/profileSlice';

import './UpdateProfile.css';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({ name: '', email: '', photo: null });
  const [preview, setPreview] = useState(null);
  const [emailError, setEmailError] = useState('');
  const emailInputRef = useRef(null);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        photo: null,
      });
      setPreview(user.photo);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'email') {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email cannot be empty';
    }
    if (!email.includes('@') || !email.includes('.com')) {
      return 'Email must contain "@" and ".com"';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidationMsg = validateEmail(formData.email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
      return;
    }

    const updatedForm = new FormData();
    updatedForm.append('name', formData.name);
    updatedForm.append('email', formData.email);
    if (formData.photo) {
      updatedForm.append('photo', formData.photo);
    }

    const resultAction = await dispatch(updateUserData(updatedForm));

    if (updateUserData.fulfilled.match(resultAction)) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="update-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-form" encType="multipart/form-data" noValidate>
        <div>
          <label>Name:</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            ref={emailInputRef}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        <div>
          <label>Profile Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Profile Preview" />
          </div>
        )}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
