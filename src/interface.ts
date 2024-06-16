export type Undoable<T> = {
    value: T;
    undo: () => void;
}