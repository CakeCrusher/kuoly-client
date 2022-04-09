// @ts-nocheck

import React from "react";
import Head from "next/head";
import { textClipper } from "../../utils/functions";

type CatalogueHeadProps = {
  catalogue: CatalogueType | null;
  ids_param: string[];
};
const CatalogueHead: React.FC<CatalogueHeadProps> = ({
  catalogue,
  ids_param,
}) => {
  const joinedIdsParam = ids_param ? ids_param.join("/") : "";

  // if catalogue does not exist
  if (!catalogue || !ids_param || ids_param.length === 0) {
    return (
      <Head>
        <title>List not found</title>
        <link
          rel="icon"
          type="text/png"
          href="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
        />
        <meta
          name="description"
          content="List not found or was deleted, visit Kuoly and make your own list."
        />
        <meta property="og:title" content="List not found" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:description"
          content="List not found or was deleted, visit Kuoly and make your own list."
        />
        <meta
          property="og:url"
          content={`https://www.kuoly.com/ctg/${joinedIdsParam}`}
        />
        <meta property="og:site_name" content="Kuoly" />
        <meta name="theme-color" content="#c9042c" />
        <meta name="twitter:title" content="List not found" />
        <meta
          name="twitter:description"
          content="List not found or was deleted, visit Kuoly and make your own list."
        />
      </Head>
    );
  }
  // if it is a listing link
  if (ids_param.length === 2) {
    const listing = catalogue.listings.find(
      (listing) => listing.id === ids_param[1]
    );
    // if listing does not exist
    if (!listing) {
      return (
        <Head>
          <title>
            (Listing not found) in "{textClipper(catalogue.title, 35)}"
          </title>
          <link
            rel="icon"
            type="text/png"
            href="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
          />
          <meta
            name="description"
            content={`(Listing no longer exists or was deleted) in "${catalogue.title}", view the other ${catalogue.listings.length} listings.`}
          />
          <meta
            property="og:title"
            content={`(Listing not found) in "${textClipper(
              catalogue.title,
              35
            )}"`}
          />
          <meta property="og:locale" content="en_US" />
          <meta
            property="og:description"
            content={`(Listing no longer exists or was deleted) in "${catalogue.title}", view the other ${catalogue.listings.length} listings.`}
          />
          <meta
            property="og:url"
            content={`https://www.kuoly.com/ctg/${joinedIdsParam}`}
          />
          <meta property="og:site_name" content="Kuoly" />
          <meta name="theme-color" content={catalogue.header_color} />
          <meta
            name="twitter:title"
            content={`(Listing not found) in "${textClipper(
              catalogue.title,
              35
            )}"`}
          />
          <meta
            name="twitter:description"
            content={`(Listing no longer exists or was deleted) in "${catalogue.title}", view the other ${catalogue.listings.length} listings.`}
          />
        </Head>
      );
    } else {
      const title = textClipper(listing.name, 57);
      const price =
        listing.show_price && listing.price ? `($${listing.price})` : "";
      const description =
        listing.description || `${price} Listing in "${catalogue.title}"}`;
      const image =
        listing.image_url ||
        catalogue.header_image_url ||
        catalogue.profile_picture_url ||
        "https://storage.googleapis.com/givespace-pictures/Logo%20Placeholder%202.png";
      return (
        <Head>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />

          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />

          {price && (
            <>
              <meta name="twitter:label1" value="Price" />
              <meta name="twitter:data1" value={"$" + listing.price.toString} />
            </>
          )}

          <meta property="og:image" content={image} />
          <meta property="og:image:alt" content="Listing image" />
          {/* <meta property="og:image:type" content="image/jpeg" /> */}
          <meta name="twitter:card" content={image} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:card" content="summary_large_image" />

          <meta property="og:site_name" content="Kuoly" />
          <meta
            property="og:url"
            content={`https://www.kuoly.com/ctg/${joinedIdsParam}`}
          />
          <meta name="theme-color" content={catalogue.header_color} />
          <meta property="og:locale" content="en_US" />
          <link
            rel="icon"
            type="text/png"
            href="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
          />
        </Head>
      );
    }
  }
  // if it is a catalogue link
  // if it is an edit link
  const title = textClipper(catalogue.title, 57) || "Untitled list";
  const date = catalogue.event_date
    ? new Date(catalogue.event_date).toLocaleDateString().split(",")[0]
    : "";
  const listings = catalogue.listings ? catalogue.listings.length : 0;
  const author = catalogue.author ? `by ${catalogue.author}` : "";
  const description =
    catalogue.description ||
    `List ${author} with ${listings} listings. ${date ? `Date: ${date}` : ""}`;
  const firstListingImage =
    listings &&
    catalogue.listings.find((listing) => listing.image_url) &&
    catalogue.listings.find((listing) => listing.image_url).image_url;
  const image =
    catalogue.header_image_url ||
    catalogue.profile_picture_url ||
    firstListingImage ||
    "https://storage.googleapis.com/givespace-pictures/Logo%20Placeholder%202.png";
  if (ids_param[0] === catalogue.edit_id) {
    return (
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta
          name="description"
          content={
            "You have been invited to edit this list! ----- " + description
          }
        />
        <meta
          property="og:description"
          content={
            "You have been invited to edit this list! ----- " + description
          }
        />
        <meta
          name="twitter:description"
          content={
            "You have been invited to edit this list! ----- " + description
          }
        />

        <meta name="twitter:label1" value="Listings" />
        <meta name="twitter:data1" value={listings} />
        {date && (
          <>
            <meta name="twitter:label1" value="Date" />
            <meta
              name="twitter:data1"
              value={new Date(catalogue.event_date).toLocaleDateString()}
            />
          </>
        )}

        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content="List image" />
        {/* <meta property="og:image:type" content="image/jpeg" /> */}
        <meta name="twitter:card" content={image} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:site_name" content="Kuoly" />
        <meta
          property="og:url"
          content={`https://www.kuoly.com/ctg/${joinedIdsParam}`}
        />
        <meta name="theme-color" content={catalogue.header_color} />
        <meta property="og:locale" content="en_US" />
        <link
          rel="icon"
          type="text/png"
          href="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
        />
      </Head>
    );
  } else {
    return (
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        <meta name="twitter:label1" value="Listings" />
        <meta name="twitter:data1" value={listings} />
        {date && (
          <>
            <meta name="twitter:label1" value="Date" />
            <meta
              name="twitter:data1"
              value={new Date(catalogue.event_date).toLocaleDateString()}
            />
          </>
        )}

        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content="List image" />
        {/* <meta property="og:image:type" content="image/jpeg" /> */}
        <meta name="twitter:card" content={image} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:site_name" content="Kuoly" />
        <meta
          property="og:url"
          content={`https://www.kuoly.com/ctg/${joinedIdsParam}`}
        />
        <meta name="theme-color" content={catalogue.header_color} />
        <meta property="og:locale" content="en_US" />
        <link
          rel="icon"
          type="text/png"
          href="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
        />
      </Head>
    );
  }
};

export default CatalogueHead;
