import type {MyLocation} from "../generated-api";

export interface EditLocationLinkFormProps {
    location: MyLocation,
    linkId: string,
    setLocation: (location: MyLocation) => void;
}
