/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {useEffect, useState} from 'react'
import {Link, Navigate} from "react-router-dom";
import './css/bootstrap.css'
import Util from './service/Util';
import {useLocation} from "react-router";
import {
    AdminLinksApi,
    AdminLocationApi, type DeleteLocationRequest, type EditLinkRequest,
    LocationApi,
    type LocationRequest,
    type MyLocation,
} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {isAdmin} from "./service/AuthenticationService.tsx";
import type {JSX} from "react/jsx-runtime";
import type {EditLocationLinkFormProps} from "./interface/EditLocationLinkFormProps.tsx";
import type {EditNameFormProps} from "./interface/EditNameFormProps.tsx";
import {useTranslation} from "react-i18next";

const locationApi = new LocationApi(apiConfig)
const adminLocationApi = new AdminLocationApi(apiConfig)
const adminLinksApi = new AdminLinksApi(apiConfig)

function LocationPage() {
    const {t} = useTranslation();

    const _location = useLocation()
    const id = _location.pathname.split('/')[2]

    const [location, setLocation] = useState<MyLocation>()
    const [showLinkEdit, setShowLinkEdit] = useState<boolean>(false)
    const [showNameEdit, setShowNameEdit] = useState<boolean>(false)
    const [combine, setCombine] = useState<boolean>(false)
    const [link_id] = useState('')
   const [deleted, setDeleted] = useState<boolean>(false)


    useEffect(() => {
        let request: LocationRequest = {
            id: parseInt(id)
        };
        locationApi.getLocation(request).then((response) => {
            if (response.data.location != null) {
                setLocation(response.data.location)
            }
        }).catch((error) => {
                console.log(error)
            }
        )
    })

    function deleteLocation() {
        if (location == null) {
            return
        }

        let request: DeleteLocationRequest = {
            id: location.id
        };

        adminLocationApi.deleteLocation(request).then(() => {
            setDeleted(true)
        }).catch(error => {
            console.log(error)
        })
    }

    function delete_link(id: number) {
        if (location == null) {
            return
        }

        let postData = {
            link_id: id,
            location_id: location.id
        };

        adminLinksApi.deleteLink(postData)
            .then(() => {
            })
            .catch(error => {
                console.log(error)
            })
    }

    function add_link() {
        setShowLinkEdit(true)
    }

    function edit_link(id: number | undefined) {
        if (location == null || location.links == null || location.links.length === 0 ) {
            return
        }
        location.links.find(link => {
            return link.id === id
        });
        setShowLinkEdit(true)
    }

    function edit_name() {
        setShowNameEdit(true)
    }

    function combinePerson() {
        setCombine(true)
    }


    let linkTo = '';
    if (location != null) {
        linkTo = '/get_text/location/' + location.id;
    }

    if (combine === true) {
        if (location == null) {
            return null
        }

        return <Navigate to={'/combine_location/' + location.id}/>
    }

    if (deleted === true) {
        return <Navigate to={'/get_locations/'}/>
    }

    let links: JSX.Element[] = [];
    if (location != null && location.links != null) {
        links = location.links.map(function (link, i) {
            return (
                <div key={i}>
                    <table width="100%">
                        <tr>
                            <td>
                                <a href={link.link_url} target="_blank"
                                   rel="noopener noreferrer">{link.link_name}</a>
                            </td>
                            <td width="20%">
                                {isAdmin() === "true" ?
                                    <div>
                                        <button
                                            className="btn btn-outline-success mybutton ml-2 mt-2"
                                            onClick={() => edit_link(link.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger mybutton ml-2 mt-2"
                                            onClick={() => delete_link(link.id!)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    : null}
                            </td>
                        </tr>
                    </table>
                </div>
            );
        });
    }

    return (
        <>
            <div>
                {location == null ? <div>Loading...</div> :
                    <div>
                        <div className='container letter'>
                            <h3>{location.id} {location.location_name}</h3>
                            <p className='mt-5'><Link
                                to={`/get_letters_for_location/${location.id}`}>{t('letters')} {t('uit')} {location.location_name}</Link>
                            </p>
                            <p className='mt-5'>{location.comment}</p>

                            <div className='textpage mt-5 ml-5'>
                                {location.text != null&& location.text.text_string !=undefined && Util.isNotEmpty(location.text.text_string) ?
                                    <div>
                                        {/* TODO: this needs to change when others than myself get access to data entry */}
                                        {location.text.text_string != null && location.text.text_string.length > 300
                                            ?
                                            <div
                                                dangerouslySetInnerHTML={{__html: location.text.text_string.substring(0, 300)}}/>
                                            :
                                            null}

                                        {location.text.text_string != null && location.text.text_string.length > 300 ?
                                            <p>
                                                <Link to={linkTo} className='mt-5 mb-5'> {t('meer')} </Link>
                                            </p>
                                            : null}
                                    </div> : null}
                            </div>
                        </div>
                        <div>
                            <div id='linkContainer'>
                                {links}
                            </div>

                            {isAdmin() === "true" ?

                                <div className="mt-5">

                                    {showNameEdit && location != null ? (
                                        <EditNameForm
                                            location={location}
                                            setLocation={setLocation}
                                        />
                                    ) : null}

                                    {showLinkEdit ? (
                                            <EditLocationLinkForm
                                                location={location}
                                                linkId={link_id}
                                                setLocation={setLocation}
                                            />
                                        )
                                        :

                                        <div>
                                            <div className='mb-5 mt-5 ml-5'>
                                                <Link to={"/edit_text/location/" + location.id}>
                                                    Edit tekst
                                                </Link>
                                            </div>

                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <form onSubmit={edit_name} className='mt-5 ml-5 mb-5'>
                                                            <input
                                                                type="submit"
                                                                className="btn btn-outline-success mybutton"
                                                                value="Edit"
                                                            />

                                                        </form>
                                                    </td>
                                                    <td>
                                                        <form onSubmit={add_link} className='mt-5 ml-5 mb-5'>
                                                            <input
                                                                type="submit"
                                                                className="btn btn-outline-success mybutton"
                                                                value="Link toevoegen"
                                                            />

                                                        </form>
                                                    </td>
                                                    <td>
                                                        <form onSubmit={() => combinePerson()}
                                                              className="mt-5 ml-5 mb-5">
                                                            <input
                                                                type="submit"
                                                                className="btn btn-outline-success mybutton"
                                                                value="Combineren"
                                                            />
                                                        </form>
                                                    </td>
                                                    <td>
                                                        <form onSubmit={() => deleteLocation()}
                                                              className="mt-5 ml-5 mb-5">
                                                            <input
                                                                type="submit"
                                                                className="btn btn-outline-danger mybutton"
                                                                value="Verwijderen"
                                                            />
                                                        </form>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>
                                : null}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

function EditNameForm({location}: EditNameFormProps) {
    const {t} = useTranslation();

    const [_location, _setLocation] = useState<MyLocation>(location)
    const [locationName, setLocationName] = useState<string | undefined>(location.name)
    const [locationComment, setLocationComment] = useState<string | undefined>(location.comment)

    function handleNameChange(event: { target: { value: string}; }) {
        setLocationName(event.target.value);
    }

    function handleCommentChange(event: { target: { value: string}; }) {
        setLocationComment(event.target.value);
    }

    function handleSubmit() {

        let postData = {
            id: location.id,
            name: location.name,
            comment: location.comment
        };

        adminLocationApi.updateLocation(postData).then(response => {
            if (response.data.location != null) {
                _setLocation(response.data.location)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="status">{t('location_name')}</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    id="location_name"
                    value={locationName}
                    onChange={handleNameChange}
                />
                <label htmlFor="status">Comment</label>
                <input
                    type="text"
                    className="form-control extratextarea"
                    id="location_description"
                    value={locationComment}
                    onChange={handleCommentChange}
                />
            </div>
            <input
                type="submit"
                className="btn btn-outline-success mybutton mt-3"
                value="Submit"
            />
        </form>
    );
}


function EditLocationLinkForm({location, linkId}: EditLocationLinkFormProps) {

    const [linkName, setLinkName] = useState<string>('')
    const [linkUrl, setLinkUrl] = useState<string>('')
    const [_location, _setLocation] = useState<MyLocation>(location)

    function handleLinkSubmit() {

        let request: EditLinkRequest = {
            location_id: location.id,
            link_id: parseInt(linkId),
            link_name: linkName,
            link_url: linkUrl,
        };

        adminLinksApi.editLink(request).then(response => {
            if (response.data.location != null) {
                _setLocation(response.data.location)
            }
        })

    }

    function handleNameChange(event: { target: { value: string }; }) {
        setLinkName(event.target.value);
    }

    function handleUrlChange(event: { target: { value: string }; }) {
        setLinkUrl(event.target.value);
    }

    return (
        <form onSubmit={handleLinkSubmit}>
            <div className="form-group">
                <label htmlFor="status">Link naam</label>
                <input
                    type="text"
                    className="form-control "
                    id="link_name"
                    value={linkName}
                    onChange={handleNameChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="status">Link url</label>
                <input
                    type="text"
                    className="form-control "
                    id="link_url"
                    value={linkUrl}
                    onChange={handleUrlChange}
                />
            </div>
            <input
                type="submit"
                className="btn btn-outline-success mybutton"
                value="Submit"
            />
        </form>
    );
}

export default LocationPage
