/*
* MIT License
*
* Copyright (c) 2011 Francisco M.S. Ferreira
* http://www.jquerylog.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
*/

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
		$.constructor = function(selector, context){
			indentLevel = 0;
			var returned = $jq(selector,context);
			log("\n$",(context===undefined ? selector : selector+" -> "+ context), returned);
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
							"contents",
							"find",
							"has", 
							"not", 
							"filter", 
							"is", 
							"index", 
							"add"];
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
		
		// missing from group: closest, andSelft

		
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
				//console.log("applied: "+name);
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