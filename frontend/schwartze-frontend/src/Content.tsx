/*
 * Copyright (c) 2028 - 2025, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */
import {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import {ContentApi, type ContentItem, type ContentRequest} from "./generated-api";
import {apiConfig} from "./service/AuthenticationService.tsx";
import {useTranslation} from "react-i18next";

const contentApi = new ContentApi(apiConfig)

function Content() {
    const {t} = useTranslation();

    const [contentList, setContentList] = useState<ContentItem[]>([]);
    const { i18n } = useTranslation();

    useEffect(() => {
        const request: ContentRequest = {
            language: i18n.language
        };
        contentApi.getContent(request).then((response) => {
            if (response.data.content != null) {
                if (response.data.content != null) {
                    setContentList(response.data.content);
                }
            }
        })
    }, []);

    const items = contentList.map(function (item) {
        const linkTo = '/get_page/' + item.chapter_number + '/' + item.page_number
        return <div><Link to={linkTo}>{item.chapter_number}. {item.chapter_title}</Link></div>
    });

    return (
        <div className='container letter'>
            <h3>{t('content')}</h3>
            <div className='mt-3 ml-3'>
                {items}
            </div>
        </div>
    )
}


export default Content
