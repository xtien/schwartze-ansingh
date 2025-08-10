import type {Page} from "../generated-api";

export interface EditPictureProps {
    picture_url: string;
    setPictureUrl: (url: string) => void;
    setPictureCaption: (caption: string) => void;
    page: Page;
    setPage: (page: Page) => void;
    pictureCaption: string;
    togglePictureDone: () => void;
}
