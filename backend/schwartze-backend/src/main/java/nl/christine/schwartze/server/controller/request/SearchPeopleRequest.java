/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

package nl.christine.schwartze.server.controller.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import nl.christine.schwartze.server.controller.enums.PersonOrderEnum;

public class SearchPeopleRequest {

    @JsonProperty("search_term")
    private String searchTerm;

    private PersonOrderEnum orderBy;

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public PersonOrderEnum getOrderBy()
    {
        return orderBy;
    }

    public void setOrderBy(PersonOrderEnum orderBy)
    {
        this.orderBy = orderBy;
    }
}
