import React from "react";
import replaceUrlsWithAnchorTags from "../../../utils/replaceUrlsWithAnchorTags";
import styles from "./chat.module.scss";

function ClientGeneratedChatNotice() {
  return (
    <li className={styles[`chat__message--private`]} key={`${Date.now()} ${"1234"}`}>
      {/* eslint-disable-next-line react/no-danger */}
      <span
        className={styles[`chat__message--private`]}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: replaceUrlsWithAnchorTags(
            "Battle School is in alpha. All accounts are likely to be deleted upon the first beta release. Please report any issues here: https://github.com/SnowdenWintermute/lucella/issues",
            styles[`chat__message--private`]
          ),
        }}
      />
    </li>
  );
}

export default ClientGeneratedChatNotice;
