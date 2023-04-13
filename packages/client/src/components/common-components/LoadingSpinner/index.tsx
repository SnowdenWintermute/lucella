import React from "react";

export default function LoadingSpinner({ extraStyles = "" }: { extraStyles?: string }) {
  return <div className={`loading-spinner ${extraStyles}`} />;
}
