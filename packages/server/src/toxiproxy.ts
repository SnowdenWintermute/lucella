// index.ts
import { Toxiproxy, ICreateProxyBody, Toxic, ICreateToxicBody } from "toxiproxy-node-client";

export const getToxic = async <T>(type: string, attributes: T): Promise<Toxic<T>> => {
  const toxiproxy = new Toxiproxy("http://localhost:22220");
  const proxyBody = <ICreateProxyBody>{
    listen: "[::]:18080",
    name: "lucella_test_nodeserver_main",
    upstream: "localhost:8080",
  };
  const proxy = await toxiproxy.createProxy(proxyBody);

  const toxicBody = <ICreateToxicBody<T>>{
    attributes,
    type,
  };
  return proxy.addToxic(new Toxic(proxy, toxicBody));
};

// { attributes: { rate: 1000 },
//   name: 'bandwidth_downstream',
//   stream: 'downstream',
//   toxicity: 1,
//   type: 'bandwidth' }
// getToxic("latency", <Latency>{ latency: 400, jitter: 100, toxicity: 1, stream: "downstream" })
//   .then((toxic) => console.log(toxic.toJson()))
//   .catch(console.error);
