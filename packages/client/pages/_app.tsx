/* eslint-disable react/jsx-props-no-spreading */
import "../styles/main.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";
import LayoutWithHeader from "../components/layout/LayoutWithHeaderAndAlerts";
import store from "../redux/store";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

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
