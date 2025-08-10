/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useEffect, useRef, useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Navigate, useLocation, useNavigate} from "react-router";
import {
    AdminLetterApi, AdminLocationApi,
    AdminPersonApi,
    type Letter,
    type LetterRequest, LettersApi, type LocationsRequest,
    type MyLocation, type PeopleRequest,
    type Person
} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const letterApi = new LettersApi(apiConfig)
const adminLetterApi = new AdminLetterApi(apiConfig)
const adminLocationApi = new AdminLocationApi(apiConfig)
const adminPersonApi = new AdminPersonApi(apiConfig)


function EditLetter() {
     const {t} = useTranslation();

    const location = useLocation()
    const params = location.pathname.split('/')
    const number = params[2]
    const navigate = useNavigate()

    const [letter, setLetter] = useState<Letter>()
    const [senders, setSenders] = useState<Array<Person>>()
    const [recipients, setRecipients] = useState<Array<Person>>()
    const [senderLocations, setSenderLocations] = useState<Array<MyLocation>>()
    const [recipientLocations, setRecipientLocations] = useState<Array<MyLocation>>()

    const [senderLocationNamesString, setSenderLocationNamesString] = useState<string>('')
    const [recipientLocationNamesString, setRecipientLocationNamesString] = useState<string>('')
    const [recipientNamesString, setRecipientNamesString] = useState<string>('')
    const [sendersNamesString, setSendersNamestring] = useState<string>('')

    const [senderLocationIdsString, setSenderLocationIdsString] = useState<string>('')
    const [recipientLocationIdsString, setRecipientLocationIdsString] = useState<string>('')
    const [recipientIdsString, setRecipientIdsString] = useState<string>('')
    const [sendersIdsString, setSendersIdsString] = useState<string>('')

    const [errorMessage, setErrorMessage] = useState<string>()
    const [editDone, setEditDone] = useState<boolean>(false)
    const [date, setDate] = useState<string>()

    const hasMounted = useRef(false);

    useEffect(() => {

        if (hasMounted.current) {
            return;
        }

        let postData: LetterRequest = {
            number: parseInt(number)
        };

        letterApi.getLetter(postData).then(response => {
            if (response.data.letter != null) {
                doSetLetter(response.data.letter)

            }
        })

        hasMounted.current = true;

    }, []);

    function doSetLetter(letter: Letter) {
        setLetter(letter)
        setDate(letter.date)
        setSenders(letter.senders)
        setRecipients(letter.recipients)

        setSendersIdsString(letter.senders.map((r) => r.id).join(','))
        setRecipientIdsString(letter.recipients.map((r) => r.id).join(', '))
        setSenderLocationIdsString(letter.sender_locations.map((r) => r.id).join(', '))
        setRecipientLocationIdsString(letter.recipient_locations.map((r) => r.id).join(', '))

        setRecipientNamesString(letter.recipients.map((r) => personToString(r)).join(', '))
        setSenderLocationNamesString(letter.sender_locations.map((r) => r.name).join(', '))
        setRecipientLocationNamesString(letter.recipient_locations.map((r) => r.name).join(', '))
        setSendersNamestring(letter.senders.map((r) => personToString(r)).join(','))
    }

    function _setSenders(senders: Array<Person>) {
        if (letter != null) {
            setSenders(senders)
            const updatedLetter = letter;
            updatedLetter.senders = senders;
            setLetter(updatedLetter)
        }
    }

    function _setRecipients(recipients: Array<Person>) {
        if (letter != null) {
            setRecipients(recipients)
            const updatedLetter = letter;
            updatedLetter.recipients = recipients;
            setLetter(updatedLetter)
        }
    }

    function _setSenderLocations(senderLocations: Array<MyLocation>) {
        if (letter != null) {
            setSenderLocations(senderLocations)
            const updatedLetter = letter;
            updatedLetter.sender_locations = senderLocations;
            setLetter(updatedLetter)
        }
    }

    function _setRecipientLocations(recipientLocations: Array<MyLocation>) {
        if (letter != null) {
            setRecipientLocations(recipientLocations)
            const updatedLetter = letter;
            updatedLetter.recipient_locations = recipientLocations;
            setLetter(updatedLetter)
        }
    }


    function getPeopleFromIdsString(idsString: string, func: (people: Array<Person>) => void) {
        const ids = idsString.replace(' ', '').split(',')
        const numbers = ids.map((id) => parseInt(id))
        const request: PeopleRequest = {
            ids: numbers
        }
        adminPersonApi.getPersonsForIds(request).then(response => {
            if (response.data.people != null) {
                if (func != undefined)
                    func(
                        response.data.people
                    )
            }
        })
    }

    function getLocationsFromIdsString(idsString: string, func: (location: Array<MyLocation>) => void) {
        const ids = idsString.replace(' ', '').split(',')
        const numbers = ids.map((id) => parseInt(id))
        const request: LocationsRequest = {
            ids: numbers
        }
        adminLocationApi.getLocationsForIds(request).then(response => {
            if (response.data.locations != null) {
                if (func != undefined) {
                    func(response.data.locations)
                }
            }
        })
    }

    function handleSenderIds(event: { target: { value: string; }; }) {
        setSendersIdsString(event.target.value)
        getPeopleFromIdsString(event.target.value, setSenders)
    }

    function handleSenderLocationIds(event: { target: { value: string; }; }) {
        setSenderLocationIdsString(event.target.value)
        getLocationsFromIdsString(event.target.value, _setSenderLocations)
    }

    function handleRecipientIds(event: { target: { value: string; }; }) {
        setRecipientIdsString(event.target.value)
        getPeopleFromIdsString(event.target.value, _setRecipients)
    }

    function handleRecipientLocationIds(event: { target: { value: string; }; }) {
        setRecipientLocationIdsString(event.target.value)
        getLocationsFromIdsString(event.target.value, _setRecipientLocations)
    }

    function handleDate(event: { target: { value: string; }; }) {
        setDate(event.target.value);
    }

    function handleSubmit(event: { preventDefault: () => void;}) {
        event.preventDefault();

        if (letter != null) {

            let postData = {
                letter: letter
            };

            adminLetterApi.updateLetter(postData).then(response => {
                if (response.data.letter != null) {
                    doSetLetter(response.data.letter)
                }
                setEditDone(true)
            }).catch(error => {
                console.log(error)
                setErrorMessage(error)
            })
        }
    }

    function handlePreview(event: { preventDefault: () => void; }) {
        event.preventDefault();


        getPeopleFromIdsString(sendersIdsString, _setSenders)
        getPeopleFromIdsString(recipientIdsString, _setRecipients)
        getLocationsFromIdsString(senderLocationIdsString, _setSenderLocations)
        getLocationsFromIdsString(recipientLocationIdsString, _setRecipientLocations)


        if (senders != null) {
            setSendersIdsString(senders.map((r) => r.id).join(','))
            setSendersNamestring(senders.map((p) => personToString(p)).join(','))
        }
        if (senderLocations != null) {
            setSenderLocationNamesString(senderLocations.map((r) => r.location_name).join(', '))
            setSenderLocationIdsString(senderLocations.map((r) => r.id).join(', '))
        }

        if (recipients != null) {
            setRecipientIdsString(recipients.map((r) => r.id).join(', '))
            setRecipientNamesString(recipients.map((r) =>personToString(r)).join(', '))
        }


        if (recipientLocations != null) {
            setRecipientLocationIdsString(recipientLocations.map((r) => r.id).join(', '))
            setRecipientLocationNamesString(recipientLocations.map((r) => r.location_name).join(', '))
        }


        if (editDone === true && letter != null) {
            return <Navigate to={'/get_letter_details/' + letter.number + '/0'}></Navigate>
        }
    }

    let senderListString = ''
    if (senders != null) {
        for (var s of senders) {
            senderListString += personToString(s);
        }
    }

    let recipientListString = ''
    if (recipients != null) {
        for (const r of recipients) {
            recipientListString += personToString(r);
        }
    }

    function personToString(p: Person) {
        return (p.nick_name ?? '') + ' ' + (p.tussenvoegsel ?? '') + ' ' + (p.last_name ?? '') + ', ';
    }

    function handleCancel() {
        navigate('get_letter_details/' + number + '/0')
    }

    return (
        <div className="container ml-5 mt-5">
            {errorMessage != null ?
                <div className="mb-5">
                    <div>{errorMessage}</div>
                </div> : null}

            <div>
                <h3>{t('letterNumber')} {number} </h3>

                <form>
                    <div className='form-group mt-5'>
                        <table width="600px">
                            <tbody>
                            <tr>
                                <td width="150px">
                                    <div className='mb-5'>
                                        {t('date')}:
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control  mt-1 w-25 mb-5'
                                        id="sender.id"
                                        value={date ?? ''}
                                        onChange={handleDate}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td width="150px">
                                    {t('sender')}:
                                </td>
                                <td>
                                    {sendersNamesString}
                                </td>
                            </tr>
                            <tr>
                                <td width="150px">
                                    {t('senderLocation')}:
                                </td>
                                <td>
                                    {senderLocationNamesString}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className='mr-3' htmlFor="status">{t('personId')}</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control  mt-1 w-25'
                                        id="senderId"
                                        value={sendersIdsString}
                                        onChange={handleSenderIds}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">{t('locationId')}</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control  mt-1 w-25'
                                        id="sender_location.id"
                                        value={senderLocationIdsString}
                                        onChange={handleSenderLocationIds}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='form-group mt-5'>
                        <table width="600px">
                            <tbody>
                            <tr>
                                <td width="150px">
                                    {t('recipient')}:
                                </td>
                                <td>
                                    {recipientNamesString}
                                </td>
                            </tr>
                            <tr>
                                <td width="150px">
                                    {t('recipientLocation')}:
                                </td>
                                <td>
                                    {recipientLocationNamesString}
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">{t('personId')}</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control  mt-1 w-25'
                                        id="recipientid"
                                        value={recipientIdsString}
                                        onChange={handleRecipientIds}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">{t('locationId')}</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control  mt-1 w-25'
                                        id="recipient_location.id"
                                        value={recipientLocationIdsString}
                                        onChange={handleRecipientLocationIds}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-3'>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton m-lg-3"
                            value={t('submit')}
                            onClick={handleSubmit}
                        />
                        <button
                            className="btn btn-outline-success mybutton m-lg-3"
                            onClick={handlePreview}>
                            {t('preview')}
                        </button>
                        <button
                            className="btn btn-outline-info mybutton m-lg-3"
                            onClick={handleCancel}
                        >{t('cancel')}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditLetter
