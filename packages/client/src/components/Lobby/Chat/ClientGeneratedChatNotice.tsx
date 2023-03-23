import React from "react";
import replaceUrlsWithAnchorTags from "../../../utils/replaceUrlsWithAnchorTags";

function ClientGeneratedChatNotice() {
  return (
    <span
      className="chat__message--private"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: replaceUrlsWithAnchorTags(
          "Battle School is in alpha. All accounts are likely to be deleted upon the first beta release. Please report any issues here: https://github.com/SnowdenWintermute/lucella/issues",
          `chat__message--private`
        ),
      }}
    />
  );
}

export default ClientGeneratedChatNotice;
