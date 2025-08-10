import type {Letter} from "../generated-api";

export interface CommentFormProps {
    letter: Letter,
    toggleEditDone: () => void
    setLetter: (letter: Letter) => void;
}
