/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

package nl.christine.schwartze.server.search.impl;

import nl.christine.schwartze.server.dao.LetterDao;
import nl.christine.schwartze.server.model.Letter;
import nl.christine.schwartze.server.properties.SchwartzeProperties;
import nl.christine.schwartze.server.search.SearchFiles;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.StoredFields;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.FuzzyQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component("searchFiles")
public class SearchFilesImpl implements SearchFiles
{

    private final Comparator<Letter> compareByDate;

    @Value("${defaultlanguage}")
    private String defaultLanguage;

    @Autowired
    private SchwartzeProperties properties;

    @Autowired
    private LetterDao letterDao;

    private String baseLettersDirectory;
    private String lettersDirectory;

    String indexPath;
    private String textDocumentName;

    public SearchFilesImpl()
    {
        compareByDate = Comparator
                .comparing(Letter::getDate, Comparator.nullsFirst(Comparator.naturalOrder()));
    }

    @PostConstruct
    public void init()
    {
        baseLettersDirectory = properties.getProperty("letters_directory");
        indexPath = properties.getProperty("index_directory");
        textDocumentName = properties.getProperty("text_document_name");
    }

    @Override
    public List<Letter> search(String searchTerm, String language, boolean fuzzy)
    throws Exception
    {
        lettersDirectory = baseLettersDirectory;

        String indexDir = lettersDirectory + "/" + indexPath;

        Directory dir = FSDirectory.open(Paths.get(indexDir));
        IndexReader reader = DirectoryReader.open(dir);
        IndexSearcher searcher = new IndexSearcher(reader);
        TopDocs foundDocs;
        if (fuzzy) {
            Term term = new Term(searchTerm);
            Query fuzzyQuery = new FuzzyQuery(term);
            foundDocs = searcher.search(fuzzyQuery, 10);
        }
        else {
            foundDocs = searchInContent(searchTerm, searcher);
        }

        StoredFields storedFields = reader.storedFields();
        List<Document> documents = new ArrayList<>();
        for (ScoreDoc scoreDoc : foundDocs.scoreDocs) {
            documents.add(storedFields.document(scoreDoc.doc));
        }
        return documents.stream().map(doc -> getLetter(doc)).sorted(compareByDate).collect(Collectors.toList());
    }

    private Letter getLetter(Document doc)
    {
        String stringValue = doc.getField("path").stringValue();
        String documentNumber = stringValue.substring(stringValue
                .lastIndexOf("/Schwartze/") + "Schwartze/".length() + 1, stringValue.lastIndexOf("/tekst"));
        if (documentNumber.contains("/")) {
            documentNumber = documentNumber.substring(3);
        }
        if (NumberUtils.isCreatable(documentNumber)) {
            return letterDao.getLetterForNumber(Integer.parseInt(documentNumber));
        }
        return new Letter();
    }

    private TopDocs searchInContent(String textToFind, IndexSearcher searcher)
    throws Exception
    {
        QueryParser qp = new QueryParser("contents", new StandardAnalyzer());
        Query query = qp.parse(textToFind);
        return searcher.search(query, 10);
    }
}
