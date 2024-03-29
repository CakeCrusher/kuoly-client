import { ApolloError } from "@apollo/client";
import { DocumentNode } from "graphql";
import { cache } from "../graphql/clientConfig";
import {
  ALL_CATALOGUE_FIELDS,
  LABEL_FIELDS,
  LISTING_FIELDS,
  LISTING_LABEL_FIELDS,
} from "../graphql/fragments";

export const getCatalogueFromCache = (
  catalogueId: string
): CatalogueType | null => {
  return cache.readFragment({
    id: `Catalogue:${catalogueId}`,
    fragment: ALL_CATALOGUE_FIELDS,
    fragmentName: "AllCatalogueFields",
  });
};

export const apolloHookErrorHandler = (
  path: string,
  hookError: ApolloError | undefined,
  warning?: boolean
): void => {
  if (hookError) {
    if (hookError.message.includes("Catalogue does not exist")) {
      // console.log("Catalogue does not exist", path);
      window.location.reload();
      return;
    }
    if (warning || process.env.NODE_ENV === "production") {
      // if (warning || prcess) {
      console.log(hookError);
      console.warn(`☝️☝️☝️ ERROR at "${path}" ☝️☝️☝️`);
    } else {
      console.log(hookError);
      throw new Error(`☝️☝️☝️ ERROR at "${path}" ☝️☝️☝️`);
    }
  }
};

export const updateCatalogueCache = (id: string, field: string, value: any) => {
  // will require updates as the object has more depth
  cache.modify({
    id,
    fields: {
      [field](existing) {
        return value;
      },
    },
  });
};

export const handleCacheDeletion = (cacheId: string) => {
  cache.evict({ id: cacheId });
  cache.gc();
};

export const endOrdering = (list: any[] | null, type: string): number => {
  if (!list || (list && list.length === 0)) return 0;
  return list.reduce(
    // @ts-ignore
    (max, ins) => {
      if (type === "max") return Math.max(max, ins.ordering);
      if (type === "min") return Math.min(max, ins.ordering);
    },
    list[0].ordering
  );
};

const getDependentCacheItem = (
  cacheId: string,
  fragment: DocumentNode,
  fragmentName: string
): DependentCacheItems => {
  return {
    id: cacheId,
    fragment,
    fragmentName,
    data: cache.readFragment({
      id: cacheId,
      fragment,
      fragmentName,
    }),
  };
};

export const handleDeletion = (
  id: string,
  type: string,
  deletionMutation: () => void,
  textField?: string,
  setRemoveMFD?: (value: RemoveMFD) => void,
  markedForDeletion?: MarkedForDeletion[],
  setMarkedForDeletion?: (value: MarkedForDeletion[]) => void,
  catalogue?: CatalogueType
) => {
  const cacheId = `${type}:${id}`;

  let dependentCacheItems: DependentCacheItems[] = [];

  // Conditional dependant cache items for each kind of object
  if (type === "Label") {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, LABEL_FIELDS, "AllLabelFields")
    );
    // TODO: standardize undo
    // Because of Label's cascadeing delete we need to store data which was
    if (catalogue) {
      catalogue.listings?.forEach((li: Listing) => {
        if (li.labels) {
          li.labels.forEach((la: ListingLabel) => {
            if (la.label.id === id) {
              dependentCacheItems.push(
                getDependentCacheItem(
                  `ListingLabel:${la.id}`,
                  LISTING_LABEL_FIELDS,
                  "AllListingLabelFields"
                )
              );
            }
          });
        }
      });
    }
  } else if (type === "Listing") {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, LISTING_FIELDS, "AllListingFields")
    );
  } else {
    dependentCacheItems.push(
      getDependentCacheItem(cacheId, ALL_CATALOGUE_FIELDS, "AllCatalogueFields")
    );
  }

  // if it will contain undo functionality
  if (textField && setRemoveMFD && markedForDeletion && setMarkedForDeletion) {
    // Initiate timeout to remove the item from the databse and unpdate state
    const deleteTimeout = setTimeout(() => {
      deletionMutation();
      setRemoveMFD({ id: cacheId, isUndo: false });
    }, 5000);

    // Update markedForDeletion state
    setMarkedForDeletion([
      ...markedForDeletion,
      {
        id: cacheId,
        text: `${
          type.charAt(0).toUpperCase() + type.substring(1).toLocaleLowerCase()
        } "${dependentCacheItems[0].data[textField]}" deleted`,
        timeout: deleteTimeout,
        dependentCacheItems,
      },
    ]);
  } else {
    deletionMutation();
  }
  dependentCacheItems.forEach((item) => {
    handleCacheDeletion(item.id);
  });
};

export const randomNumbers = (length: number): string => {
  const numbers = [];
  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  return numbers.join("");
};

export const isUrl = (value: string): boolean => {
  if (value.slice(0, 8) === "https://" || value.slice(0, 7) === "http://")
    return true;
  return false;
};

export const cleanedPath = (path: string): string => {
  let reducedUrl: string;
  if (location.pathname.endsWith("/")) {
    reducedUrl = location.pathname.slice(0, -1);
  } else {
    reducedUrl = location.pathname;
  }
  return reducedUrl;
};

export const concurrentEditingBlocker = (
  catalogue: CatalogueType,
  fieldEditing: FieldEditing
): CatalogueType => {
  switch (fieldEditing.typename) {
    case "Catalogue":
      // TODO: create enum for catalogue fields
      // @ts-ignore
      delete catalogue[fieldEditing.key];
      break;
    case "Listing":
      let listingRef: Listing | undefined | null;
      listingRef =
        catalogue.listings &&
        catalogue.listings!.find(
          (listing: Listing) => listing.id === fieldEditing.id
        );
      // @ts-ignore
      if (listingRef) delete listingRef[fieldEditing.key];
      break;
    case "Label":
      break;
    case "ListingLabel":
      break;
    case "Link":
      // listing where link is found
      let listingRefForLink: Listing | undefined | null;
      listingRefForLink =
        catalogue.listings &&
        catalogue.listings!.find(
          (listing: Listing) =>
            listing.links &&
            listing.links.find((link: Link) => link.id === fieldEditing.id)
        );
      let linkRef: Link | undefined | null;
      linkRef =
        listingRefForLink &&
        listingRefForLink.links &&
        listingRefForLink.links.find(
          (link: Link) => link.id === fieldEditing.id
        );
      // @ts-ignore
      if (linkRef) delete linkRef[fieldEditing.key];
      break;
    default:
      break;
  }

  return catalogue;
};

export const catalogueFEParser = (
  catalogue: CatalogueType,
  fieldEditing: FieldEditing | null
): CatalogueType => {
  // catalogue cleaning
  // if fieldEditing block the relevant update
  if (fieldEditing) {
    catalogue = concurrentEditingBlocker(catalogue, fieldEditing);
  }

  return catalogue;
};

export const removeFromCacheIfMFD = (
  catalogue: CatalogueType,
  markedForDeletion: MarkedForDeletion[]
) => {
  const labelsMFD: Label[] | null =
    markedForDeletion.length && catalogue.labels
      ? catalogue.labels.filter((label: Label) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === label.id)
        )
      : null;
  if (labelsMFD) {
    // TODO: standardize undo
    const labelsMFDIds: string[] = labelsMFD.map((label: Label) => label.id);
    catalogue.listings?.forEach((li: Listing) => {
      if (li.labels) {
        li.labels.forEach((la: ListingLabel) => {
          if (labelsMFDIds.includes(la.label.id)) {
            handleCacheDeletion(`ListingLabel:${la.id}`);
          }
        });
      }
    });
    // for each labelsMFDIds remove from cache
    labelsMFDIds.forEach((labelId: string) => {
      handleCacheDeletion(`Label:${labelId}`);
    });
  }
  // prevents listings from being shown if MFD
  const listingsMFD: Listing[] | null =
    markedForDeletion.length && catalogue.listings
      ? catalogue.listings.filter((listing: Listing) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === listing.id)
        )
      : null;
  if (listingsMFD) {
    const listingsMFDIds: string[] = listingsMFD.map(
      (listing: Listing) => listing.id
    );
    // for each listingsMFDIds remove from cache
    listingsMFDIds.forEach((labelId: string) => {
      handleCacheDeletion(`Listing:${labelId}`);
    });
  }
};

export const handleCopy = (path: string): void => {
  const currentUrl = window.location.href;
  const domain = currentUrl.split("/").slice(0, 3).join("/");
  navigator.clipboard.writeText(domain + path);
};

export const filteredListings = (
  listings: Listing[],
  listingsFilter: ListingsFilter
): Listing[] => {
  let newListings = [...listings];
  if (listingsFilter.labelIds.length) {
    newListings = newListings.filter((listing: Listing) => {
      if (!listing.labels) return false;
      return listing.labels.some((listingLabel: ListingLabel) => {
        return listingsFilter.labelIds.includes(listingLabel.label.id);
      });
    });
  }
  // exclude if it has label with id in listingsFilter.excludeLabelIds
  if (listingsFilter.excludeLabelIds.length) {
    newListings = newListings.filter((listing: Listing) => {
      if (!listing.labels) return true;
      return !listing.labels.some((listingLabel: ListingLabel) => {
        return listingsFilter.excludeLabelIds.includes(listingLabel.label.id);
      });
    });
  }
  switch (listingsFilter.type) {
    case "date":
      return newListings.sort((a: Listing, b: Listing) => {
        const aDate = new Date(a.created);
        const bDate = new Date(b.created);
        // most recent first
        return bDate.getTime() - aDate.getTime();
      });
    case "price":
      return newListings.sort((a: Listing, b: Listing) => {
        if (!a.price) return 1;
        if (!b.price) return -1;
        return b.price - a.price;
      });
    case "name":
      return newListings.sort((a: Listing, b: Listing) => {
        if (b.name === null) return -1;
        if (a.name === null) return 1;
        if (a.name > b.name) return 1;
        return -1;
      });
    default:
      return newListings;
  }
};

export const newOrdering = (items: any, id: string, overId: string): number => {
  const sortedItems = [...items].sort(
    (a: any, b: any) => a.ordering - b.ordering
  );
  const indexOfId = sortedItems.findIndex((item: any) => item.id === id);
  const indexOfOverId = sortedItems.findIndex(
    (item: any) => item.id === overId
  );
  const newItems = sortedItems.filter((item: any) => item.id !== id);
  newItems.splice(indexOfOverId, 0, sortedItems[indexOfId]);
  const nextItem = newItems[indexOfOverId + 1];
  const previousItem = newItems[indexOfOverId - 1];
  if (nextItem && previousItem) {
    return (nextItem.ordering + previousItem.ordering) / 2;
  } else if (nextItem) {
    return nextItem.ordering - 1;
  } else if (previousItem) {
    return previousItem.ordering + 1;
  } else {
    return 0;
  }
};

export const textClipper = (
  text: string | null,
  length: number
): string | null => {
  if (!text || text.length <= length) {
    return text;
  } else {
    return text.substring(0, length) + "...";
  }
};

export const rootUrl = (url: string): string => {
  return url.split("/").slice(0, 3).join("/");
};

import axios, { AxiosRequestConfig } from "axios";
export const fetchFullCatalogue = async (
  id: string
): Promise<CatalogueType | null> => {
  let catalogue: CatalogueType;
  const fetchToUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : process.env.BACKEND_URL + "/graphql";
  // create a axios fetch request to the http://localhost:4000/graphql
  const query = `fragment AllLabelFields on Label {
    id
    catalogue_id
    name
    link_url
    ordering
    is_private
    created
    updated
  }
  fragment AllListingLabelFields on ListingLabel {
    id
    listing_id
    label {
      ...AllLabelFields
    }
  }
  fragment AllLinkFields on Link {
    id
    listing_id
    url
    title
    created
    updated
  }
  fragment AllListingFields on Listing {
    id
    catalogue_id
    name
    link_url
    image_url
    description
    ordering
    show_price
    price
    created
    updated
    labels {
      ...AllListingLabelFields
    }
    links {
      ...AllLinkFields
    }
  }
  fragment AllCatalogueFields on Catalogue {
    id
    edit_id
    user_id
    status
    title
    description
    views
    header_image_url
    header_color
    author
    profile_picture_url
    event_date
    location
    created
    updated
    labels {
      ...AllLabelFields
    }
    listings {
      ...AllListingFields
    }
  }
  query Catalogues($id: ID, $edit_id: String) {
    catalogues(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }`;

  const config: AxiosRequestConfig = {
    method: "post",
    url: fetchToUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      query,
      variables: { id: id, edit_id: id },
    }),
  };
  let response = await axios(config);
  if (response.data.errors) return null;

  catalogue = response.data.data.catalogues[0];
  console.log("catalogue", catalogue);
  return catalogue;
};
