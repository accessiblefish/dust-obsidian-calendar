import {TAbstractFile} from 'obsidian';
import Path from "./Path";
import TemplateUtil from "./TemplateUtil";

interface ObsidianTemplatesPlugin {
    instance: {
        options: {
            folder: string;
        };
        insertTemplate(templateFile: TAbstractFile): void;
    };
}

interface AppWithInternalPlugins {
    internalPlugins: {
        plugins: Record<string, ObsidianTemplatesPlugin | undefined>;
    };
}

export default class ObsidianTemplateUtil extends TemplateUtil {

    private get templatesPlugin(): ObsidianTemplatesPlugin | undefined {
        const app = this.plugin.app as unknown as AppWithInternalPlugins;
        return app.internalPlugins.plugins.templates;
    }

    public isEnable(): boolean {
        return this.templatesPlugin !== undefined;
    }

    public getTemplateFolder(): Path {
        return new Path(this.templatesPlugin?.instance.options.folder ?? "");
    }

    public insertTemplateImpl(templateFile: TAbstractFile): void {
        this.templatesPlugin?.instance.insertTemplate(templateFile);
    }
}
