package com.basiccontmgmt;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;

import com.basiccontmgmt.controller.BasicContMgmtController;
import com.basiccontmgmt.domain.Document;
import com.basiccontmgmt.exception.ContentManagementException;
import com.basiccontmgmt.repository.DocumentRepository;
import com.basiccontmgmt.util.Messages;

/**
 * REST API test cases
 * 1) Success
 * 2) Get all documents
 * 3) Duplicate document
 * 4) Invalid content type
 * 5) Null document
 * @author forum
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@WebAppConfiguration
public class RestAPITestCase {

	
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
	Messages messages;
	
	@Autowired
	DocumentRepository documentRepository;
	@Autowired
	BasicContMgmtController controller;
	private TestingAuthenticationToken testingAuthenticationToken;
    
    @Before
    public void setup() throws Exception {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
		User user = new User("user","password", AuthorityUtils.createAuthorityList("USER"));
        testingAuthenticationToken = new TestingAuthenticationToken(user,null);
        SecurityContextHolder.getContext().setAuthentication(testingAuthenticationToken);
        
    }
    
    /**
     * Test success scenario
     */
    @Test
    @Transactional
    public void testSuccess(){
    	
		try {
			MockMultipartFile firstFile = new MockMultipartFile("file", "filename.pdf",MediaType.APPLICATION_PDF_VALUE , "some pdf".getBytes());
			mockMvc.perform(MockMvcRequestBuilders.fileUpload("/content/upload")
					.file(firstFile).principal(testingAuthenticationToken))
                .andExpect(status().is(200));
                
		} catch (Exception e) {
			e.printStackTrace();
			Assert.fail();
		}
		
    }
    
    /**
     * Fetch list of documents
     */
    @Test
    @Rollback(false)
    @Transactional
	public void getAllDocumentsTest(){
		
    	try {
			mockMvc.perform(MockMvcRequestBuilders.fileUpload("/content/getDocuments")
					.principal(testingAuthenticationToken))
                .andExpect(status().is(200));
                
		} catch (Exception e) {
			e.printStackTrace();
			Assert.fail();
		}
	}
	
    /**
     * Test for duplicate file upload
     */
	@Test
	@Rollback(false)
	@Transactional
	public void saveDuplicateDocument(){
		Document document1 = new Document();
		document1.setName("Test1.pdf");
		documentRepository.save(document1);
		
		try {
			MockMultipartFile firstFile = new MockMultipartFile("file", "Test1.pdf",MediaType.APPLICATION_PDF_VALUE , "some pdf".getBytes());
			mockMvc.perform(MockMvcRequestBuilders.fileUpload("/content/upload")
					.file(firstFile).principal(testingAuthenticationToken))
                .andExpect(status().is5xxServerError());

			Assert.fail();
			
		}
		catch(Exception e){
			Assert.assertTrue(e.getMessage().contains(messages.get("service.failed.alreadyexists")));
		}
		finally{
			documentRepository.delete(document1);
		}
	}
    
	/**
	 * Test for invalid content type.
	 */
    @Test
	public void uploadInvalidContentTypeTest(){
		MultipartFile[] multipartFiles = getMultipartFiles(MediaType.TEXT_PLAIN_VALUE);
		try{
			controller.upload(multipartFiles);
			Assert.fail();
		}
		catch(ContentManagementException ce){
			Assert.assertEquals(messages.get("content.invalid.documenttype"), ce.getMessage());
		}
		catch(Exception e){
			Assert.fail();
		}
	}
	
    /**
     * Test for null file upload.
     */
	@Test
	public void uploadInvalidNullFile(){
		try{
			controller.upload(null);
			Assert.fail();
		}
		catch(ContentManagementException ce){
			Assert.assertEquals(messages.get("content.invalid.document"), ce.getMessage());
		}
		catch(Exception e){
			Assert.fail();
		}
	}
	
	
	private MultipartFile[] getMultipartFiles(String contentType){
		byte[] bytes=null;
		MultipartFile[] multipartFiles = new MultipartFile[1];
		MultipartFile multifile1 =  new MockMultipartFile("Test1","Test1",contentType,bytes);
		multipartFiles[0] = multifile1;
		return multipartFiles;
	}
	
	
  

}
