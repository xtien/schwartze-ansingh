import type {EditPictureProps} from "../interface/EditPictureProps";
import {AdminPageApi} from "../generated-api";

const adminPageApi = new AdminPageApi();

export function EditPictureUrlForm({
                                    page,
                                    picture_url,
                                    setPictureUrl,
                                    setPictureCaption,
                                    setPage,
                                    pictureCaption,
                                    togglePictureDone
                                }: EditPictureProps) {

    function handleUrlChange(event: { target: { value: string; }; }) {
        setPictureUrl(event.target.value);
    }

    function handleCaptionChange(event: { target: { value: string; }; }) {
        setPictureCaption(event.target.value);
    }

    function handleCancel() {
        togglePictureDone()
    }

    function handleSubmit() {


        const p = page;
        p.picture_url = picture_url;
        p.picture_caption = pictureCaption;
        p.page_number = '0';
        p.chapter_number = '0';

        const postData = {
            page: p
        };

        adminPageApi.updatePage(postData)
            .then(response => {
                if (response.data.page != null) {
                    setPage(response.data.page);
                }
                togglePictureDone();
            })
            .catch((errror) => {
                console.log(errror)
            });
    }

    return (
        <div className='page_text'>
            <h4 className='mb-5'> Edit picture url</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <table width="100%" className='mt-2'>
                        <tbody>
                        <tr>
                            <td>url: <input
                                type="text"
                                className="form-control text"
                                id="picture"
                                placeholder="url"
                                value={picture_url}
                                onChange={handleUrlChange}
                            /></td>
                        </tr>
                        <tr>
                            <td>caption: <input
                                type="text"
                                className="form-control text"
                                id="picture"
                                placeholder="caption"
                                value={pictureCaption}
                                onChange={handleCaptionChange}
                            /></td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-outline-success mybutton mt-3 mr-3"
                                    value="Submit"
                                />
                                <input
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-outline-danger mybutton mt-3"
                                    value="Cancel"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </form>
        </div>
    )
}
