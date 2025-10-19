import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '../rtk/slices/profileSlice';
import './Home.css'
import { Link, replace, useNavigate } from 'react-router-dom';
import { logOut } from '../rtk/slices/authSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, loading } = useSelector(state => state.userProfile);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user === null) {
      navigate('/login');
    }
  }, [user, loading, navigate]);


  const handleLogout = async () => {
  try {
    await dispatch(logOut());
    navigate('/login', { replace: true });
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-card">
          <img
            src={user.photo}
            alt=""
            className="profile-image"
          />
          <div className="profile-details">
            <h2>Name: {user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
          </div>
          <Link to="/updateProfile" type="submit" disabled={loading} className="update-button">update</Link>
          <button type='submit' className='logout-button' onClick={handleLogout}>logout</button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}

export default Home;
