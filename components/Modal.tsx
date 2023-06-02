import { FunctionComponent, PropsWithChildren } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface Props extends PropsWithChildren {
  title: string;
  onClose: () => void;
}

export const Modal: FunctionComponent<Props> = ({
  onClose,
  title,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-lg px-6 py-4 bg-white shadow-lg rounded-md text-center flex flex-col">
        <div className="flex flex-row justify-between w-full mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
