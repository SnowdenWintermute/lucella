import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { ladderApiSlice } from "./api-slices/ladder-api-slice";
import { authApi } from "./api-slices/auth-api-slice";
import { userApi } from "./api-slices/user-api-slice";
import alertsSlice from "./slices/alerts-slice";
import chatSlice from "./slices/chat-slice";
import ladderSlice from "./slices/ladder-slice";
import lobbyUiSlice from "./slices/lobby-ui-slice";
import userSlice from "./slices/user-slice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ladderApiSlice.reducerPath]: ladderApiSlice.reducer,
    user: userSlice,
    ladder: ladderSlice,
    alerts: alertsSlice,
    chat: chatSlice,
    lobbyUi: lobbyUiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      userApi.middleware,
      ladderApiSlice.middleware,
    ]),
}); // disabled serializable check because we are using instances of classes for alerts, game rooms etc

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
