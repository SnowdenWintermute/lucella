/* eslint-disable no-param-reassign */
import { INetworkPerformanceMetrics } from "../../types";

export default function handlePong(networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>) {
  const numberOfLatencyRecordsToKeep = 10;
  const { recentLatencies, maxJitter, minJitter, lastPingSentAt, maxLatency, minLatency } = networkPerformanceMetricsRef.current;
  const newMetrics: INetworkPerformanceMetrics = {
    recentLatencies: [],
    averageLatency: 0,
    jitter: 0,
    maxJitter: 0,
    minJitter: null,
    lastPingSentAt: 0,
    latency: 0,
    maxLatency: 0,
    minLatency: null,
  };
  if (!lastPingSentAt) return;
  newMetrics.latency = Date.now() - lastPingSentAt;
  if (newMetrics.latency >= maxLatency) newMetrics.maxLatency = newMetrics.latency;
  if (minLatency === null || newMetrics.latency < minLatency) newMetrics.minLatency = newMetrics.latency;

  newMetrics.recentLatencies = [...recentLatencies];
  newMetrics.recentLatencies.push(newMetrics.latency);
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
    console.log(key, value);
    // @ts-ignore
    networkPerformanceMetricsRef.current[key] = value;
  });
  // console.log("newMetrics: ", JSON.stringify(newMetrics, null, 2), "recent latencies: ", newMetrics.recentLatencies.length);
  console.log(
    "current metrics: ",
    JSON.stringify(networkPerformanceMetricsRef.current, null, 2),
    "recent latencies: ",
    networkPerformanceMetricsRef.current.recentLatencies.length
  );
}
