/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useEffect, useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Link} from "react-router-dom";
import Util from './service/Util';
import {useLocation, useNavigate} from "react-router";
import {
    type AddPersonRequest,
    AdminLinksApi,
    AdminPersonApi,
    type DeletePersonRequest,
    type GetPersonRequest,
    type Person,
    PersonApi
} from "./generated-api";
import {apiConfig, isAdmin} from "./service/AuthenticationService.tsx";
import type {EditPersonFormProps} from "./interface/EditPersonFormProps.tsx";
import type {EditPersonLinkFormProps} from "./interface/EditPersonLinkFormProps.tsx";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";

const personApi = new PersonApi(apiConfig)
const adminLinksApi = new AdminLinksApi(apiConfig)
const adminPersonApi = new AdminPersonApi(apiConfig)

function PersonPage() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const location = useLocation()
    const params = location.pathname.split('/')
    const id: string = params[2]

    const [showEdit, setShowEdit] = useState(false)
    const [showLinkEdit, setShowLinkEdit] = useState(false)
    const [person, setPerson] = useState<Person>({})
    const [link_id] = useState<number>(0)
    const [showDialog, setShowDialog] = useState<boolean>(false)


    useEffect(() => {
        getPerson(id)
    }, [])

    function getPerson(id: string) {
        const request: GetPersonRequest = {
            id: parseInt(id)
        }
        personApi.getPerson(request).then(response => {
            if (response.data.person != null) {
                setPerson(response.data.person)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    function setEditDone() {
        setShowEdit(false)
    }

    function edit() {
        setShowEdit(true)
    }

    function setCancel() {
        setShowEdit(false)
    }

    function deletePerson() {
        const request: DeletePersonRequest = {
            id: person!.id
        };
        adminPersonApi.deletePerson(request).then(() => {
            setShowDialog(true)
        }).catch(error => {
            console.log(error)
        })
    }


    function delete_link(id: number) {

        let postData = {
            link_id: id,
            person_id: person!.id
        };

        adminLinksApi.deleteLink(postData).then(response => {
            if (response.data.person != null) {
                setPerson(response.data.person)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    function edit_link(id: number) {

        if (person != null && person.links != null) {
            const link = person.links.find(link => {
                return link.id === id
            });
            if (link != null && link.id != null) {
                setShowLinkEdit(true)
            }
        }
    }

    function add_link() {
        setShowLinkEdit(true)
    }

    let linkTo = '';
    let linkToEditTextPerson = '';
    if (person != null) {
        linkTo = '/get_text/person/' + person.id;
        linkToEditTextPerson = '/edit_text/person/' + person.id;
    }

    let brievenVoor = <Link
        to={`/get_letters_for_person/${person.id}/`}
        className='linkStyle'> {t('brieven_van')} {person.nick_name} </Link>

    let links;
    if (person != null && person.links != null) {
        links = person.links.map(function (link, i) {
            return (
                <div key={i}>
                     <table width="100%">
                        <tbody>
                        <tr>
                            <td>
                                <a href={link.link_url} target="_blank"
                                   rel="noopener noreferrer" className='linkStyle'>{link.link_name}</a>
                            </td>
                            <td width="20%">
                                {
                                    isAdmin() === "true" ?
                                        <div>
                                            <button
                                                className="btn btn-outline-success mybutton ml-2 mt-2"
                                                onClick={() => edit_link(link.id!)}
                                            >
                                                {t('edit')}
                                            </button>
                                            &nbsp;&nbsp;
                                            <button
                                                className="btn btn-outline-danger mybutton ml-2 mt-2"
                                                onClick={() => delete_link(link.id!)}
                                            >
                                                {t('delete')}
                                            </button>
                                        </div>
                                        : null
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            );
        });
    }

    let fullname = '';
    if (person.full_name != null && person.full_name.length > 0) {
        fullname = '(' + person.full_name + ')'
    }

    function combine(event: { preventDefault: () => void; }) {
        event.preventDefault();
        navigate('/combine_person/' + person.id)
    }

    function setLinkEditDone() {
        setShowLinkEdit(false)
    }

    const handleClose = () => {
        setShowDialog(false);
  //      navigate('/getPeople/0')
    }

    return (
        <div className='container-fluid me-sm-5 ms-sm-5'>
        <Modal show={showDialog} onHide={handleClose}>
                <Modal.Body>{t('letterRemoved')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('close')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {person == null ?
                <div className='content-container letter mt-5'>
                    No person found with id {id}
                </div>
                :
                <div className='content-container letter mt-5'>
                    {showEdit ? null : (
                        <div>
                            <div>
                                <div className="person_image">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <img className="person_image" alt="" src={person.image_url}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><p className="person_caption">{person.image_caption}</p>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p>
                                    {person.id} {person.nick_name} {fullname} {person.tussenvoegsel} {person.last_name}
                                </p>
                                <p>{t('geboren')}: {person.date_of_birth} {person.place_of_birth === null ? null : ' te'} {person.place_of_birth} </p>
                                <p>{t('overleden')}: {person.date_of_death} {person.place_of_death === null ? null : 'te'} {person.place_of_death}</p>
                                <p>{person.comment}</p>
                                <p className='mt-5'>
                                    {brievenVoor}
                                </p>
                                {
                                    isAdmin() === "true" ?
                                        <div>
                                            {showEdit ? null : (
                                                <div>
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-success mybutton"
                                                            onClick={edit}
                                                            value={id}
                                                        >
                                                            edit
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </div> : null
                                }

                                <div className='textpage mt-5 ml-5'>
                                    {person.text != null && person.text.text_string != undefined && Util.isNotEmpty(person.text.text_string) ?
                                        <div>
                                            {/* TODO: this needs to change when others than myself get access to data entry */}

                                            <div
                                                dangerouslySetInnerHTML={{__html: person.text.text_string!.substring(0, 300)}}/>

                                            {person.text.text_string!.length > 300 ?
                                                <p>
                                                    <Link to={linkTo} className='mt-5 mb-5'> {t('meer')} </Link>
                                                </p>
                                                : null}
                                        </div> : null}
                                </div>

                            </div>

                            <div id='linkContainer'>
                                <h3 className='mt-5'>Links</h3>
                                {links}
                            </div>


                        </div>
                    )}
                    {showEdit ? (
                        <EditPersonForm
                            person={person}
                            setPerson={setPerson}
                            setEditDone={setEditDone}
                            setCancel={setCancel}
                        />
                    ) : null
                    }

                    {isAdmin() === "true" ?

                        <div className="mt-5">
                            {showLinkEdit ? (
                                    <EditPersonLinkForm
                                        person={person}
                                        linkId={link_id}
                                        setPerson={setPerson}
                                        setLinkEditDone={setLinkEditDone}
                                    />
                                )
                                :
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <form onSubmit={add_link} className='ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Link toevoegen"
                                                    />
                                                </form>

                                            </div>
                                        </td>
                                        <td>
                                            <form onSubmit={combine} className="ml-5 mb-5">
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-success mybutton ml-5"
                                                    value="Combineren"
                                                />
                                            </form>
                                        </td>
                                        <td>
                                            <form onSubmit={deletePerson} className="ml-5 mb-5">
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-danger mybutton"
                                                    value="Verwijderen"
                                                />

                                            </form>
                                        </td>
                                        <td>
                                            <div className="ml-5 mb-5">
                                                <Link to={linkToEditTextPerson}>
                                                    Edit text
                                                </Link>
                                            </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            }
                        </div>
                        : null
                    }

                </div>
            }
        </div>
    )
}


function EditPersonForm({person, setEditDone, setPerson, setCancel}: EditPersonFormProps) {
    const { t } = useTranslation();

    const [nick_name, setNickName] = useState<string>(person.nick_name ?? '')
    const [full_name, setFullName] = useState<string>(person.full_name ?? '')
    const [tussenvoegsel, setTussenVoegsel] = useState<string>(person.tussenvoegsel ?? '')
    const [last_name, setLastName] = useState<string>(person.last_name ?? '')
    const [date_of_birth, setDoB] = useState<string>(person.date_of_birth ?? '')
    const [date_of_death, setDoD] = useState<string>(person.date_of_death ?? '')
    const [place_of_birth, setPoB] = useState<string>(person.place_of_birth ?? '')
    const [place_of_death, setPoD] = useState<string>(person.place_of_death ?? '')
    const [comment, setComment] = useState<string>(person.comment ?? '')
    const [image_url, setImageUrl] = useState<string>(person.image_url ?? '')
    const [image_caption, setImageCaption] = useState<string>(person.image_caption ?? '')


    function handlecommentChange(event: { target: { value: string; }; }) {
       setComment(event.target.value);
    }

    function handleImageUrlChange(event: { target: { value: string; }; }) {
        setImageUrl( event.target.value);
    }

    function handleImageCaptionChange(event: { target: { value: string; }; }) {
       setImageCaption(event.target.value);
    }

    function handleNickNameChange(event: { target: { value: string; }; }) {
        setNickName( event.target.value);
    }

    function handleFullNameChange(event: { target: { value: string; }; }) {
       setFullName( event.target.value);
    }

    function handleTussenvoegselChange(event: { target: { value: string; }; }) {
       setTussenVoegsel ( event.target.value);
    }

    function handleLastNameChange(event: { target: { value: string; }; }) {
        setLastName( event.target.value);
    }

    function handleDoBChange(event: { target: { value: string; }; }) {
        setDoB (event.target.value);
    }

    function handleDoDChange(event: { target: { value: string; }; }) {
       setDoD(event.target.value);
    }

    function handlePoBChange(event: { target: { value: string; }; }) {
        setPoB(event.target.value);
    }

    function handlePoDChange(event: { target: { value: string; }; }) {
        setPoD(event.target.value);
    }

    function handleCancel() {
        setCancel();
    }

    function handleSubmit() {
        let request: AddPersonRequest = {
            person:   {
                ...person,
                nick_name: nick_name,
                full_name: full_name,
                tussenvoegsel: tussenvoegsel,
                last_name: last_name,
                date_of_birth: date_of_birth,
                date_of_death: date_of_death,
                place_of_birth: place_of_birth,
                place_of_death: place_of_death,
                comment: comment,
                image_url: image_url,
                image_caption: image_caption,
            }
        };

        adminPersonApi.updatePersonDetails(request).then(response => {
            if (response.data.person != null) {
                setPerson(response.data.person)
                setEditDone()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>{nick_name ?? ''} {tussenvoegsel ?? ''} {last_name ?? ''}</p>
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('nickname')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="nick_name"
                        value={nick_name ?? ''}
                        onChange={handleNickNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('fullname')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="full_name"
                        value={full_name ?? ''}
                        onChange={handleFullNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('tussenvoegsel')}[</label>
                    <input
                        type="text"
                        className="form-control "
                        id="tussenvoegsel"
                        value={tussenvoegsel ?? ''}
                        onChange={handleTussenvoegselChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('lastname')}e</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={last_name}
                        onChange={handleLastNameChange ?? ''}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('geboren')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={date_of_birth ?? ''}
                        onChange={handleDoBChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('plaats')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={place_of_birth ?? ''}
                        onChange={handlePoBChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('overleden')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={date_of_death ?? ''}
                        onChange={handleDoDChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('plaats')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={place_of_death ?? ''}
                        onChange={handlePoDChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('opmerkingen')}</label>
                    <textarea
                        className="form-control textarea200"
                        id="comments"
                        value={comment ?? ''}
                        onChange={handlecommentChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('image_url')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="image_url"
                        value={image_url ?? ''}
                        onChange={handleImageUrlChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">{t('image_caption')}</label>
                    <input
                        type="text"
                        className="form-control "
                        id="image_caption"
                        value={image_caption ?? ''}
                        onChange={handleImageCaptionChange}
                    />
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton mt-3"
                                value="Submit"
                            />
                        </td>
                        <td>
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
            </form>
        </div>
    )
        ;
}


function EditPersonLinkForm({
                                person, linkId, setPerson, setLinkEditDone
                            }: EditPersonLinkFormProps) {

    const { t } = useTranslation();


    const [link_name, setLinkName] = useState<string>();
    const [link_url, setLinkUrl] = useState<string>();


    function handleLinkSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        let request = {
            person_id: person!.id,
            link_id: linkId,
        };

        adminLinksApi.editLink(request).then(response => {
            if (response.data.person != null) {
                setPerson(response.data.person)
            }
            setLinkEditDone()

        }).catch(error => {
            console.log(error)
        })
    }

    function handleNameChange(event: { target: { value: string } }) {
        setLinkName(event.target.value);
    }

    function handleUrlChange(event: { target: { value: string } }) {
        setLinkUrl(event.target.value);
    }

    return (
        <form onSubmit={handleLinkSubmit}>
            <div className="form-group mt-3 mt-5">
                <label htmlFor="status">{t('linknaam')}</label>
                <input
                    type="text"
                    className="form-control"
                    id="link_name"
                    value={link_name}
                    onChange={handleNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">{t('link_url')}</label>
                <input
                    type="text"
                    className="form-control"
                    id="link_url"
                    value={link_url}
                    onChange={handleUrlChange}
                />
            </div>
            <table className='mt-5'>
                <tbody>
                <tr>
                    <td>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton"
                            value="Submit"
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
}

export default PersonPage
