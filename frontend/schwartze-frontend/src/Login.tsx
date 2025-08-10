/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import {useState} from 'react'
import './App.css'
import './css/bootstrap.css'
import {
    createBasicAuthToken,
    executeLogin, registerSuccessfulLogin, setAuthorities,
} from "./service/AuthenticationService.tsx";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

function Login() {
   const {t} = useTranslation();

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function handleLinkSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        if (username === undefined || password === undefined) {
            return (<div>no username</div>)
        }

        const auth = createBasicAuthToken(username, password);
        console.log(auth)
        executeLogin(username, password)
            .then(response => {
                registerSuccessfulLogin(username, password);
                setAuthorities(response.data.authorities);
                navigate('/get_letters/0');
            })
            .catch(error => {
                console.log(error)
            });
    }

    function handleUserNameChange(event: { target: { value: any; }; }) {
        setUsername(event.target.value);
    }

    function handlePwChange(event: { target: { value: any; }; }) {
        setPassword(event.target.value);
    }

    return (
        <div>
            <form onSubmit={handleLinkSubmit}>
                <div className="row mt-5">
                    <div className='col-sm-2 mb-2'>
                        <label htmlFor="status">{t('username')}</label>
                    </div>

                    <div className='col-sm-3 mb-2'>

                        <input
                            type="text"
                            className="form-control  ml-5"
                            id="username"
                            value={username}
                            onChange={handleUserNameChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col-sm-2 mb-2'>
                        <label htmlFor="status">{t('password')}</label></div>

                    <div className='col-sm-3 mb-2'>
                        <input
                            type="password"
                            className="form-control  ml-5"
                            id="password"
                            value={password}
                            onChange={handlePwChange}
                        />
                    </div>
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton mt-5"
                    value="Submit"
                />
            </form>
        </div>
    );
}

export default Login
