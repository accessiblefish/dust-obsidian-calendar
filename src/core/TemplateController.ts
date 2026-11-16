import {TAbstractFile, TFile} from 'obsidian';
import {NoteType, TemplatePlugin} from "../base/enum";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import DustCalendarPlugin from "../main";
import TemplateUtil from "../util/TemplateUtil";
import ObsidianTemplateUtil from "../util/ObsidianTemplateUtil";
import TemplaterUtil from "../util/TemplaterUtil";


/**
 * 封装模板操作
 */
export default class TemplateController {

    public readonly plugin: DustCalendarPlugin;
    public templateUtil: TemplateUtil;
    private acceptsNotifications: boolean;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.templateUtil = new TemplateUtil(this.plugin);
        this.acceptsNotifications = true;
        this.plugin.register(() => {
            this.acceptsNotifications = false;
        });
    }

    public getTemplatePlugin(): TemplatePlugin {
        return this.plugin.database.setting.templatePlugin;
    }

    public isTemplatePluginEnable(): boolean {
        return this.templateUtil.isEnable();
    }

    public updateTemplatePlugin(templatePlugin: TemplatePlugin): void {
        this.plugin.database.setting.templatePlugin = templatePlugin;
        if (templatePlugin === TemplatePlugin.OBSIDIAN) {
            this.templateUtil = new ObsidianTemplateUtil(this.plugin);
        }
        else if (templatePlugin === TemplatePlugin.TEMPLATER) {
            this.templateUtil = new TemplaterUtil(this.plugin);
        }
        else {
            this.templateUtil = new TemplateUtil(this.plugin);
        }
    }

    public hasTemplateFolder(): boolean {
        const folder = this.templateUtil.getTemplateFolder();
        return folder.string.length !== 0 && PathUtil.exists(folder, this.plugin.app.vault);
    }

    public getTemplateFolder(): Path {
        return this.templateUtil.getTemplateFolder();
    }

    public getTemplateFilename(noteType: NoteType): string | null {

        if (this.plugin.database.setting.templatePlugin === TemplatePlugin.NONE) {
            return null;
        }

        if (noteType === NoteType.DAILY) {
            return this.plugin.database.setting.dailyTemplateFilename;
        }
        else if (noteType === NoteType.WEEKLY) {
            return this.plugin.database.setting.weeklyTemplateFilename;
        }
        else if (noteType === NoteType.MONTHLY) {
            return this.plugin.database.setting.monthlyTemplateFilename;
        }
        else if (noteType === NoteType.QUARTERLY) {
            return this.plugin.database.setting.quarterlyTemplateFilename;
        }
        else if (noteType === NoteType.YEARLY) {
            return this.plugin.database.setting.yearlyTemplateFilename;
        }

        return null;
    }

    public setTemplateFilename(noteType: NoteType, templateFilename: string): void {
        if (this.plugin.database.setting.templatePlugin === TemplatePlugin.NONE) {
            return;
        }

        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyTemplateFilename = templateFilename;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyTemplateFilename = templateFilename;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyTemplateFilename = templateFilename;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyTemplateFilename = templateFilename;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyTemplateFilename = templateFilename;
        }
    }

    public hasTemplateFile(filename: string): boolean {
        return this.getTemplateFileByFilename(filename) !== null;
    }

    public insertTemplate(noteType: NoteType, targetFile: TFile): void {
        if (!this.acceptsNotifications || !this.templateUtil.isEnable()) {
            return;
        }

        const templateFile = this.getTemplateFileByNoteType(noteType);
        if (templateFile === null) {
            return;
        }

        this.notify(templateFile, targetFile);
    }

    private notify(templateFile: TAbstractFile, targetFile: TFile, remainingAttempts: number = 50): void {
        if (!this.acceptsNotifications) {
            return;
        }
        if (this.plugin.app.workspace.activeEditor?.file?.path === targetFile.path) {
            this.templateUtil.insertTemplateImpl(templateFile);
            return;
        }
        if (remainingAttempts === 0) {
            return;
        }
        window.setTimeout(() => this.notify(templateFile, targetFile, remainingAttempts - 1), 100);
    }

    public getTemplateFileByFilename(filename: string): TAbstractFile | null {
        const folder = this.getTemplateFolder();
        if (folder.string.length === 0 || !PathUtil.exists(folder, this.plugin.app.vault)) {
            return null;
        }

        return this.getTemplateFileImpl(folder, new Path(filename));
    }

    private getTemplateFileByNoteType(noteType: NoteType): TAbstractFile | null {
        const folder = this.getTemplateFolder();
        const filename = this.getTemplateFilename(noteType);
        if (folder.string.length === 0 || filename === null || filename.length === 0
            || !PathUtil.exists(folder, this.plugin.app.vault)) {
            return null;
        }
        return this.getTemplateFileImpl(folder, new Path(filename));
    }

    private getTemplateFileImpl(folder: Path, pureFilename: Path): TAbstractFile | null {
        let newFilenameStr = pureFilename.string;
        if (pureFilename.extension.string.length === 0) {
            newFilenameStr = newFilenameStr.concat(".md");
        }
        const fullPath = folder.append(new Path(newFilenameStr));
        return this.plugin.app.vault.getAbstractFileByPath(fullPath.string);
    }
}
