/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {useState} from 'react'
import './App.css'
import './css/bootstrap.css'

import {useLocation, useNavigate} from "react-router";
import {AdminLocationApi, type MyLocation} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const locationApi = new AdminLocationApi(apiConfig)

function CombineLocation() {

    const location = useLocation();
    const params = location.pathname.split('/')
    const id = params[2]

    const [setRedirect] = useState<boolean>(false);

    const [showConfirm, setConfirm] = useState<boolean>(false);
    const [first_id, setFirstId] = useState<number>(id!= null ? parseInt(id) : 0);
    const [second_id, setSecondId] = useState<number>(0);
    const [location1, setLocation1] = useState<any>(null);
    const [location2, setLocation2] = useState<any>(null);


    function handleFirstLocationChange(event: { target: { value: number; }; }) {
        setFirstId(event.target.value);
    }

    function handleSecondLocationChange(event: { target: { value: number; }; }) {
        setSecondId(event.target.value);
    }

    function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        let postData = {
            id1: first_id,
            id2: second_id
        };

        locationApi.getCombineLocation(postData).then((response) => {
            if (response.data.location1 != null) {
                setLocation1(response.data.location1);
                setLocation2(response.data.location2);
                setConfirm(true);
            }
        }).catch((error) => {
            console.log(error)
        })

    }


    return (
        <div>
            {
                showConfirm ? null : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="status" className="col-sm-2 col-form-label">Locatie nummer</label>
                            <div className="col-sm-2"><input
                                type="text"
                                pattern="[0-9]*"
                                className="form-control "
                                id="first_person"
                                value={first_id}
                                onChange={() => handleFirstLocationChange}
                            /></div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="status" className="col-sm-2 col-form-label">Te combineren met</label>
                            <div className="col-sm-2"><input
                                type="text"
                                pattern="[0-9]*"
                                className="form-control "
                                id="first_person"
                                value={second_id}
                                onChange={() => handleSecondLocationChange}
                            /></div>
                        </div>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton"
                            value="Combineer"
                        />
                    </form>)
            }
            {
                showConfirm ? (
                    <CombineLocationForm
                        location1={location1}
                        location2={location2}
                        setRedirect={() => setRedirect}
                    />
                ) : null}
        </div>
    )
}

interface CombineLocationProps {
    location1: MyLocation,
    location2: MyLocation,
    setRedirect: (b: boolean) => void,
}

function CombineLocationForm({location1, location2, setRedirect}: CombineLocationProps) {

    const { t } = useTranslation();

    function combine() {

        let postData = {
            requestCode: 0,
            id1: location1.id,
            id2: location2.id
        };

        locationApi.putCombineLocation(postData).then(() => {
            setRedirect(true)
        }).catch((error) => {
            console.log(error)
        })
    }

    function dontCombine() {
        const navigate = useNavigate();
        navigate("/get_location_details/" + location1.id)
    }

    return (
        <form onSubmit={combine}>
            <div className="letter text-black-50">
                <div>
                    <p>
                        {location1.id} {location1.name}
                    </p>
                </div>
                <div>
                    <p>
                        {location2.id} {location2.name}
                    </p>
                </div>
            </div>
            <input
                className="btn btn-outline-success mybutton mt-5"
                onClick={combine}
                value={t('combineren')}>
            </input>
            <input
                className="btn btn-outline-danger mybutton mt-5"
                onClick={() => dontCombine()}
                value={t('niet_doen')}>
            </input>
        </form>
    )
}

export default CombineLocation
