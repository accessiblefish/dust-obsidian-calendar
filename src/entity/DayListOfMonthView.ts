import {WeekEnum} from "../base/enum";
import {DateTime} from "luxon";

export default class DayListOfMonthView {

    private readonly _month: number;
    private readonly _totalWeeks: number;
    private readonly _dayList: DateTime[];

    constructor(year: number, month: number) {
        this._month = month;

        const firstDayOfMonth = DateTime.local(year, month);
        const lastDayOfMonth = DateTime.local(year, month, firstDayOfMonth.daysInMonth!);
        const firstDayOfMonthView = firstDayOfMonth.minus({days: firstDayOfMonth.weekday - 1});
        const lastDayOfMonthView = lastDayOfMonth.plus({days: 7 - lastDayOfMonth.weekday});
        const totalDays = lastDayOfMonthView.diff(firstDayOfMonthView, 'days').as('days') + 1;
        this._totalWeeks = totalDays / 7;

        this._dayList = [];
        for (let i = 0; i < totalDays; i++) {
            this._dayList.push(firstDayOfMonthView.plus({days: i}));
        }
    }

    get month(): number {
        return this._month;
    }

    get totalWeeks(): number {
        return this._totalWeeks;
    }

    getDayByWeek(weekIndexInCurrentMonth: number, weekEnum: WeekEnum): DateTime {
        const dayIndex = weekIndexInCurrentMonth * 7 + weekEnum.valueOf() - 1;
        return this._dayList[dayIndex];
    }
}
