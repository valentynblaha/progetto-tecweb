import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * Converts a string to a dayjs instance
 * @param {string} str
 * @returns
 */
export function strTimeToDayjs(str) {
  return dayjs(str, "hh:mm:ss");
}

/**
 * Converts a dayjs instance to string
 * @param {dayjs.Dayjs} dayjsVal
 * @returns
 */
export function dayjsTimeToStr(dayjsVal) {
  return dayjsVal.format("hh:mm:ss");
}

/**
 * Rerpesents a day in a schedule
 * @typedef {{
 * week_day: string,
 * start1: string,
 * end1: string,
 * start2: string,
 * end2: string,
 * }} ScheduleDay
 */

/**
 * Checks if 2 Schedule days overlap
 * @param {ScheduleDay} a
 * @param {ScheduleDay} b
 */
export function overlap(a, b) {
  const d = strTimeToDayjs; // only for aestethics
  const overlapSegment = (s1, e1, s2, e2) => d(e1) > d(s2) && d(e2) > d(s1);
  if (!a || !b) return false;
  return a.week_day === b.week_day && Boolean(
    overlapSegment(a.start1, a.end1, b.start1, b.end1) ||
      (b.start2 && b.end2 && overlapSegment(a.start1, a.end1, b.start2, b.end2)) ||
      (a.start2 && a.end2 && overlapSegment(a.start2, a.end2, b.start1, b.end1)) ||
      (a.start2 && a.end2 && b.start2 && b.end2 && overlapSegment(a.start2, a.end2, b.start2, b.end2))
  );
}
export default dayjs;
