$(function() {
	window.onload=function(){
		

		// Get the user details
		$.ajax({
	        url: "content/getUserDetails",
	        type: "POST",         
	        
	        success: function(data,status,jqXHR) {
	            $("#username").text(data);          
	        },
	        error: function(request, status, error){
            	$("#error").text(request.responseJSON.message);
            }
	        
	    });
		// List all the documents
		getDocuments();
	}
	
	/**
	 * Lists all documents
	 */
	getDocuments=function(){
		
		var aaData = []; 
		$.ajax({
	        url: "content/getDocuments",
	        type: "POST",         
	        success: function(data,status,jqXHR) {
	        	for (i in data) {
	                aaData.push(["<a target='_blank' href="+data[i].path+" >"+data[i].name+"</a>",
	                             data[i].owner,
	                             getFormattedDate(data[i].lastModified),
	                             getFormattedSize(data[i].size)]);
	            }
	        	$('#documents').DataTable({
	        		"aaData": aaData,
	        		bDestroy: true
	        		
	        	});          
	        },
	        error: function(request, status, error){
            	$("#error").text(request.responseJSON.message);
            }
	    });
	}
	
	/**
	 * Uploads file
	 */
	upload=function(){		
		var objFormData = new FormData($('#file')[0]);
	    objFormData.append('file', $('input[type=file]')[0].files[0]);
		$.ajax({
	        url: "content/upload",
	        type: "POST",
	        contentType:false,
	        data: objFormData,
	        enctype: 'multipart/form-data',
	        processData:false,
	        success: function(data,status,jqXHR) {
	        	$("#error").hide();
	        	$("#success").text("Document uploaded.");
	        	$("#file").val("");
	        	getDocuments();
	        	
	        },
	        error: function(request, status, error){
	        	$("#success").hide();
            	$("#error").text(request.responseJSON.message);
            }
	    });
	}
	
	/**
	 * Formats date
	 * @param date
	 * @returns {String}
	 */
	getFormattedDate=function(date){
		if(date === "" | date=== undefined)
			return "";
		var formattedDate = new Date(date);
		return formattedDate.getDate() + "-" + (formattedDate.getMonth()+1) + "-" + formattedDate.getFullYear();
	}
	
	/**
	 * Formats size
	 * @param size
	 * @returns
	 */
	getFormattedSize=function(size){
		if(size=== "" | size=== undefined)
			return "";
		return Math.ceil(size/1000);
	}
	
	
		
});
