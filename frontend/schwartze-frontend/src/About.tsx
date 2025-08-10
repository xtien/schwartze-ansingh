/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import {Link} from "react-router-dom";
import {useEffect} from "react";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";

export function About() {

    const {t} = useTranslation();

    useEffect(() => {
        // Send pageview with a custom path
        ReactGA.send({ hitType: "pageview", page: "/about", title: "About Page" });
    }, [])

    return (
        <div className='container-fluid me-sm-5 ms-sm-5'>
        <div className="row align-items-start">
                <div className="textpage mt-5 m-lg-5"><p>{t('aboutText')}</p></div>
                <div className="textpage m-lg-5"><Link to={"/get_page/1/1"}>{t('more_about_site')}</Link></div>
                <div className="textpage m-lg-5"><a href="https://christine.nl/about">{t('aboutChristine')}</a></div>
            </div>
        </div>
    )
}
