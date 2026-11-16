import {StrictMode} from "react";
import {createRoot, Root} from "react-dom/client";
import {Provider} from "react-redux";
import {ItemView, WorkspaceLeaf} from "obsidian";
import {store} from "./redux/store";
import CalendarViewImpl from "./calendar_view/CalendarViewImpl";
import DustCalendarPlugin from "../main";
import {PluginContext} from "./context";

export const VIEW_TYPE_CALENDAR = "calendar-view";

export class CalendarView extends ItemView {

    private readonly plugin: DustCalendarPlugin;
    private root: Root | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: DustCalendarPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.icon = "lucide-calendar-check";
    }

    getViewType(): string {
        return VIEW_TYPE_CALENDAR;
    }

    getDisplayText(): string {
        return "日历";
    }

    async onOpen(): Promise<void> {
        this.root = createRoot(this.containerEl.children[1]);
        this.renderCalendar();
    }

    public flush(): void {
        this.renderCalendar();
    }

    async onClose(): Promise<void> {
        this.root?.unmount();
        this.root = null;
    }

    private renderCalendar(): void {
        this.root?.render(
            <StrictMode>
                <PluginContext.Provider value={this.plugin}>
                    <Provider store={store}>
                        <CalendarViewImpl/>
                    </Provider>
                </PluginContext.Provider>
            </StrictMode>,
        );
    }
}
