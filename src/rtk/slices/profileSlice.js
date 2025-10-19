

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

export const getUserData = createAsyncThunk("profile/userData", async () => {

    try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get("https://backend-booking.appointroll.com/api/edit-profile", {
            headers: {
                "Content-Type": "application/json",
                'Authorization': token,
            },


        });
        return response.data.data.user;

        // console.log(response.data.data.user, "getUserData======================>");
    } catch (error) {
        console.log(error);

    }
});
export const updateUserData = createAsyncThunk('profile/upddateUserData', async (data) => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await axios.post("https://backend-booking.appointroll.com/api/update-profile",data, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': token,
            },

        });
    } catch (e) {
        console.log(e);
    }

});

const profileSlice = createSlice({
    initialState: {
        user: null,
        error: null,
        loading: false
    },
    name: "profile",
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserData.pending, (state) => {
            state.loading = true;
            state.error = null;

        }).addCase(getUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        }).addCase(getUserData.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Data Fetched failed';

        })

        .addCase(updateUserData.pending, (state) => {
            state.loading = true;
            state.error = null;

        }).addCase(updateUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        }).addCase(updateUserData.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload
        })

    }
});


export const profileReducer = profileSlice.reducer;

