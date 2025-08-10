import type {Page} from "../generated-api";

export interface EditReferenceProps {
    pageNumber: number,
    chapterNumber: number,
    key: string,
    setPage: (page: Page) => void,
    toggleEditDone: () => void,
    toggleEditDoneParam: () => void,
}
