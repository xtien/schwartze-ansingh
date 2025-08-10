import type {MyLocation} from "../generated-api";

export interface EditNameFormProps {
    location: MyLocation,
    setLocation: (location: MyLocation) => void;
}
