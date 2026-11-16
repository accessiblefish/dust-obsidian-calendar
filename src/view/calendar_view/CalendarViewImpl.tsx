import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {DateTime} from "luxon";
import DayListOfMonthView from "../../entity/DayListOfMonthView";
import MonthView from "./MonthView";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import CalendarViewHeader from "./CalendarViewHeader";
import YearView from "./YearView";
import {selectCalendarViewType} from "../redux/calendarViewType";
import {CalendarViewType, FontSizeChangeMode} from "../../base/enum"
import {selectSelectedItem, updateSelectedDate} from "../redux/selectedItemSlice";
import {PluginContext} from "../context";

function useToday() {
    const dispatch = useAppDispatch();
    const [today, setToday] = useState(() => DateTime.now().startOf('day'));

    const selectToday = useCallback(() => {
        const nextToday = DateTime.now().startOf('day');
        setToday(current => current.hasSame(nextToday, 'day') ? current : nextToday);
        dispatch(updateSelectedDate(nextToday));
        return nextToday;
    }, [dispatch]);

    useEffect(() => {
        let timeout: number;
        const updateToday = () => {
            const nextToday = selectToday();
            const delay = nextToday.plus({days: 1}).diff(DateTime.now()).as('milliseconds') + 100;
            timeout = window.setTimeout(updateToday, delay);
        };
        updateToday();
        return () => window.clearTimeout(timeout);
    }, [selectToday]);

    return {today, selectToday};
}

export default function CalendarViewImpl() {
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const calendarViewType = useAppSelector(selectCalendarViewType);
    const plugin = useContext(PluginContext)!;
    const {today, selectToday} = useToday();

    const widthRef = useRef(null);
    const [width, setWidth] = useState(168);
    useEffect(() => {
        const element = widthRef.current;
        if (!element) return;

        // 创建 ResizeObserver 实例
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === element) {
                    const contentRect = entry.contentRect;
                    setWidth(contentRect.width);
                }
            }
        });

        // 开始监听
        resizeObserver.observe(element);

        // 清理函数，在组件卸载时停止监听
        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
    }, []);

    const fontSizeChangeMode = plugin.database.setting.fontSizeChangeMode;
    let fontSizeFactor = plugin.database.setting.immutableFontSizeFactor / 10;

    let fontSizeCustomEnable = 1;
    let fontSizeFollowObsidian = 0;
    if (fontSizeChangeMode === FontSizeChangeMode.FOLLOW_OBSIDIAN) {
        fontSizeCustomEnable = 0;
        fontSizeFollowObsidian = 1;
    }
    else if (fontSizeChangeMode === FontSizeChangeMode.FOLLOW_WIDGET) {
        let tmp = width - 168;
        if (tmp > 200) {
            tmp = 200;
        }
        fontSizeFactor = tmp / 100;
    }

    const style = {
        '--d-font-size-factor': fontSizeFactor,
        '--d-font-size-custom-enable': fontSizeCustomEnable,
        '--d-font-size-follow-obsidian': fontSizeFollowObsidian
    };

    if (calendarViewType === CalendarViewType.MONTH) {
        const dayListOfMonthView: DayListOfMonthView = new DayListOfMonthView(selectedDate.year, selectedDate.month);
        return <div style={style as React.CSSProperties} ref={widthRef}>
            <CalendarViewHeader today={today} onSelectToday={selectToday}/>
            <MonthView dayListOfMonthView={dayListOfMonthView} today={today}/>
        </div>
    }
    else {
        return <div style={style as React.CSSProperties} ref={widthRef}>
            <CalendarViewHeader today={today} onSelectToday={selectToday}/>
            <YearView showYear={selectedDate.year}/>
        </div>
    }


}
