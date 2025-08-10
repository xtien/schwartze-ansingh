import type {PageReferenceTypeEnum} from "../generated-api";

export interface EditPageReferenceFormProps {

    pageNumber: number
    chapterNumber: number
    key: string
    reference_description: string
    reference_type: PageReferenceTypeEnum
    setPage: (page: any) => void;
    toggleEditDone: () => void;
    toggleEditDoneParam: () => void;
}
