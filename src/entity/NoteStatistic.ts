export default class NoteStatistic {
    public totalWords: number | null;
    public totalDots: number | null;
    public hasUnfinishedTasks: boolean | null;

    constructor() {
        this.totalWords = null;
        this.totalDots = null;
        this.hasUnfinishedTasks = null;
    }

    public equals(another: NoteStatistic): boolean {
        return this.totalWords === another.totalWords
            && this.totalDots === another.totalDots
            && this.hasUnfinishedTasks === another.hasUnfinishedTasks;
    }
}