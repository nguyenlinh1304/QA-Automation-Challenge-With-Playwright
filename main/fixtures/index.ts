import type { Page } from '@playwright/test';

import { Button, ErrorMessage, Label, TextField } from './components/ui';
import type { Selector } from '@fixtures/components/ui/selector'

export * from './components/ui';

type UiComponent<T> = (
    selector: Selector
) => T;
export interface Ui {
    button: UiComponent<Button>;
    textField: UiComponent<TextField>;
    label: UiComponent<Label>;
    adminMenu: UiComponent<Button>;
    errorMessage: UiComponent<ErrorMessage>;
}

export const Ui = (page: Page): Ui => ({
    button: (selector) => new Button(page, selector),
    textField: (selector) => new TextField(page, selector),
    label: (selector) => new Label(page, selector),
    adminMenu: (selector) => new Button(page, selector),
    errorMessage: (selector) => new ErrorMessage(page, selector),
});
