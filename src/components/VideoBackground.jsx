import React from "react";

const VideoBackground = ({ videoUrl }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "auto",
        height: "100vh",
        overflow: "hidden",
        marginBottom: "2.5rem",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Add your content on top of the video */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your homepage content */}
      </div>
    </div>
  );
};

export default VideoBackground;
