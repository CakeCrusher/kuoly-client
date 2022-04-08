import Head from "next/head";
import React from "react";

const Api = () => {
  return (
    <div className="api-page-container">
      <Head>
        <title>API</title>
        <link
          rel="icon"
          type="text/png"
          href="https://storage.googleapis.com/givespace-pictures/Logo.svg"
        />
        <meta
          name="description"
          content="'A machines' ultimate tool for creating sharable product lists and catalogues. Start making requests, no sign-up required."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:title" content="API" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:description"
          content="'A machines' ultimate tool for creating sharable product lists and catalogues. Start making requests, no sign-up required."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/givespace-pictures/Kuoly.png"
        />
        <meta property="og:image:width" content="1218" />
        <meta property="og:image:height" content="684" />
        <meta property="og:image:alt" content="Kuoly" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content="https://www.kuoly.com/api-info" />
        <meta property="og:site_name" content="Kuoly" />
        <meta name="theme-color" content="#c9042c" />
        <meta name="twitter:title" content="API" />
        <meta
          name="twitter:description"
          content="'A machines' ultimate tool for creating sharable product lists and catalogues. Start making requests, no sign-up required."
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/givespace-pictures/Kuoly.png"
        />
      </Head>
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
