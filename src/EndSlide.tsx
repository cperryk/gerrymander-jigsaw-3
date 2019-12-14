import React from "react";
import { getShareUrl } from "./utils";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";

export const EndSlide: React.FunctionComponent<{
  title: string;
  subtitle: string;
  shareText: string;
  onRestart: () => any;
}> = ({ title, subtitle, shareText, onRestart }) => {
  const shareUrl = getShareUrl();
  return (
    <div className="slide">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button onClick={() => onRestart()}>Restart</button>
        <div className="share-btns">
          <FacebookShareButton
            className="btn-share"
            url={shareUrl}
            quote={shareText}
          >
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton className="btn-share" url={shareUrl}>
            Tweet
          </TwitterShareButton>
          <EmailShareButton className="btn-share" url={shareUrl}>
            Email
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};
