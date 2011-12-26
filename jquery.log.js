(function(){
		var c = console,
			indentLevel = 0,
			doLog = false,
			executed = {},
			log = function(fname, selector , returned ){
				if(doLog === false){
					return;
				}
				var indent = "";
				for(var i=0;i<indentLevel;i++){
					indent+="\t";
				}
				c.log(indent+ fname+"("+ ((typeof selector==="string") ? "'%s'" : "%o") +"): %o", selector , returned);
			};
			var $jq = (jQuery!==undefined ? jQuery : $);
			
		// special treatment for main selector
		$ = function(selector, context){
			indentLevel = 0;
			var returned = $jq(selector,context);
			log("$",(context===undefined ? selector : selector+" -> "+ context), returned);
			return returned;
		};
		
		
		
		// replace all functions with correct log outputs (ordered by inputs)
		// the reason why every one is copied one by one is to guarantee we can customize the logging
		// depending on the arguments given or collection these functions belong to.
		// This will lead to some repeated code, but the minimizer should cut it out.
		var localNames = [	"parent",
							"parents",
							"parentsUntil",
							"next",
							"prev",
							"nextAll",
							"prevAll",
							"siblings",
							"children",
							"contents"];
		for(var i=0;i<localNames.length;i++){
			(function(){
				var name = localNames[i];
				var f = jQuery.fn[name];
				jQuery.fn[localNames[i]] = function(elem){
					indentLevel++;
					var returned = f.apply(this,arguments);
					log(name,elem, returned);
					return returned;
				};
				executed[name]= true;
			})();
		}
		
		localNames = [	"parentsUntil",
						"nextUntil", 
						"prevUntil"];
		for(var i=0;i<localNames.length;i++){
			(function(){
				var name = localNames[i];
				var f = jQuery.fn[name];
				jQuery.fn[localNames[i]] = function(elem, i, until){
					indentLevel++;
					var returned = f.apply(this,arguments);
					if(until===undefined){
						log(name,elem, returned);
					} else {
						log(name,elem+" with "+i+" filters:"+until, returned);
					}
					return returned;
				};
				executed[name]= true;
			})();
		}
		
		
		// all others till I have time to manually do them all
		for(var localName in jQuery.fn){
			if(localName in executed){
				continue;
			}
			(function(){
				var name = localName;
				var f = jQuery.fn[name];
				jQuery.fn[localNames[i]] = function(elem){
					indentLevel++;
					var returned = f.apply(this,arguments);
					log(name,elem, returned);
					return returned;
				};
				executed[name]= true;
				console.log("applied: "+name);
			})();
		}
		
		$.log = function(l){
			if(l==undefined){
				doLog = true;
			}
			doLog = l;
		}
		
		//jQuery = $;
	
	
	})();