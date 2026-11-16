import {MarkdownView, Notice, TAbstractFile, TFile} from "obsidian";
import {DateTime} from "luxon";
import {NoteType, SelectedItemType} from "../base/enum";
import SelectedItem from "../entity/SelectedItem";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import DustCalendarPlugin from "../main";

/**
 * 封装笔记操作
 */
export default class NoteController {

    public readonly plugin: DustCalendarPlugin;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
    }

    public getNoteOption(noteType: NoteType): boolean {

        if (noteType === NoteType.DAILY) {
            return this.plugin.database.setting.dailyNoteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            return this.plugin.database.setting.weeklyNoteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            return this.plugin.database.setting.monthlyNoteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            return this.plugin.database.setting.quarterlyNoteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            return this.plugin.database.setting.yearlyNoteOption;
        }

        return false;
    }

    public setNoteOption(noteType: NoteType, noteOption: boolean): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNoteOption = noteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNoteOption = noteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNoteOption = noteOption;
        }
    }

    public getNotePattern(noteType: NoteType): string {

        let noteOption: boolean = false;
        let notePattern: string = "";
        const {setting} = this.plugin.database;

        if (noteType === NoteType.DAILY) {
            noteOption = setting.dailyNoteOption;
            notePattern = setting.dailyNotePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            noteOption = setting.weeklyNoteOption;
            notePattern = setting.weeklyNotePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            noteOption = setting.monthlyNoteOption;
            notePattern = setting.monthlyNotePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            noteOption = setting.quarterlyNoteOption;
            notePattern = setting.quarterlyNotePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            noteOption = setting.yearlyNoteOption;
            notePattern = setting.yearlyNotePattern;
        }

        if (!noteOption || notePattern.length === 0) {
            return "";
        }

        return notePattern;
    }

    public setNotePattern(noteType: NoteType, notePattern: string): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNotePattern = notePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNotePattern = notePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNotePattern = notePattern;
        }
    }

    public getShouldConfirmBeforeCreatingNote(): boolean {
        return this.plugin.database.setting.shouldConfirmBeforeCreatingNote;
    }

    public setShouldConfirmBeforeCreatingNote(shouldConfirmBeforeCreatingNote: boolean): void {
        this.plugin.database.setting.shouldConfirmBeforeCreatingNote = shouldConfirmBeforeCreatingNote;
    }

    public getNotePatternPlaceHolder(noteType: NoteType): string {

        if (noteType === NoteType.DAILY) {
            return "日记/yyyy-MM-dd";
        }
        else if (noteType === NoteType.WEEKLY) {
            return "周记/yyyy-WW";
        }
        else if (noteType === NoteType.MONTHLY) {
            return "月度总结/yyyy-MM";
        }
        else if (noteType === NoteType.QUARTERLY) {
            return "季度总结/yyyy-qq";
        }
        else if (noteType === NoteType.YEARLY) {
            return "年度总结/yyyy";
        }

        return "";
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        const noteFilename = this.getNoteFilename(date, noteType);
        if (noteFilename === null) {
            return false;
        }
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(noteFilename);
        return abstractFile instanceof TFile;
    }

    public getNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern.length === 0) {
            return null;
        }
        return date.setLocale(navigator.language).toFormat(notePattern).concat(".md");
    }

    public openNoteBySelectedItem(selectedItem: SelectedItem): void {
        if (selectedItem.type === SelectedItemType.DAY_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.DAILY);
        }
        else if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.WEEKLY)
        }
        else if (selectedItem.type === SelectedItemType.MONTH_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.MONTHLY)
        }
        else if (selectedItem.type === SelectedItemType.QUARTER_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.QUARTERLY)
        }
        else if (selectedItem.type === SelectedItemType.YEAR_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.YEARLY)
        }
    }

    public openNoteByNoteType(date: DateTime, noteType: NoteType): void {
        const noteFilename = this.getNoteFilename(date, noteType);
        if (noteFilename === null) {
            return;
        }
        this.openNoteByFilename(new Path(noteFilename), noteType);
    }

    public openNoteByFilename(filename: Path, noteType: NoteType): void {
        const vault = this.plugin.app.vault;
        const file = vault.getAbstractFileByPath(filename.string);
        if (file instanceof TFile) {
            void this.openNoteTabView(file);
            return;
        }
        if (file !== null) {
            return;
        }

        if (this.plugin.database.setting.shouldConfirmBeforeCreatingNote) {
            const modal = new ConfirmCreatingNoteModal(filename, this.plugin, noteType);
            modal.open();
        }
        else {
            void this.createNote(filename, noteType);
        }
    }

    public async createNote(filename: Path, noteType: NoteType): Promise<void> {
        try {
            const abstractFile: TAbstractFile = await PathUtil.create(filename, this.plugin.app.vault);
            if (!(abstractFile instanceof TFile)) {
                return;
            }
            await this.openNoteTabView(abstractFile);
            this.plugin.templateController.insertTemplate(noteType, abstractFile);
            this.plugin.noteStatisticController.addTaskByFile(abstractFile);
        }
        catch {
            new Notice(`无法创建笔记：${filename.string}`);
        }
    }

    private async openNoteTabView(tFile: TFile): Promise<void> {
        const {workspace} = this.plugin.app;
        const openedLeaf = workspace.getLeavesOfType("markdown").find(leaf =>
            leaf.view instanceof MarkdownView && leaf.view.file?.path === tFile.path
        );
        if (openedLeaf) {
            workspace.revealLeaf(openedLeaf);
            workspace.setActiveLeaf(openedLeaf, {focus: true});
            return;
        }

        const targetLeaf = workspace.getLeaf("tab");
        try {
            await targetLeaf.openFile(tFile);
            workspace.revealLeaf(targetLeaf);
            workspace.setActiveLeaf(targetLeaf, {focus: true});
        }
        catch {
            new Notice(`无法打开笔记：${tFile.path}`);
        }
    }

}

