import { FunctionComponent } from "react";

export interface Props {
  setHasClickedOnce: (hasClickedOnce: boolean) => void;
}

export const WelcomeModalView: FunctionComponent<Props> = ({
  setHasClickedOnce,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="relative w-full max-w-lg px-6 py-4 bg-white dark:bg-gray-800 shadow-lg rounded-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🌏 Welcome to globale! 🌍
        </h1>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-200">
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
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-200">
          The code is{" "}
          <a
            href="https://github.com/snowzurfer/globale"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            open source
          </a>{" "}
          🤖.
        </p>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-200">
          Click anywhere on the globe to add ThreeJS objects! They are
          synchronized and persisted 🔁.
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setHasClickedOnce(true)}
          >
            Let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
};
