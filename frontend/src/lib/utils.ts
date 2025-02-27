import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatDate(date: string) {
//   const now = new Date();
//   const givenDate = new Date(date);
//   const diffInSeconds = Math.floor(
//     (now.getTime() - givenDate.getTime()) / 1000
//   );

//   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

//   if (diffInSeconds < 60) {
//     return rtf.format(-diffInSeconds, "seconds");
//   } else if (diffInSeconds < 3600) {
//     const minutes = Math.floor(diffInSeconds / 60);
//     return rtf.format(-minutes, "minutes");
//   } else if (diffInSeconds < 86400) {
//     const hours = Math.floor(diffInSeconds / 3600);
//     return rtf.format(-hours, "hours");
//   } else {
//     const days = Math.floor(diffInSeconds / 86400);
//     return rtf.format(-days, "days");
//   }
// }
export function formatDate(date: string) {
  const now = new Date();
  const givenDate = new Date(date);

  if (isNaN(givenDate.getTime())) {
    return "Invalid date";
  }

  const diffInSeconds = Math.floor(
    (now.getTime() - givenDate.getTime()) / 1000
  );

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, "seconds");
  } else if (Math.abs(diffInSeconds) < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, "minutes");
  } else if (Math.abs(diffInSeconds) < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, "hours");
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, "days");
  }
}

export const makeSlug = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const makeUserAvatarSlug = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};
