import { Button, ErrorMessage } from "@fixtures/index";
import { TextField } from "@fixtures/index";

export interface Elements {
    username: TextField;
    password: TextField;
    submit: Button;
    errorMessage: ErrorMessage;
}