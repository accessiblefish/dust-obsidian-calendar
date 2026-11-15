import {TAbstractFile} from 'obsidian';
import TemplateUtil from "./TemplateUtil";
import Path from "./Path";

interface TemplaterPlugin {
    settings: {
        templates_folder: string;
    };
    templater: {
        append_template_to_active_file(templateFile: TAbstractFile): void;
    };
}

interface AppWithCommunityPlugins {
    plugins: {
        plugins: Record<string, TemplaterPlugin | undefined>;
    };
}

export default class TemplaterUtil extends TemplateUtil {

    private get templaterPlugin(): TemplaterPlugin | undefined {
        const app = this.plugin.app as unknown as AppWithCommunityPlugins;
        return app.plugins.plugins["templater-obsidian"];
    }

    public isEnable(): boolean {
        return this.templaterPlugin !== undefined;
    }

    public getTemplateFolder(): Path {
        return new Path(this.templaterPlugin?.settings.templates_folder ?? "");
    }

    public insertTemplateImpl(templateFile: TAbstractFile): void {
        this.templaterPlugin?.templater.append_template_to_active_file(templateFile);
    }
}
