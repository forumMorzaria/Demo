package com.basiccontmgmt.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.basiccontmgmt.domain.Document;
import com.basiccontmgmt.exception.ContentManagementException;
import com.basiccontmgmt.repository.DocumentRepository;
import com.basiccontmgmt.util.Messages;

/**
 * Service implementation talks to the Data layer to perform basic crud operations.
 */
@Service
public class DocumentStorageServiceImpl implements DocumentStorageService{

	
	@Value("${uploads.root}")
	private String rootLocation;
	@Value("${uploads.path}")
	private String rootPath;
	@Autowired
	DocumentRepository documentRepo;
	@Autowired
	Messages messages;
	
	/**
	 * Here the uploaded file gets saved on a configured location and its relative path is stored in the Database.
	 * This configured path is defined as a docbase in the server.xml
	 */
	@Override
	@Transactional
	public void saveDocument(MultipartFile file, Document document) throws ContentManagementException {
		try {
            if (file.isEmpty() || document == null) {
                throw new ContentManagementException(messages.get("service.invalid.params"));
            }
            String directory = rootPath+rootLocation;
		    File newFile = Paths.get(directory, file.getOriginalFilename()).toFile();
		    newFile.getParentFile().mkdirs();
		    FileOutputStream os = new FileOutputStream(newFile);
		    os.write(file.getBytes());
		    document.setPath(rootLocation+File.separator+file.getOriginalFilename());
            documentRepo.save(document);
            os.close();
        } catch (IOException e) {
            throw new ContentManagementException(messages.get("service.failed.save"));
        }
		
		
		
	}

	/**
	 * Fetches list of all documents
	 */
	@Override
	public List<Document> getDocuments() {
		Iterable<Document> documents = documentRepo.findAll();
		List<Document> documentList = new ArrayList<Document>();
		if(documents != null){
			for(Document d : documents){
				documentList.add(d);
			}
		}
		return documentList;
	}

	/**
	 * Fetches documents by name
	 */
	@Override
	public void checkExistingDocuments(String documentName) throws ContentManagementException {
		List<Document> existingDocuments = documentRepo.findByName(documentName);
		if(existingDocuments != null && !existingDocuments.isEmpty())
			throw new ContentManagementException(messages.get("service.failed.alreadyexists"));
	}

}
