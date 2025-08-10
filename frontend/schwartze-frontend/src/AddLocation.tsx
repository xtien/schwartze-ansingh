/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Navigate} from "react-router-dom";
import {AdminLocationApi} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const adminLocationApi = new AdminLocationApi(apiConfig)

function AddLocation() {
    const {t} = useTranslation();

    const [locationName, setLocationName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [id, setId] = useState<number>(0);
    const [editDone, setEditDone] = useState<boolean>(false);

    function handleCommentChange(event: { target: { value: string; }; }) {
        setComment(event.target.value);
    }

    function handleLocationNameChange(event: { target: { value: string }; }) {
        setLocationName(event.target.value)
    }

    function handleSubmit() {

        let postData = {
            location: {
                location_name: locationName,
                comment: comment,
            }
        };

        adminLocationApi.addLocation(postData).then((response) => {
            if (response.data.location != null) {
                setEditDone(true)
                if (response.data.location.id != null) {

                    setId(response.data.location.id)
                }
            }
        }).catch((error) => {
            console.log(error)
        })
    }


    if (editDone === true) {
        return (
            <Navigate to={"/get_location_details/" + id}/>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
                <label htmlFor="status">Location</label>
                <input
                    type="text"
                    className="form-control "
                    id="nick_name"
                    value={locationName}
                    onChange={handleLocationNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">{t('text')}</label>
                <textarea
                    className="form-control "
                    id="comments"
                    value={comment}
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

export default AddLocation
