export default class Path {

    private _path: string;
    private _parent: string | null;
    private _extension: string | null;

    constructor(path: string) {
        this._path = path;
        this._parent = null;
        this._extension = null;
        this.normalize();
    }

    get string(): string {
        return this._path;
    }

    get parent(): Path {
        this.parseParent();
        return new Path(this._parent!);
    }

    get extension(): Path {
        this.parseExtension();
        return new Path(this._extension!);
    }

    get isFolder(): boolean {
        this.parseExtension();
        return this._extension!.length === 0;
    }

    public append(path: Path): Path {
        if (path.string.startsWith("/")) {
            return new Path(this.string.concat(path.string));
        }
        return new Path(this.string.concat("/", path.string));
    }

    private normalize(): void {
        this._path = this._path.replace(/^\.\//, "");
        this._path = this._path.replace(/\/$/, "");
        this._path = this._path.replace(/\/\.\//, "/");
        this._path = this._path.replace(/\/.*\/\.\.\//, "/");
        this._path = this._path.replace(/^.*\/\.\.\//, "/");
    }

    private parseParent(): void {
        if (this._parent !== null) {
            return;
        }
        const index = this._path.lastIndexOf("/");
        this._parent = this._path.substring(0, index);
    }

    private parseExtension(): void {
        if (this._extension !== null) {
            return;
        }
        const filenameStart = this._path.lastIndexOf("/") + 1;
        const index = this._path.lastIndexOf(".");
        this._extension = index < filenameStart ? "" : this._path.substring(index);
    }
}
