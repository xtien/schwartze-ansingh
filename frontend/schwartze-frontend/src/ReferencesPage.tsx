/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useEffect, useState} from 'react'
import {AdminReferencesApi, type EditReferenceLinkRequest, type References, ReferencesApi} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {isAdmin} from "./service/AuthenticationService.tsx";
import type {EditReferenceLinkFormProps} from "./interface/EditReferenceLinkFormProps.tsx";
import {useTranslation} from "react-i18next";

const referenceApi = new ReferencesApi(apiConfig)
const adminReferenceApi = new AdminReferencesApi(apiConfig)

function ReferencesPage() {
    const { t } = useTranslation();

    const [references, setReferences] = useState<References>();
    const [showLinkEdit, setShowLinkEdit] = useState(false);
    const [link_id, setLinkId] = useState<string>('');
    const [link_url, setLinkUrl] = useState<string | undefined>('');
    const [link_name, setLinkName] = useState<string | undefined>('');


    useEffect(() => {
        const request = {
            type: 'site'
        }

        referenceApi.getReferences(request)
            .then((response) => {
                if (response.data.references != null) {
                    setReferences(response.data.references)
                }
            })
            .catch(
                error => {
                    console.log(error)
                }
            )
    }, [])

    function add_link() {

        setShowLinkEdit(true)
        setLinkName('')
        setLinkUrl('')
        setLinkId('')
    }

    function delete_link(id: number) {

        let request: EditReferenceLinkRequest = {
            link_id: id,
            type: references!.type
        };

        adminReferenceApi.removeReferenceLink(request).then(() => {

        }).catch(
            error => {
                console.log(error)
            }
        )
    }

    function edit_link(id: number) {

        if (references == null || references.links == null) {
            return
        }

        const link = references.links.find(link => {
            return link.id === id
        });

        if (link != null && link.id != null) {
            setShowLinkEdit(true)
            setLinkName(link.link_name)
            setLinkUrl(link.link_url)
            setLinkId(link.id.toString())
        }
    }

    let links;
    if (references != null && references.links != null) {
        links = references.links.map(function (link, i) {
            return (
                <div key={i}>
                    <table width="100%">
                        <tbody>
                        <tr>
                            <td>
                                <div className='mt-3'>
                                    <a href={link.link_url} target="blank"
                                       className='linkStyle'>{link.link_name}</a>
                                </div>
                            </td>
                            <td width="20%">
                                {isAdmin() === "true" ?
                                    <div>
                                        <button
                                            className="btn btn-outline-success mybutton ml-2 mt-2"
                                            onClick={() => edit_link(link.id!)}
                                        >
                                            Edit
                                        </button>
                                        &nbsp;&nbsp;
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
                        </tbody>
                    </table>
                </div>
            );
        });
    }

    return (

        <div className='container-fluid mt-5 me-sm-5 ms-sm-5'>

        <div className='mt-5 topics'>
                <h3>{t('references')}</h3>
                {showLinkEdit ? null :
                    <div id='linkContainer'>
                        {links}
                    </div>
                }
                {showLinkEdit && references != null ? (
                        <EditLinkForm
                            type={references.type!}
                            link_id={link_id}
                            link_name={link_name!}
                            link_url={link_url!}
                            setReferences={setReferences}
                        />
                    )
                    :
                    <div>
                        {
                            isAdmin() === "true" ?

                                <div>

                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <form onSubmit={add_link} className='mt-5 ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Link toevoegen"
                                                    />

                                                </form>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                : null}
                    </div>
                }
            </div>
        </div>
    )
}

function EditLinkForm({type, link_id, link_name, link_url}: EditReferenceLinkFormProps) {
    const [_link_name, setLinkName] = useState(link_name);
    const [_link_url, setLinkUrl] = useState(link_url);
    const [_link_id] = useState(link_id);
    const [_type] = useState(type);

    function handleLinkSubmit() {

        let postData: EditReferenceLinkRequest = {
            link_id: parseInt(link_id),
            link_name: link_name,
            link_url: link_url,
            type: type
        };

        adminReferenceApi.editReferenceLink(postData).then(() => {
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }


    function handleNameChange(event: { target: { value: string } }) {
        setLinkName(event.target.value);
    }

    function handleUrlChange(event: { target: { value: string } }) {
        setLinkUrl(event.target.value);
    }

    return (
        <form onSubmit={handleLinkSubmit}>
            <div className="form-group mt-3">
                <label htmlFor="status">Link naam</label>
                <input
                    type="text"
                    className="form-control "
                    id="link_name"
                    value={link_name}
                    onChange={handleNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Link url</label>
                <input
                    type="text"
                    className="form-control"
                    id="link_url"
                    value={link_url}
                    onChange={handleUrlChange}
                />
            </div>
            <input
                type="submit"
                className="btn btn-outline-success mybutton mt-5"
                value="Submit"
            />
        </form>
    );
}

export default ReferencesPage
