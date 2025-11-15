import type { Page } from '@playwright/test';

import { Ui } from '@fixtures/components';
import type { Elements, InteractiveElement } from '@typings';

export class BaseModel<E = Elements> implements InteractiveElement<E> {
    private _elements: E;
    protected readonly ui: Ui;

    constructor(protected readonly page: Page) {
        this.ui = Ui(page);
        this._elements = {} as E;
    }

    get elements(): E {
        return this._elements;
    }

    set elements(value: E) {
        this._elements = value;
    }
}
