/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface INetworkPerformanceMetricsState {
  recentLatencies: number[];
  averageLatency: number;
  jitter: number;
  maxJitter: number;
  minJitter: number;
  lastPingSentAt: number;
  latency: number;
  maxLatency: number;
  minLatency: number;
}

const initialState: INetworkPerformanceMetricsState = {
  recentLatencies: [],
  averageLatency: 0,
  jitter: 0,
  maxJitter: 0,
  minJitter: 0,
  lastPingSentAt: 0,
  latency: 0,
  maxLatency: 0,
  minLatency: 0,
};

const numberOfLatencyRecordsToKeep = 10;

const networkPerformanceMetricsSlice = createSlice({
  name: "networkPerformanceMetrics",
  initialState,
  reducers: {
    setLastPingSentAtNow(state) {
      state.lastPingSentAt = Date.now();
    },
    handleNewPong(state) {
      if (!state.lastPingSentAt) return;
      state.latency = Date.now() - state.lastPingSentAt;
      if (state.latency > state.maxLatency) state.maxLatency = state.latency;
      if (state.latency < state.minLatency) state.minLatency = state.latency;
      state.recentLatencies.push(state.latency);
      if (state.recentLatencies.length > numberOfLatencyRecordsToKeep) state.recentLatencies.pop();
      state.averageLatency =
        state.recentLatencies.reduce((acc, curr) => {
          return acc + curr;
        }, 0) / state.recentLatencies.length;
      if (state.recentLatencies.length < 2) return;
      const minLatency = Math.min(...state.recentLatencies);
      const maxLatency = Math.max(...state.recentLatencies);
      state.jitter = maxLatency - minLatency;
      if (state.jitter > state.maxJitter) state.maxJitter = state.jitter;
      if (state.jitter < state.minJitter) state.minJitter = state.jitter;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.subject,
      };
    },
  },
});

export const { setLastPingSentAtNow, handleNewPong } = networkPerformanceMetricsSlice.actions;

export default networkPerformanceMetricsSlice.reducer;
