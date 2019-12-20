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
    <div className="slide">
      <div>
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
        <div className="share-btns">
          <FacebookShareButton
            className="puzzle-btn"
            url={shareUrl}
            quote={shareText}
          >
            <FaFacebookF />
            <span>Share</span>
          </FacebookShareButton>
          <TwitterShareButton
            className="puzzle-btn"
            url={shareUrl}
            title={shareText}
          >
            <FaTwitter />
            Tweet
          </TwitterShareButton>
          <EmailShareButton
            className="puzzle-btn"
            url={shareUrl}
            subject={shareText}
          >
            <FaRegEnvelope />
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
