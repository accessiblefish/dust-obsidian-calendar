import {useContext, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../redux/selectedItemSlice";
import {selectCalendarViewType, updateCalendarViewType} from "../redux/calendarViewType";
import {DateTime} from "luxon";
import {ChevronLeft, ChevronRight} from 'lucide-react';
import SelectedItem from "../../entity/SelectedItem";
import {CalendarViewType, NoteType, SelectedItemType} from "../../base/enum";
import {PluginContext} from "../context";
import StatisticLabel from "./StatisticLabel";

function YearItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const plugin = useContext(PluginContext)!;

    const toLastYear = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({years: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextYear = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({years: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div className="calendar-header-block-year">
        <div className="calendar-header-body-year" onMouseEnter={() => setHidden(false)}
             onMouseLeave={() => setHidden(true)}>
            <ChevronLeft className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}} onClick={toLastYear}/>
            <div className="calendar-header-content-year"
                 onDoubleClick={() => plugin.noteController.openNoteByNoteType(DateTime.local(selectedDate.year), NoteType.YEARLY)}>
                <div>{selectedDate.year}年</div>
            </div>
            <ChevronRight className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}} onClick={toNextYear}/>
        </div>
        <StatisticLabel date={DateTime.local(selectedDate.year)} noteType={NoteType.YEARLY}/>
    </div>
}

function MonthItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const plugin = useContext(PluginContext)!;

    const toLastMonth = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({months: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextMonth = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({months: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div className="calendar-header-block-month">
        <div className="calendar-header-body-month" onMouseEnter={() => setHidden(false)}
             onMouseLeave={() => setHidden(true)}>
            <ChevronLeft className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}} onClick={toLastMonth}/>
            <div className="calendar-header-content-month"
                 onDoubleClick={() => plugin.noteController.openNoteByNoteType(DateTime.local(selectedDate.year, selectedDate.month), NoteType.MONTHLY)}>
                <div>{selectedDate.month}月</div>
            </div>
            <ChevronRight className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}} onClick={toNextMonth}/>
        </div>
        <StatisticLabel date={DateTime.local(selectedDate.year, selectedDate.month)} noteType={NoteType.MONTHLY}/>
    </div>
}

function QuarterItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const plugin = useContext(PluginContext)!;

    const toLastQuarter = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({months: 3});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextQuarter = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({months: 3});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div className="calendar-header-block-quarter">
        <div className="calendar-header-body-quarter" onMouseEnter={() => setHidden(false)}
             onMouseLeave={() => setHidden(true)}>
            <ChevronLeft className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                         onClick={toLastQuarter}/>
            <div className="calendar-header-content-quarter"
                 onDoubleClick={() => plugin.noteController.openNoteByNoteType(DateTime.local(selectedDate.year, selectedDate.quarter * 3 - 2), NoteType.QUARTERLY)}>
                <div>{plugin.viewController.parseQuarterName(selectedDate.quarter)}</div>
            </div>
            <ChevronRight className="d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                          onClick={toNextQuarter}/>
        </div>
        <StatisticLabel date={DateTime.local(selectedDate.year, selectedDate.quarter * 3 - 2)}
                        noteType={NoteType.QUARTERLY}/>
    </div>
}

function isTodaySelected(selectedItem: SelectedItem, today: DateTime): boolean {
    const selectedDate = selectedItem.date;
    switch (selectedItem.type) {
        case SelectedItemType.DAY_ITEM:
            return selectedDate.hasSame(today, 'day');
        case SelectedItemType.WEEK_INDEX_ITEM:
            return selectedDate.weekYear === today.weekYear && selectedDate.weekNumber === today.weekNumber;
        case SelectedItemType.MONTH_ITEM:
            return selectedDate.hasSame(today, 'month');
        case SelectedItemType.QUARTER_ITEM:
            return selectedDate.year === today.year && selectedDate.quarter === today.quarter;
        case SelectedItemType.YEAR_ITEM:
            return selectedDate.year === today.year;
        default:
            return false;
    }
}

function TodayItem({today, onSelectToday}: { today: DateTime, onSelectToday: () => void }) {
    const selectedItem = useAppSelector(selectSelectedItem);
    const className = isTodaySelected(selectedItem, today)
        ? "today-label d-selected-item"
        : "today-label d-unselected-item";

    return <div className={className} onClick={onSelectToday}>今</div>
}

function ViewSelector() {

    const dispatch = useAppDispatch();
    const calendarViewType = useAppSelector(selectCalendarViewType);
    const selectedItem = useAppSelector(selectSelectedItem);

    const clickMonthCallback = () => {
        dispatch(updateCalendarViewType(CalendarViewType.YEAR));

        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = SelectedItemType.MONTH_ITEM
        newSelectedItem.date = selectedItem.date;
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const clickYearCallback = () => {
        dispatch(updateCalendarViewType(CalendarViewType.MONTH));

        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = SelectedItemType.DAY_ITEM
        newSelectedItem.date = selectedItem.date;
        dispatch(updateSelectedItem(newSelectedItem));
    }

    if (calendarViewType === CalendarViewType.MONTH) {
        return <div className="view-selector-label d-unselected-item" onClick={clickMonthCallback}>月</div>
    }
    else {
        return <div className="view-selector-label d-unselected-item" onClick={clickYearCallback}>年</div>
    }

}

export default function CalendarViewHeader({today, onSelectToday}: { today: DateTime, onSelectToday: () => void }) {
    return <div className="d-header-font calendar-header-container">
        <div className="calendar-header-row">
            <YearItem/>
            <QuarterItem/>
        </div>
        <div className="calendar-header-row">
            <MonthItem/>
            <div className="calendar-header-block-label">
                <TodayItem today={today} onSelectToday={onSelectToday}/>
                <ViewSelector/>
            </div>
        </div>
    </div>
}