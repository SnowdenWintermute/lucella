/* eslint-disable no-param-reassign */
import cloneDeep from "lodash.clonedeep";
import { INetworkPerformanceMetrics } from "../../types";

export default function handlePong(networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>) {
  const numberOfLatencyRecordsToKeep = 10;
  const { recentLatencies, maxJitter, minJitter, lastPingSentAt, maxLatency, minLatency } = networkPerformanceMetricsRef.current;
  const newMetrics = cloneDeep(networkPerformanceMetricsRef.current);
  if (!lastPingSentAt) return;
  newMetrics.latency = Date.now() - lastPingSentAt;
  if (newMetrics.latency >= maxLatency) newMetrics.maxLatency = newMetrics.latency;
  if (minLatency === null || newMetrics.latency < minLatency) newMetrics.minLatency = newMetrics.latency;

  newMetrics.recentLatencies = [...recentLatencies];
  newMetrics.recentLatencies.unshift(newMetrics.latency);
  if (newMetrics.recentLatencies.length > numberOfLatencyRecordsToKeep) newMetrics.recentLatencies.pop();
  if (newMetrics.recentLatencies.length > 0)
    newMetrics.averageLatency =
      newMetrics.recentLatencies.reduce((acc, curr) => {
        return acc + curr;
      }, 0) / newMetrics.recentLatencies.length;

  if (newMetrics.recentLatencies.length > 2) {
    const recentMinLatency = Math.min(...newMetrics.recentLatencies);
    const recentMaxLatency = Math.max(...newMetrics.recentLatencies);
    newMetrics.jitter = recentMaxLatency - recentMinLatency;
    if (newMetrics.jitter > maxJitter) newMetrics.maxJitter = newMetrics.jitter;
    if (newMetrics.jitter !== null && (minJitter === null || newMetrics.jitter < minJitter)) newMetrics.minJitter = newMetrics.jitter;
  }

  Object.entries(newMetrics).forEach(([key, value]) => {
    if (key === "lastPingSentAt") return;
    // @ts-ignore
    networkPerformanceMetricsRef.current[key] = value;
    // @ts-ignore
    // console.log(key, networkPerformanceMetricsRef.current[key]);
  });
}
