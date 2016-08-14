(function(win){

	var links = new Array();
	links.push("/css/reunion.styles.css");

	// var cssFontLinks = new Array();
	// cssFontLinks.push("http://fonts.googleapis.com/css?family=Oswald%7CKarla:400,400italic,700,700italic");
	// cssFontLinks.push("http://fonts.googleapis.com/css?family=Average");
	
	var scripts = new Array();
	scripts.push("/javascript/reunion.js");

	var scriptsloaded = 0; 
	var cssloaded = 0; 

	var loader = new Object();
	loader.elementId = "loader";
	loader.elementMessageId = "loading_message";
	loader.classInitial = "clip";
	loader.classFinished = "right";


	var elementsToShow = new Array();

	var loadingMessages = new Object();
	loadingMessages.initial = "Loading";
	loadingMessages.finsihed = "Finished";
	loadingMessages.legacy = "Legacy Browser";


	// creates the XMLHTTP Object
	function createXMLHttpRequest() {
		try	{
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {}
		
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {}
		
		try{
			return new XMLHttpRequest();
			}
		catch(e){}
		
		return null;
	}

	function loadScript(scriptname){
		
		var xhr = createXMLHttpRequest();

		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState==4) 
			{// Request is finished
			
				if (xhr.status!=200)
				{
				}// end if 
				else{
					appendScript(xhr.responseText);
				}// end if 
			}// end main if
			else
			{	
				//showErrorPanel("An error occurred with your submission. Please contact customer support!");
			}
		}// end onreadystatechange function
		
		xhr.open("GET", scriptname, true);
		xhr.setRequestHeader("Content-type","application/javascript");
		xhr.send();
	}

	function loadCSS(linklocation){
		
		if(typeof linklocation != "undefined"){

			var xhr = createXMLHttpRequest();

			xhr.onreadystatechange = function() 
			{
				if (xhr.readyState==4) 
				{// Request is finished
				
					if (xhr.status!=200)
					{
					}// end if 
					else{
						appendCSS(xhr.responseText);
					}// end if 
				}// end main if
				else
				{	
					//showErrorPanel("An error occurred with your submission. Please contact customer support!");
				}
			}// end onreadystatechange function
			
			xhr.open("GET", linklocation, true);
			xhr.setRequestHeader("Content-type","text/css");
			xhr.send();
		}
	}

	function unclipBodyRemoveCar(){
		setTimeout(function(){
			//jquery is loaded at this point
			var ldr = document.getElementById(loader.elementId);

			if(typeof ldr != "undefined" && ldr != null){
				document.body.removeChild(ldr);
				document.body.className = "";	
			}
			
			
		},500);
	}

	function appendScript(output){
		var head = document.head || document.getElementsByTagName("head")[0];
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.text = output;
		head.appendChild(s);
		scriptsloaded++;

		//loadOtherScripts(scriptsloaded);

		if(scriptsloaded>scripts.length){

			var ele = document.getElementById(loader.elementMessageId);

			if(typeof ele != "undefined" && ele != null){
				ele.innerHTML = loadingMessages.finished;	
			}
			
		}

		if(scriptsloaded==scripts.length){
			loadCSS(links[cssloaded]);
		}
	}

	function appendCSS(output){
		var head = document.head || document.getElementsByTagName("head")[0];
		
		var dldcss = document.createElement("style");
		dldcss.text = "text/css";
		dldcss.media = "screen";
		head.appendChild(dldcss);

		if(dldcss.styleSheet){
			dldcss.styleSheet.cssText = output;
		}
		else{
			dldcss.appendChild(document.createTextNode(output));
		}

		cssloaded++;

		if(typeof links[cssloaded] != "undefined"){
			loadCSS(links[cssloaded]);
		}

		if(cssloaded==links.length){

			var ele = document.getElementById(loader.elementId);

			if(typeof ele != "undefined" && ele != null){
				ele.className=loader.classFinished;	
			}

			unclipBodyRemoveCar();
			loadCSSFontLinks();
			
			var timeout = setTimeout(function(){

				if(elementsToShow.length > 0 ){
					for(var i in elementsToShow){
						var cssele = document.querySelector(elementsToShow[i]);

						if(typeof cssele != "undefined" && cssele != null){
							cssele.style.display="block";	
						}
					}	
				}
				// else{
				// 	throw "No elements to show";
				// }
				
			},500);
		}
	}

	function loadJquery(){

		var ele = document.getElementById(loader.elementId);

		if(typeof ele != "undefined" && ele != null){
			ele.className="";
			document.getElementsByTagName("body").className=loader.classInitial;
		}

		loadScript(scripts[0]);
	}

	function loadOtherScripts(indice){
		if(typeof scripts[indice] != "undefined"){
			loadScript(scripts[indice]);
		}
	}

	//https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
	function checkForAnimations(){

		var elm = document.createElement("div");
		document.body.appendChild(elm);

		var animation = false,
		    animationstring = 'animation',
		    keyframeprefix = '',
		    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
		    pfx  = '';

		if( elm.style.animationName !== undefined ) { animation = true; }    

		if( animation === false ) {
		  for( var i = 0; i < domPrefixes.length; i++ ) {
		    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		      pfx = domPrefixes[ i ];
		      animationstring = pfx + 'Animation';
		      keyframeprefix = '-' + pfx.toLowerCase() + '-';
		      animation = true;
		      break;
		    }
		  }
		}

		document.body.removeChild(elm);
		return animation;
	}

	function loadCSSFontLinks(){
		var head = document.head || document.getElementsByTagName("head")[0];

		if(typeof cssFontLinks != "undefined"){
			for(var i =0;i<cssFontLinks.length;i++){
				var l = document.createElement("link");
				l.href = cssFontLinks[i];
				l.rel = "stylesheet";
				l.type = "text/css";
				head.appendChild(l);
			}

		}

	}
	//if( typeof window.addEventListener !="undefined" && !Boolean(navigator.userAgent.match(/msie\s(7|8|9)/i))){
	if(checkForAnimations() || Boolean(navigator.userAgent.match(/msie\s(9)/i)) ){
		document.addEventListener("DOMContentLoaded",loadJquery);
	}
	else{

		var ele1 = document.getElementById(loader.elementId);
		var ele2 = document.getElementById(loader.elementMessageId);	


		if(typeof ele != "undefined" && ele != null){
			ele1.className="";

			if(typeof ele2 != "undefined" && ele2 != null){
				ele2.innerHTML = loadingMessages.legacy;
			}

		}
	}

})();