import "../styles/main.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";
import LayoutWithHeader from "../components/layout/LayoutWithHeaderAndAlerts";
import AuthMiddleware from "../components/routing/AuthMiddleware";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <Provider store={store}>
      {/* <AuthMiddleware> */}
      <LayoutWithHeader>
        <Component {...pageProps} />
      </LayoutWithHeader>
      {/* </AuthMiddleware> */}
    </Provider>
  );
}

export default MyApp;
