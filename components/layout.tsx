import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

import { useUser } from "../lib/UserProvider";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { apolloHookErrorHandler } from "../utils/functions";
import { useMarkedForDeletion, useRemoveMFD } from "../state/store";
import { MY_CATALOGUES } from "../graphql/schemas";
import CreateCatalogueButton from "./CreateCatalogueButton/CreateCatalogueButton";
import UndoNotification from "./Undo/UndoNotification";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { registerUser, cache } = useUser();
  useEffect(() => {
    registerUser();
  }, []);
  const { removeMFD, setRemoveMFD } = useRemoveMFD();
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();

  useEffect(() => {
    // handling undo and clearing of undo list
    if (
      removeMFD &&
      markedForDeletion.find(
        (mfd: MarkedForDeletion) => mfd.id === removeMFD.id
      )
    ) {
      const currentMFD = markedForDeletion.find(
        (mfd: MarkedForDeletion) => mfd.id === removeMFD.id
      )!;

      if (removeMFD.isUndo) {
        currentMFD.dependentCacheItems.forEach((dci: DependentCacheItems) => {
          cache.writeFragment(dci);
        });
      } else {
      }

      setMarkedForDeletion(
        markedForDeletion.filter(
          (mfd: MarkedForDeletion) => mfd.id !== removeMFD.id
        )
      );

      setRemoveMFD(null);
    }
  }, [removeMFD, setRemoveMFD, markedForDeletion, setMarkedForDeletion]);

  const myCatalogues = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("layout.tsx", myCatalogues.error);
  return (
    <div className="layoutContainer">
      <div id="navbar">
        <Link href="/">
          <a className="logo">
            <img
              className="icon"
              src="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
              alt="kuoly"
            />
            <div>
              Kuo<span className="secondary-text">ly</span>
            </div>
          </a>
        </Link>
        <div className="routes">
          <Link href="/catalogues">
            <a>My Lists</a>
          </Link>
          <CreateCatalogueButton>Create a List</CreateCatalogueButton>
        </div>
      </div>
      <div className="false-nav" />
      <ul>
        {myCatalogues.data &&
          myCatalogues.data.myCatalogues?.map((catalogues) => (
            <li key={catalogues.id}>{catalogues.title}</li>
          ))}
      </ul>
      {children}
      <div className="footer-wrapper">
        <div id="footer">
          <div className="footer-text">
            Got questions or comments? Contact us at{" "}
            <a href="mailto:contact@kuoly.com">
              <strong className="contact">contact@kuoly.com</strong>
            </a>
          </div>
          {/* <Feedback /> */}
        </div>
        <div className="misc-links">
          <Link href="/api">
            <a className="footer-link">Kuoly API</a>
          </Link>
          <a
            href="https://github.com/CakeCrusher/kuoly"
            target="_blank"
            className="footer-link"
          >
            Kuoly GitHub
          </a>
        </div>
      </div>
      <UndoNotification />
    </div>
  );
}
