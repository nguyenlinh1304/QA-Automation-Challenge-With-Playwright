import { TextField, Button } from "@fixtures/components/ui";
import { Locator } from "@playwright/test";

export interface Elements {
    usernameSearchField: TextField;
    searchButton: Button;
    tableRows: Locator,
    usernameCells: Locator,
}