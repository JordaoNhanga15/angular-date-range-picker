import { DataInterface } from "../../core/interfaces/DataInterface";
import { detectDateFormats } from "./detectDateFormats";

export const formatDate = (
  date: Date,
  callback: (date: Date) => string
): string => {
  if (!date) return "";
  return callback(date);
};

export const isBefore = (date: Date, compare: Date): Boolean => {
  if (!date || !compare) return false;
  return date.getTime() < compare.getTime();
};

export const isAfter = (date: Date, compare: Date): boolean => {
  if (!date || !compare) return false;
  return date.getTime() > compare.getTime();
};

export const transformPipeInDate = (
  day: number,
  month: number,
  year: number
): Date => {
  return new Date(year, month, day);
};

export const splitDate = (date: string, contract: DataInterface): string[] => {
  if (!date) return [];

  let formattedString = date.replace(/\./g, "/");

  if (!formattedString) return [];

  return {
    month: () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
      });

      if (!formattedString) return [];

      const newDate = new Date(formattedString);

      if (!isNaN(newDate.getTime())) return [];

      const parsedDate = new Date(formatter.format(newDate));

      return parsedDate
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
        })
        .split("/");
    },
    day: () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      if (!formattedString) return [];

      const wasDetected = detectDateFormats(formattedString);

      if (wasDetected.length) {
        const reverse = wasDetected.reverse();

        formattedString = reverse.toString();

        const splited = formattedString.split("/");

        const [day, month, year] = splited;

        return [month, day, year];
      }

      const newDate = new Date(formattedString);

      const parsedDate = new Date(formatter.format(newDate));

      return parsedDate
        .toLocaleDateString("en-Us", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
        .split("/");
    },
    year: () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      });

      const newDate = new Date(formattedString);

      if (!isNaN(newDate.getTime())) return [];

      const parsedDate = new Date(formatter.format(newDate));

      return parsedDate
        .toLocaleDateString("en-US", {
          year: "numeric",
        })
        .split("/");
    },
    week: () => [],
    decade: () => [],
    century: () => [],
  }[contract.type]();
};
