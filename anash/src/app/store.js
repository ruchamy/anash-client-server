import { configureStore } from "@reduxjs/toolkit";
import usersReducer, {fetchApprovedUsers} from "../components/users/usersSlice";

export const store = configureStore({
    reducer: {
        users:usersReducer,
    }
})

store.dispatch(fetchApprovedUsers());