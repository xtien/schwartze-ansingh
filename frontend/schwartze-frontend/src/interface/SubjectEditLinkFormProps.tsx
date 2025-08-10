import type {Subject} from "../generated-api";

export interface SubjectEditLinkFormProps {
    subject?: Subject,
    setCountPlusOne: () => void;
    setShowLinkEditForm: (showLinkEditForm: boolean) => void;
}
