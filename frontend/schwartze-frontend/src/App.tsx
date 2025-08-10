/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import './App.css'
import {BrowserRouter, Link, Route, Routes} from "react-router";
import {isAdmin} from "./service/AuthenticationService.tsx";
import twitli from './images/logo.png'
import Landing from "./Landing.tsx";
import Letters from "./Letters.tsx";
import LetterPage from "./LetterPage.tsx";
import TextPage from "./TextPage.tsx";
import People from "./People.tsx";
import PersonPage from "./PersonPage.tsx";
import LocationPage from "./LocationPage.tsx";
import Locations from "./Locations.tsx";
import ReferencesPage from "./ReferencesPage.tsx";
import Topics from "./Topics.tsx";
import {About} from "./About.tsx";
import PagePage from "./PagePage.tsx";
import Content from "./Content.tsx";
import Login from "./Login.tsx";
import Admin from "./Admin.tsx";
import AddPerson from "./AddPerson.tsx";
import AddLetter from "./AddLetter.tsx";
import AddLocation from "./AddLocation.tsx";
import EditLetter from "./EditLetter.tsx";
import DeleteLetter from "./DeleteLetter.tsx";
import TextEdit from "./TextEdit.tsx";
import CombinePerson from "./CombinePerson.tsx";
import CombineLocation from "./CombineLocation.tsx";
import {useEffect} from "react";
import ReactGA from 'react-ga4'
import {t} from "i18next";
import {Form} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

function App() {

    const {i18n} = useTranslation();

    useEffect(() => {
        ReactGA.initialize("G-BK9BVQ50MX");
        // Send pageview with a custom path
        ReactGA.send({hitType: "pageview", page: "/", title: "Landing Page"});
    }, [])

    const languages = [

        {
            code: "en",
            name: "en",
            countryCode: "en"
        },
        {
            code: "nl",
            name: "nl",
            countryCode: "nl"
        },
        {
            code: "de",
            name: "de",
            countryCode: "de"
        },
        {
            code: "es",
            name: "es",
            countryCode: "es"
        },
        {
            code: "fr",
            name: "fr",
            countryCode: "fr"
        },
        {
            code: "it",
            name: "it",
            countryCode: "it"
        }
    ];

    return (
        <div className='container-fluid h-auto position-absolute top-0 end-0 mt-3'>

        <BrowserRouter>
                <div className='container-fluid h-auto '>
                    <div className="d-block d-sm-none">   {/*only xs*/}
                        <div className='col float-end'>
                            <Form.Select
                                defaultValue={i18n.resolvedLanguage}
                                onChange={e => {
                                    i18n.changeLanguage(e.target.value);
                                }}
                            >
                                {languages.map(({code, name, countryCode}) => {
                                    return (
                                        <option
                                            key={countryCode}
                                            value={code}
                                        >
                                            {name}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </div>
                        <h1>{t('titel')}</h1>
                        <table className='mt-3'>
                            <tbody>
                            <tr>
                                <td>
                                    <p className='navbar-nav'>
                                        <Link to='/' className='linkStyle'>{t('home')}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_letters/0' className='linkStyle'>{t('letters')}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/get_people/'
                                                                              className='linkStyle'>{t('people')}</Link>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_locations/' className='linkStyle'>{t('locations')}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/references/' className='linkStyle'>{t('references')}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/topics/' className='linkStyle'>{t('topics')}</Link>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_page/1/1' className='linkStyle'>{t('pages')}</Link>
                                    </p>
                                </td>
                                <td>
                                    {/* Admin should only be visible after login. toggle enables Login.js
                                               to render App.js by setting its state  */}
                                    {isAdmin() === 'true' ?
                                        <p className='navbar-nav textStyle'>
                                            <Link to={'/admin/'} className='linkStyle'>{t('admin')}</Link>
                                        </p>
                                        : null}
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/about/' className='linkStyle'>{t('about')}</Link>
                                    </p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="d-none d-sm-block">   {/*  hidden below sm    */}
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div className="position-absolute top-0 end-0 m-xl-3">
                                    <Form.Select
                                        defaultValue={i18n.resolvedLanguage}
                                        onChange={e => {
                                            i18n.changeLanguage(e.target.value);
                                        }}
                                    >
                                        {languages.map(({code, name, countryCode}) => {
                                            return (
                                                <option
                                                    key={countryCode}
                                                    value={code}
                                                >
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                </div>
                                <h1 className='px-5'>{t('titel')}</h1>
                                <nav className="navbar navbar-expand-xl navbar-light px-5">
                                    <p className='navbar-nav'>
                                        <Link to='/' className='linkStyle'>{t('home')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_letters/0' className='linkStyle'>{t('letters')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_people/' className='linkStyle'>{t('people')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_locations/'
                                              className='linkStyle'>{t('locations')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/references/'
                                              className='linkStyle'>{t('references')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/topics/' className='linkStyle'>{t('topics')}</Link>
                                    </p>
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/get_page/1/1' className='linkStyle'>{t('pages')}</Link>
                                    </p>
                                    {/*Admin should only be visible after login. toggle enables Login.js to render App.js by setting its state*/}
                                    {
                                        isAdmin() === 'true' ?
                                            <p className='navbar-nav textStyle'>
                                                <Link to={'/admin/'}
                                                      className='linkStyle'>{t('admin')}</Link>
                                            </p>
                                            : null
                                    }
                                    <p className='navbar-nav textStyle'>
                                        <Link to='/about/' className='linkStyle'>{t('about')}</Link>
                                    </p>
                                </nav>
                            </td>
                            <td>
                                <img src={twitli} className="logo" alt="logo"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <hr className="hr"/>

                </div>
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/admin/" element={<Admin/>}/>
                    <Route path="/login/" element={<Login/>}/>
                    {/*<Route path="/signup/" element={<Signup/>}/>*/}
                    <Route path="/get_letters/:page" element={<Letters/>}/>
                    <Route path="/add_person/" element={<AddPerson/>}/>
                    <Route path="/add_letter/" element={<AddLetter/>}/>
                    <Route path="/edit_letter/:number" element={<EditLetter/>}/>
                    <Route path="/delete_letter/:number" element={<DeleteLetter/>}/>
                    <Route path="/add_location/" element={<AddLocation/>}/>
                    <Route path="/combine_person/:id" element={<CombinePerson/>}/>
                    <Route path="/combine_location/:id" element={<CombineLocation/>}/>
                    <Route path="/get_location_details/:id" element={<LocationPage/>}/>
                    <Route path="/get_letters_for_location/:id" element={<Letters/>}/>
                    <Route path="/get_person_details/:id" element={<PersonPage/>}/>
                    <Route path="/get_letter_details/:number/:pagenumber" element={<LetterPage/>}/>
                    <Route path="/get_letters_for_person/:id/" element={<Letters/>}/>
                    <Route path="/get_text/:entity/:id" element={<TextPage/>}/>
                    <Route path="/get_page/:chapterNumber/:pageNumber" element={<PagePage/>}/>
                    <Route path="/edit_text/:type/:id" element={<TextEdit/>}/>
                    <Route path="/get_locations/" element={<Locations/>}/>
                    <Route path="/get_people/" element={<People/>}/>
                    <Route path="/references/" element={<ReferencesPage/>}/>
                    <Route path="/topics/" element={<Topics/>}/>
                    <Route path="/search_letters/:search_term" element={<Letters/>}/>
                    <Route path="/get_content/" element={<Content/>}/>
                    <Route path="/about/" element={<About/>}/>
                </Routes>

            </BrowserRouter>
        </div>

    )
}

export default App
