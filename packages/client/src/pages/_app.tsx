/* eslint-disable react/jsx-props-no-spreading */
import "../styles/globals.scss";
// import "../components/common-components/AuthPage/auth-page.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";
import LayoutWithAlerts from "../components/layout/LayoutWithAlerts";
import store, { wrapper } from "../redux/store";

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
        <LayoutWithAlerts>
          <Component {...pageProps} />
        </LayoutWithAlerts>
      )}
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
