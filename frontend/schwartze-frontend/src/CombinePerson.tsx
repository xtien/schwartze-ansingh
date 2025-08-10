/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {useEffect, useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {useLocation, useNavigate} from "react-router";
import {
    AdminPersonApi,
    type CombinePersonRequest,
    type GetPersonRequest,
    type Person,
    PersonApi
} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const adminPersonApi = new AdminPersonApi(apiConfig)
const personApi = new PersonApi(apiConfig)

function CombinePerson() {
    const {t} = useTranslation();

    const location = useLocation();

    const params = location.pathname.split('/')
    const id = params[2]

    const [, setRedirect] = useState<boolean>(false);
    const [first_id, setFirstId] = useState(id)
    const [second_id, setSecondId] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false)
    const [person1, setPerson1] = useState<Person>()
    const [person2, setPerson2] = useState<Person>()


    function handleFirstPersonChange(event: { target: { value: string; }; }) {
        setFirstId(event.target.value);
    }

    function handleSecondPersonChange(event: { target: { value: number; }; }) {
        setSecondId(event.target.value);
    }

    useEffect(() => {
        const request: GetPersonRequest = {
            id: parseInt(first_id)
        }

        personApi.getPerson(request).then((response) => {
            if (response.data.person != null) {
                setPerson1(response.data.person)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, []);

    function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        let postData: CombinePersonRequest = {
            id1: parseInt(first_id),
            id2: second_id
        };

        adminPersonApi.getCombinePerson(postData)
            .then((response) => {
                    if (response.data.person1 != null) {
                        setPerson1(response.data.person1)
                        setPerson1(response.data.person1)
                    }
                    if (response.data.person2 != null) {
                        setPerson2(response.data.person2),
                            setShowConfirm(true)
                    }
                }
            ).catch
        ((error) => {
            console.log(error)
        })
    }

    function dontCombine() {
        const navigate = useNavigate();
        navigate("/get_person_details/" + first_id)
    }

    return (
        <div>
            {
                showConfirm ? null : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group row mt-5">
                            <label htmlFor="status" className="col-sm-2 col-form-label">Persoon nummer</label>
                            <div className="col-sm-2">
                                <input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control "
                                    id="first_person"
                                    value={first_id}
                                    onChange={handleFirstPersonChange}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="status" className="col-sm-2 col-form-label">Te combineren met</label>
                            <div className="col-sm-2 mt-2">
                                <input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control "
                                    id="first_person"
                                    value={second_id}
                                    onChange={() => handleSecondPersonChange}
                                />
                            </div>
                        </div>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton m-lg-3  mt-3"
                            value={t('combineren')}
                        />
                        <input
                            className="btn btn-outline-danger mybutton mt-5"
                            onClick={() => dontCombine()}
                            value={t('niet_doen')}>
                        </input>
                    </form>)
            }
            {
                showConfirm && person1 != null && person2 != null ?
                    <CombinePersonForm
                        person1={person1}
                        person2={person2}
                        setRedirect={() => setRedirect}
                    />
                    : null
            }
        </div>
    )

}


interface CombinePersonProps {
    person1: Person,
    person2: Person,
    setRedirect: (b: boolean) => void
}

function CombinePersonForm({person1, person2, setRedirect}: CombinePersonProps) {

    const [_redirect, _setRedirect] = useState(false);
    const [_person1] = useState(person1);
    const [_person2] = useState(person2);

    function combine() {

        let postData = {
            requestCode: 0,
            id1: person1.id,
            id2: person2.id
        };

        adminPersonApi.putCombinePerson(postData).then(() => {
            setRedirect(true)
        }).catch((error) => {
            console.log(error)
        })
    }

    function dont() {
        setRedirect(true)
    }

    return (
        <form onSubmit={combine}>
            <div className="letter text-black-50">
                <div className='mt-3 m-lg-3'>
                    <p>
                        {person1.id} {person1.nick_name} {person1.full_name} {person1.last_name}
                    </p>
                </div>
                <div>
                    <p>
                        {person2.id} {person2.nick_name} {person2.full_name} {person2.last_name}
                    </p>
                </div>
            </div>
            <input
                className="btn btn-outline-success mybutton mt-5"
                onClick={combine}
                value="Combineren">
            </input>
            <input
                className="btn btn-outline-danger mybutton mt-5"
                onClick={dont}
                value="Niet doen">
            </input>
        </form>
    )
}


export default CombinePerson
