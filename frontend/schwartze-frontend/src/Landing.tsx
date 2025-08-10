/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {type ReactElement, type ReactNode, useEffect, useState,} from 'react'
import './css/bootstrap.css'
import {Link} from "react-router-dom";

import {
    AdminReferencesApi,
    HomeTextApi,
    type Page,
    PageApi,
    type PageReference,
    PageReferenceTypeEnum,
    type PageTextRequest,
    type RemoveReferenceLinkRequest
} from "./generated-api";
import type {RefMap} from "./model/refMap.tsx";
import {EditPictureUrlForm} from "./functions/EditPictureUrlForm.tsx";
import {EditReferenceForm} from "./functions/EditReferenceForm.tsx";
import type {JSX} from 'react/jsx-runtime';
import {apiConfig, isAdmin} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const homeTextApi = new HomeTextApi(apiConfig);
const pageApi = new PageApi(apiConfig);
const adminReferencesApi = new AdminReferencesApi(apiConfig);

function Landing() {

    const {t} = useTranslation();
    const {i18n} = useTranslation();

    const lang = i18n.language;

    const [pageNumber] = useState<number>(0);
    const [chapterNumber] = useState<number>(0);
    const [leftBlockPage, setLeftBlockPage] = useState<Page>();
    const [pageText, setPageText] = useState('');
    const [blogText, setBlogText] = useState('');
    const [refMap] = useState<RefMap>(
        {
            person: '/get_person_details/',
            location: '/get_location/',
            letter: '/get_letter_details/',
            subject: '/get_text/subject/'
        }
    )
    const [pictureUrl, setPictureUrl] = useState('');
    const [showLinkEdit, setShowLinkEdit] = useState(false);
    const [showPictureUrlEdit, setShowPictureUrlEdit] = useState(false);
    const [pictureCaption, setPictureCaption] = useState('');

    useEffect(() => {

        const postData = {
            type: 'text',
            text_id: 'home',
            language: lang
        };

        homeTextApi.getHomeText(postData)
            .then(response => {
                setPageText(response.data.text!);
            })
            .catch(error => {
                console.log(error.toString())
            })

        const blogData = {
            type: 'text',
            text_id: 'blog',
            language: lang
        };
        homeTextApi.getHomeText(blogData)
            .then(response => {
                setBlogText(response.data.text!);
            })
            .catch(error => {
                console.log(error.toString())
            })

        getLeftPage()

    }, [lang]);

    function getLeftPage() {
        const request: PageTextRequest = {
            page: '0',
            chapter: '0',
            language: lang
        }

        // set page object for left block
        pageApi.getPage(request).then((response) => {
            setLeftBlockPage(response.data.page);
        }).catch((error) => {
            console.log(error)
        })
    }

    function delete_link(link_id: number) {

        const request: RemoveReferenceLinkRequest = {
            type: 'link',
            link_id: link_id
        }

        adminReferencesApi.removeReferenceLink(request)
            .then((response) => {
                console.log(response)
                getLeftPage()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function setPage(page: Page) {
        setShowLinkEdit(false);
        setLeftBlockPage(page);
    }

    function add_reference() {
        setShowLinkEdit(true);
    }

    function toggleEditDoneParam() {
        setShowLinkEdit(false);
        pageApi.getPage({'pageId': pageNumber.toString(), 'chapter': chapterNumber.toString()})
            .then((response) => {
                    if (response.data.page != null) {
                        setPage(response.data.page);
                    }
                }
            ).catch();
    }

    function toggleEditDone() {
        setShowLinkEdit(false);
    }

    function togglePictureDone() {
        setShowPictureUrlEdit(false)
    }

    function edit_picture() {
        setShowPictureUrlEdit(true)
    }

    function renderReference(reference: PageReference) {
        switch (reference.type) {
            case PageReferenceTypeEnum.Person:
                return (<div className='mb-2'>
                    <Link to={refMap.person + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id!)
                                }}> del
                        </button> : ''}
                </div>)
            case PageReferenceTypeEnum.Location:
                return (<div className='mb-2'>
                    <Link to={refMap.location + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id!)
                                }}> del
                        </button> : ''}
                </div>)
            case PageReferenceTypeEnum.Letter:
                return (<div className='mb-2'>
                    <Link to={refMap.letter + reference.key + '/0'}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id!)
                                }}> del
                        </button> : ''}
                </div>)
            case PageReferenceTypeEnum.Subject:
                return (<div className='mb-2'>
                    <Link to={refMap.subject + reference.key}
                          className='linkStyle'>{reference.description}</Link>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id!)
                                }}> del
                        </button> : ''}
                </div>)
            case PageReferenceTypeEnum.Link:
                return (<div className='mb-2'>
                    <a href={reference.key} target="_blank" rel="noopener noreferrer">{reference.description}</a>
                    {isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id!)
                                }}> del
                        </button> : ''}
                </div>)
            default:
                return null
        }
    }

    const isAdm = isAdmin();
    const caption: string | undefined = leftBlockPage != null && leftBlockPage?.picture_caption != null ? leftBlockPage!.picture_caption : ''
    const picture_caption = caption != null ? caption! : '';

    let picture_url = null;
    if (leftBlockPage != null) {
        picture_url = leftBlockPage.picture_url;
    }
    if (picture_url === 'undefined') {
        picture_url = null;
    }
    if (picture_url != null && !picture_url.startsWith('https://')) {
        picture_url = "https://" + picture_url;
    }

    let references: JSX.Element[] | ReactElement | Iterable<ReactNode> | null | undefined = []

    if (leftBlockPage != null && leftBlockPage.references != null) {

        references = leftBlockPage.references.map(function (reference, i) {
            return (
                <div key={i}>
                    <table>
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

        <div className="container-fluid">
            <div className="row">
                <div className="col-sm col-lg-3 mt-3 pt-3 p-lg-3 m-lg-5 bg-light ">
                    <div>
                        <div>{isAdm === 'true' ?
                            <p className='nav-link'><Link to={'/admin/'}>Admin</Link>
                            </p>
                            : null}
                        </div>
                        <div id='linkContainer'>
                            {references}
                        </div>

                        <div className='sidebar-picture'>
                            {picture_url === null ? null :
                                <div><img src={picture_url!} width="200" alt="kinderpartij"/></div>
                            }
                            <div className='picture-caption'>{picture_caption}</div>
                        </div>
                        <div>
                            {
                                isAdmin() === "true" ?
                                    <div>
                                        <button type="button"
                                                className='btn btn-link mt-5 pl-3'
                                                onClick={add_reference}>
                                            Add reference
                                        </button>
                                        <button type="button"
                                                className='btn btn-link mt-5'
                                                onClick={edit_picture}>
                                            Edit picture
                                        </button>
                                    </div> : null
                            }
                        </div>
                        <div className='border border-dark mt-5'>
                            <div className='help'>{t('help_title')}</div>
                            <div className='help'>{t('help')}</div>
                        </div>

                    </div>
                </div>

                <div className="col mt-5 p-lg-3 m-lg-3 me-lg-5">
                    <div>
                        {showPictureUrlEdit && leftBlockPage != null ? (
                            <EditPictureUrlForm
                                page={leftBlockPage}
                                picture_url={pictureUrl}
                                pictureCaption={pictureCaption}
                                setPictureUrl={setPictureUrl}
                                setPictureCaption={setPictureCaption}
                                setPage={setPage}
                                togglePictureDone={togglePictureDone}
                            />

                        ) : null
                        }
                        {showLinkEdit ? (
                                <EditReferenceForm
                                    pageNumber={pageNumber}
                                    chapterNumber={chapterNumber}
                                    key=''
                                    setPage={setPage}
                                    toggleEditDone={toggleEditDone}
                                    toggleEditDoneParam={toggleEditDoneParam}
                                />
                            )
                            :
                            null
                        }
                    </div>

                    <div>
                        <div className='photo-center'>
                            <img className=' d-sm-none' alt="briefkaart lizzy"
                                 src="https://lizzyansingh.nl/pics/32-1.jpg"
                                 width="250px"/>
                        </div>
                        <div className='photo'>
                            <img className=' d-none d-sm-block' alt="briefkaart lizzy"
                                 src="https://lizzyansingh.nl/pics/32-1.jpg"
                                 width="500px"/></div>
                        <div className='textpage'>
                            {/* TODO: this needs to change when others than myself get access to data entry */}

                            <div dangerouslySetInnerHTML={{__html: pageText}}/>
                        </div>
                        <div className='textpage mt-5 '>
                            <div>
                                {/* TODO: this needs to change when others than myself get access to data entry */}
                                <div dangerouslySetInnerHTML={{__html: blogText}}/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Landing
