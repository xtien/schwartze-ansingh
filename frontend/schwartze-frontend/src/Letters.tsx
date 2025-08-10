/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import * as React from 'react'
import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router";
import {
    type GetPersonRequest,
    type Letter,
    LettersApi,
    type LettersRequest,
    LettersRequestOrderByEnum,
    LettersRequestToFromEnum,
    type LocationLettersRequest,
    LuceneSearchApi,
    type MyLocation,
    type Person,
    PersonApi,
    type PersonLettersRequest,
    PersonLettersRequestToFromEnum,
    type PersonResult,
    type SearchRequest
} from "./generated-api";
import strings from "./strings.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import {apiConfig} from "./service/AuthenticationService.tsx";
import type {AxiosResponse} from "axios";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";

const lettersApi = new LettersApi(apiConfig);
const personApi = new PersonApi(apiConfig);
const searchApi = new LuceneSearchApi(apiConfig)

function Letters() {
    const {t} = useTranslation();

    useEffect(() => {
        // Send pageview with a custom path
        ReactGA.send({hitType: "pageview", page: "/get_letters", title: "Letters Page"});
    }, [])

    const location = useLocation()
    const params = location.pathname.substring(1).split('/')
    const id = params[1]
    const searchTerm = params[1]
    const urlPart = params[0]
    const isPerson: boolean = urlPart.includes('person') ? true : false
    const isLocation: boolean = urlPart.includes('location') ? true : false
    const isSearch: boolean = urlPart.includes('search_letters') ? true : false
    const toFromString = params[2]

    const navigate = useNavigate();
    const [person, setPerson] = useState<Person>()
    const [letters, setLetters] = React.useState<Letter[]>([]);
    const [myLocation] = useState<MyLocation>()
    const [orderBy, setOrderBy] = React.useState<LettersRequestOrderByEnum>("NUMBER");
    const [toFrom] = React.useState<LettersRequestToFromEnum>(toFromString === 'to' ? LettersRequestToFromEnum.To : LettersRequestToFromEnum.From);
    const [search_term, setSearchTerm] = React.useState('');

    function getLetters(orderBy: LettersRequestOrderByEnum) {
        if (isPerson) {
            function getPerson(id: string) {
                const personRequest: GetPersonRequest = {
                    id: parseInt(id),
                }
                personApi.getPerson(personRequest).then((response: AxiosResponse<PersonResult, any>) => {
                        if (response.data.person != null) {
                            setPerson(response.data.person)
                        }
                    }
                ).catch((error: any) => {
                    console.log(error)
                })
            }

            if (id != null && toFromString != null) {
                getPerson(id)
                const request: PersonLettersRequest = {
                    id: parseInt(id),
                    toFrom: toFrom,
                    orderBy: orderBy
                }

                lettersApi.getLettersForPerson(request).then((response) => {
                    if (response.data.letters != null) {
                        setLetters(response.data.letters!)
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
        } else if (isLocation) {
            function getLocation(id: string) {
                const request: LocationLettersRequest = {
                    location_id: parseInt(id),
                }
                lettersApi.getLettersForLocation(request).then(
                    (response) => {
                        if (response.data.letters != null) {
                            setLetters(response.data.letters!)
                        }
                    }
                ).catch(
                    (error) => {
                        console.log(error)
                    }
                )
            }

            getLocation(id)

        } else if (isSearch) {
            let postData: SearchRequest = {
                search_term: searchTerm,
            };

            searchApi.searchLetters(postData).then((response) => {
                if (response.data.letters != null) {
                    setLetters(response.data.letters)
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            const request: LettersRequest = {
                orderBy: orderBy
            }
            lettersApi.getLetters(request).then((response) => {
                if (response.data.letters != null) {
                    setLetters(response.data.letters!)
                }
            }).catch(error => {
                console.log(error)
            })
        }

    }

    React.useEffect(() => {
        getLetters(orderBy)
    }, [id, toFromString, urlPart, orderBy])

    function createFullName(person: Person): string {
        let name = '';
        name += person.nick_name != null ? person.nick_name + ' ' : '';
        name += person.tussenvoegsel != null ? person.tussenvoegsel + ' ' : '';
        name += person.last_name != null ? person.last_name : '';
        return name;
    }

    function handleSearchTermChange(event: { target: { value: string }; }) {
        setSearchTerm(event.target.value);
    }

    function handleSearchSubmit() {
        navigate('/search_letters/' + search_term)
    }

    function navigateTo(location: string) {
        navigate(location);
    }

    function sort(order: LettersRequestOrderByEnum) {

        setOrderBy(order)
        getLetters(order)
    }

    function renderLetters() {
        return letters.map(function (letter) {
            const letterLink = '/get_letter_details/' + letter.number?.toString() + '/0';
            const senders = letter.senders;
            let senderName = '';
            if (senders != undefined && senders.length > 0) {
                senders.map(function (sender) {
                    const fullName: string = createFullName(sender);
                    senderName += fullName + ', '
                })
                senderName = senderName.slice(0, -2);
            }

            const recipients = letter.recipients;
            let recipientName = '';
            if (recipients != undefined && recipients.length > 0) {
                recipients.map(function (recipient) {
                    recipientName += recipient.nick_name + ' ' + recipient.last_name + ', '
                })
                recipientName = recipientName.slice(0, -2);
            }

            let senderLocation = '';
            if (letter.sender_locations != null && letter.sender_locations.length > 0) {
                letter.sender_locations.map(function (location) {
                    senderLocation += location.name + ', '
                })
            }
            senderLocation = senderLocation.slice(0, -2);

            let recipientLocation = '';
            if (letter.recipient_locations != null) {
                letter.recipient_locations.map(function (location) {
                    recipientLocation += location.name + ', '
                })
            }
            recipientLocation = recipientLocation.slice(0, -2);

            return (
                <tr onClick={() => navigateTo(letterLink)}>
                    <td className='text-nowrap d-none d-lg-block'>{letter.number}</td>
                    <td className='text-nowrap'>{letter.date}</td>
                    <td>{senderName}</td>
                    <td className='d-none d-lg-block'>{senderLocation}</td>
                    <td>{recipientName}</td>
                    <td className='d-none d-lg-block'>{recipientLocation}</td>
                </tr>
            )
        });
    }

    return (
        <div className='container-fluid me-sm-5 ms-sm-5'>
            <div className="row">
                {person != null || myLocation != null ?
                    <div className='mt-3 m-lg-5'>
                        {person != null ? (strings.personLettersText + " " + (toFrom === PersonLettersRequestToFromEnum.From ? strings.from : strings.to) + ' ' + createFullName(person)) : ''}
                        {myLocation != null ? (strings.locationLettersText + ' ' + myLocation.name) : ''}
                    </div> : null}

                <div className='d-none d-lg-block'>
                    {letters.length < 10 ? null :
                        <div className='col-sm-7'>
                            <button
                                className="btn btn-outline-secondary mybutton m-lg-3  mt-3"
                                onClick={() => sort(LettersRequestOrderByEnum.Number)}>
                                {t('op_nummer')}
                            </button>
                            <button
                                className="btn btn-outline-secondary mybutton m-lg-3  mt-3"
                                onClick={() => sort(LettersRequestOrderByEnum.Date)}>
                                {t('op_datum')}
                            </button>
                            <button
                                className="btn btn-outline-secondary mybutton m-lg-3 mt-3"
                                onClick={() => sort(LettersRequestOrderByEnum.SenderLastname)}>
                                {t('op_achternaam')}
                            </button>
                            <button
                                className="btn btn-outline-secondary mybutton m-lg-3 mt-3"
                                onClick={() => sort(LettersRequestOrderByEnum.SenderFirstname)}>
                                {t('op_voornaam')}
                            </button>
                        </div>
                    }
                </div>

                <div className='col-sm-5'>
                    <form onSubmit={handleSearchSubmit} className='mb-3 mt-3'>
                        <input
                            type="input"
                            id="text"
                            placeholder={t('search')}
                            onChange={handleSearchTermChange}
                            className='form-control w-75'
                        />
                    </form>
                </div>
                <Table>
                    <thead>
                    <tr>
                        <th className='d-none d-lg-block'>{t('number')}</th>
                        <th>{t('date')}</th>
                        <th>{t('sender')}</th>
                        <th className='d-none d-lg-block'>{t('senderLocation')}</th>
                        <th>{t('recipient')}</th>
                        <th className='d-none d-lg-block'>{t('recipientLocation')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderLetters()}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Letters
