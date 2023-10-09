import { calendarType } from "../../core/interfaces/DataInterface";
import {
  detectDateFormats,
  countryCodes,
  countriesWithDifferentDateFormat,
} from "./detectDateFormats";
import { PaginationEnum, PaginationYearEnum } from "../models/strategy.model";
import { FormControlInterface } from "../../core/interfaces/FormControlInterface";

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

export const splitDate = (date: string, contract: calendarType): string[] => {
  if (!date) return [];

  let formattedString = date.replace(/[.-]/g, "/");

  const locale = contract.locale.toLowerCase();

  if (!formattedString) return [];

  return {
    month: () => {
      if (!formattedString) return [];

      const wasDetected = detectDateFormats(formattedString);

      const isDifferentFormat2 =
        countriesWithDifferentDateFormat.includes(locale);

      if (isDifferentFormat2) {
        const splited = formattedString.split("/");

        const [year, month] = splited;

        return [month, year];
      }

      if (wasDetected.length) {
        const reverse = wasDetected.reverse();

        formattedString = reverse.toString();
      }

      const splited = formattedString.split("/");

      const [month, year] = splited;

      return [month, year];
    },
    day: () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      if (!formattedString) return [];

      const wasDetected = detectDateFormats(formattedString);

      const isDifferentFormat = countryCodes.includes(locale);

      const isDifferentFormat2 =
        countriesWithDifferentDateFormat.includes(locale);

      if (isDifferentFormat2) {
        const splited = formattedString.split("/");

        const [year, month, day] = splited;

        return [month, day, year];
      }

      if (wasDetected.length && !isDifferentFormat) {
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
  }[contract.type]();
};

export const handleCalendarYearBuildForm = (
  type: string,
  callback: Function,
  years: number[],
  calendar: HTMLElement,
  form: FormControlInterface,
  row: calendarType,
  yearClass?: Function
): void => {
  if (!type) return;

  const yearArray = calendar.querySelector("#year-array") as HTMLElement;

  if (!yearArray) return;

  if (!years.length) return;

  const yearArrayHtml = yearArray.innerHTML;

  if (!yearArrayHtml.length) return;

  const [firstYear, lastYear] = yearArrayHtml.split(" - ");

  return {
    prevPagination: () => {
      let y = Number(firstYear);

      if (y == 0) return;

      if (!y) y = new Date().getFullYear();

      let yearList = calendar.querySelector(".year-list") as HTMLElement;

      let yearsAbove = years.slice(Math.max(0, y - 20), y);

      yearList.innerHTML = "";

      (calendar.querySelector("#year-array") as HTMLElement).innerHTML =
        yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

      yearsAbove.forEach((e, index) => {
        let year = document.createElement("div");
        year.innerHTML = `<div data-year="${e}" class="year-element ${
          yearClass ? yearClass(e, form, row) : ""
        }">${e}</div>`;

        yearList.appendChild(year);
      });

      (
        calendar.querySelectorAll(".year-element") as NodeListOf<HTMLDivElement>
      ).forEach((element: HTMLDivElement) => {
        element.addEventListener("click", (ele: Event) =>
          callback(ele.target as HTMLDivElement)
        );
      });
    },
    nextPagination: () => {
      let y = Number(lastYear);

      if (!y) y = new Date().getFullYear();

      let yearList = calendar.querySelector(".year-list") as HTMLElement;

      let yearsAbove = years.slice(Number(y) + 1, Number(y) + 21);

      yearList.innerHTML = "";

      (calendar.querySelector("#year-array") as HTMLElement).innerHTML =
        yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

      yearsAbove.forEach((e, index) => {
        let year = document.createElement("div");
        year.innerHTML = `<div data-year="${e}" class="year-element ${
          yearClass ? yearClass(e, form, row) : ""
        }">${e}</div>`;

        yearList.appendChild(year);
      });

      (
        calendar.querySelectorAll(".year-element") as NodeListOf<HTMLDivElement>
      ).forEach((element: HTMLDivElement) => {
        element.addEventListener("click", (ele: Event) =>
          callback(ele.target as HTMLDivElement)
        );
      });
    },
  }[type as keyof PaginationEnum]();
};

export const handleCalendarMonthBuildForm = (
  type: string,
  callback: Function
) => {
  if (!type) return;

  return {
    prevYear: () => {
      callback(type);
    },
    nextYear: () => {
      callback(type);
    },
  }[type as keyof PaginationYearEnum]();
};
