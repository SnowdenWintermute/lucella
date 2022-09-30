import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { authApiSlice } from "./api-slices/auth-api-slice";
import { ladderApiSlice } from "./api-slices/ladder-api-slice";
import authSlice from "./slices/auth-slice";
import alertsSlice from "./slices/alerts-slice";
import chatSlice from "./slices/chat-slice";
import ladderSlice from "./slices/ladder-slice";
import lobbyUiSlice from "./slices/lobby-ui-slice";
import userSlice from "./slices/user-slice";

const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [ladderApiSlice.reducerPath]: ladderApiSlice.reducer,
    ladder: ladderSlice,
    auth: authSlice,
    alerts: alertsSlice,
    chat: chatSlice,
    lobbyUi: lobbyUiSlice,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([authApiSlice.middleware, ladderApiSlice.middleware]),
}); // disabled serializable check because we are using instances of classes for alerts, game rooms etc

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
