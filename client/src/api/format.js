import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

/**
 * Converts a string to a dayjs instance
 * @param {string} str 
 * @returns 
 */
export function strTimeToDayjs(str) {
  return dayjs(str, "hh:mm:ss")
}

/**
 * Converts a dayjs instance to string
 * @param {dayjs.Dayjs} dayjsVal 
 * @returns 
 */
export function dayjsTimeToStr(dayjsVal) {
  return dayjsVal.format("hh:mm:ss")
}

export default dayjs;