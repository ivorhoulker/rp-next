import { AppProps } from "next/app";
import "../styles/globals.css";
import { TinaCMS, TinaProvider } from "tinacms";
import {
  GithubClient,
  TinacmsGithubProvider,
  GithubMediaStore,
} from "react-tinacms-github";

function App({ Component, pageProps }: AppProps) {
  const github = new GithubClient({
    proxy: "/api/proxy-github",
    authCallbackRoute: "/api/create-github-access-token",
    clientId: process.env.GITHUB_CLIENT_ID!,
    baseRepoFullName: process.env.REPO_FULL_NAME!,
    baseBranch: process.env.BASE_BRANCH,
  });

  const cms = new TinaCMS({
    enabled: !!pageProps.preview,
    apis: {
      /**
       * 2. Register the GithubClient
       */
      github,
    },
    /**
     * 3. Register the Media Store
     */
    media: new GithubMediaStore(github),
    /**
     * 4. Use the Sidebar and Toolbar
     */
    sidebar: pageProps.preview,
    toolbar: pageProps.preview,
  });

  return (
    <TinaProvider cms={cms}>
      <TinacmsGithubProvider
        onLogin={onLogin}
        onLogout={onLogout}
        error={pageProps.error}
      >
        {/**
         * 6. Add a button for entering Preview/Edit Mode
         */}
        <EditLink cms={cms} />
        <Component {...pageProps} />
      </TinacmsGithubProvider>
    </TinaProvider>
  );
}

const onLogin = async () => {
  const token = localStorage.getItem("tinacms-github-token") || null;
  const headers = new Headers();

  if (token) {
    headers.append("Authorization", "Bearer " + token);
  }

  const resp = await fetch(`/api/preview`, { headers: headers });
  const data = await resp.json();

  if (resp.status == 200) window.location.href = window.location.pathname;
  else throw new Error(data.message);
};

const onLogout = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
};

export interface EditLinkProps {
  cms: TinaCMS;
}

export const EditLink = ({ cms }: EditLinkProps) => {
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  );
};

export default App;
