/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {useEffect, useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Link} from "react-router-dom";
import {Navigate, useLocation, useNavigate} from "react-router";
import arrow_left from "./images/arrow_left.png";
import arrow_right from "./images/arrow_right.png";
import {
    AdminLetterApi,
    AdminTranslateApi,
    ImagesApi,
    type Letter,
    type LetterRequest,
    LettersApi,
    type MyLocation,
    type Person,
    type TranslateRequest
} from "./generated-api";
import {apiConfig, isAdmin} from "./service/AuthenticationService.tsx";
import type {CommentFormProps} from "./interface/CommentFormProps.tsx";
import Util from "./service/Util.tsx";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";

const letterApi = new LettersApi(apiConfig)
const imageApi = new ImagesApi(apiConfig)
const adminLetterApi = new AdminLetterApi(apiConfig)
const translateApi = new AdminTranslateApi(apiConfig)

function LetterPage() {

    useEffect(() => {
        // Send pageview with a custom path
        ReactGA.send({hitType: "pageview", page: "/get_letter_details", title: "LetterPage"});
    }, [])

    const navigate = useNavigate();
    const location = useLocation()
    const params = location.pathname.substring(1).split('/')
    let n = 0;
    if (params[1] != null) {
        n = parseInt(params[1])
    }

    const [letterNumber, setLetterNumber] = useState<number>(n)
    const [letter, setLetter] = useState<Letter>({
        collectie: undefined,
        comment: "",
        date: "",
        id: 0,
        localDate: "",
        number: 0,
        senders: [],
        recipients: [],
        recipient_locations: [],
        sender_locations: [],
        remarks: "",
        text: undefined
    })
    const [letterText, setLetterText] = useState<string>()
    const [showEdit, setShowEdit] = useState(false)
    const [imageData, setImageData] = useState<string[]>([])
    const [edit_letter, setEdit_letter] = useState(false)
    const [delete_letter, setDelete_letter] = useState(false)
    const [showError, setShowError] = useState(false)
    const [error, setError] = useState<string>()
    const [translated, setTranslated] = useState(0)

    const {i18n} = useTranslation();
    const {t} = useTranslation();

    useEffect(() => {
        const request: LetterRequest = {
            'number': letterNumber,
            'language': i18n.language
        }
        letterApi.getLetter(request).then((response) => {
            if (response.data.letter !== undefined) {
                setLetter(response.data.letter)
                setLetterText(response.data.lettertext)
                getLetterImages(letterNumber.toString());
            }

        }).catch((error) => {
            console.log(error)
            setShowError(true)
            setError(error.toString())
        })
    }, [i18n.language, translated, letterNumber])

    function toggleEditDone() {
        setShowEdit(false)
    }

    function editComment() {
        setShowEdit(true)
    }

    function editLetter() {
        setEdit_letter(true)
    }

    function deleteLetter() {
        setDelete_letter(true)
    }

    function next(event: { preventDefault: () => void; }) {
        event.preventDefault()
        const request: LetterRequest = {
            'number': letter.number
        }
        letterApi.getNextLetter(request).then((response) => {
            // setLetter(response.data.letter)
            if (response.data.letter != null && response.data.letter.number != undefined) {
                console.log('next letter: ' + '/get_letter_details/' + response.data.letter.number + '/0')
                navigate('/get_letter_details/' + response.data.letter.number + '/0')
                setLetterNumber(response.data.letter.number)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function previous(event: { preventDefault: () => void; }) {
        event.preventDefault();
        const request: LetterRequest = {
            'number': letter.number
        }
        letterApi.getPreviousLetter(request).then((response) => {
            if (response.data.letter != null && response.data.letter.number != undefined) {
                navigate('/get_letter_details/' + response.data.letter.number + '/0')
                setLetterNumber(response.data.letter.number)
            }
        }).catch((error) => {
            console.log(error)
        })
    }


    function getLetterImages(number: string) {

        const request = {
            'number': parseInt(number)
        }

        imageApi.getLetterImages(request).then((response) => {

            if (response.data.images != null && response.data.images.length > 0)
                setImageData(response.data.images)
        }).catch((error) => {
            console.log(error)
        })
    }

    let linkTo = '';
    let linkToEditText = '';

    const listItems = imageData.map((d) => (
        <div className='mt-5'>
            <img className="img-fluid" src={`data:image/jpeg;base64,${d}`}/>

        </div>));
    const senderList = letter.senders.map((s: Person) =>
        <span><Link to={`/get_person_details/${s.id}`}
                    className='linkStyle me-2'>{s.nick_name} {s.tussenvoegsel} {s.last_name} </Link> </span>);
    const recipientList = letter.recipients.map((r: Person) => <span><Link
        to={`/get_person_details/${r.id}`}
        className='linkStyle me-2'>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);

    const senderLocationList = letter.sender_locations.map((s: MyLocation) => <span><Link
        to={`/get_location_details/${s.id}`} className='linkStyle ms-2'>{s.location_name} </Link> </span>);
    const recipientLocationList = letter.recipient_locations.map((s: MyLocation) => <span><Link
        to={`/get_location_details/${s.id}`} className='linkStyle ms-2'>{s.location_name} </Link> </span>);

    if (letter != null) {
        linkTo = '/get_text/letter/' + letter.id;
        linkToEditText = '/edit_text/letter/' + letter.id;
    }

    if (edit_letter === true) {
        return <Navigate to={'/edit_letter/' + letter.number}/>
    }
    if (delete_letter === true) {
        return <Navigate to={'/delete_letter/' + letter.number}/>
    }

    function translateLetter() {
        const request: TranslateRequest = {
            id: letter.number,
            language: i18n.language
        }
        translateApi.translateLetter(request)
            .then(() => {
                setTranslated(translated + 1)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className='container-fluid me-sm-5 ms-sm-5'>
            {
                error != null && showError ?
                    <div className='alert alert-danger' role='alert'></div>
                    : null
            }

            {showEdit ? null : (

                <div>
                    <div className="row">
                        <div className='col'>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={previous}>
                                <img src={arrow_left} alt="back"/>
                            </button>
                        </div>
                        <div className='col'>
                            <div>
                                {
                                    isAdmin() === "true" ?
                                        <button
                                            className="btn btn-outline-success mybutton"
                                            onClick={editComment}>
                                            {t('editCommentLine')}
                                        </button> : null}
                            </div>
                        </div>
                        <div className='col'>
                            <div>
                                {
                                    isAdmin() === "true" ?
                                        <button
                                            className="btn btn-outline-warning mybutton ml-2"
                                            onClick={editLetter}>
                                            {t('editsenderRecipient')}
                                        </button> : null}
                            </div>
                        </div>
                        <div className='col'>
                            {
                                isAdmin() === "true" ?
                                    <button
                                        className="btn btn-outline-warning mybutton "
                                        onClick={deleteLetter}>
                                        {t('deleteLetter')}
                                    </button> : null}

                        </div>
                        <div className='col'>
                            {
                                isAdmin() === "true" ?
                                    <button
                                        className="btn btn-outline-secondary mybutton  "
                                        onClick={translateLetter}>
                                        {t('translateLetter')}
                                    </button> : null}

                        </div>
                        <div className='col'>
                            <button
                                className="btn btn-link"
                                onClick={next}>
                                <img src={arrow_right} alt="forward"/>
                            </button>
                        </div>
                    </div>

                </div>
            )}

            <div>
                {showEdit ?
                    <div>
                        <div>
                            <CommentForm
                                letter={letter}
                                toggleEditDone={toggleEditDone}
                                setLetter={setLetter}
                            />
                        </div>
                    </div> : null}
            </div>
            <div className='bg-light'>
                <table>
                    <tbody>
                    <tr>
                        <td width="80">
                            <div>
                                {t('nummer')}
                            </div>
                        </td>
                        <td>
                            <div>
                                {letter.number}
                            </div>
                        </td>
                    </tr>
                    {letter.collectie != null ?
                        <tr>
                            <td width="80">
                                <div className='mb-3'>
                                    {t('collection')}
                                </div>
                            </td>
                            <td colSpan={2}>
                                {letter.collectie.name}
                            </td>
                        </tr>
                        : null
                    }
                    <tr>
                        <td>{t('from')}:</td>
                        <td>{senderList}</td>
                        <td>
                            <div className='ml-3'>{senderLocationList}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>{t('to')}:</td>
                        <td>{recipientList}</td>
                        <td>
                            <div className='ml-3'>{recipientLocationList}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>{t('date')}:</td>
                        <td>{letter.date}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className='mt-5 mb-5'>
                {letterText != null && letterText != null ?
                    <div
                        dangerouslySetInnerHTML={{__html: letterText != null && letterText != null ? letterText : ''}}/>
                    : null}

                {letter != null && letter.text != null && letter.text.text_string != undefined ?
                    <div>
                        <div className='mt-5'>{t('remark')}</div>
                        <div className='fst-italic pt-3 pb-1 mb-3 bg-light'>
                            {letter.text != null && letter.text.text_string != undefined && Util.isNotEmpty(letter.text.text_string) ?
                                <div>
                                    {/* TODO: this needs to change when others than myself get access to data entry */}
                                    {letter.text.text_string === undefined ? '' :
                                        <div
                                            dangerouslySetInnerHTML={{__html: letter.text.text_string.substring(0, 300)}}/>
                                    }
                                    {letter.text.text_string !== undefined && letter.text.text_string.length > 300 ?
                                        <p>
                                            <Link to={linkTo} className='mt-5 mb-5'> {t('meer')} </Link>
                                        </p>
                                        : null}
                                </div> : null}
                            {letter !=null && letter.comment != null ?
                            <div className='remark'>
                                {letter.comment}
                            </div>
                                : null
                            }
                        </div>
                    </div>
                    : null
                }

                {isAdmin() === "true" ?
                    <div className=''>
                        <Link to={linkToEditText}>
                            {t('editText')}
                        </Link>
                    </div>
                    : null}

                <div>
                    {listItems}
                </div>
            </div>
        </div>

    )

    function CommentForm({letter, toggleEditDone, setLetter}: CommentFormProps) {

        const [text, setText] = useState(letter.text != null ? letter.text.text_string : '');
        const [date, setDate] = useState(letter.date);

        function handleChange(event: { target: { value: string; }; }) {
            setText(event.target.value);
        }

        function handleDateChange(event: { target: { value: string; }; }) {
            setDate(event.target.value);
        }

        function handleSubmit() {
            const request: LetterRequest =
                {
                    comment: text,
                    date: date, number: letter.number,
                }

            adminLetterApi.updateLetterComment(request).then(response => {
                if (response.data.letter != null) {
                    setLetter(response.data.letter)
                }
                toggleEditDone()
            }).catch(error => {
                console.log(error)
            })
        }

        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status"></label>
                    <textarea
                        id="text"
                        value={text}
                        className="form-control  mb-5"
                        onChange={handleChange}/>
                    <label htmlFor="status">Datum</label>
                    <input
                        type="text"
                        id="date"
                        value={date}
                        className="form-control "
                        onChange={handleDateChange}/>
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton"
                    value="Submit"
                />
            </form>
        );
    }
}

export default LetterPage
