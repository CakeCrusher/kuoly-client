import React from "react";
import Link from "next/link";
import { CreateCatalogueButton } from "../components";
import { MY_CATALOGUES } from "../graphql/schemas";
import { useApolloClient, useQuery } from "@apollo/client";

import { FiEdit, FiShare2 } from "react-icons/fi";
import { BiPalette } from "react-icons/bi";
import { useUser } from "../lib/UserProvider";

const Home = () => {
  // TODO: get the client data instead of making a query
  // const { client, userId } = useUser();
  // const client = useApolloClient();
  // const cachedData = client.readQuery({
  //   query: MY_CATALOGUES,
  // });
  // console.log("client.cache", client.cache);
  const myCatalogues = useQuery(MY_CATALOGUES);

  const ButtonsToShow = () => {
    return (
      <div className="btn-container">
        <CreateCatalogueButton className="create" />
        {myCatalogues.data && myCatalogues.data.myCatalogues.length ? (
          <Link href="/catalogues">
            <a className="btn btn-outline">My Lists</a>
          </Link>
        ) : null}
      </div>
    );
  };

  return (
    <div className="home-page-container">
      <section className="welcome-section">
        <div className="text-container">
          <div className="texts">
            <h3 className="title">Easy, custom, shareable product lists.</h3>
            <p>
              Your ultimate tool for creating product lists and catalogues. Get
              started in seconds, no sign-up required.
            </p>
          </div>
          <div className="spacer" />
        </div>
        <div className="btn-logo-container">
          <ButtonsToShow />
          <div className="logo-container">
            <img
              className="logo"
              src="/assets/icon/home_banner_logo.svg"
              alt="banner-kuoly"
            />
          </div>
        </div>
      </section>
      <section className="description-section">
        <div className="video-container">
          <div className="description">How it Works</div>
          <iframe
            className="video"
            src="https://www.youtube.com/embed/R0BlGDSi51M"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <div className="steps">
          <div className="step">
            <FiEdit className="icon" size="3rem" />
            <h5 className="title">Create</h5>
            <div>
              Effortlessly create a list by searching for products or directly
              pasting links—we fill in the details.
            </div>
          </div>
          <div className="spacer" />
          <div className="step">
            <BiPalette className="icon" size="3rem" />
            <h5 className="title">Customize</h5>
            <div>
              Add your own style with custom image, color, and font choices.
            </div>
          </div>
          <div className="spacer" />
          <div className="step">
            <FiShare2 className="icon" size="3rem" />
            <h5 className="title">Share</h5>
            <div>
              Send out your list! You can copy a link with editor access for
              easy collaboration.
            </div>
          </div>
        </div>
      </section>
      <section className="sendoff">
        <div className="text">Get started, no sign-up required</div>
        <div>
          <CreateCatalogueButton className="btn-secondary" />
        </div>
      </section>
    </div>
  );
};

export default Home;
