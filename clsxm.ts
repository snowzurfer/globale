// from https://stackoverflow.com/a/75145528
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const clsxm = (...classes: ClassValue[]) => twMerge(clsx(...classes));
