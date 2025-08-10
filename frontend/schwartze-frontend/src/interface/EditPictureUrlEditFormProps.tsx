import type {Page} from "../generated-api";

export interface EditPictureUrlEditFormProps {
    page: Page,
    setPage: (page: Page) => void;
    togglePictureDone: () => void;
}
