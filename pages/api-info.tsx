import React from "react";

const Api = () => {
  return (
    <div className="api-page-container">
      <h3 className="api-title">Our API interface</h3>
      <iframe
        className="video"
        src="https://www.youtube.com/embed/bsG_u6hCrjE"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <script src="https://gist.github.com/CakeCrusher/43f7e42060adc7d007d870f1c229a327.js"></script>
      <a
        href="https://gist.github.com/CakeCrusher/25d712a964addb7f6670385ec9091635"
        target="_blank"
      >
        <h4 className="api-link">
          <strong>JSON</strong> catalogue variable content example
        </h4>
      </a>
      <a
        href="https://gist.github.com/CakeCrusher/43f7e42060adc7d007d870f1c229a327"
        target="_blank"
      >
        <h4 className="api-link">
          <strong>Node.js</strong> example
        </h4>
      </a>
      <a
        href="https://gist.github.com/CakeCrusher/2cf982d7575b5059c66181bab46b0478"
        target="_blank"
      >
        <h4 className="api-link">
          <strong>Python</strong> example
        </h4>
      </a>
    </div>
  );
};

export default Api;
