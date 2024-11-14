import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { useSelector } from "react-redux";
import { selectSettings } from "../features/settingsSlice";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(customParseFormat);

export const RelativeDateClass = (date) => {
  let dateClass = "future";

  if (dayjs(date).isToday()) {
    dateClass = "today";
  }

  if (dayjs(date).isBefore(dayjs(), "day")) {
    dateClass = "past";
  }

  return dateClass;
};

export const FormattedDate = (date) => {
  const settings = useSelector(selectSettings);

  let dueDate = "";
  if (settings.relativeDate) {
    dueDate = dayjs(date + " 23:59").fromNow();
    if (dayjs(date).isToday()) {
      dueDate = "today";
    }
  }

  if (settings.date) {
    dueDate += " " + dayjs(date).format(settings.dateFormat);
  }

  return dueDate.trim();
};

export const dateExists = (date, format = "YYYY-MM-DD") => {
  return dayjs(date, format, true).isValid(); // false
};
