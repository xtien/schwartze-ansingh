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

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component("searchFiles")
public class SearchFilesImpl implements SearchFiles
{

    private final Comparator<Letter> compareByDate;

    @Value("${nl.christine.schwartze.defaultlanguage}")
    private String defaultLanguage;
    @Value("${nl.christine.schwartze.docdir}")
    private String docDir;
    @Value("${nl.christine.schwartze.textFileName}")
    private String textFileName;

    @Autowired
    private SchwartzeProperties properties;

    @Autowired
    private LetterDao letterDao;

    private String baseLettersDirectory;
    private String lettersDirectory;

    String indexPath;

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
    }

    @Override
    public List<Letter> search(String searchTerm, String language)
    throws Exception
    {
        lettersDirectory = baseLettersDirectory;

        String indexDir = lettersDirectory + "/" + indexPath;

        Directory dir = FSDirectory.open(Paths.get(indexDir));
        IndexReader reader = DirectoryReader.open(dir);
        IndexSearcher searcher = new IndexSearcher(reader);
        TopDocs foundDocs = searchInContent(searchTerm, searcher);
        StoredFields storedFields = reader.storedFields();
        List<Document> documents = new ArrayList<>();
        for (ScoreDoc scoreDoc : foundDocs.scoreDocs) {
            documents.add(storedFields.document(scoreDoc.doc));
        }
        return deDuplicate(documents);
    }

    private List<Letter> deDuplicate(List<Document> documents)
    {
        List<Letter> list = documents
                .stream()
                .map(this::getLetter)
                .collect(Collectors.toList());
        Map<Integer, Letter> map = list
                .stream()
                .collect(Collectors.toMap(Letter::getNumber, Function.identity(), (a, b) -> a));
        return map.values().stream().sorted(compareByDate).collect(Collectors.toList());
    }

    @Override
    public List<Letter> fuzzySearch(String searchTerm, String language)
    throws Exception
    {
        // Use the same index directory as the normal search
        lettersDirectory = baseLettersDirectory;
        String indexDir = lettersDirectory + "/" + indexPath;

        Directory dir = FSDirectory.open(Paths.get(indexDir));
        IndexReader reader = DirectoryReader.open(dir);
        IndexSearcher searcher = new IndexSearcher(reader);

        // Build a fuzzy query on the contents field
        // MaxEdits 2 allows up to two edits; adjust prefix length if needed
        Term term = new Term("contents", searchTerm);
        FuzzyQuery fuzzyQuery = new FuzzyQuery(term, 2);

        TopDocs foundDocs = searcher.search(fuzzyQuery, 50);
        StoredFields storedFields = reader.storedFields();
        List<Document> documents = new ArrayList<>();
        for (ScoreDoc scoreDoc : foundDocs.scoreDocs) {
            documents.add(storedFields.document(scoreDoc.doc));
        }
        return deDuplicate(documents);
    }

    private Letter getLetter(Document doc)
    {
        String stringValue = doc.getField("path").stringValue();
        String documentNumber = stringValue.substring(stringValue
                .lastIndexOf("/" + docDir) + docDir.length() + 2, stringValue.lastIndexOf("/" + textFileName));
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
        return searcher.search(query, 50);
    }
 }
