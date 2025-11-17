import { type OptionIdType } from '@typings';
import type { Page } from '@playwright/test';

import { Button, Label, Select, TextField } from './components/ui';
import type { Selector } from '@fixtures/components/ui/selector'

export * from './components/ui';

type UiComponent<T> = (
    selector: Selector
) => T;
export interface Ui {
    button: UiComponent<Button>;
    select: UiComponent<Select<OptionIdType>>;
    textField: UiComponent<TextField>;
    label: UiComponent<Label>;
    adminMenu: UiComponent<Button>;
}

export const Ui = (page: Page): Ui => ({
    button: (selector) => new Button(page, selector),
    select: (selector) => new Select(page, selector),
    textField: (selector) => new TextField(page, selector),
    label: (selector) => new Label(page, selector),
    adminMenu: (selector) => new Button(page, selector),
});
