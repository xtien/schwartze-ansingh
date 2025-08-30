/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {
    useEffect,
    useState,
} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Navigate} from "react-router-dom";
import {useLocation, useNavigate} from "react-router";
import {
    AdminLetterApi,
    type Letter,
    type LetterRequest,
    LettersApi,
    type MyLocation,
    type Person
} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import type {JSX} from 'react/jsx-runtime';
import {isAdmin} from "./service/AuthenticationService.tsx";
import {Modal} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";

const adminLetterApi = new AdminLetterApi(apiConfig)
const letterApi = new LettersApi(apiConfig)

function DeleteLetter() {
    const {t} = useTranslation();

    const location = useLocation();
    const navigate = useNavigate()

    const params = location.pathname.split('/')
    const number = params[2]

    const [letter, setLetter] = useState<Letter>()
    const [senders, setSenders] = useState<Array<Person>>()
    const [recipients, setRecipients] = useState<Array<Person>>()
    const [sender_location, setSenderLocation] = useState<MyLocation>()
    const [recipient_location, setRecipientLocation] = useState<MyLocation>()
     const [cancel, setCancel] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)

    const handleClose = () => {
        setShowDialog(false);
        navigate('/get_letters/')
    }

     let postData: LetterRequest = {
        number: parseInt(number)
    };

    useEffect(() => {

        letterApi.getLetter(postData).then(response => {
            if (response.data.letter != null) {
                setLetter(response.data.letter)
                setSenders(response.data.letter.senders)
                setRecipients(response.data.letter.recipients)
                setSenderLocation(response.data.letter.sender_locations[0])
                setRecipientLocation(response.data.letter.recipient_locations[0])


                let senderIdList: number[] = []
                if (senders != null && senders.length > 0) {
                    senderIdList = senders.map((p) =>
                        p.id != undefined ? p.id : 0);
                }
                let senderIds = ''
                let id
                for (id in senderIdList) {
                    senderIds += senderIdList[id];
                }

                let recipientIdList: number[] = []
                if (recipients != null && recipients.length > 0) {
                    recipientIdList = recipients.map((r) =>
                        r.id != undefined ? r.id : 0);
                }
                let recipientIds = ''
                for (id in recipientIdList) {
                    recipientIds += recipientIdList[id];
                }

            }
        }).catch(error => {
            console.log(error)
        })
    }, []);


    function _cancel() {
        setCancel(true)
    }

    function deleteLetter(event: { preventDefault: () => void; }) {
        event.preventDefault();

        const postData = {
            letter: letter
        };

        adminLetterApi.deleteLetter(postData).then(() => {
            setShowDialog(true)
        }).catch(error => {
            console.log(error)
        })

    }

    if (cancel === true && letter != null) {
        return <Navigate to={'/get_letter_details/' + letter.number + '/0'}></Navigate>
    }

    const date = letter != null ? letter.date : '';

    let senderList: JSX.Element[] = []
    if (senders != null) {
        senderList = senders.map((r) => <span>
                {r.nick_name} {r.tussenvoegsel} {r.last_name} </span>);
    } else {
        senderList = [];
    }

    let recipientList: JSX.Element[] = []
    if (recipients != null) {
        recipientList = recipients.map((r) => <span>
                {r.nick_name} {r.tussenvoegsel} {r.last_name} </span>);
    } else {
        recipientList = [];
    }

    return (
        <div>
            <div>
                <div>
                    <div
                        className="modal show"
                        style={{display: 'block', position: 'initial'}}
                    >
                        <Modal show={showDialog} onHide={handleClose}>
                            <Modal.Body>{t('letterRemoved')}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    {t('close')}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div>
                    <h3>{t('letterNumber')} {number} </h3>

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
                                    {date}
                                </td>
                            </tr>
                            <tr>
                                <td width="150px">
                                    {t('sender')}:
                                </td>
                                <td>
                                    {senderList} in {sender_location != null ? sender_location.name : ''}
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
                                    {recipientList} in {recipient_location != null ? recipient_location.name : ''}
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <td width="10">
                        <div className="m-lg-3 mt-5">
                            {
                                isAdmin() === "true" ?
                                    <button
                                        className="btn btn-outline-success mybutton"
                                        onClick={_cancel}>
                                        {t('cancel')}
                                    </button> : null}
                        </div>
                    </td>
                    <td width="1000">
                        <div className="m-lg-3 mt-5">
                            {
                                isAdmin() === "true" ?
                                    <button
                                        className="btn btn-outline-warning mybutton ml-2"
                                        onClick={deleteLetter}>
                                        {t('delete')}
                                    </button> : null}
                        </div>
                    </td>

                </div>
            </div>
        </div>
    )
}


export default DeleteLetter
