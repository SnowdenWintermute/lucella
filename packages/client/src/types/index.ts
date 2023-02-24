export interface INetworkPerformanceMetrics {
  recentLatencies: number[];
  averageLatency: number;
  jitter: number;
  maxJitter: number;
  minJitter: number | null;
  lastPingSentAt: number;
  latency: number;
  maxLatency: number;
  minLatency: number | null;
}
