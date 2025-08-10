/*
 *  * Copyright (c) 2018 - "2025", Zaphod Consulting BV, Christine Karman.
 *  This project is free software: you can redistribute it and/or modify it under the terms of the Apache License, Version 2.0. You can find a copy of the license at http://www.apache.org/licenses/LICENSE-2.0.
 *
 */

import React, {useState} from 'react'
import {LocationApi, type LocationRequest, type MyLocation} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import Table from "react-bootstrap/Table";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

const locationApi = new LocationApi(apiConfig)

function Locations() {

    const {t} = useTranslation();

    const [locations, setLocations] = useState<MyLocation[]>([])
    const navigate = useNavigate()

    React.useEffect(() => {

        const request: LocationRequest = {}

        locationApi.getLocations(request)
            .then((response) => {
                    if (response.data.locations != null) {
                        setLocations(response.data.locations);
                    }
                }
            ).catch(error => {
            console.log(error)
        })
    }, [])


    function renderLocations() {
        return locations.map(function (location) {
            const locationLink = '/get_location_details/' + location.id?.toString();
            return (
                <tr onClick={() => navigate(locationLink)}>
                    <td className='text-nowrap'>{location.id}</td>
                    <td className='text-nowrap'>{location.name}</td>
                       </tr>
            )
        })
    }

    return (
        <div className='container-fluid mt-5 me-sm-5 ms-sm-5'>
                <Table>
                    <thead>
                    <tr>
                        <th>{t('number')}</th>
                        <th>{t('name')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderLocations()}
                    </tbody>
                </Table>
            </div>

    )
}

export default Locations
