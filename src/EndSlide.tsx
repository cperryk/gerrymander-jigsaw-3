import React from "react";
import { getShareUrl } from "./utils";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";

import { FaRedo, FaFacebookF, FaTwitter, FaRegEnvelope } from "react-icons/fa";

export const EndSlide: React.FunctionComponent<{
  title: string;
  subtitle: string;
  shareText: string;
  onRestart: () => any;
}> = ({ title, subtitle, shareText, onRestart }) => {
  const shareUrl = getShareUrl();
  return (
    <div className="slide fade-in">
      <div>
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
        <div className="share-btns">
          <FacebookShareButton
            className="puzzle-btn"
            url={shareUrl}
            quote={shareText}
          >
            <FaFacebookF color="rgb(59, 89, 152)" />
            <span>Share</span>
          </FacebookShareButton>
          <TwitterShareButton
            className="puzzle-btn"
            url={shareUrl}
            title={shareText}
          >
            <FaTwitter color="rgb(64, 153, 255)" />
            Tweet
          </TwitterShareButton>
          <EmailShareButton
            openWindow={true}
            className="puzzle-btn"
            url={shareUrl}
            subject={shareText}
          >
            <FaRegEnvelope color="rgb(106, 4, 50)" />
            Email
          </EmailShareButton>
        </div>
        <div className="puzzle-btn" onClick={onRestart}>
          <FaRedo />
          <span>Restart</span>
        </div>
      </div>
    </div>
  );
};
