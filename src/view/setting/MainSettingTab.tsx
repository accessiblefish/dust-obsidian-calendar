import {PluginSettingTab, Setting} from "obsidian";
import {ReactNode} from "react";
import {createRoot, Root} from "react-dom/client";
import {FontSizeChangeMode, NoteType, TemplatePlugin} from "../../base/enum";
import DustCalendarPlugin from "../../main";
import ImmutableFontSizeSlider from "./ImmutableFontSizeSlider";
import FontSizeChangeModeSelect from "./FontSizeChangeModeSelect";
import QuarterNameModeSelect from "./QuarterNameModeSelect";
import TemplatePluginSelect from "./TemplatePluginSelect";
import NoteTemplate from "./NoteTemplate";
import NotePattern from "./NotePattern";
import DotUpperLimitSelect from "./DotUpperLimitSelect";
import TodoAnnotationModeSelect from "./TodoAnnotationModeSelect";
import WordsPerDotInput from "./WordsPerDotInput";

interface SettingDefinition {
    type?: "group";
    name?: string;
    desc?: string;
    heading?: string;
    items?: SettingDefinition[];
    visible?: () => boolean;
    render?: (setting: Setting) => void;
}

export default class MainSettingTab extends PluginSettingTab {

    private plugin: DustCalendarPlugin;
    private reactRoots: Set<Root>;

    constructor(plugin: DustCalendarPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.reactRoots = new Set();
    }

    getSettingDefinitions(): SettingDefinition[] {
        return [
            {
                name: "是否显示农历信息",
                desc: "关闭后不再显示农历月份、日期、节气、节日。",
                render: setting => this.displayShouldDisplayLunarInfoToggle(setting),
            },
            {
                name: "是否显示调休信息",
                desc: "关闭后不再显示调休信息。",
                render: setting => this.displayShouldDisplayHolidayInfo(setting),
            },
            {
                name: "字体大小调整模式",
                render: setting => this.renderReact(setting, <FontSizeChangeModeSelect plugin={this.plugin}/>),
            },
            {
                name: "字体大小",
                visible: () => this.plugin.database.setting.fontSizeChangeMode === FontSizeChangeMode.IMMUTABLE,
                render: setting => this.renderReact(setting, <ImmutableFontSizeSlider plugin={this.plugin}/>),
            },
            {
                name: "季度命名方式",
                render: setting => this.renderReact(setting, <QuarterNameModeSelect plugin={this.plugin}/>),
            },
            {
                name: "字数统计：字/点",
                render: setting => this.renderReact(setting, <WordsPerDotInput plugin={this.plugin}/>),
            },
            {
                name: "字数统计：点数上限",
                render: setting => this.renderReact(setting, <DotUpperLimitSelect plugin={this.plugin}/>),
            },
            {
                name: "待办标注方式",
                render: setting => this.renderReact(setting, <TodoAnnotationModeSelect plugin={this.plugin}/>),
            },
            {
                name: "创建新笔记之前是否需要确认",
                desc: "关闭后不再弹窗提示创建新笔记的信息。",
                render: setting => this.displayShouldConfirmBeforeCreatingNoteToggle(setting),
            },
            {
                name: "模板插件",
                render: setting => this.renderReact(setting, <TemplatePluginSelect plugin={this.plugin}/>),
            },
            this.getNoteSettingDefinitions(NoteType.DAILY, "每日笔记"),
            this.getNoteSettingDefinitions(NoteType.WEEKLY, "每周笔记"),
            this.getNoteSettingDefinitions(NoteType.MONTHLY, "每月笔记"),
            this.getNoteSettingDefinitions(NoteType.QUARTERLY, "季度笔记"),
            this.getNoteSettingDefinitions(NoteType.YEARLY, "年度笔记"),
        ];
    }

    display(): void {
        this.unmountReactRoots();
        this.containerEl.empty();
        for (const definition of this.getSettingDefinitions()) {
            this.renderDefinition(definition, this.containerEl);
        }
    }

    async hide(): Promise<void> {
        await this.plugin.database.saveSetting();
        this.unmountReactRoots();
        this.plugin.calendarViewController.forceFlush();
        super.hide();
    }

    public refresh(): void {
        this.display();
    }

    private getNoteSettingDefinitions(noteType: NoteType, title: string): SettingDefinition {
        return {
            type: "group",
            heading: title,
            items: [
                {
                    name: "启用",
                    render: setting => this.addNoteOptionToggle(setting, noteType),
                },
                {
                    name: "文件命名规则",
                    visible: () => this.plugin.noteController.getNoteOption(noteType),
                    render: setting => this.renderReact(setting, <NotePattern plugin={this.plugin} noteType={noteType}/>),
                },
                {
                    name: "模板文件",
                    visible: () => this.plugin.noteController.getNoteOption(noteType)
                        && this.plugin.templateController.getTemplatePlugin() !== TemplatePlugin.NONE
                        && this.plugin.templateController.isTemplatePluginEnable(),
                    render: setting => this.renderReact(setting, <NoteTemplate plugin={this.plugin} noteType={noteType}/>),
                },
            ],
        };
    }

    private renderDefinition(definition: SettingDefinition, container: HTMLElement): void {
        if (definition.visible && !definition.visible()) {
            return;
        }

        if (definition.type === "group") {
            const heading = new Setting(container).setName(definition.heading ?? "").setHeading();
            const [toggle, ...items] = definition.items ?? [];
            if (toggle) {
                toggle.render?.(heading);
            }
            for (const item of items) {
                this.renderDefinition(item, container);
            }
            return;
        }

        this.renderSetting(definition, new Setting(container));
    }

    private renderSetting(definition: SettingDefinition, setting: Setting): void {
        if (definition.name) {
            setting.setName(definition.name);
        }
        if (definition.desc) {
            setting.setDesc(definition.desc);
        }
        definition.render?.(setting);
    }

    private renderReact(setting: Setting, content: ReactNode): void {
        setting.settingEl.empty();
        const root = createRoot(setting.settingEl);
        this.reactRoots.add(root);
        root.render(content);
    }

    private unmountReactRoots(): void {
        for (const root of this.reactRoots) {
            root.unmount();
        }
        this.reactRoots.clear();
    }

    private displayShouldDisplayLunarInfoToggle(setting: Setting): void {
        setting.setName("是否显示农历信息").setDesc("关闭后不再显示农历月份、日期、节气、节日。");
        setting.addToggle(toggle => {
            toggle.setValue(this.plugin.calendarViewController.getShouldDisplayLunarInfo());
            toggle.onChange((value) => {
                this.plugin.calendarViewController.setShouldDisplayLunarInfo(value);
                void this.plugin.database.saveSetting();
                this.plugin.calendarViewController.requestFlush();
            });
        });
    }

    private displayShouldDisplayHolidayInfo(setting: Setting): void {
        setting.setName("是否显示调休信息").setDesc("关闭后不再显示调休信息。");
        setting.addToggle(toggle => {
            toggle.setValue(this.plugin.calendarViewController.getShouldDisplayHolidayInfo());
            toggle.onChange((value) => {
                this.plugin.calendarViewController.setShouldDisplayHolidayInfo(value);
                void this.plugin.database.saveSetting();
                this.plugin.calendarViewController.requestFlush();
            });
        });
    }

    private displayShouldConfirmBeforeCreatingNoteToggle(setting: Setting): void {
        setting.setName("创建新笔记之前是否需要确认").setDesc("关闭后不再弹窗提示创建新笔记的信息。");
        setting.addToggle(toggle => {
            toggle.setValue(this.plugin.noteController.getShouldConfirmBeforeCreatingNote());
            toggle.onChange((value) => {
                this.plugin.noteController.setShouldConfirmBeforeCreatingNote(value);
                void this.plugin.database.saveSetting();
            });
        });
    }

    private addNoteOptionToggle(setting: Setting, noteType: NoteType): void {
        setting.addToggle(toggle => {
            toggle.setValue(this.plugin.noteController.getNoteOption(noteType));
            toggle.onChange((value) => {
                this.plugin.noteController.setNoteOption(noteType, value);
                void this.plugin.database.saveSetting();
                this.refresh();
            });
        });
    }
}
