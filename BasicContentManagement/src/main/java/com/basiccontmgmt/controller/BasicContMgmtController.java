package com.basiccontmgmt.controller;

import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.basiccontmgmt.domain.Document;
import com.basiccontmgmt.exception.ContentManagementException;
import com.basiccontmgmt.service.DocumentStorageService;
import com.basiccontmgmt.util.Messages;


/**
 * REST controller defining the API for a simple content management application.
 * @author forum
 *
 */
@RestController
@EnableAutoConfiguration
@RequestMapping(value="/content")
public class BasicContMgmtController {

	@Autowired
	Messages messages;
	@Autowired
	DocumentStorageService documentService;
	
	
	@RequestMapping(value="/getUserDetails",method=RequestMethod.POST)
    public String getUserDetails() throws ContentManagementException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		if(authentication == null)
			throw new ContentManagementException(messages.get("content.auth.message"));
		return authentication.getName();
		
	}
	
	/**
	 * Lists all documents
	 * @return
	 * @throws ContentManagementException
	 */
	@RequestMapping(value="/getDocuments", method=RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Document> getDocuments() throws ContentManagementException {
		
		if(documentService.getDocuments() == null)
			throw new ContentManagementException(messages.get("content.empty.documents"));
		return documentService.getDocuments();
	}
	
	/**
	 * Uploads a file after checking for content type.
	 * Also check if document with same name exists.
	 * @param files
	 * @throws ContentManagementException
	 */
	@RequestMapping(value="/upload",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public void upload(@RequestParam("file") MultipartFile[] files ) throws ContentManagementException{
		if(files == null || files.length == 0)
			throw new ContentManagementException(messages.get("content.invalid.document"));
		MultipartFile file = files[0];
		checkFileContentType(file);
		documentService.checkExistingDocuments(file.getOriginalFilename());
		
		Document document = new Document();
        document.setName(file.getOriginalFilename());
        document.setOwner(getUserDetails());
        document.setLastModified(new Date());
        document.setSize(file.getSize());
        document.setPath(Paths.get(file.getOriginalFilename()).toString());
        documentService.saveDocument(file,document);
       
       
	}
	
	private void checkFileContentType(MultipartFile file) throws ContentManagementException{
		if(!MediaType.APPLICATION_PDF_VALUE.equals(file.getContentType()))
			throw new ContentManagementException(messages.get("content.invalid.documenttype"));
	}
	
	
}
