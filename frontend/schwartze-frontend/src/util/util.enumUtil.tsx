import {PageReferenceTypeEnum} from "../generated-api";

export function toPageReferenceEnum(value:string){
    switch (value) {
        case 'LetterPage': return PageReferenceTypeEnum.Letter
        case 'Link': return PageReferenceTypeEnum.Link
        case 'Location': return PageReferenceTypeEnum.Location
        case 'Person': return PageReferenceTypeEnum.Person
        case 'Subject': return PageReferenceTypeEnum.Subject
    }
}
