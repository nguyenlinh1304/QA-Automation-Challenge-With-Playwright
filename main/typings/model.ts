export type Elements = Record<string, unknown>;

export interface InteractiveElement<E = Elements> {
    elements: E;
}
