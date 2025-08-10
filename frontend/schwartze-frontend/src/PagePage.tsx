/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useEffect, useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import arrow_right from "./images/arrow_right.png";
import three_arrow_right from "./images/three_arrow_right.png";
import three_arrow_left from "./images/three_arrow_left.png";
import arrow_left from "./images/arrow_left.png";
import {Link} from "react-router-dom";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {AdminPageApi, PageApi} from './generated-api/api.ts';
import {useLocation} from "react-router";
import type {
    Page, PageReference,
    PageReferenceRequest,
    PageReferenceTypeEnum,
    PageTextRequest
} from "./generated-api";
import {isAdmin} from "./service/AuthenticationService.tsx";
import type {EditPageReferenceFormProps} from "./interface/EditPageReferenceFormProps.tsx";
import type {EditPictureUrlEditFormProps} from "./interface/EditPictureUrlEditFormProps.tsx";
import Cookies from "universal-cookie";
import {useTranslation} from "react-i18next";

const pageApi = new PageApi(apiConfig);
const adminPageApi = new AdminPageApi(apiConfig);

function PagePage() {
    const {t} = useTranslation();
    const {i18n} = useTranslation();

    const cookies = new Cookies();
    const pNr: string = cookies.get('pageNumber');
    const cNr: string = cookies.get('chapterNumber');

    const lang = i18n.language;

    const location = useLocation()
    const params = location.pathname.split('/')
    let _chapterNumber = params[2]
    let _pageNumber = params[3]
    if (_pageNumber === '0' && _chapterNumber === '0') {
        _pageNumber = pNr
        _chapterNumber = cNr
    }

    const [text, setText] = useState('')
    const [page, setPage] = useState<Page>()
    const [chapterNumber, setChapterNumber] = useState<string>(_chapterNumber)
    const [pageNumber, setPageNumber] = useState<string>(_pageNumber)
    const [refMap] = useState({
        person: '/get_person_details/',
        location: '/get_location/',
        letter: '/get_letter_details/',
        subject: '/get_text/subject/'
    },)
    const [showPictureUrlEdit, setShowPictureUrlEdit] = useState(false)
    const [showLinkEdit, setShowLinkEdit] = useState(false)

    useEffect(() => {
        getPage(chapterNumber, pageNumber)

        const request: PageTextRequest = {
            page: pageNumber,
            chapter: chapterNumber,
            language: lang
        }
        pageApi.getPage(request).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
            }
            if (response.data.text != null) {
                setText(response.data.text)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }, [chapterNumber, pageNumber, lang]);

    function getPage(chapterNumber: string, pageNumber: string) {
        const request: PageTextRequest = {
            page: pageNumber,
            chapter: chapterNumber,
            language: lang
        }

        pageApi.getPage(request).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
                const cookies = new Cookies();
                cookies.set('pageNumber', response.data.page.page_number, {path: '/'});
                cookies.set('chapterNumber', response.data.page.chapter_number, {path: '/'});
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function delete_link(reference_id: PageReference | undefined) {

        const request: PageReferenceRequest = {
            page_number: pageNumber,
            chapter_number: chapterNumber,
            reference: reference_id
        }

        adminPageApi.removePageReference(request).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
            }
            if (response.data.text != null) {
                setText(response.data.text)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function next() {
        const request: PageTextRequest = {
            chapter: chapterNumber,
            page: pageNumber
        }
        pageApi.getNextPage(request).then(response => {
            if (response.data.page?.page_number != null) {
                setPageNumber(response.data.page.page_number)
            }
            if (response.data.page?.chapter_number != null) {
                setChapterNumber(response.data.page.chapter_number)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function previous() {
        const request: PageTextRequest = {
            chapter: chapterNumber,
            page: pageNumber
        }
        pageApi.getPreviousPage(request).then(response => {
            if (response.data.page?.page_number != null) {
                setPageNumber(response.data.page.page_number)
            }
            if (response.data.page?.chapter_number != null) {
                setChapterNumber(response.data.page.chapter_number)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function nextChapter() {
        const request: PageTextRequest = {
            chapter: chapterNumber,
            page: pageNumber
        }
        pageApi.getNextChapter(request).then(response => {
            if (response.data.page?.page_number != null) {
                setPageNumber(response.data.page.page_number)
            }
            if (response.data.page?.chapter_number != null) {
                setChapterNumber(response.data.page.chapter_number)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function previousChapter() {
        const request: PageTextRequest = {
            chapter: chapterNumber,
            page: pageNumber
        }
        pageApi.getPreviousChapter(request).then(response => {
            if (response.data.page?.page_number != null) {
                setPageNumber(response.data.page.page_number)
            }
            if (response.data.page?.chapter_number != null) {
                setChapterNumber(response.data.page.chapter_number)
            }
        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function add_reference() {
        setShowLinkEdit(true)
    }

    function toggleEditDoneParam() {
        setShowLinkEdit(false)
        getPage(chapterNumber, pageNumber)
    }

    function toggleEditDone() {
        setShowLinkEdit(false)
    }

    function togglePictureDone() {
        setShowPictureUrlEdit(false)
    }

    function edit_picture() {
        setShowPictureUrlEdit(true)
    }

    function renderReference(reference: PageReference) {

        switch (reference.type) {
            case 'PERSON':
                return (<div className='mb-2'>
                    <Link to={refMap.person + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LOCATION':
                return (<div className='mb-2'>
                    <Link to={refMap.location + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LETTER':
                return (<div className='mb-2'>
                    <Link to={refMap.letter + reference.key + '/0'}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference)
                                }}> del
                        </button> : ''}
                </div>)
            case 'SUBJECT':
                return (<div className='mb-2'>
                    <Link to={refMap.subject + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LINK':
                return (<div className='mb-2'>
                    <a href={reference.key} target="_blank" rel="noopener noreferrer">{reference.description}</a>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference)
                                }}> del
                        </button> : ''}
                </div>)
            default:
                return null
        }
    }

    let picture_url = page != null ? page!.picture_url : '';
    const picture_caption = page != null ? page!.picture_caption : '';


    if (picture_url != null && !picture_url.startsWith('https://')) {
        picture_url = "https://" + picture_url;
    }

    let references = null;
    if (page != null && page.references != null) {
        references = page.references.map(function (reference, i) {
            return (
                <div key={i}>
                    <table width="100%">
                        <tbody>
                        <tr>
                            <td>
                                {renderReference(reference)}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
        })
    }

    return (
        <div className='container-fluid'>
            <div className='d-md-none m-4'>  <Link to='/get_content/' className='linkStyle'>{t('content')}</Link></div>
            <table width='100%'>
                <tbody>
                <tr>
                    <td>
                        <button type="button"
                                className='btn btn-link'
                                onClick={previousChapter}>
                            <img src={three_arrow_left} alt="back"/>
                        </button>
                    </td>
                    <td>
                        <button type="button"
                                className='btn btn-link'
                                onClick={previous}>
                            <img src={arrow_left} alt="back"/>
                        </button>
                    </td>
                    <td>
                        <p className='page_header'>{t('chapter')} {chapterNumber} {t('page')} {pageNumber} </p>
                    </td>
                    <td>
                        <button type="button"
                                className='btn btn-link'
                                onClick={next}>
                            <img src={arrow_right} alt="back"/>
                        </button>
                    </td>
                    <td>
                        <button type="button"
                                className='btn btn-link'
                                onClick={nextChapter}>
                            <img src={three_arrow_right} alt="back"/>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="row">
                <div className="col-3 mt-5 ms-5 d-none d-lg-block">
                    <div >
                        <ul className="sidebar-nav">
                            <li className="sidebar-brand"></li>
                            <div id='linkContainer' className='ml-3'>
                                {references}
                            </div>
                            <div className='ml-3 mt-5'>
                                <Link to='/get_content/' className='linkStyle'>{t('content')}</Link>
                            </div>
                            <div className="row align-items-end mt-5">
                                <div className='sidebar-picture'>
                                    <div><img src={picture_url} width="200" alt=""/></div>
                                    <div className='picture-caption'>{picture_caption}</div>
                                </div>
                                <div>
                                    {
                                        isAdmin() === "true" ?
                                            <div>
                                                <button type="button"
                                                        className='btn btn-link mt-5'
                                                        onClick={add_reference}>
                                                    Add reference
                                                </button>
                                                <button type="button"
                                                        className='btn btn-link mt-5'
                                                        onClick={edit_picture}>
                                                    edit picture
                                                </button>
                                            </div>
                                            : null
                                    }
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="col me-5">
                    <div>
                        {showPictureUrlEdit ? (

                            <EditPictureUrlEditForm
                                page={page!}
                                setPage={setPage}
                                togglePictureDone={togglePictureDone}
                            />

                        ) : null
                        }

                        {showLinkEdit ? (
                                <EditReferenceForm
                                    pageNumber={parseInt(pageNumber)}
                                    chapterNumber={parseInt(chapterNumber)}
                                    key=''
                                    reference_description=''
                                    reference_type='LINK'
                                    setPage={setPage}
                                    toggleEditDone={toggleEditDone}
                                    toggleEditDoneParam={toggleEditDoneParam}
                                />
                            )
                            : <div>

                                <div className='chapter_title'>
                                    {page != null && pageNumber === '1' ? page!.chapter_title : null}
                                </div>


                                <div className='page_text' dangerouslySetInnerHTML={{__html: text}}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditPictureUrlEditForm({page, togglePictureDone, setPage}: EditPictureUrlEditFormProps) {

    const [picture_url, setPictureUrl] = useState<string>()
    const [picture_caption, setPictureCaption] = useState<string>()


    function handleUrlChange(event: { target: { value: string }; }) {
        setPictureUrl(event.target.value);
    }

    function handleCaptionChange(event: { target: { value: string }; }) {
        setPictureCaption(event.target.value);
    }

    function handleSubmit() {

        const p = page;
        p.picture_url = picture_url;
        p.picture_caption = picture_caption;

        let postData = {
            page: p
        };

        adminPageApi.updatePage(postData).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
                togglePictureDone()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function handleCancel() {
        togglePictureDone()
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
                                value={picture_caption}
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


function EditReferenceForm({
                               pageNumber,
                               chapterNumber,
                               key,
                               reference_description,
                               reference_type,
                               setPage,
                               toggleEditDone,
                               toggleEditDoneParam
                           }: EditPageReferenceFormProps) {


    const [description, setDescription] = useState<string>(reference_description)
    const [type, setType] = useState<PageReferenceTypeEnum>(reference_type)
    const [_setPage] = useState<Page>()
    const [_key, setKey] = useState<string>(key)
    const [cancel, setCancel] = useState<boolean>(false)
    const [editDone, setEditDone] = useState<boolean>(false)

    function handleDescriptionChange(event: { target: { value: string; }; }) {
        setDescription(event.target.value);
    }

    function handleTypeChange(event: any) {
        setType(event.target.value);
    }

    function handleKeyChange(event: { target: { value: string; }; }) {
        setKey(event.target.value);
    }

    function handleCancel() {
        setCancel(true)
    }

    function handleSubmit() {

        let request: PageReferenceRequest = {
            page_number: pageNumber.toString(),
            chapter_number: chapterNumber.toString(),
            reference: {
                key: key,
                type: type,
                description: description
            }
        };

        adminPageApi.addPageReference(request).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
                toggleEditDone()
            }
        }).catch(
            error => {
                console.log(error)
            }
        )

        adminPageApi.addPageReference(request).then(response => {
            if (response.data.page != null) {
                setPage(response.data.page)
            }
        })
    }

    if (editDone === true) {
        setEditDone(false)
        toggleEditDoneParam();
    }
    if (cancel === true) {
        setEditDone(true)
        toggleEditDone();
    }


    return (
        <div className='add_reference'>
            <h5 className='mb-5'> Add page reference</h5>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <table width="60%" className='mt-2'>
                        <tbody>
                        <tr>
                            <td width="150px"><label htmlFor="status">Description</label></td>
                            <td><input
                                type="text"
                                className="form-control "
                                id="description"
                                value={description}
                                onChange={handleDescriptionChange}
                            /></td>
                        </tr>
                        </tbody>
                    </table>

                    <table width="60%" className='mt-2'>
                        <tbody>
                        <tr>
                            <td width="150px"><label htmlFor="status">Type</label></td>
                            <td><input
                                type="text"
                                className="form-control "
                                id="description"
                                value={type}
                                onChange={handleTypeChange}
                            /></td>
                        </tr>
                        </tbody>
                    </table>

                    <table width="60%" className='mt-2'>
                        <tbody>
                        <tr>
                            <td width="150px"><label htmlFor="status">Key</label></td>
                            <td><input
                                type="text"
                                className="form-control "
                                id="description"
                                value={key}
                                onChange={handleKeyChange}
                            /></td>
                        </tr>
                        </tbody>
                    </table>

                </div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton mt-5 ml-5 mb-5"
                                value="Submit"
                            /></td>
                        <td>
                            <input
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-outline-danger mybutton mt-5 ml-5 mb-5"
                                value="Cancel"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default PagePage
