/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

package nl.christine.schwartze.server.controller.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchRequest {

    @JsonProperty("search_term")
    private String searchTerm;

  //  @JsonProperty("language")
    private String language;

    private boolean fuzzy;

    public String getSearchTerm()
    {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public boolean isFuzzy()
    {
        return fuzzy;
    }

    public void setFuzzy(boolean fuzzy)
    {
        this.fuzzy = fuzzy;
    }

    public String getLanguage()
    {
        return language;
    }

    public void setLanguage(String language)
    {
        this.language = language;
    }
}
