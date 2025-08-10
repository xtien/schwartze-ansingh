import type {Person} from "../generated-api";

export interface EditPersonFormProps {
    person: Person,
    setEditDone: () => void,
    setPerson: (person: Person) => void;
    setCancel: () => void;
}
