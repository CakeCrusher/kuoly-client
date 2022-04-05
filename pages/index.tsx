import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import { GetStaticProps } from "next";
import { gql, useQuery } from "@apollo/client";
import { useUser } from "../lib/UserProvider";
import { useEffect } from "react";

const myCataloguesQuery = gql`
  query MyCatalogues {
    myCatalogues {
      title
    }
  }
`;

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}) {
  return (
    <div>
      <Head>
        <title>asd</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Self ]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
