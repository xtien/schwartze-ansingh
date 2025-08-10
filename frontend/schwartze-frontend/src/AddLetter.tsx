/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import { useState} from 'react';
import './App.css';
import './css/bootstrap.css';
import {Navigate} from "react-router-dom";
import {type AddLetterRequest, AdminLetterApi} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";

const letterApi = new AdminLetterApi(apiConfig)

function AddLetter() {

    const [number, setNumber] = useState<string>('');
    const [collectie, setCollectie] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [editDone, setEditDone] = useState<boolean>(false);

    function handleDateChange(event: { target: { value: string; }; }) {
        setDate(event.target.value);
    };

    function handleNumberChange(event: { target: { value: string; }; }) {
        setNumber(event.target.value);
    };

    function handleCollectieChange(event: { target: { value: string; }; }) {
        setCollectie(event.target.value)
    };

    function handleSubmit  () {

        const request: AddLetterRequest = {
            letter: {
                number: parseInt(number),
                collectie: {
                    id: parseInt(collectie)
                },
                date: date,
                senders: [],
                recipients: [],
                sender_locations: [],
                recipient_locations: []
            }
        };

        letterApi.addLetter(request).then((response) => {
            if (response.data.letter != null) {
                setEditDone(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    };

    if (editDone === true) {
        return (
            <Navigate to={"/get_letter_details/" + number + '/0'}/>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
                <label htmlFor="status">Nummer</label>
                <input
                    type="text"
                    className="form-control"
                    id="number"
                    value={number}
                    onChange={handleNumberChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Collectie</label>
                <input
                    type="number"
                    className="form-control"
                    id="collectie"
                    value={collectie}
                    onChange={handleCollectieChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="header">Datum</label>
                <input
                    type="text"
                    className="form-control"
                    id="links"
                    value={date}
                    onChange={handleDateChange}
                />
            </div>
            <input
                type="submit"
                className="btn btn-outline-success mybutton mt-3"
                value="Submit"
            />
        </form>
    );
};

export default AddLetter;
