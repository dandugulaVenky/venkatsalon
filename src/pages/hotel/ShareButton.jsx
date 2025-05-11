import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ShareButton = () => {
  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check this out!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-center justify-center cursor-pointer">
      <p className="text-xs">Share</p>{" "}
      <FontAwesomeIcon icon={faShare} className="mr-2" onClick={handleShare} />
    </div>
  );
};

export default ShareButton;
