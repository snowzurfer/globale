import { FunctionComponent, useState } from "react";
import { Switch } from "@headlessui/react";
import { clsxm } from "@/clsxm";

export interface Props {
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  labelClassName?: string;
}

export const SwitchWithlabel: FunctionComponent<Props> = ({
  label,
  enabled,
  setEnabled,
  labelClassName,
}) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between w-full">
      <span className="">
        <Switch.Description
          as="span"
          className={clsxm("text-sm text-gray-500", labelClassName)}
        >
          {label}
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={clsxm(
          enabled ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={clsxm(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
};
