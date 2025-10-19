import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, { rejectWithValue }) => { // ✅ Add { rejectWithValue } here
        try {
            const response = await axios.post(
                "https://backend-booking.appointroll.com/api/register",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log("api post success", response.data);
            return response.data;
        } catch (e) {
            console.log("api post error", e.response?.data?.message);
            return rejectWithValue(e.response?.data?.message || "Registration failed");
        }
    }
);
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp', 
  async (verifyCode, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://backend-booking.appointroll.com/api/account/verify",
        {
          email: verifyCode.email,
          code: verifyCode.otp,
        }
      );
      
      console.log("verify thunk otp success", response.data);
      return response.data;
      
    } catch (error) {
      console.log("=== FULL ERROR ===", error);
      console.log("=== ERROR.RESPONSE ===", error.response);
      console.log("=== ERROR.RESPONSE.DATA ===", error.response?.data);
      console.log("=== ERRORS OBJECT ===", error.response?.data?.errors);
      console.log("=== AUTH_FAILED ===", error.response?.data?.errors?.auth_failed);
      const errorData = error.response?.data;
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (errorData?.errors?.auth_failed && Array.isArray(errorData.errors.auth_failed)) {
        errorMessage = errorData.errors.auth_failed[0];
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log("=== FINAL ERROR MESSAGE ===", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const resendOtp = createAsyncThunk('auth/resendOtp', async (verifyCode) => {

    const response = await axios.post("https://backend-booking.appointroll.com/api/resend-verify-account", { email: verifyCode.email },)
    console.log("resend  thunk otp", response.data)
},

)

export const loginUser = createAsyncThunk('auth/loginUser', async (data) => {
  
    const response = await axios.post('https://backend-booking.appointroll.com/api/login', {
        "identify": data.email,
        "password": data.password
    })
    console.log("login response ===>>>", response.data);
})

export const logOut = createAsyncThunk('auth/logout', async () => {
    try {
        const token = localStorage.getItem("authToken");

        const res = await axios.post(
            "https://backend-booking.appointroll.com/api/customer/logout",
            {},
            {
                headers: {
                    Authorization: ` ${token}`,
                },
            }
        );

        console.log(res.data);
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
});



const authSlice = createSlice({
    initialState: {
        user: null,
        loading: false,
        error: null,
        token: null || localStorage.getItem("authToken"),
        otpCode: null,

    },
    name: "auth",
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.token = null;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.data.user?.original.access_token;
            //state.user = action.payload;


        }).addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload

        }).addCase(verifyOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(verifyOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload
        }).addCase(verifyOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })



            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(resendOtp.fulfilled, (state, action) => {
                state.loading = false;
                //state.otpCode = action.payload.data.user?.original.otp_verify;
            }).addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;

            }).addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(logOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(logOut.fulfilled, (state, action) => {
                state.loading = false;
                state.token = null;
                state.error = null;
                localStorage.removeItem("authToken");
                state.user = null
                //state.otpCode = action.payload.data.user?.original.otp_verify;
            }).addCase(logOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});
export const authReducer = authSlice.reducer;