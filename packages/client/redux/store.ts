import { createWrapper } from "next-redux-wrapper";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { ladderApi } from "./api-slices/ladder-api-slice";
import { authApi } from "./api-slices/auth-api-slice";
import { usersApi } from "./api-slices/users-api-slice";
import alertsSlice from "./slices/alerts-slice";
import chatSlice from "./slices/chat-slice";
import ladderSlice from "./slices/ladder-slice";
import lobbyUiSlice from "./slices/lobby-ui-slice";
import UISlice from "./slices/ui-slice";
import { moderationApi } from "./api-slices/moderation-api-slice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [ladderApi.reducerPath]: ladderApi.reducer,
    [moderationApi.reducerPath]: moderationApi.reducer,
    ladder: ladderSlice,
    alerts: alertsSlice,
    chat: chatSlice,
    lobbyUi: lobbyUiSlice,
    UI: UISlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([authApi.middleware, usersApi.middleware, ladderApi.middleware, moderationApi.middleware]),
}); // disabled serializable check because we are using instances of classes for alerts, game rooms etc

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

export default store;
// export type AppStore = ReturnType<typeof store>;
// export const wrapper = createWrapper<AppStore>(store); // next-redux-wrapper
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<AppStore["getState"]>; // next-redux-wrapper
// export type AppDispatch = ReturnType<AppStore["dispatch"]>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
