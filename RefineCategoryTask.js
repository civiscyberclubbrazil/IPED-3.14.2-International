﻿/*
 * Script of Category Specialization based on item properties.
 * Uses javascript language to allow flexibility in definitions.
 */

/* Name of processing task
*/
function getName(){
	return "RefineCategoryTask";
}

function init(confProps, configFolder){}

function finish(){}

/*
 * Changes category of items based on their properties
 *
 */
function process(e){

	var categorias = e.getCategories();
	var length = e.getLength();
	var ext = e.getExt().toLowerCase();

	if(length == 0)
		e.addCategory("Empty Files");

	if(e.getExt().toLowerCase().equals("mts")){
		e.setMediaTypeStr("video/mp2t");
		e.setCategory("Videos");
	}

	if(categorias.indexOf("Images") > -1){

		if(isFromInternet(e))
			e.setCategory("Temporary Internet Images");

		else if(inSystemFolder(e))
			e.setCategory("Images in System Folders");
			
		else
			e.setCategory("Other Images");
	}

	else if(categorias.indexOf("Plain Texts") > -1){

		if(isFromInternet(e))
			e.setCategory("Temporary Internet Texts");

		else if(inSystemFolder(e))
			e.setCategory("Texts in System Folders");

		else if (ext.equals("url"))
			e.setCategory("URL links");

		else
			e.setCategory("Other Texts");
	}
	
	else if(isFromInternet(e)){
		if(e.getMediaType().toString().equals("application/x-sqlite3"))
			e.setCategory("Internet History");
	}
    
    else if(categorias.indexOf("Other files") > -1){
		var ext = e.getExt().toLowerCase();
		
		if (ext.equals("url"))
			e.setCategory("URL links");
			
		else if (ext.equals("plist")) {
			var path = e.getPath().toLowerCase();
			if (path.indexOf("/safari/") > -1) {
				var nome = e.getName().toLowerCase();
				if (nome.indexOf("history") > -1 || 
	 			   nome.indexOf("downloads") > -1 ||
	  			   nome.indexOf("lastsession") > -1 ||
	   			   nome.indexOf("topsites") > -1 || 
				   nome.indexOf("bookmarks") > -1)
					e.setCategory("Internet History");
			}
		} else {
			var nome = e.getName().toLowerCase();
			if (e.getPath().toLowerCase().indexOf("/chrome/user data/") > -1) {
				if (nome.indexOf(" session") > -1 || 
	 			   nome.indexOf(" tabs") > -1 ||
	  			   nome.indexOf("visited links") > -1 ||
	   			   nome.indexOf("history") > -1 || 
				   nome.indexOf("journal") > -1)
					e.setCategory("Internet History");
			}
		}
	}

	if(inRecycle(e))
		e.addCategory("Windows Recycle");
}


/*
 *  Auxiliar function
 */
function isFromInternet(e){
	
	var path = e.getPath();
	
	return 	path.indexOf("Temporary Internet") > -1 || 
		path.indexOf("/Microsoft/Windows/INetCache") > -1 ||
		path.indexOf("/Microsoft/Windows/INetCookies") > -1 ||
		path.indexOf("Chrome/User Data/") > -1 ||
		path.indexOf("Mozilla/Firefox/Profiles") > -1 || 
		path.indexOf("Apple Computer/Safari") > -1 ||
		path.indexOf("chromium/Default/Cache") > -1 ||
 		path.indexOf("cache/mozilla/firefox") > -1 || 
		path.indexOf("/Cookies/") > -1;
}


/*
 *  Auxiliar function
 */
function inSystemFolder(e){

	var path = e.getPath().toLowerCase();
	var idx = path.indexOf("/windows/");

	return	(idx > -1 && idx - path.indexOf("/vol_vol") - 8 <= 2) ||
		path.indexOf("arquivos de programas") > -1 ||
		path.indexOf("system volume information") > -1 ||
		path.indexOf("program files") > -1;

}

/*
 *  Auxiliar function
 */
function inRecycle(e){
	var path = e.getPath().toLowerCase();
	return 	path.indexOf("/$recycle.bin/") > -1 || path.indexOf("/recycler/") > -1;
}