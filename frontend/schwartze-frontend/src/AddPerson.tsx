/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {useNavigate} from "react-router";
import {type AddPersonRequest, AdminPersonApi, type Person} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";

const adminPersonApi = new AdminPersonApi(apiConfig)

function AddPerson() {

    const navigate = useNavigate();

    const [nick_name, setNickName] = useState<string>('');
    const [full_name, setFullName] = useState<string>('');
    const [tussenvoegsel, setTussenvoegsel] = useState<string>('');
    const [last_name, setLastName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [editDone, setEditDone] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [person] = useState<Person>({});


    function handleCommentChange(event: { target: { value: string; }; }) {
        setComment(event.target.value);
    }

    function handleFirstNameChange(event: { target: { value: string; }; }){
        setNickName(event.target.value);
    }

    function handleMiddleNameChange(event: { target: { value: string; }; }){
        setFullName(event.target.value);
    }

    function handleTussenvoegselChange(event: { target: { value: string; }; }) {
        setTussenvoegsel(event.target.value);
    }

    function handleLastNameChange(event: { target: { value: string; }; }) {
        setLastName(event.target.value);
    }

    function handleSubmit() {
        let postData:AddPersonRequest = {
            person: {
                nick_name: nick_name,
                full_name: full_name,
                tussenvoegsel: tussenvoegsel,
                last_name: last_name,
                comment: comment,
                links: [],
            }
        };

        adminPersonApi.updatePerson(postData).then((response) => {
            if (response.data.person != null) {
                setEditDone(true)
                if (response.data.person.id != null) {
                    setId(response.data.person.id)
                }
            }
        }).catch((error) => {
            console.log(error)
        })


    }

    if (editDone) {
        navigate("/get_person_details/" + id)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div><p>{person.nick_name} {person.last_name}</p></div>
            <div className="form-group">
                <label htmlFor="status">Nick name</label>
                <input
                    type="text"
                    className="form-control "
                    id="nick_name"
                    value={nick_name}
                    onChange={handleFirstNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Full first name</label>
                <input
                    type="text"
                    className="form-control "
                    id="full_name"
                    value={full_name}
                    onChange={handleMiddleNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Tussenvoegsel</label>
                <input
                    type="text"
                    className="form-control "
                    id="full_name"
                    value={tussenvoegsel}
                    onChange={handleTussenvoegselChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Last name</label>
                <input
                    type="text"
                    className="form-control "
                    id="last_name"
                    value={last_name}
                    onChange={handleLastNameChange}
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="status">Text</label>
                <input
                    type="text"
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


export default AddPerson
