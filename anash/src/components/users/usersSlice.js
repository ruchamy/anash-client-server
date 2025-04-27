import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



// טעינת משתמשים מאושרים מהשרת
export const fetchApprovedUsers = createAsyncThunk(
    "users/fetchApprovedUsers",
    async () => {
        const response = await fetch("http://localhost:3000/approved-users");
        return await response.json();
    }
);


// הסרת משתמש מאושר מהשרת
export const removeApprovedUser = createAsyncThunk(
    "users/removeApprovedUser",
    async (id) => {
        await fetch(`http://localhost:3000/approved-users/${id}`, {
            method: "DELETE",
        });
        return id;
    }
);

const savedUser = sessionStorage.getItem("loggedInUser");
const savedIsAdmin = sessionStorage.getItem("isAdmin");

const initialState = {
    loggedInUser: savedUser ? JSON.parse(savedUser) : null,
    approvedUsersID: [],
    isAdmin : savedIsAdmin ? (savedIsAdmin === "true") : false
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        register: (state, action) => {
            // const newUser = action.payload;
            // state.newUsersID.push(newUser.id)
        },
        login: (state, action) => {
            const user = action.payload;
            state.loggedInUser = user;
            sessionStorage.setItem("loggedInUser", JSON.stringify(action.payload)); // שמירה בלוקאל
        },
        logout: (state, action) => {

            state.loggedInUser = null;
            state.isAdmin = false;
            sessionStorage.removeItem("loggedInUser"); // מחיקה מהלוקאל
        },
        isAdmin: (state, action) => {
            state.isAdmin = action.payload;
            sessionStorage.setItem("isAdmin", JSON.stringify(action.payload)); // שמירה בלוקאל
        },
        approveNewUser: (state, action) => {
            const newUserId = action.payload;
            state.approvedUsersID.push(newUserId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovedUsers.fulfilled, (state, action) => {
                state.approvedUsersID = action.payload;
            })
            .addCase(removeApprovedUser.fulfilled, (state, action) => {
                state.approvedUsersID = state.approvedUsersID.filter(id => id !== action.payload);
            });
    },
});

// Export actions for use in components
export const {
    register,
    login,
    logout,
    isAdmin,
    approveNewUser,
    userAuthorization,
    getApprovedUsers,
} = usersSlice.actions;

// Export the reducer to be included in the store
export default usersSlice.reducer;
