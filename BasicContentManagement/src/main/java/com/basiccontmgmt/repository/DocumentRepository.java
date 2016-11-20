package com.basiccontmgmt.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.basiccontmgmt.domain.Document;

public interface DocumentRepository extends CrudRepository<Document, Long>{
	
	List<Document> findByName(String documentName);

}
