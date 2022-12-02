import "../styles/main.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
// import store from "../redux/hooks";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";
import LayoutWithHeader from "../components/layout/LayoutWithHeaderAndAlerts";
import store from "../redux/store";
// import { wrapper } from "../redux/hooks";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// function App({ Component, pageProps }: AppProps) {
//   // const { store, props } = wrapper.useWrappedStore(rest);
//   return (
//     <Provider store={store}>
//       <Component {...pageProps} />
//     </Provider>
//   );
// }

// export default App;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider store={store}>
      {getLayout(
        <LayoutWithHeader>
          <Component {...pageProps} />
        </LayoutWithHeader>
      )}
    </Provider>
  );
}

export default MyApp;
