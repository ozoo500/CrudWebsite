import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resendOtp, verifyOtp } from '../../rtk/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './verify.css';

const VerifyCode = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const { token, loading} = useSelector((state) => state.auth);

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = '';
        setOtpDigits(newOtpDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, ''); 
    if (paste.length !== 4) return;

    const newOtpDigits = paste.split('').slice(0, 4);
    setOtpDigits(newOtpDigits);
    inputRefs.current[3]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = otpDigits.join('');
    if (otp.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }

    const loadingToast = toast.loading('Verifying OTP...');

    try {
      const resultAction = await dispatch(verifyOtp({ otp, token, email }));
      console.log('Result Action:', resultAction);

      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success('OTP verified successfully! Redirecting...', {
          id: loadingToast,
        });
        
          navigate('/login');
      } else {
        const errorMsg = resultAction.payload || 'OTP verification failed. Please try again.';
        toast.error(errorMsg, {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An unexpected error occurred. Please try again.', {
        id: loadingToast,
      });
    }
    setOtpDigits(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleResendOtp = async () => {
    const loadingToast = toast.loading('Resending OTP...');

    try {
      const resultAction = await dispatch(resendOtp({ email }));

      if (resendOtp.fulfilled.match(resultAction)) {
        toast.success('OTP has been resent to your email!', {
          id: loadingToast,
        });
      } else {
        const errorMsg = resultAction.payload || 'Failed to resend OTP. Please try again.';
        toast.error(errorMsg, {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('An unexpected error occurred. Please try again.', {
        id: loadingToast,
      });
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
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

      <form onSubmit={handleSubmit} className="otp_form">
        <div className="mainHeading">Enter OTP</div>
        <div className="otp_subheading">We have sent a verification code to your email</div>

        <div className="input_container" onPaste={handlePaste}>
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength="1"
              className="top_input"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              required
            />
          ))}
        </div>

        <button className="very_btn" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>

       

        <p className="resend_note">
          Didn't receive the code?
          <button 
            type="button" 
            className="resend_btn" 
            onClick={handleResendOtp}
            disabled={loading}
          >
            Resend Code
          </button>
        </p>
      </form>
    </>
  );
};

export default VerifyCode;