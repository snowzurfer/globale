import { firAuth } from "@/app/firebase";
import { useGlobaleStore } from "@/app/store";
import { signInAnonymously } from "firebase/auth";
import { FunctionComponent, useEffect, useState } from "react";

export interface Props {
  setHasClickedOnce: (hasClickedOnce: boolean) => void;
}

export const WelcomeModalView: FunctionComponent<Props> = ({
  setHasClickedOnce,
}) => {
  const googleTilesAPIKey = useGlobaleStore((state) => state.googleTilesAPIKey);
  const setGoogleTilesAPIKey = useGlobaleStore(
    (state) => state.setGoogleTilesAPIKey
  );
  const user = useGlobaleStore((state) => state.user);
  const [apiKey, setApiKey] = useState(googleTilesAPIKey);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setApiKey(googleTilesAPIKey);
  }, [googleTilesAPIKey]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="relative w-full flex flex-col gap-4 max-w-lg px-6 py-4 bg-white dark:bg-gray-800 shadow-lg rounded-md text-center text-sm text-gray-600 dark:text-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🌏 Welcome to globale! 🌍
        </h1>
        <p>
          This is a synchronized 3D globe editor rendering Google Maps 3D Tiles,
          using{" "}
          <a
            href="https://github.com/ebeaufay/UltraGlobe"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            UltraGlobe
          </a>
          ,{" "}
          <a
            href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            react-three-fiber
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/pmndrs/drei"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            drei
          </a>
          .
        </p>
        <p>
          The code is{" "}
          <a
            href="https://github.com/snowzurfer/globale"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            open source
          </a>{" "}
          🤖.
        </p>
        <p>
          Click anywhere on the globe to add ThreeJS objects! They are
          synchronized and persisted 🔁.
        </p>

        <div className="flex flex-col w-full gap-2 text-sm">
          <p>Enter your Google Tiles API Key:</p>
          <input
            type="text"
            name="API Keuy"
            id="api-key"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="API_KEY"
            aria-describedby="api-key"
            value={apiKey ?? ""}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <a
            href="https://developers.google.com/maps/documentation/embed/get-api-key"
            className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
          >
            How to create an API key
          </a>
        </div>
        <div className="mt-2">
          <button
            type="button"
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-500"
            disabled={!apiKey}
            onClick={async () => {
              setProcessing(true);

              setHasClickedOnce(true);

              await setGoogleTilesAPIKey(apiKey);
              if (!user) {
                await signInAnonymously(firAuth);
              }

              setProcessing(false);
            }}
          >
            Let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
};
