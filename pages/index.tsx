import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { getGithubPreviewProps, parseJson } from "next-tinacms-github";
import { GetStaticProps } from "next";

export default function Home({
  file,
}: {
  file: { fileRelativePath: string; data: { title: string } };
}) {
  const data = file.data;
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="title">
          {/**
           * Render the title from `home.json`
           */}
          - Welcome to <a href="https://nextjs.org">Next.js!</a>
          {data.title}
        </h1>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
}) {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: "content/home.json",
      parse: parseJson,
    });
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: "data/home.json",
        data: (await import("../data/home.json")).default,
      },
    },
  };
};
