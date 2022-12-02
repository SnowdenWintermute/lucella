import { Fragment } from "react";
import AlertsHolder from "./alerts/AlertsHolder";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

export default function LayoutWithHeaderAndAlerts({ children }: Props) {
  return (
    <Fragment>
      <Navbar />
      <AlertsHolder />
      <main>{children}</main>
    </Fragment>
  );
}
