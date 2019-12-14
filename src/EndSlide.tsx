import React from "react";
import { formatTimeVerbose } from "./utils";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";

export const EndSlide: React.FunctionComponent<{ time: number }> = ({
  time
}) => {
  return (
    <div className="end-slide">
      <div>
        <h2>Complete!</h2>
        <p>
          You solved the puzzle in <strong>{formatTimeVerbose(time)}</strong>.
        </p>
        <div className="share-btns">
          <FacebookShareButton
            className="btn-share"
            url="http://slate.com"
            quote={`I put ridiculously gerrymandered Louisiana back together in ${time}`}
          >
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton className="btn-share" url="http://slate.com">
            Tweet
          </TwitterShareButton>
          <EmailShareButton className="btn-share" url="http://slate.com">
            Email
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};
