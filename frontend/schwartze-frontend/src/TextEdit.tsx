/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import './css/bootstrap.css'
import {Link, useLocation, useNavigate} from "react-router";
import {useState} from "react";
import {
    AdminTextApi,
    type Letter,
    type MyLocation,
    type Person,
    type Subject,
    TextApi,
    type TextRequest
} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const textApi = new TextApi(apiConfig)
const adminTextApi = new AdminTextApi(apiConfig)

function TextEdit() {
    const {i18n} = useTranslation();

    const _location = useLocation();
    const params = _location.pathname.split('/')
    const type = params[2]
    const id = params[3]

    const navigate = useNavigate()

    const [subjectId, setSubjectId] = useState<string>();
    const [personId, setPersonId] = useState<string>();
    const [letterId, setLetterId] = useState<string>();
    const [text_string, setTextString] = useState<string>();
    const [title_string, setTitleString] = useState<string>();
    const [locationId, setLocationId] = useState<string>();
    const [location, setLocation] = useState<MyLocation>();
    const [person, setPerson] = useState<Person>()
    const [letter, setLetter] = useState<Letter>()
    const [subject, setSubject] = useState<Subject>()

    if (id != null) {
        switch (type) {
            case "subject":
                setSubjectId(id)
                break;
            case "location":
                setLocationId(id)
                break;
            case "person":
                setPersonId(id);
                break;
            case "letter":
                setLetterId(id)
                break;
        }
    }

    let request: TextRequest = {
        location_id: locationId != undefined ? parseInt(locationId) : undefined,
        person_id: personId != undefined ? parseInt(personId) : undefined,
        letter_id: letterId != undefined ? parseInt(letterId) : undefined,
        subject_id: subjectId != undefined ? parseInt(subjectId) : undefined,
        language: i18n.language
    };

    textApi.getText(request).then((response) => {
        setLocation(response.data.location)
        if (response.data.location != null && response.data.location.text?.text_string != null) {
            setTextString(response.data.location.text.text_string)
        }
        setPerson(response.data.person)
        if (response.data.person != null && response.data.person.text?.text_string != null) {
            setTextString(response.data.person.text.text_string)
        }
        setSubject(response.data.subject)
        if (response.data.subject != null && response.data.subject.text?.text_string != null) {
            setTextString(response.data.subject.text.text_string)
        }
        setLetter(response.data.letter)
        if (response.data.letter != null && response.data.letter.text?.text_string != undefined) {
            setTextString(response.data.letter.text.text_string)
        }
        setTitleString(response.data.subject != null ? response.data.subject.name : '')
    }).catch((error) => {
        console.log(error)
    })


    function handleTextChange(event: { target: { value: string; }; }) {
        setTextString(event.target.value);
    }

    function handleTitleChange(event: { target: { value: string; }; }) {
        setTitleString(event.target.value);
    }

    function handleCancel() {
        navigate(redirectTo)
    }

    function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        let request: TextRequest = {
            location_id: locationId != undefined ? parseInt(locationId) : undefined,
            person_id: personId != undefined ? parseInt(personId) : undefined,
            letter_id: letterId != undefined ? parseInt(letterId) : undefined,
            subject_id: subjectId != undefined ? parseInt(subjectId) : undefined,
            text_string: text_string,
            title_string: title_string,
            language: i18n.language      };

        adminTextApi.updateText(request).then(() => {
            navigate(redirectTo)
        }).catch((error) => {
            console.log(error)
        })


    }


    const redirectTo =
        (letter != null) ? ('/get_letter_details/' + letter.number + '/0') : (
            (location != null && location.text != null) ? '/get_location_details/' + location.id : (
                (person != null) ? '/get_person_details/' + person.id : (
                    '/topics/')));


    return (
        <div className='container'>
            <div>

                <div>
                    <div>
                        {person != null ?
                            <Link
                                to={'/get_person_details/' + person.id}>
                                <h3> {person.nick_name} {(person.tussenvoegsel != null ? (person.tussenvoegsel + ' ') : '')} {person.last_name}</h3>
                            </Link>
                            : null
                        }</div>
                    <div>
                        {location != null ?
                            <Link to={'/get_location_details/' + location.id}>
                                <h3> {location.location_name}</h3>
                            </Link>
                            : null
                        }
                    </div>
                    <div>
                        {letter != null ?
                            <Link to={'/get_letter_details/' + letter.number + '/0'}>
                                <h3> Brief {letter.number}</h3>
                            </Link>
                            : null
                        }
                    </div>
                    <div>
                        {subject != null ?
                            <Link to={'/get_text/subject/' + subject.id}><h3> {subject.name}</h3>
                            </Link>
                            : null
                        }
                    </div>
                    <form onSubmit={handleSubmit} className='mt-5'>
                        <div className="form-group">
                            <div>
                                {subject != null ?
                                    <div><textarea
                                        id="title_string"
                                        value={title_string}
                                        onChange={handleTitleChange}
                                    />npm
                                    </div>
                                    : null
                                }
                            </div>
                            <textarea
                                className="form-control extratextarea"
                                id="text_string"
                                value={text_string}
                                onChange={handleTextChange}
                            />
                        </div>
                        <table className='mt-5'>
                            <body>
                            <tr>
                                <td>
                                    <input
                                        type="submit"
                                        className="btn btn-outline-success mybutton"
                                        value="Save"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-outline-danger mybutton"
                                        value="Cancel"
                                    />
                                </td>
                            </tr>
                            </body>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default TextEdit
