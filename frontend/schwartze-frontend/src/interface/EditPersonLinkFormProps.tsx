import type { Person} from "../generated-api";

export interface EditPersonLinkFormProps {
    person: Person,
    linkId: number,
    setPerson: (person: Person) => void;
    setLinkEditDone: () => void;
}
