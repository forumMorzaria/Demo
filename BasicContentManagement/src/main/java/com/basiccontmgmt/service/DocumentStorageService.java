package com.basiccontmgmt.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.basiccontmgmt.domain.Document;
import com.basiccontmgmt.exception.ContentManagementException;

public interface DocumentStorageService {
	
	void saveDocument(MultipartFile file, Document document) throws ContentManagementException;
	
	List<Document> getDocuments() ;
	
	void checkExistingDocuments(String documentName) throws ContentManagementException;

}
