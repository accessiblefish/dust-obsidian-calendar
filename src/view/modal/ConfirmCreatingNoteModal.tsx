import {Modal, Setting} from "obsidian";
import React, {ChangeEvent} from "react";
import {createRoot, Root} from "react-dom/client";
import Path from "../../util/Path";
import DustCalendarPlugin from "../../main";
import {NoteType} from "../../base/enum";

function ControlElement({modal}: { modal: ConfirmCreatingNoteModal }) {

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        modal.plugin.noteController.setShouldConfirmBeforeCreatingNote(!e.target.checked);
    };

    return <>
        <div className="setting-item-info">
            <div className="setting-item-description">
                <input type="checkbox" style={{verticalAlign: "text-bottom"}} onChange={onInputChange}/>
                下次不再提示
            </div>
        </div>
        <div className="setting-item-control">
            <button onClick={() => modal.close()}>取消</button>
            <button className="mod-cta" onClick={() => modal.closeAndCreate()}>确定</button>
        </div>
    </>
}

export default class ConfirmCreatingNoteModal extends Modal {

    public plugin: DustCalendarPlugin;
    private readonly filename: Path;
    private readonly noteType: NoteType;
    private shouldCreateNote: boolean;
    private controlElementRoot: Root | null;

    constructor(filename: Path, plugin: DustCalendarPlugin, noteType: NoteType) {
        super(plugin.app);
        this.plugin = plugin;
        this.filename = filename;
        this.noteType = noteType;
        this.shouldCreateNote = false;
        this.controlElementRoot = null;
    }

    onOpen(): void {
        this.titleEl.createEl("h1", {text: "创建新笔记"});
        this.contentEl.createEl("p", {text: `是否要创建一个路径为 ${this.filename.string} 的笔记`});

        const element = new Setting(this.contentEl);
        this.controlElementRoot = createRoot(element.settingEl);
        this.controlElementRoot.render(<ControlElement modal={this}/>);
    }

    onClose(): void {
        this.controlElementRoot?.unmount();
        this.controlElementRoot = null;
        if (this.shouldCreateNote) {
            void this.plugin.noteController.createNote(this.filename, this.noteType);
        }
    }

    public closeAndCreate(): void {
        this.shouldCreateNote = true;
        this.close();
    }
}
