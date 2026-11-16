import Path from "./Path";
import {TAbstractFile, Vault} from "obsidian"

export default class PathUtil {

    public static exists(path: Path, vault: Vault): boolean {
        return vault.getAbstractFileByPath(path.string) !== null;
    }

    public static async create(path: Path, vault: Vault): Promise<TAbstractFile> {
        return PathUtil.createImpl(path, vault, path.isFolder);
    }

    private static async createImpl(path: Path, vault: Vault, isFolder: boolean): Promise<TAbstractFile> {
        if (path.string.length === 0) {
            return vault.getRoot();
        }

        const abstractFile = vault.getAbstractFileByPath(path.string);
        if (abstractFile !== null) {
            return abstractFile;
        }

        await PathUtil.createImpl(path.parent, vault, true);

        if (isFolder) {
            return vault.createFolder(path.string);
        }
        return vault.create(path.string, "");
    }
}
