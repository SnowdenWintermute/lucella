/* eslint-disable react/jsx-props-no-spreading */
import "../styles/layout/nav.scss";
import "../styles/pages/pages.scss";
import "../styles/components/buttons.scss";
import "../styles/components/modals.scss";
import "../styles/layout/auth.scss";
import "../styles/layout/forms.scss";
import "../styles/pages/game-shell.scss";
import "../styles/abstracts/lucellaStrap.scss";
import "../styles/pages/battle-room.scss";
import "../styles/components/score-screen.scss";
import "../styles/pages/ladder.scss";
import "../styles/base/style.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";
import LayoutWithAlertsAndModals from "../components/layout/LayoutWithAlertsAndModals";
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
        <LayoutWithAlertsAndModals>
          <Component {...pageProps} />
        </LayoutWithAlertsAndModals>
      )}
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
