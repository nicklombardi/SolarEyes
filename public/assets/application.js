/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
if(!AmCharts)var AmCharts={};AmCharts.inheriting={};
AmCharts.Class=function(a){var b=function(){arguments[0]!==AmCharts.inheriting&&(this.events={},this.construct.apply(this,arguments))};a.inherits?(b.prototype=new a.inherits(AmCharts.inheriting),b.base=a.inherits.prototype,delete a.inherits):(b.prototype.createEvents=function(){for(var a=0,b=arguments.length;a<b;a++)this.events[arguments[a]]=[]},b.prototype.listenTo=function(a,b,c){a.events[b].push({handler:c,scope:this})},b.prototype.addListener=function(a,b,c){this.events[a].push({handler:b,scope:c})},
b.prototype.removeListener=function(a,b,c){a=a.events[b];for(b=a.length-1;0<=b;b--)a[b].handler===c&&a.splice(b,1)},b.prototype.fire=function(a,b){for(var c=this.events[a],g=0,h=c.length;g<h;g++){var k=c[g];k.handler.call(k.scope,b)}});for(var c in a)b.prototype[c]=a[c];return b};AmCharts.charts=[];AmCharts.addChart=function(a){AmCharts.charts.push(a)};AmCharts.removeChart=function(a){for(var b=AmCharts.charts,c=b.length-1;0<=c;c--)b[c]==a&&b.splice(c,1)};AmCharts.IEversion=0;
-1!=navigator.appVersion.indexOf("MSIE")&&document.documentMode&&(AmCharts.IEversion=Number(document.documentMode));if(document.addEventListener||window.opera)AmCharts.isNN=!0,AmCharts.isIE=!1,AmCharts.dx=0.5,AmCharts.dy=0.5;document.attachEvent&&(AmCharts.isNN=!1,AmCharts.isIE=!0,9>AmCharts.IEversion&&(AmCharts.dx=0,AmCharts.dy=0));window.chrome&&(AmCharts.chrome=!0);AmCharts.handleResize=function(){for(var a=AmCharts.charts,b=0;b<a.length;b++){var c=a[b];c&&c.div&&c.handleResize()}};
AmCharts.handleMouseUp=function(a){for(var b=AmCharts.charts,c=0;c<b.length;c++){var d=b[c];d&&d.handleReleaseOutside(a)}};AmCharts.handleMouseMove=function(a){for(var b=AmCharts.charts,c=0;c<b.length;c++){var d=b[c];d&&d.handleMouseMove(a)}};AmCharts.resetMouseOver=function(){for(var a=AmCharts.charts,b=0;b<a.length;b++){var c=a[b];c&&(c.mouseIsOver=!1)}};AmCharts.onReadyArray=[];AmCharts.ready=function(a){AmCharts.onReadyArray.push(a)};
AmCharts.handleLoad=function(){for(var a=AmCharts.onReadyArray,b=0;b<a.length;b++)(0,a[b])()};AmCharts.useUTC=!1;AmCharts.updateRate=40;AmCharts.uid=0;AmCharts.getUniqueId=function(){AmCharts.uid++;return"AmChartsEl-"+AmCharts.uid};AmCharts.isNN&&(document.addEventListener("mousemove",AmCharts.handleMouseMove,!0),window.addEventListener("resize",AmCharts.handleResize,!0),document.addEventListener("mouseup",AmCharts.handleMouseUp,!0),window.addEventListener("load",AmCharts.handleLoad,!0));
AmCharts.isIE&&(document.attachEvent("onmousemove",AmCharts.handleMouseMove),window.attachEvent("onresize",AmCharts.handleResize),document.attachEvent("onmouseup",AmCharts.handleMouseUp),window.attachEvent("onload",AmCharts.handleLoad));
AmCharts.clear=function(){var a=AmCharts.charts;if(a)for(var b=0;b<a.length;b++)a[b].clear();AmCharts.charts=null;AmCharts.isNN&&(document.removeEventListener("mousemove",AmCharts.handleMouseMove,!0),window.removeEventListener("resize",AmCharts.handleResize,!0),document.removeEventListener("mouseup",AmCharts.handleMouseUp,!0),window.removeEventListener("load",AmCharts.handleLoad,!0));AmCharts.isIE&&(document.detachEvent("onmousemove",AmCharts.handleMouseMove),window.detachEvent("onresize",AmCharts.handleResize),
document.detachEvent("onmouseup",AmCharts.handleMouseUp),window.detachEvent("onload",AmCharts.handleLoad))};AmCharts.toBoolean=function(a,b){if(void 0===a)return b;switch(String(a).toLowerCase()){case "true":case "yes":case "1":return!0;case "false":case "no":case "0":case null:return!1;default:return Boolean(a)}};AmCharts.removeFromArray=function(a,b){var c;for(c=a.length-1;0<=c;c--)a[c]==b&&a.splice(c,1)};
AmCharts.getStyle=function(a,b){var c="";document.defaultView&&document.defaultView.getComputedStyle?c=document.defaultView.getComputedStyle(a,"").getPropertyValue(b):a.currentStyle&&(b=b.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()}),c=a.currentStyle[b]);return c};AmCharts.removePx=function(a){return Number(a.substring(0,a.length-2))};
AmCharts.getURL=function(a,b){if(a)if("_self"!=b&&b)if("_top"==b&&window.top)window.top.location.href=a;else if("_parent"==b&&window.parent)window.parent.location.href=a;else{var c=document.getElementsByName(b)[0];c?c.src=a:window.open(a)}else window.location.href=a};AmCharts.formatMilliseconds=function(a,b){if(-1!=a.indexOf("fff")){var c=b.getMilliseconds(),d=String(c);10>c&&(d="00"+c);10<=c&&100>c&&(d="0"+c);a=a.replace(/fff/g,d)}return a};AmCharts.ifArray=function(a){return a&&0<a.length?!0:!1};
AmCharts.callMethod=function(a,b){var c;for(c=0;c<b.length;c++){var d=b[c];if(d){if(d[a])d[a]();var f=d.length;if(0<f){var e;for(e=0;e<f;e++){var g=d[e];if(g&&g[a])g[a]()}}}}};AmCharts.toNumber=function(a){return"number"==typeof a?a:Number(String(a).replace(/[^0-9\-.]+/g,""))};
AmCharts.toColor=function(a){if(""!==a&&void 0!==a)if(-1!=a.indexOf(",")){a=a.split(",");var b;for(b=0;b<a.length;b++){var c=a[b].substring(a[b].length-6,a[b].length);a[b]="#"+c}}else a=a.substring(a.length-6,a.length),a="#"+a;return a};AmCharts.toCoordinate=function(a,b,c){var d;void 0!==a&&(a=String(a),c&&c<b&&(b=c),d=Number(a),-1!=a.indexOf("!")&&(d=b-Number(a.substr(1))),-1!=a.indexOf("%")&&(d=b*Number(a.substr(0,a.length-1))/100));return d};
AmCharts.fitToBounds=function(a,b,c){a<b&&(a=b);a>c&&(a=c);return a};AmCharts.isDefined=function(a){return void 0===a?!1:!0};AmCharts.stripNumbers=function(a){return a.replace(/[0-9]+/g,"")};AmCharts.extractPeriod=function(a){var b=AmCharts.stripNumbers(a),c=1;b!=a&&(c=Number(a.slice(0,a.indexOf(b))));return{period:b,count:c}};
AmCharts.resetDateToMin=function(a,b,c,d){void 0===d&&(d=1);var f,e,g,h,k,l,m;AmCharts.useUTC?(f=a.getUTCFullYear(),e=a.getUTCMonth(),g=a.getUTCDate(),h=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),m=a.getUTCMilliseconds(),a=a.getUTCDay()):(f=a.getFullYear(),e=a.getMonth(),g=a.getDate(),h=a.getHours(),k=a.getMinutes(),l=a.getSeconds(),m=a.getMilliseconds(),a=a.getDay());switch(b){case "YYYY":f=Math.floor(f/c)*c;e=0;g=1;m=l=k=h=0;break;case "MM":e=Math.floor(e/c)*c;g=1;m=l=k=h=0;break;case "WW":0===
a&&0<d&&(a=7);g=g-a+d;m=l=k=h=0;break;case "DD":g=Math.floor(g/c)*c;m=l=k=h=0;break;case "hh":h=Math.floor(h/c)*c;m=l=k=0;break;case "mm":k=Math.floor(k/c)*c;m=l=0;break;case "ss":l=Math.floor(l/c)*c;m=0;break;case "fff":m=Math.floor(m/c)*c}AmCharts.useUTC?(a=new Date,a.setUTCFullYear(f),a.setUTCMonth(e),a.setUTCDate(g),a.setUTCHours(h),a.setUTCMinutes(k),a.setUTCSeconds(l),a.setUTCMilliseconds(m)):a=new Date(f,e,g,h,k,l,m);return a};
AmCharts.getPeriodDuration=function(a,b){void 0===b&&(b=1);var c;switch(a){case "YYYY":c=316224E5;break;case "MM":c=26784E5;break;case "WW":c=6048E5;break;case "DD":c=864E5;break;case "hh":c=36E5;break;case "mm":c=6E4;break;case "ss":c=1E3;break;case "fff":c=1}return c*b};AmCharts.roundTo=function(a,b){if(0>b)return a;var c=Math.pow(10,b);return Math.round(a*c)/c};
AmCharts.toFixed=function(a,b){var c=String(Math.round(a*Math.pow(10,b)));if(0<b){var d=c.length;if(d<b){var f;for(f=0;f<b-d;f++)c="0"+c}d=c.substring(0,c.length-b);""===d&&(d=0);return d+"."+c.substring(c.length-b,c.length)}return String(c)};AmCharts.intervals={s:{nextInterval:"ss",contains:1E3},ss:{nextInterval:"mm",contains:60,count:0},mm:{nextInterval:"hh",contains:60,count:1},hh:{nextInterval:"DD",contains:24,count:2},DD:{nextInterval:"",contains:Infinity,count:3}};
AmCharts.getMaxInterval=function(a,b){var c=AmCharts.intervals;return a>=c[b].contains?(a=Math.round(a/c[b].contains),b=c[b].nextInterval,AmCharts.getMaxInterval(a,b)):"ss"==b?c[b].nextInterval:b};
AmCharts.formatDuration=function(a,b,c,d,f,e){var g=AmCharts.intervals,h=e.decimalSeparator;if(a>=g[b].contains){var k=a-Math.floor(a/g[b].contains)*g[b].contains;"ss"==b&&(k=AmCharts.formatNumber(k,e),1==k.split(h)[0].length&&(k="0"+k));("mm"==b||"hh"==b)&&10>k&&(k="0"+k);c=k+""+d[b]+""+c;a=Math.floor(a/g[b].contains);b=g[b].nextInterval;return AmCharts.formatDuration(a,b,c,d,f,e)}"ss"==b&&(a=AmCharts.formatNumber(a,e),1==a.split(h)[0].length&&(a="0"+a));("mm"==b||"hh"==b)&&10>a&&(a="0"+a);c=a+""+
d[b]+""+c;if(g[f].count>g[b].count)for(a=g[b].count;a<g[f].count;a++)b=g[b].nextInterval,"ss"==b||"mm"==b||"hh"==b?c="00"+d[b]+""+c:"DD"==b&&(c="0"+d[b]+""+c);":"==c.charAt(c.length-1)&&(c=c.substring(0,c.length-1));return c};
AmCharts.formatNumber=function(a,b,c,d,f){a=AmCharts.roundTo(a,b.precision);isNaN(c)&&(c=b.precision);var e=b.decimalSeparator;b=b.thousandsSeparator;var g;g=0>a?"-":"";a=Math.abs(a);var h=String(a),k=!1;-1!=h.indexOf("e")&&(k=!0);0<=c&&!k&&(h=AmCharts.toFixed(a,c));var l="";if(k)l=h;else{var h=h.split("."),k=String(h[0]),m;for(m=k.length;0<=m;m-=3)l=m!=k.length?0!==m?k.substring(m-3,m)+b+l:k.substring(m-3,m)+l:k.substring(m-3,m);void 0!==h[1]&&(l=l+e+h[1]);void 0!==c&&(0<c&&"0"!=l)&&(l=AmCharts.addZeroes(l,
e,c))}l=g+l;""===g&&(!0===d&&0!==a)&&(l="+"+l);!0===f&&(l+="%");return l};AmCharts.addZeroes=function(a,b,c){a=a.split(b);void 0===a[1]&&0<c&&(a[1]="0");return a[1].length<c?(a[1]+="0",AmCharts.addZeroes(a[0]+b+a[1],b,c)):void 0!==a[1]?a[0]+b+a[1]:a[0]};
AmCharts.scientificToNormal=function(a){var b;a=String(a).split("e");var c;if("-"==a[1].substr(0,1)){b="0.";for(c=0;c<Math.abs(Number(a[1]))-1;c++)b+="0";b+=a[0].split(".").join("")}else{var d=0;b=a[0].split(".");b[1]&&(d=b[1].length);b=a[0].split(".").join("");for(c=0;c<Math.abs(Number(a[1]))-d;c++)b+="0"}return b};
AmCharts.toScientific=function(a,b){if(0===a)return"0";var c=Math.floor(Math.log(Math.abs(a))*Math.LOG10E);Math.pow(10,c);mantissa=String(mantissa).split(".").join(b);return String(mantissa)+"e"+c};AmCharts.randomColor=function(){return"#"+("00000"+(16777216*Math.random()<<0).toString(16)).substr(-6)};
AmCharts.hitTest=function(a,b,c){var d=!1,f=a.x,e=a.x+a.width,g=a.y,h=a.y+a.height,k=AmCharts.isInRectangle;d||(d=k(f,g,b));d||(d=k(f,h,b));d||(d=k(e,g,b));d||(d=k(e,h,b));d||!0===c||(d=AmCharts.hitTest(b,a,!0));return d};AmCharts.isInRectangle=function(a,b,c){return a>=c.x-5&&a<=c.x+c.width+5&&b>=c.y-5&&b<=c.y+c.height+5?!0:!1};AmCharts.isPercents=function(a){if(-1!=String(a).indexOf("%"))return!0};AmCharts.dayNames="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames="Sun Mon Tue Wed Thu Fri Sat".split(" ");AmCharts.monthNames="January February March April May June July August September October November December".split(" ");AmCharts.shortMonthNames="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");AmCharts.getWeekNumber=function(a){a=new Date(a);a.setHours(0,0,0);a.setDate(a.getDate()+4-(a.getDay()||7));var b=new Date(a.getFullYear(),0,1);return Math.ceil(((a-b)/864E5+1)/7)};
AmCharts.formatDate=function(a,b){var c,d,f,e,g,h,k,l,m=AmCharts.getWeekNumber(a);AmCharts.useUTC?(c=a.getUTCFullYear(),d=a.getUTCMonth(),f=a.getUTCDate(),e=a.getUTCDay(),g=a.getUTCHours(),h=a.getUTCMinutes(),k=a.getUTCSeconds(),l=a.getUTCMilliseconds()):(c=a.getFullYear(),d=a.getMonth(),f=a.getDate(),e=a.getDay(),g=a.getHours(),h=a.getMinutes(),k=a.getSeconds(),l=a.getMilliseconds());var n=String(c).substr(2,2),v=d+1;9>d&&(v="0"+v);var u=f;10>f&&(u="0"+f);var y="0"+e;b=b.replace(/W/g,m);m=g;24==
m&&(m=0);var q=m;10>q&&(q="0"+q);b=b.replace(/JJ/g,q);b=b.replace(/J/g,m);m=g;0===m&&(m=24);q=m;10>q&&(q="0"+q);b=b.replace(/HH/g,q);b=b.replace(/H/g,m);m=g;11<m&&(m-=12);q=m;10>q&&(q="0"+q);b=b.replace(/KK/g,q);b=b.replace(/K/g,m);m=g;0===m&&(m=12);12<m&&(m-=12);q=m;10>q&&(q="0"+q);b=b.replace(/LL/g,q);b=b.replace(/L/g,m);m=h;10>m&&(m="0"+m);b=b.replace(/NN/g,m);b=b.replace(/N/g,h);h=k;10>h&&(h="0"+h);b=b.replace(/SS/g,h);b=b.replace(/S/g,k);k=l;10>k&&(k="00"+k);100>k&&(k="0"+k);h=l;10>h&&(h="00"+
h);b=b.replace(/QQQ/g,k);b=b.replace(/QQ/g,h);b=b.replace(/Q/g,l);b=12>g?b.replace(/A/g,"am"):b.replace(/A/g,"pm");b=b.replace(/YYYY/g,"@IIII@");b=b.replace(/YY/g,"@II@");b=b.replace(/MMMM/g,"@XXXX@");b=b.replace(/MMM/g,"@XXX@");b=b.replace(/MM/g,"@XX@");b=b.replace(/M/g,"@X@");b=b.replace(/DD/g,"@RR@");b=b.replace(/D/g,"@R@");b=b.replace(/EEEE/g,"@PPPP@");b=b.replace(/EEE/g,"@PPP@");b=b.replace(/EE/g,"@PP@");b=b.replace(/E/g,"@P@");b=b.replace(/@IIII@/g,c);b=b.replace(/@II@/g,n);b=b.replace(/@XXXX@/g,
AmCharts.monthNames[d]);b=b.replace(/@XXX@/g,AmCharts.shortMonthNames[d]);b=b.replace(/@XX@/g,v);b=b.replace(/@X@/g,d+1);b=b.replace(/@RR@/g,u);b=b.replace(/@R@/g,f);b=b.replace(/@PPPP@/g,AmCharts.dayNames[e]);b=b.replace(/@PPP@/g,AmCharts.shortDayNames[e]);b=b.replace(/@PP@/g,y);return b=b.replace(/@P@/g,e)};AmCharts.findPosX=function(a){var b=a,c=a.offsetLeft;if(a.offsetParent){for(;a=a.offsetParent;)c+=a.offsetLeft;for(;(b=b.parentNode)&&b!=document.body;)c-=b.scrollLeft||0}return c};
AmCharts.findPosY=function(a){var b=a,c=a.offsetTop;if(a.offsetParent){for(;a=a.offsetParent;)c+=a.offsetTop;for(;(b=b.parentNode)&&b!=document.body;)c-=b.scrollTop||0}return c};AmCharts.findIfFixed=function(a){if(a.offsetParent)for(;a=a.offsetParent;)if("fixed"==AmCharts.getStyle(a,"position"))return!0;return!1};AmCharts.findIfAuto=function(a){return a.style&&"auto"==AmCharts.getStyle(a,"overflow")?!0:a.parentNode?AmCharts.findIfAuto(a.parentNode):!1};
AmCharts.findScrollLeft=function(a,b){a.scrollLeft&&(b+=a.scrollLeft);return a.parentNode?AmCharts.findScrollLeft(a.parentNode,b):b};AmCharts.findScrollTop=function(a,b){a.scrollTop&&(b+=a.scrollTop);return a.parentNode?AmCharts.findScrollTop(a.parentNode,b):b};
AmCharts.formatValue=function(a,b,c,d,f,e,g,h){if(b){void 0===f&&(f="");var k;for(k=0;k<c.length;k++){var l=c[k],m=b[l];void 0!==m&&(m=e?AmCharts.addPrefix(m,h,g,d):AmCharts.formatNumber(m,d),a=a.replace(RegExp("\\[\\["+f+""+l+"\\]\\]","g"),m))}}return a};AmCharts.formatDataContextValue=function(a,b){if(a){var c=a.match(/\[\[.*?\]\]/g),d;for(d=0;d<c.length;d++){var f=c[d],f=f.substr(2,f.length-4);void 0!==b[f]&&(a=a.replace(RegExp("\\[\\["+f+"\\]\\]","g"),b[f]))}}return a};
AmCharts.massReplace=function(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];void 0===d&&(d="");a=a.replace(c,d)}return a};AmCharts.cleanFromEmpty=function(a){return a.replace(/\[\[[^\]]*\]\]/g,"")};
AmCharts.addPrefix=function(a,b,c,d,f){var e=AmCharts.formatNumber(a,d),g="",h,k,l;if(0===a)return"0";0>a&&(g="-");a=Math.abs(a);if(1<a)for(h=b.length-1;-1<h;h--){if(a>=b[h].number&&(k=a/b[h].number,l=Number(d.precision),1>l&&(l=1),c=AmCharts.roundTo(k,l),!f||k==c)){e=g+""+c+""+b[h].prefix;break}}else for(h=0;h<c.length;h++)if(a<=c[h].number){k=a/c[h].number;l=Math.abs(Math.round(Math.log(k)*Math.LOG10E));k=AmCharts.roundTo(k,l);e=g+""+k+""+c[h].prefix;break}return e};
AmCharts.remove=function(a){a&&a.remove()};AmCharts.copyProperties=function(a,b){for(var c in a)a.hasOwnProperty(c)&&"events"!=c&&(void 0!==a[c]&&"function"!=typeof a[c])&&(b[c]=a[c])};AmCharts.recommended=function(){var a="js";document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")||swfobject&&swfobject.hasFlashPlayerVersion("8")&&(a="flash");return a};
AmCharts.getEffect=function(a){">"==a&&(a="easeOutSine");"<"==a&&(a="easeInSine");"elastic"==a&&(a="easeOutElastic");return a};AmCharts.extend=function(a,b){for(var c in b)void 0!==b[c]&&(a.hasOwnProperty(c)||(a[c]=b[c]))};AmCharts.fixNewLines=function(a){if(9>AmCharts.IEversion&&0<AmCharts.IEversion){var b=RegExp("\\n","g");a&&(a=a.replace(b,"<br />"))}return a};
AmCharts.deleteObject=function(a,b){if(a){if(void 0===b||null===b)b=20;if(0!=b)if("[object Array]"===Object.prototype.toString.call(a))for(var c=0;c<a.length;c++)AmCharts.deleteObject(a[c],b-1),a[c]=null;else try{for(c in a)a[c]&&("object"==typeof a[c]&&AmCharts.deleteObject(a[c],b-1),"function"!=typeof a[c]&&(a[c]=null))}catch(d){}}};
AmCharts.changeDate=function(a,b,c,d,f){var e=-1;void 0===d&&(d=!0);void 0===f&&(f=!1);!0===d&&(e=1);switch(b){case "YYYY":a.setFullYear(a.getFullYear()+c*e);d||f||a.setDate(a.getDate()+1);break;case "MM":a.setMonth(a.getMonth()+c*e);d||f||a.setDate(a.getDate()+1);break;case "DD":a.setDate(a.getDate()+c*e);break;case "WW":a.setDate(a.getDate()+7*c*e+1);break;case "hh":a.setHours(a.getHours()+c*e);break;case "mm":a.setMinutes(a.getMinutes()+c*e);break;case "ss":a.setSeconds(a.getSeconds()+c*e);break;
case "fff":a.setMilliseconds(a.getMilliseconds()+c*e)}return a};AmCharts.AmDraw=AmCharts.Class({construct:function(a,b,c){AmCharts.SVG_NS="http://www.w3.org/2000/svg";AmCharts.SVG_XLINK="http://www.w3.org/1999/xlink";AmCharts.hasSVG=!!document.createElementNS&&!!document.createElementNS(AmCharts.SVG_NS,"svg").createSVGRect;1>b&&(b=10);1>c&&(c=10);this.div=a;this.width=b;this.height=c;this.rBin=document.createElement("div");if(AmCharts.hasSVG){AmCharts.SVG=!0;var d=this.createSvgElement("svg");d.style.position="absolute";d.style.width=b+"px";d.style.height=c+"px";
AmCharts.rtl&&(d.setAttribute("direction","rtl"),d.style.left="auto",d.style.right="0px");d.setAttribute("version","1.1");a.appendChild(d);this.container=d;this.R=new AmCharts.SVGRenderer(this)}else AmCharts.isIE&&AmCharts.VMLRenderer&&(AmCharts.VML=!0,AmCharts.vmlStyleSheet||(document.namespaces.add("amvml","urn:schemas-microsoft-com:vml"),b=document.createStyleSheet(),b.addRule(".amvml","behavior:url(#default#VML); display:inline-block; antialias:true"),AmCharts.vmlStyleSheet=b),this.container=
a,this.R=new AmCharts.VMLRenderer(this),this.R.disableSelection(a))},createSvgElement:function(a){return document.createElementNS(AmCharts.SVG_NS,a)},circle:function(a,b,c,d){var f=new AmCharts.AmDObject("circle",this);f.attr({r:c,cx:a,cy:b});this.addToContainer(f.node,d);return f},setSize:function(a,b){0<a&&0<b&&(this.container.style.width=a+"px",this.container.style.height=b+"px")},rect:function(a,b,c,d,f,e,g){var h=new AmCharts.AmDObject("rect",this);AmCharts.VML&&(f=100*f/Math.min(c,d),c+=2*e,
d+=2*e,h.bw=e,h.node.style.marginLeft=-e,h.node.style.marginTop=-e);1>c&&(c=1);1>d&&(d=1);h.attr({x:a,y:b,width:c,height:d,rx:f,ry:f,"stroke-width":e});this.addToContainer(h.node,g);return h},image:function(a,b,c,d,f,e){var g=new AmCharts.AmDObject("image",this);g.attr({x:b,y:c,width:d,height:f});this.R.path(g,a);this.addToContainer(g.node,e);return g},addToContainer:function(a,b){b||(b=this.container);b.appendChild(a)},text:function(a,b,c){return this.R.text(a,b,c)},path:function(a,b,c,d){var f=
new AmCharts.AmDObject("path",this);d||(d="100,100");f.attr({cs:d});c?f.attr({dd:a}):f.attr({d:a});this.addToContainer(f.node,b);return f},set:function(a){return this.R.set(a)},remove:function(a){if(a){var b=this.rBin;b.appendChild(a);b.innerHTML=""}},bounce:function(a,b,c,d,f){return(b/=f)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+0.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+0.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+0.984375)+c},easeInSine:function(a,b,c,d,f){return-d*Math.cos(b/f*(Math.PI/
2))+d+c},easeOutSine:function(a,b,c,d,f){return d*Math.sin(b/f*(Math.PI/2))+c},easeOutElastic:function(a,b,c,d,f){a=1.70158;var e=0,g=d;if(0===b)return c;if(1==(b/=f))return c+d;e||(e=0.3*f);g<Math.abs(d)?(g=d,a=e/4):a=e/(2*Math.PI)*Math.asin(d/g);return g*Math.pow(2,-10*b)*Math.sin((b*f-a)*2*Math.PI/e)+d+c},renderFix:function(){var a=this.container,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}a=1-c.e%1;c=1-c.f%1;0.5<a&&(a-=1);0.5<c&&(c-=1);a&&(b.left=a+"px");
c&&(b.top=c+"px")}});AmCharts.AmDObject=AmCharts.Class({construct:function(a,b){this.D=b;this.R=b.R;this.node=this.R.create(this,a);this.y=this.x=0;this.scale=1},attr:function(a){this.R.attr(this,a);return this},getAttr:function(a){return this.node.getAttribute(a)},setAttr:function(a,b){this.R.setAttr(this,a,b);return this},clipRect:function(a,b,c,d){this.R.clipRect(this,a,b,c,d)},translate:function(a,b,c,d){d||(a=Math.round(a),b=Math.round(b));this.R.move(this,a,b,c);this.x=a;this.y=b;this.scale=c;this.angle&&this.rotate(this.angle)},
rotate:function(a){this.R.rotate(this,a);this.angle=a},animate:function(a,b,c){for(var d in a)if(a.hasOwnProperty(d)){var f=d,e=a[d];c=AmCharts.getEffect(c);this.R.animate(this,f,e,b,c)}},push:function(a){if(a){var b=this.node;b.appendChild(a.node);var c=a.clipPath;c&&b.appendChild(c);(a=a.grad)&&b.appendChild(a)}},text:function(a){this.R.setText(this,a)},remove:function(){this.R.remove(this)},clear:function(){var a=this.node;if(a.hasChildNodes())for(;1<=a.childNodes.length;)a.removeChild(a.firstChild)},
hide:function(){this.setAttr("visibility","hidden")},show:function(){this.setAttr("visibility","visible")},getBBox:function(){return this.R.getBBox(this)},toFront:function(){var a=this.node;if(a){this.prevNextNode=a.nextSibling;var b=a.parentNode;b&&b.appendChild(a)}},toPrevious:function(){var a=this.node;a&&this.prevNextNode&&(a=a.parentNode)&&a.insertBefore(this.prevNextNode,null)},toBack:function(){var a=this.node;if(a){this.prevNextNode=a.nextSibling;var b=a.parentNode;if(b){var c=b.firstChild;
c&&b.insertBefore(a,c)}}},mouseover:function(a){this.R.addListener(this,"mouseover",a);return this},mouseout:function(a){this.R.addListener(this,"mouseout",a);return this},click:function(a){this.R.addListener(this,"click",a);return this},dblclick:function(a){this.R.addListener(this,"dblclick",a);return this},mousedown:function(a){this.R.addListener(this,"mousedown",a);return this},mouseup:function(a){this.R.addListener(this,"mouseup",a);return this},touchstart:function(a){this.R.addListener(this,
"touchstart",a);return this},touchend:function(a){this.R.addListener(this,"touchend",a);return this},contextmenu:function(a){this.node.addEventListener?this.node.addEventListener("contextmenu",a):this.R.addListener(this,"contextmenu",a);return this},stop:function(a){(a=this.animationX)&&AmCharts.removeFromArray(this.R.animations,a);(a=this.animationY)&&AmCharts.removeFromArray(this.R.animations,a)},length:function(){return this.node.childNodes.length},gradient:function(a,b,c){this.R.gradient(this,
a,b,c)}});AmCharts.SVGRenderer=AmCharts.Class({construct:function(a){this.D=a;this.animations=[]},create:function(a,b){return document.createElementNS(AmCharts.SVG_NS,b)},attr:function(a,b){for(var c in b)b.hasOwnProperty(c)&&this.setAttr(a,c,b[c])},setAttr:function(a,b,c){void 0!==c&&a.node.setAttribute(b,c)},animate:function(a,b,c,d,f){var e=this,g=a.node;"translate"==b?(g=(g=g.getAttribute("transform"))?String(g).substring(10,g.length-1):"0,0",g=g.split(", ").join(" "),g=g.split(" ").join(","),0===g&&(g=
"0,0")):g=g.getAttribute(b);b={obj:a,frame:0,attribute:b,from:g,to:c,time:d,effect:f};e.animations.push(b);a.animationX=b;e.interval||(e.interval=setInterval(function(){e.updateAnimations.call(e)},AmCharts.updateRate))},updateAnimations:function(){var a;for(a=this.animations.length-1;0<=a;a--){var b=this.animations[a],c=1E3*b.time/AmCharts.updateRate,d=b.frame+1,f=b.obj,e=b.attribute,g,h,k;d<=c?(b.frame++,"translate"==e?(g=b.from.split(","),e=Number(g[0]),g=Number(g[1]),h=b.to.split(","),k=Number(h[0]),
h=Number(h[1]),k=0===k-e?k:Math.round(this.D[b.effect](0,d,e,k-e,c)),b=0===h-g?h:Math.round(this.D[b.effect](0,d,g,h-g,c)),e="transform",b="translate("+k+","+b+")"):(g=Number(b.from),k=Number(b.to),k-=g,b=this.D[b.effect](0,d,g,k,c),0===k&&this.animations.splice(a,1)),this.setAttr(f,e,b)):("translate"==e?(h=b.to.split(","),k=Number(h[0]),h=Number(h[1]),f.translate(k,h)):(k=Number(b.to),this.setAttr(f,e,k)),this.animations.splice(a,1))}},getBBox:function(a){if(a=a.node)try{return a.getBBox()}catch(b){}return{width:0,
height:0,x:0,y:0}},path:function(a,b){a.node.setAttributeNS(AmCharts.SVG_XLINK,"xlink:href",b)},clipRect:function(a,b,c,d,f){var e=a.node,g=a.clipPath;g&&this.D.remove(g);var h=e.parentNode;h&&(e=document.createElementNS(AmCharts.SVG_NS,"clipPath"),g=AmCharts.getUniqueId(),e.setAttribute("id",g),this.D.rect(b,c,d,f,0,0,e),h.appendChild(e),b="#",AmCharts.baseHref&&!AmCharts.isIE&&(b=window.location.href+b),this.setAttr(a,"clip-path","url("+b+g+")"),this.clipPathC++,a.clipPath=e)},text:function(a,b,
c){var d=new AmCharts.AmDObject("text",this.D);a=String(a).split("\n");var f=b["font-size"],e;for(e=0;e<a.length;e++){var g=this.create(null,"tspan");g.appendChild(document.createTextNode(a[e]));g.setAttribute("y",(f+2)*e+f/2);g.setAttribute("x",0);d.node.appendChild(g)}d.node.setAttribute("y",f/2);this.attr(d,b);this.D.addToContainer(d.node,c);return d},setText:function(a,b){var c=a.node;c&&(c.removeChild(c.firstChild),c.appendChild(document.createTextNode(b)))},move:function(a,b,c,d){b="translate("+
b+","+c+")";d&&(b=b+" scale("+d+")");this.setAttr(a,"transform",b)},rotate:function(a,b){var c=a.node.getAttribute("transform"),d="rotate("+b+")";c&&(d=c+" "+d);this.setAttr(a,"transform",d)},set:function(a){var b=new AmCharts.AmDObject("g",this.D);this.D.container.appendChild(b.node);if(a){var c;for(c=0;c<a.length;c++)b.push(a[c])}return b},addListener:function(a,b,c){a.node["on"+b]=c},gradient:function(a,b,c,d){var f=a.node,e=a.grad;e&&this.D.remove(e);b=document.createElementNS(AmCharts.SVG_NS,
b);e=AmCharts.getUniqueId();b.setAttribute("id",e);if(!isNaN(d)){var g=0,h=0,k=0,l=0;90==d?k=100:270==d?l=100:180==d?g=100:0===d&&(h=100);b.setAttribute("x1",g+"%");b.setAttribute("x2",h+"%");b.setAttribute("y1",k+"%");b.setAttribute("y2",l+"%")}for(d=0;d<c.length;d++)g=document.createElementNS(AmCharts.SVG_NS,"stop"),h=100*d/(c.length-1),0===d&&(h=0),g.setAttribute("offset",h+"%"),g.setAttribute("stop-color",c[d]),b.appendChild(g);f.parentNode.appendChild(b);c="#";AmCharts.baseHref&&!AmCharts.isIE&&
(c=window.location.href+c);f.setAttribute("fill","url("+c+e+")");a.grad=b},remove:function(a){a.clipPath&&this.D.remove(a.clipPath);a.grad&&this.D.remove(a.grad);this.D.remove(a.node)}});AmCharts.AmChart=AmCharts.Class({construct:function(){this.version="2.10.4";AmCharts.addChart(this);this.createEvents("dataUpdated","init","rendered");this.height=this.width="100%";this.dataChanged=!0;this.chartCreated=!1;this.previousWidth=this.previousHeight=0;this.backgroundColor="#FFFFFF";this.borderAlpha=this.backgroundAlpha=0;this.color=this.borderColor="#000000";this.fontFamily="Verdana";this.fontSize=11;this.numberFormatter={precision:-1,decimalSeparator:".",thousandsSeparator:","};this.percentFormatter=
{precision:2,decimalSeparator:".",thousandsSeparator:","};this.labels=[];this.allLabels=[];this.titles=[];this.marginRight=this.marginLeft=this.autoMarginOffset=0;this.timeOuts=[];var a=document.createElement("div"),b=a.style;b.overflow="hidden";b.position="relative";b.textAlign="left";this.chartDiv=a;a=document.createElement("div");b=a.style;b.overflow="hidden";b.position="relative";b.textAlign="left";this.legendDiv=a;this.balloon=new AmCharts.AmBalloon;this.balloon.chart=this;this.titleHeight=0;
this.prefixesOfBigNumbers=[{number:1E3,prefix:"k"},{number:1E6,prefix:"M"},{number:1E9,prefix:"G"},{number:1E12,prefix:"T"},{number:1E15,prefix:"P"},{number:1E18,prefix:"E"},{number:1E21,prefix:"Z"},{number:1E24,prefix:"Y"}];this.prefixesOfSmallNumbers=[{number:1E-24,prefix:"y"},{number:1E-21,prefix:"z"},{number:1E-18,prefix:"a"},{number:1E-15,prefix:"f"},{number:1E-12,prefix:"p"},{number:1E-9,prefix:"n"},{number:1E-6,prefix:"\u03bc"},{number:0.001,prefix:"m"}];this.panEventsEnabled=!1;AmCharts.bezierX=
3;AmCharts.bezierY=6;this.product="amcharts"},drawChart:function(){this.drawBackground();this.redrawLabels();this.drawTitles()},drawBackground:function(){AmCharts.remove(this.background);var a=this.container,b=this.backgroundColor,c=this.backgroundAlpha,d=this.set,f=this.updateWidth();this.realWidth=f;var e=this.updateHeight();this.realHeight=e;this.background=b=AmCharts.polygon(a,[0,f-1,f-1,0],[0,0,e-1,e-1],b,c,1,this.borderColor,this.borderAlpha);d.push(b);if(b=this.backgroundImage)this.path&&(b=
this.path+b),this.bgImg=a=a.image(b,0,0,f,e),d.push(a)},drawTitles:function(){var a=this.titles;if(AmCharts.ifArray(a)){var b=20,c;for(c=0;c<a.length;c++){var d=a[c],f=d.color;void 0===f&&(f=this.color);var e=d.size;isNaN(d.alpha);var g=this.marginLeft,f=AmCharts.text(this.container,d.text,f,this.fontFamily,e);f.translate(g+(this.realWidth-this.marginRight-g)/2,b);g=!0;void 0!==d.bold&&(g=d.bold);g&&f.attr({"font-weight":"bold"});b+=e+6;this.freeLabelsSet.push(f)}}},write:function(a){var b=this.balloon;
b&&!b.chart&&(b.chart=this);a="object"!=typeof a?document.getElementById(a):a;a.innerHTML="";this.div=a;a.style.overflow="hidden";a.style.textAlign="left";var b=this.chartDiv,c=this.legendDiv,d=this.legend,f=c.style,e=b.style;this.measure();var g,h;if(d)switch(d.position){case "bottom":a.appendChild(b);a.appendChild(c);break;case "top":a.appendChild(c);a.appendChild(b);break;case "absolute":g=document.createElement("div");h=g.style;h.position="relative";h.width=a.style.width;h.height=a.style.height;
a.appendChild(g);f.position="absolute";e.position="absolute";void 0!==d.left&&(f.left=d.left+"px");void 0!==d.right&&(f.right=d.right+"px");void 0!==d.top&&(f.top=d.top+"px");void 0!==d.bottom&&(f.bottom=d.bottom+"px");d.marginLeft=0;d.marginRight=0;g.appendChild(b);g.appendChild(c);break;case "right":g=document.createElement("div");h=g.style;h.position="relative";h.width=a.style.width;h.height=a.style.height;a.appendChild(g);f.position="relative";e.position="absolute";g.appendChild(b);g.appendChild(c);
break;case "left":g=document.createElement("div");h=g.style;h.position="relative";h.width=a.style.width;h.height=a.style.height;a.appendChild(g);f.position="absolute";e.position="relative";g.appendChild(b);g.appendChild(c);break;case "outside":a.appendChild(b)}else a.appendChild(b);this.listenersAdded||(this.addListeners(),this.listenersAdded=!0);this.initChart()},createLabelsSet:function(){AmCharts.remove(this.labelsSet);this.labelsSet=this.container.set();this.freeLabelsSet.push(this.labelsSet)},
initChart:function(){this.divIsFixed=AmCharts.findIfFixed(this.chartDiv);this.previousHeight=this.divRealHeight;this.previousWidth=this.divRealWidth;this.destroy();var a=0;document.attachEvent&&!window.opera&&(a=1);this.dmouseX=this.dmouseY=0;var b=document.getElementsByTagName("html")[0];b&&window.getComputedStyle&&(b=window.getComputedStyle(b,null))&&(this.dmouseY=AmCharts.removePx(b.getPropertyValue("margin-top")),this.dmouseX=AmCharts.removePx(b.getPropertyValue("margin-left")));this.mouseMode=
a;this.container=new AmCharts.AmDraw(this.chartDiv,this.realWidth,this.realHeight);if(AmCharts.VML||AmCharts.SVG)a=this.container,this.set=a.set(),this.gridSet=a.set(),this.graphsBehindSet=a.set(),this.bulletBehindSet=a.set(),this.columnSet=a.set(),this.graphsSet=a.set(),this.trendLinesSet=a.set(),this.axesLabelsSet=a.set(),this.axesSet=a.set(),this.cursorSet=a.set(),this.scrollbarsSet=a.set(),this.bulletSet=a.set(),this.freeLabelsSet=a.set(),this.balloonsSet=a.set(),this.balloonsSet.setAttr("id",
"balloons"),this.zoomButtonSet=a.set(),this.linkSet=a.set(),this.drb(),this.renderFix()},measure:function(){var a=this.div,b=this.chartDiv,c=a.offsetWidth,d=a.offsetHeight,f=this.container;a.clientHeight&&(c=a.clientWidth,d=a.clientHeight);var e=AmCharts.removePx(AmCharts.getStyle(a,"padding-left")),g=AmCharts.removePx(AmCharts.getStyle(a,"padding-right")),h=AmCharts.removePx(AmCharts.getStyle(a,"padding-top")),k=AmCharts.removePx(AmCharts.getStyle(a,"padding-bottom"));isNaN(e)||(c-=e);isNaN(g)||
(c-=g);isNaN(h)||(d-=h);isNaN(k)||(d-=k);e=a.style;a=e.width;e=e.height;-1!=a.indexOf("px")&&(c=AmCharts.removePx(a));-1!=e.indexOf("px")&&(d=AmCharts.removePx(e));a=AmCharts.toCoordinate(this.width,c);e=AmCharts.toCoordinate(this.height,d);if(a!=this.previousWidth||e!=this.previousHeight)b.style.width=a+"px",b.style.height=e+"px",f&&f.setSize(a,e),this.balloon.setBounds(2,2,a-2,e);this.realWidth=a;this.realHeight=e;this.divRealWidth=c;this.divRealHeight=d},destroy:function(){this.chartDiv.innerHTML=
"";this.clearTimeOuts()},clearTimeOuts:function(){var a=this.timeOuts;if(a){var b;for(b=0;b<a.length;b++)clearTimeout(a[b])}this.timeOuts=[]},clear:function(a){AmCharts.callMethod("clear",[this.chartScrollbar,this.scrollbarV,this.scrollbarH,this.chartCursor]);this.chartCursor=this.scrollbarH=this.scrollbarV=this.chartScrollbar=null;this.clearTimeOuts();this.container&&(this.container.remove(this.chartDiv),this.container.remove(this.legendDiv));a||AmCharts.removeChart(this)},setMouseCursor:function(a){"auto"==
a&&AmCharts.isNN&&(a="default");this.chartDiv.style.cursor=a;this.legendDiv.style.cursor=a},redrawLabels:function(){this.labels=[];var a=this.allLabels;this.createLabelsSet();var b;for(b=0;b<a.length;b++)this.drawLabel(a[b])},drawLabel:function(a){if(this.container){var b=a.y,c=a.text,d=a.align,f=a.size,e=a.color,g=a.rotation,h=a.alpha,k=a.bold,l=AmCharts.toCoordinate(a.x,this.realWidth),b=AmCharts.toCoordinate(b,this.realHeight);l||(l=0);b||(b=0);void 0===e&&(e=this.color);isNaN(f)&&(f=this.fontSize);
d||(d="start");"left"==d&&(d="start");"right"==d&&(d="end");"center"==d&&(d="middle",g?b=this.realHeight-b+b/2:l=this.realWidth/2-l);void 0===h&&(h=1);void 0===g&&(g=0);b+=f/2;c=AmCharts.text(this.container,c,e,this.fontFamily,f,d,k,h);c.translate(l,b);0!==g&&c.rotate(g);a.url&&(c.setAttr("cursor","pointer"),c.click(function(){AmCharts.getURL(a.url)}));this.labelsSet.push(c);this.labels.push(c)}},addLabel:function(a,b,c,d,f,e,g,h,k,l){a={x:a,y:b,text:c,align:d,size:f,color:e,alpha:h,rotation:g,bold:k,
url:l};this.container&&this.drawLabel(a);this.allLabels.push(a)},clearLabels:function(){var a=this.labels,b;for(b=a.length-1;0<=b;b--)a[b].remove();this.labels=[];this.allLabels=[]},updateHeight:function(){var a=this.divRealHeight,b=this.legend;if(b){var c=this.legendDiv.offsetHeight,b=b.position;if("top"==b||"bottom"==b)a-=c,0>a&&(a=0),this.chartDiv.style.height=a+"px"}return a},updateWidth:function(){var a=this.divRealWidth,b=this.divRealHeight,c=this.legend;if(c){var d=this.legendDiv,f=d.offsetWidth,
e=d.offsetHeight,d=d.style,g=this.chartDiv.style,c=c.position;if("right"==c||"left"==c)a-=f,0>a&&(a=0),g.width=a+"px","left"==c?g.left=f+"px":d.left=a+"px",d.top=(b-e)/2+"px"}return a},getTitleHeight:function(){var a=0,b=this.titles;if(0<b.length){var a=15,c;for(c=0;c<b.length;c++)a+=b[c].size+6}return a},addTitle:function(a,b,c,d,f){isNaN(b)&&(b=this.fontSize+2);a={text:a,size:b,color:c,alpha:d,bold:f};this.titles.push(a);return a},addListeners:function(){var a=this,b=a.chartDiv;AmCharts.isNN&&(a.panEventsEnabled&&
"ontouchstart"in document.documentElement&&(b.addEventListener("touchstart",function(b){a.handleTouchMove.call(a,b);a.handleTouchStart.call(a,b)},!0),b.addEventListener("touchmove",function(b){a.handleTouchMove.call(a,b)},!0),b.addEventListener("touchend",function(b){a.handleTouchEnd.call(a,b)},!0)),b.addEventListener("mousedown",function(b){a.handleMouseDown.call(a,b)},!0),b.addEventListener("mouseover",function(b){a.handleMouseOver.call(a,b)},!0),b.addEventListener("mouseout",function(b){a.handleMouseOut.call(a,
b)},!0));AmCharts.isIE&&(b.attachEvent("onmousedown",function(b){a.handleMouseDown.call(a,b)}),b.attachEvent("onmouseover",function(b){a.handleMouseOver.call(a,b)}),b.attachEvent("onmouseout",function(b){a.handleMouseOut.call(a,b)}))},dispDUpd:function(){var a;this.dispatchDataUpdated&&(this.dispatchDataUpdated=!1,a="dataUpdated",this.fire(a,{type:a,chart:this}));this.chartCreated||(a="init",this.fire(a,{type:a,chart:this}));this.chartRendered||(a="rendered",this.fire(a,{type:a,chart:this}),this.chartRendered=
!0)},drb:function(){var a=this.product,b=a+".com",c=window.location.hostname.split("."),d;2<=c.length&&(d=c[c.length-2]+"."+c[c.length-1]);AmCharts.remove(this.bbset);if(d!=b){var b=b+"/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo"+a,f="chart by ",c=145;"ammap"==a&&(f="tool by ",c=125);d=AmCharts.rect(this.container,c,20,"#FFFFFF",1);f=AmCharts.text(this.container,f+a+".com","#000000","Verdana",11,"start");f.translate(7,9);d=this.container.set([d,f]);"ammap"==a&&d.translate(this.realWidth-
c,0);this.bbset=d;this.linkSet.push(d);d.setAttr("cursor","pointer");d.click(function(){window.location.href="http://"+b});for(a=0;a<d.length;a++)d[a].attr({cursor:"pointer"})}},validateSize:function(){var a=this;a.measure();var b=a.legend;if((a.realWidth!=a.previousWidth||a.realHeight!=a.previousHeight)&&0<a.realWidth&&0<a.realHeight){a.sizeChanged=!0;if(b){clearTimeout(a.legendInitTO);var c=setTimeout(function(){b.invalidateSize()},100);a.timeOuts.push(c);a.legendInitTO=c}a.marginsUpdated="xy"!=
a.chartType?!1:!0;clearTimeout(a.initTO);c=setTimeout(function(){a.initChart()},150);a.timeOuts.push(c);a.initTO=c}a.renderFix();b&&b.renderFix()},invalidateSize:function(){this.previousHeight=this.previousWidth=NaN;this.invalidateSizeReal()},invalidateSizeReal:function(){var a=this;a.marginsUpdated=!1;clearTimeout(a.validateTO);var b=setTimeout(function(){a.validateSize()},5);a.timeOuts.push(b);a.validateTO=b},validateData:function(a){this.chartCreated&&(this.dataChanged=!0,this.marginsUpdated="xy"!=
this.chartType?!1:!0,this.initChart(a))},validateNow:function(){this.listenersAdded=!1;this.write(this.div)},showItem:function(a){a.hidden=!1;this.initChart()},hideItem:function(a){a.hidden=!0;this.initChart()},hideBalloon:function(){var a=this;a.hoverInt=setTimeout(function(){a.hideBalloonReal.call(a)},80)},cleanChart:function(){},hideBalloonReal:function(){var a=this.balloon;a&&a.hide()},showBalloon:function(a,b,c,d,f){var e=this;clearTimeout(e.balloonTO);e.balloonTO=setTimeout(function(){e.showBalloonReal.call(e,
a,b,c,d,f)},1)},showBalloonReal:function(a,b,c,d,f){this.handleMouseMove();var e=this.balloon;e.enabled&&(e.followCursor(!1),e.changeColor(b),c||e.setPosition(d,f),e.followCursor(c),a&&e.showBalloon(a))},handleTouchMove:function(a){this.hideBalloon();var b=this.chartDiv;a.touches&&(a=a.touches.item(0),this.mouseX=a.pageX-AmCharts.findPosX(b),this.mouseY=a.pageY-AmCharts.findPosY(b))},handleMouseOver:function(a){AmCharts.resetMouseOver();this.mouseIsOver=!0},handleMouseOut:function(a){AmCharts.resetMouseOver();
this.mouseIsOver=!1},handleMouseMove:function(a){if(this.mouseIsOver){var b=this.chartDiv;a||(a=window.event);var c,d;if(a){this.posX=AmCharts.findPosX(b);this.posY=AmCharts.findPosY(b);switch(this.mouseMode){case 1:c=a.clientX-this.posX;d=a.clientY-this.posY;if(!this.divIsFixed){var b=document.body,f,e;b&&(f=b.scrollLeft,y1=b.scrollTop);if(b=document.documentElement)e=b.scrollLeft,y2=b.scrollTop;f=Math.max(f,e);e=Math.max(y1,y2);c+=f;d+=e}break;case 0:this.divIsFixed?(c=a.clientX-this.posX,d=a.clientY-
this.posY):(c=a.pageX-this.posX,d=a.pageY-this.posY)}a.touches&&(a=a.touches.item(0),c=a.pageX-this.posX,d=a.pageY-this.posY);this.mouseX=c-this.dmouseX;this.mouseY=d-this.dmouseY}}},handleTouchStart:function(a){this.handleMouseDown(a)},handleTouchEnd:function(a){AmCharts.resetMouseOver();this.handleReleaseOutside(a)},handleReleaseOutside:function(a){},handleMouseDown:function(a){AmCharts.resetMouseOver();this.mouseIsOver=!0;a&&a.preventDefault&&a.preventDefault()},addLegend:function(a,b){AmCharts.extend(a,
new AmCharts.AmLegend);var c;c="object"!=typeof b?document.getElementById(b):b;this.legend=a;a.chart=this;c?(a.div=c,a.position="outside",a.autoMargins=!1):a.div=this.legendDiv;c=this.handleLegendEvent;this.listenTo(a,"showItem",c);this.listenTo(a,"hideItem",c);this.listenTo(a,"clickMarker",c);this.listenTo(a,"rollOverItem",c);this.listenTo(a,"rollOutItem",c);this.listenTo(a,"rollOverMarker",c);this.listenTo(a,"rollOutMarker",c);this.listenTo(a,"clickLabel",c)},removeLegend:function(){this.legend=
void 0;this.legendDiv.innerHTML=""},handleResize:function(){(AmCharts.isPercents(this.width)||AmCharts.isPercents(this.height))&&this.invalidateSizeReal();this.renderFix()},renderFix:function(){if(!AmCharts.VML){var a=this.container;a&&a.renderFix()}},getSVG:function(){if(AmCharts.hasSVG)return this.container}});AmCharts.Slice=AmCharts.Class({construct:function(){}});AmCharts.SerialDataItem=AmCharts.Class({construct:function(){}});AmCharts.GraphDataItem=AmCharts.Class({construct:function(){}});
AmCharts.Guide=AmCharts.Class({construct:function(){}});AmCharts.AmBalloon=AmCharts.Class({construct:function(){this.enabled=!0;this.fillColor="#CC0000";this.fillAlpha=1;this.borderThickness=2;this.borderColor="#FFFFFF";this.borderAlpha=1;this.cornerRadius=6;this.maximumWidth=220;this.horizontalPadding=8;this.verticalPadding=5;this.pointerWidth=10;this.pointerOrientation="V";this.color="#FFFFFF";this.textShadowColor="#000000";this.adjustBorderColor=!1;this.showBullet=!0;this.show=this.follow=!1;this.bulletSize=3;this.textAlign="middle"},draw:function(){var a=
this.pointToX,b=this.pointToY,c=this.textAlign;if(!isNaN(a)){var d=this.chart,f=d.container,e=this.set;AmCharts.remove(e);AmCharts.remove(this.pointer);this.set=e=f.set();d.balloonsSet.push(e);if(this.show){var g=this.l,h=this.t,k=this.r,l=this.b,m=this.textShadowColor;this.color==m&&(m=void 0);var n=this.balloonColor,v=this.fillColor,u=this.borderColor;void 0!=n&&(this.adjustBorderColor?u=n:v=n);var y=this.horizontalPadding,n=this.verticalPadding,q=this.pointerWidth,r=this.pointerOrientation,s=this.cornerRadius,
t=d.fontFamily,w=this.fontSize;void 0==w&&(w=d.fontSize);d=AmCharts.text(f,this.text,this.color,t,w,c);e.push(d);var x;void 0!=m&&(x=AmCharts.text(f,this.text,m,t,w,c,!1,0.4),e.push(x));t=d.getBBox();m=t.height+2*n;t=t.width+2*y;window.opera&&(m+=2);var p,w=w/2+n;switch(c){case "middle":p=t/2;break;case "left":p=y;break;case "right":p=t-y}d.translate(p,w);x&&x.translate(p+1,w+1);"H"!=r?(p=a-t/2,c=b<h+m+10&&"down"!=r?b+q:b-m-q):(2*q>m&&(q=m/2),c=b-m/2,p=a<g+(k-g)/2?a+q:a-t-q);c+m>=l&&(c=l-m);c<h&&
(c=h);p<g&&(p=g);p+t>k&&(p=k-t);0<s||0===q?(u=AmCharts.rect(f,t,m,v,this.fillAlpha,this.borderThickness,u,this.borderAlpha,this.cornerRadius),this.showBullet&&(f=AmCharts.circle(f,this.bulletSize,v,this.fillAlpha),f.translate(a,b),this.pointer=f)):(l=[],s=[],"H"!=r?(g=a-p,g>t-q&&(g=t-q),g<q&&(g=q),l=[0,g-q,a-p,g+q,t,t,0,0],s=b<h+m+10&&"down"!=r?[0,0,b-c,0,0,m,m,0]:[m,m,b-c,m,m,0,0,m]):(h=b-c,h>m-q&&(h=m-q),h<q&&(h=q),s=[0,h-q,b-c,h+q,m,m,0,0],l=a<g+(k-g)/2?[0,0,p<a?0:a-p,0,0,t,t,0]:[t,t,p+t>a?t:a-
p,t,t,0,0,t]),u=AmCharts.polygon(f,l,s,v,this.fillAlpha,this.borderThickness,u,this.borderAlpha));e.push(u);u.toFront();x&&x.toFront();d.toFront();a=1;9>AmCharts.IEversion&&this.follow&&(a=6);e.translate(p-a,c);e=d.getBBox();this.bottom=c+e.y+e.height+2*n+2;this.yPos=e.y+c}}},followMouse:function(){if(this.follow&&this.show){var a=this.chart.mouseX,b=this.chart.mouseY-3;this.pointToX=a;this.pointToY=b;if(a!=this.previousX||b!=this.previousY)if(this.previousX=a,this.previousY=b,0===this.cornerRadius)this.draw();
else{var c=this.set;if(c){var d=c.getBBox(),a=a-d.width/2,f=b-d.height-10;a<this.l&&(a=this.l);a>this.r-d.width&&(a=this.r-d.width);f<this.t&&(f=b+10);c.translate(a,f)}}}},changeColor:function(a){this.balloonColor=a},setBounds:function(a,b,c,d){this.l=a;this.t=b;this.r=c;this.b=d},showBalloon:function(a){this.text=a;this.show=!0;this.draw()},hide:function(){this.follow=this.show=!1;this.destroy()},setPosition:function(a,b,c){this.pointToX=a;this.pointToY=b;c&&(a==this.previousX&&b==this.previousY||
this.draw());this.previousX=a;this.previousY=b},followCursor:function(a){var b=this;(b.follow=a)?(b.pShowBullet=b.showBullet,b.showBullet=!1):void 0!==b.pShowBullet&&(b.showBullet=b.pShowBullet);clearInterval(b.interval);var c=b.chart.mouseX,d=b.chart.mouseY;!isNaN(c)&&a&&(b.pointToX=c,b.pointToY=d-3,b.interval=setInterval(function(){b.followMouse.call(b)},40))},destroy:function(){clearInterval(this.interval);AmCharts.remove(this.set);this.set=null;AmCharts.remove(this.pointer);this.pointer=null}});AmCharts.circle=function(a,b,c,d,f,e,g,h){if(void 0==f||0===f)f=1;void 0===e&&(e="#000000");void 0===g&&(g=0);d={fill:c,stroke:e,"fill-opacity":d,"stroke-width":f,"stroke-opacity":g};a=a.circle(0,0,b).attr(d);h&&a.gradient("radialGradient",[c,AmCharts.adjustLuminosity(c,-0.6)]);return a};
AmCharts.text=function(a,b,c,d,f,e,g,h){e||(e="middle");"right"==e&&(e="end");AmCharts.isIE&&9>AmCharts.IEversion&&(b=b.replace("&amp;","&"),b=b.replace("&","&amp;"));c={fill:c,"font-family":d,"font-size":f,opacity:h};!0===g&&(c["font-weight"]="bold");c["text-anchor"]=e;return a.text(b,c)};
AmCharts.polygon=function(a,b,c,d,f,e,g,h,k){isNaN(e)&&(e=0);isNaN(h)&&(h=f);var l=d,m=!1;"object"==typeof l&&1<l.length&&(m=!0,l=l[0]);void 0===g&&(g=l);f={fill:l,stroke:g,"fill-opacity":f,"stroke-width":e,"stroke-opacity":h};e=AmCharts.dx;g=AmCharts.dy;h=Math.round;var l="M"+(h(b[0])+e)+","+(h(c[0])+g),n;for(n=1;n<b.length;n++)l+=" L"+(h(b[n])+e)+","+(h(c[n])+g);a=a.path(l+" Z").attr(f);m&&a.gradient("linearGradient",d,k);return a};
AmCharts.rect=function(a,b,c,d,f,e,g,h,k,l){isNaN(e)&&(e=0);void 0===k&&(k=0);void 0===l&&(l=270);isNaN(f)&&(f=0);var m=d,n=!1;"object"==typeof m&&(m=m[0],n=!0);void 0===g&&(g=m);void 0===h&&(h=f);b=Math.round(b);c=Math.round(c);var v=0,u=0;0>b&&(b=Math.abs(b),v=-b);0>c&&(c=Math.abs(c),u=-c);v+=AmCharts.dx;u+=AmCharts.dy;f={fill:m,stroke:g,"fill-opacity":f,"stroke-opacity":h};a=a.rect(v,u,b,c,k,e).attr(f);n&&a.gradient("linearGradient",d,l);return a};
AmCharts.triangle=function(a,b,c,d,f,e,g,h){if(void 0===e||0===e)e=1;void 0===g&&(g="#000");void 0===h&&(h=0);d={fill:d,stroke:g,"fill-opacity":f,"stroke-width":e,"stroke-opacity":h};b/=2;var k;0===c&&(k=" M"+-b+","+b+" L0,"+-b+" L"+b+","+b+" Z");180==c&&(k=" M"+-b+","+-b+" L0,"+b+" L"+b+","+-b+" Z");90==c&&(k=" M"+-b+","+-b+" L"+b+",0 L"+-b+","+b+" Z");270==c&&(k=" M"+-b+",0 L"+b+","+b+" L"+b+","+-b+" Z");return a.path(k).attr(d)};
AmCharts.line=function(a,b,c,d,f,e,g,h,k,l){e={fill:"none","stroke-width":e};void 0!==g&&0<g&&(e["stroke-dasharray"]=g);isNaN(f)||(e["stroke-opacity"]=f);d&&(e.stroke=d);d=Math.round;l&&(d=AmCharts.doNothing);l=AmCharts.dx;f=AmCharts.dy;g="M"+(d(b[0])+l)+","+(d(c[0])+f);for(h=1;h<b.length;h++)g+=" L"+(d(b[h])+l)+","+(d(c[h])+f);if(AmCharts.VML)return a.path(g,void 0,!0).attr(e);k&&(g+=" M0,0 L0,0");return a.path(g).attr(e)};AmCharts.doNothing=function(a){return a};
AmCharts.wedge=function(a,b,c,d,f,e,g,h,k,l,m){var n=Math.round;e=n(e);g=n(g);h=n(h);var v=n(g/e*h),u=AmCharts.VML,y=-359.5-e/100;-359.94>y&&(y=-359.94);f<=y&&(f=y);var q=1/180*Math.PI,y=b+Math.cos(d*q)*h,r=c+Math.sin(-d*q)*v,s=b+Math.cos(d*q)*e,t=c+Math.sin(-d*q)*g,w=b+Math.cos((d+f)*q)*e,x=c+Math.sin((-d-f)*q)*g,p=b+Math.cos((d+f)*q)*h,q=c+Math.sin((-d-f)*q)*v,z={fill:AmCharts.adjustLuminosity(l.fill,-0.2),"stroke-opacity":0},A=0;180<Math.abs(f)&&(A=1);d=a.set();var D;u&&(y=n(10*y),s=n(10*s),w=
n(10*w),p=n(10*p),r=n(10*r),t=n(10*t),x=n(10*x),q=n(10*q),b=n(10*b),k=n(10*k),c=n(10*c),e*=10,g*=10,h*=10,v*=10,1>Math.abs(f)&&(1>=Math.abs(w-s)&&1>=Math.abs(x-t))&&(D=!0));f="";if(0<k){u?(path=" M"+y+","+(r+k)+" L"+s+","+(t+k),D||(path+=" A"+(b-e)+","+(k+c-g)+","+(b+e)+","+(k+c+g)+","+s+","+(t+k)+","+w+","+(x+k)),path+=" L"+p+","+(q+k),0<h&&(D||(path+=" B"+(b-h)+","+(k+c-v)+","+(b+h)+","+(k+c+v)+","+p+","+(k+q)+","+y+","+(k+r)))):(path=" M"+y+","+(r+k)+" L"+s+","+(t+k),path+=" A"+e+","+g+",0,"+A+
",1,"+w+","+(x+k)+" L"+p+","+(q+k),0<h&&(path+=" A"+h+","+v+",0,"+A+",0,"+y+","+(r+k)));path+=" Z";var E=a.path(path,void 0,void 0,"1000,1000").attr(z);d.push(E);E=a.path(" M"+y+","+r+" L"+y+","+(r+k)+" L"+s+","+(t+k)+" L"+s+","+t+" L"+y+","+r+" Z",void 0,void 0,"1000,1000").attr(z);k=a.path(" M"+w+","+x+" L"+w+","+(x+k)+" L"+p+","+(q+k)+" L"+p+","+q+" L"+w+","+x+" Z",void 0,void 0,"1000,1000").attr(z);d.push(E);d.push(k)}u?(D||(f=" A"+n(b-e)+","+n(c-g)+","+n(b+e)+","+n(c+g)+","+n(s)+","+n(t)+","+
n(w)+","+n(x)),e=" M"+n(y)+","+n(r)+" L"+n(s)+","+n(t)+f+" L"+n(p)+","+n(q)):e=" M"+y+","+r+" L"+s+","+t+(" A"+e+","+g+",0,"+A+",1,"+w+","+x)+" L"+p+","+q;0<h&&(u?D||(e+=" B"+(b-h)+","+(c-v)+","+(b+h)+","+(c+v)+","+p+","+q+","+y+","+r):e+=" A"+h+","+v+",0,"+A+",0,"+y+","+r);a=a.path(e+" Z",void 0,void 0,"1000,1000").attr(l);if(m){b=[];for(c=0;c<m.length;c++)b.push(AmCharts.adjustLuminosity(l.fill,m[c]));0<b.length&&a.gradient("linearGradient",b)}d.push(a);return d};
AmCharts.adjustLuminosity=function(a,b){a=String(a).replace(/[^0-9a-f]/gi,"");6>a.length&&(a=String(a[0])+String(a[0])+String(a[1])+String(a[1])+String(a[2])+String(a[2]));b=b||0;var c="#",d,f;for(f=0;3>f;f++)d=parseInt(a.substr(2*f,2),16),d=Math.round(Math.min(Math.max(0,d+d*b),255)).toString(16),c+=("00"+d).substr(d.length);return c};AmCharts.AmLegend=AmCharts.Class({construct:function(){this.createEvents("rollOverMarker","rollOverItem","rollOutMarker","rollOutItem","showItem","hideItem","clickMarker","rollOverItem","rollOutItem","clickLabel");this.position="bottom";this.borderColor=this.color="#000000";this.borderAlpha=0;this.markerLabelGap=5;this.verticalGap=10;this.align="left";this.horizontalGap=0;this.spacing=10;this.markerDisabledColor="#AAB3B3";this.markerType="square";this.markerSize=16;this.markerBorderThickness=1;this.marginBottom=
this.marginTop=0;this.marginLeft=this.marginRight=20;this.autoMargins=!0;this.valueWidth=50;this.switchable=!0;this.switchType="x";this.switchColor="#FFFFFF";this.rollOverColor="#CC0000";this.reversedOrder=!1;this.labelText="[[title]]";this.valueText="[[value]]";this.useMarkerColorForLabels=!1;this.rollOverGraphAlpha=1;this.textClickEnabled=!1;this.equalWidths=!0;this.dateFormat="DD-MM-YYYY";this.backgroundColor="#FFFFFF";this.backgroundAlpha=0;this.showEntries=!0},setData:function(a){this.data=a;
this.invalidateSize()},invalidateSize:function(){this.destroy();this.entries=[];this.valueLabels=[];AmCharts.ifArray(this.data)&&this.drawLegend()},drawLegend:function(){var a=this.chart,b=this.position,c=this.width,d=a.divRealWidth,f=a.divRealHeight,e=this.div,g=this.data;isNaN(this.fontSize)&&(this.fontSize=a.fontSize);if("right"==b||"left"==b)this.maxColumns=1,this.marginLeft=this.marginRight=10;else if(this.autoMargins){this.marginRight=a.marginRight;this.marginLeft=a.marginLeft;var h=a.autoMarginOffset;
"bottom"==b?(this.marginBottom=h,this.marginTop=0):(this.marginTop=h,this.marginBottom=0)}c=void 0!==c?AmCharts.toCoordinate(c,d):a.realWidth;"outside"==b?(c=e.offsetWidth,f=e.offsetHeight,e.clientHeight&&(c=e.clientWidth,f=e.clientHeight)):(e.style.width=c+"px",e.className="amChartsLegend");this.divWidth=c;this.container=new AmCharts.AmDraw(e,c,f);this.lx=0;this.ly=8;b=this.markerSize;b>this.fontSize&&(this.ly=b/2-1);0<b&&(this.lx+=b+this.markerLabelGap);this.titleWidth=0;if(b=this.title)a=AmCharts.text(this.container,
b,this.color,a.fontFamily,this.fontSize,"start",!0),a.translate(this.marginLeft,this.marginTop+this.verticalGap+this.ly+1),a=a.getBBox(),this.titleWidth=a.width+15,this.titleHeight=a.height+6;this.index=this.maxLabelWidth=0;if(this.showEntries){for(a=0;a<g.length;a++)this.createEntry(g[a]);for(a=this.index=0;a<g.length;a++)this.createValue(g[a])}this.arrangeEntries();this.updateValues()},arrangeEntries:function(){var a=this.position,b=this.marginLeft+this.titleWidth,c=this.marginRight,d=this.marginTop,
f=this.marginBottom,e=this.horizontalGap,g=this.div,h=this.divWidth,k=this.maxColumns,l=this.verticalGap,m=this.spacing,n=h-c-b,v=0,u=0,y=this.container,q=y.set();this.set=q;y=y.set();q.push(y);var r=this.entries,s,t;for(t=0;t<r.length;t++){s=r[t].getBBox();var w=s.width;w>v&&(v=w);s=s.height;s>u&&(u=s)}var x=w=0,p=e;for(t=0;t<r.length;t++){var z=r[t];this.reversedOrder&&(z=r[r.length-t-1]);s=z.getBBox();var A;this.equalWidths?A=e+x*(v+m+this.markerLabelGap):(A=p,p=p+s.width+e+m);A+s.width>n&&(0<
t&&0!=x)&&(w++,x=0,A=e,p=A+s.width+e+m,skipNewRow=!0);z.translate(A,(u+l)*w);x++;!isNaN(k)&&x>=k&&(x=0,w++);y.push(z)}s=y.getBBox();k=s.height+2*l-1;"left"==a||"right"==a?(h=s.width+2*e,g.style.width=h+b+c+"px"):h=h-b-c-1;c=AmCharts.polygon(this.container,[0,h,h,0],[0,0,k,k],this.backgroundColor,this.backgroundAlpha,1,this.borderColor,this.borderAlpha);q.push(c);q.translate(b,d);c.toBack();b=e;if("top"==a||"bottom"==a||"absolute"==a||"outside"==a)"center"==this.align?b=e+(h-s.width)/2:"right"==this.align&&
(b=e+h-s.width);y.translate(b,l+1);this.titleHeight>k&&(k=this.titleHeight);a=k+d+f+1;0>a&&(a=0);g.style.height=Math.round(a)+"px"},createEntry:function(a){if(!1!==a.visibleInLegend){var b=this.chart,c=a.markerType;c||(c=this.markerType);var d=a.color,f=a.alpha;a.legendKeyColor&&(d=a.legendKeyColor());a.legendKeyAlpha&&(f=a.legendKeyAlpha());!0===a.hidden&&(d=this.markerDisabledColor);var e=this.createMarker(c,d,f);this.addListeners(e,a);f=this.container.set([e]);this.switchable&&f.setAttr("cursor",
"pointer");var g=this.switchType;if(g){var h;h="x"==g?this.createX():this.createV();h.dItem=a;!0!==a.hidden?"x"==g?h.hide():h.show():"x"!=g&&h.hide();this.switchable||h.hide();this.addListeners(h,a);a.legendSwitch=h;f.push(h)}g=this.color;a.showBalloon&&(this.textClickEnabled&&void 0!==this.selectedColor)&&(g=this.selectedColor);this.useMarkerColorForLabels&&(g=d);!0===a.hidden&&(g=this.markerDisabledColor);var d=AmCharts.massReplace(this.labelText,{"[[title]]":a.title}),k=this.fontSize,l=this.markerSize;
if(e&&l<=k){var m=0;if("bubble"==c||"circle"==c)m=l/2;c=m+this.ly-k/2+(k+2-l)/2;e.translate(m,c);h&&h.translate(m,c)}var n;d&&(d=AmCharts.fixNewLines(d),n=AmCharts.text(this.container,d,g,b.fontFamily,k,"start"),n.translate(this.lx,this.ly),f.push(n),b=n.getBBox().width,this.maxLabelWidth<b&&(this.maxLabelWidth=b));this.entries[this.index]=f;a.legendEntry=this.entries[this.index];a.legendLabel=n;this.index++}},addListeners:function(a,b){var c=this;a&&a.mouseover(function(){c.rollOverMarker(b)}).mouseout(function(){c.rollOutMarker(b)}).click(function(){c.clickMarker(b)})},
rollOverMarker:function(a){this.switchable&&this.dispatch("rollOverMarker",a);this.dispatch("rollOverItem",a)},rollOutMarker:function(a){this.switchable&&this.dispatch("rollOutMarker",a);this.dispatch("rollOutItem",a)},clickMarker:function(a){this.switchable?!0===a.hidden?this.dispatch("showItem",a):this.dispatch("hideItem",a):this.textClickEnabled&&this.dispatch("clickMarker",a)},rollOverLabel:function(a){a.hidden||(this.textClickEnabled&&a.legendLabel&&a.legendLabel.attr({fill:this.rollOverColor}),
this.dispatch("rollOverItem",a))},rollOutLabel:function(a){if(!a.hidden){if(this.textClickEnabled&&a.legendLabel){var b=this.color;void 0!==this.selectedColor&&a.showBalloon&&(b=this.selectedColor);this.useMarkerColorForLabels&&(b=a.lineColor,void 0===b&&(b=a.color));a.legendLabel.attr({fill:b})}this.dispatch("rollOutItem",a)}},clickLabel:function(a){this.textClickEnabled?a.hidden||this.dispatch("clickLabel",a):this.switchable&&(!0===a.hidden?this.dispatch("showItem",a):this.dispatch("hideItem",a))},
dispatch:function(a,b){this.fire(a,{type:a,dataItem:b,target:this,chart:this.chart})},createValue:function(a){var b=this,c=b.fontSize;if(!1!==a.visibleInLegend){var d=b.maxLabelWidth;b.equalWidths||(b.valueAlign="left");"left"==b.valueAlign&&(d=a.legendEntry.getBBox().width);var f=d;if(b.valueText){var e=b.color;b.useMarkerColorForValues&&(e=a.color,a.legendKeyColor&&(e=a.legendKeyColor()));!0===a.hidden&&(e=b.markerDisabledColor);var g=b.valueText,d=d+b.lx+b.markerLabelGap+b.valueWidth,h="end";"left"==
b.valueAlign&&(d-=b.valueWidth,h="start");e=AmCharts.text(b.container,g,e,b.chart.fontFamily,c,h);e.translate(d,b.ly);b.entries[b.index].push(e);f+=b.valueWidth+2*b.markerLabelGap;e.dItem=a;b.valueLabels.push(e)}b.index++;e=b.markerSize;e<c+7&&(e=c+7,AmCharts.VML&&(e+=3));c=b.container.rect(b.markerSize,0,f,e,0,0).attr({stroke:"none",fill:"#ffffff","fill-opacity":0.005});c.dItem=a;b.entries[b.index-1].push(c);c.mouseover(function(){b.rollOverLabel(a)}).mouseout(function(){b.rollOutLabel(a)}).click(function(){b.clickLabel(a)})}},
createV:function(){var a=this.markerSize;return AmCharts.polygon(this.container,[a/5,a/2,a-a/5,a/2],[a/3,a-a/5,a/5,a/1.7],this.switchColor)},createX:function(){var a=this.markerSize-3,b={stroke:this.switchColor,"stroke-width":3},c=this.container,d=AmCharts.line(c,[3,a],[3,a]).attr(b),a=AmCharts.line(c,[3,a],[a,3]).attr(b);return this.container.set([d,a])},createMarker:function(a,b,c){var d=this.markerSize,f=this.container,e,g=this.markerBorderColor;g||(g=b);var h=this.markerBorderThickness,k=this.markerBorderAlpha;
switch(a){case "square":e=AmCharts.polygon(f,[0,d,d,0],[0,0,d,d],b,c,h,g,k);break;case "circle":e=AmCharts.circle(f,d/2,b,c,h,g,k);e.translate(d/2,d/2);break;case "line":e=AmCharts.line(f,[0,d],[d/2,d/2],b,c,h);break;case "dashedLine":e=AmCharts.line(f,[0,d],[d/2,d/2],b,c,h,3);break;case "triangleUp":e=AmCharts.polygon(f,[0,d/2,d,d],[d,0,d,d],b,c,h,g,k);break;case "triangleDown":e=AmCharts.polygon(f,[0,d/2,d,d],[0,d,0,0],b,c,h,g,k);break;case "bubble":e=AmCharts.circle(f,d/2,b,c,h,g,k,!0),e.translate(d/
2,d/2)}return e},validateNow:function(){this.invalidateSize()},updateValues:function(){var a=this.valueLabels,b=this.chart,c;for(c=0;c<a.length;c++){var d=a[c],f=d.dItem;if(void 0!==f.type){var e=f.currentDataItem;if(e){var g=this.valueText;f.legendValueText&&(g=f.legendValueText);f=g;f=b.formatString(f,e);d.text(f)}else d.text(" ")}else e=b.formatString(this.valueText,f),d.text(e)}},renderFix:function(){if(!AmCharts.VML){var a=this.container;a&&a.renderFix()}},destroy:function(){this.div.innerHTML=
"";AmCharts.remove(this.set)}});AmCharts.maps={};
AmCharts.AmMap=AmCharts.Class({inherits:AmCharts.AmChart,construct:function(){this.version="3.3.3";this.svgNotSupported="This browser doesn't support SVG. Use Chrome, Firefox, Internet Explorer 9 or later.";this.createEvents("rollOverMapObject","rollOutMapObject","clickMapObject","selectedObjectChanged","homeButtonClicked","zoomCompleted","writeDevInfo","click");this.zoomDuration=1;this.zoomControl=new AmCharts.ZoomControl;this.fitMapToContainer=!0;this.mouseWheelZoomEnabled=this.backgroundZoomsToTop=!1;
this.allowClickOnSelectedObject=this.useHandCursorOnClickableOjects=this.showBalloonOnSelectedObject=!0;this.showObjectsAfterZoom=this.wheelBusy=!1;this.zoomOnDoubleClick=this.useObjectColorForBalloon=!0;this.allowMultipleDescriptionWindows=!1;this.dragMap=this.centerMap=this.linesAboveImages=!0;this.colorSteps=5;this.showAreasInList=!0;this.showLinesInList=this.showImagesInList=!1;this.areasProcessor=new AmCharts.AreasProcessor(this);this.areasSettings=new AmCharts.AreasSettings;this.imagesProcessor=
new AmCharts.ImagesProcessor(this);this.imagesSettings=new AmCharts.ImagesSettings;this.linesProcessor=new AmCharts.LinesProcessor(this);this.linesSettings=new AmCharts.LinesSettings;this.showDescriptionOnHover=!1;AmCharts.AmMap.base.construct.call(this);this.product="ammap";AmCharts.bezierX=3;AmCharts.bezierY=3;AmCharts.dx=0.5;AmCharts.dy=0.5},initChart:function(){this.zoomInstantly=!0;if(this.sizeChanged&&AmCharts.hasSVG&&this.chartCreated){this.container.setSize(this.realWidth,this.realHeight);
this.resizeMap();this.drawBackground();this.redrawLabels();this.drawTitles();this.processObjects();this.rescaleObjects();var a=this.container;this.zoomControl.init(this,a);this.drawBg();var b=this.smallMap;b&&b.init(this,a);(b=this.valueLegend)&&b.init(this,a);this.sizeChanged=!1;this.zoomToLongLat(this.zLevelTemp,this.zLongTemp,this.zLatTemp,!0);this.previousWidth=this.realWidth;this.previousHeight=this.realHeight;this.drb();this.updateSmallMap();this.linkSet.toFront()}else(AmCharts.AmMap.base.initChart.call(this),
AmCharts.hasSVG)?(this.dataChanged&&(this.parseData(),this.dispatchDataUpdated=!0,this.dataChanged=!1,a=this.legend)&&(a.position="absolute",a.invalidateSize()),this.addMouseWheel(),this.createDescriptionsDiv(),this.svgAreas=[],this.svgAreasById={},this.drawChart()):(document.createTextNode(this.svgNotSupported),this.chartDiv.style.textAlign="",this.chartDiv.setAttribute("class","ammapAlert"),this.chartDiv.innerHTML=this.svgNotSupported)},invalidateSize:function(){var a=this.zoomLongitude();isNaN(a)||
(this.zLongTemp=a);a=this.zoomLatitude();isNaN(a)||(this.zLatTemp=a);a=this.zoomLevel();isNaN(a)||(this.zLevelTemp=a);AmCharts.AmMap.base.invalidateSize.call(this)},addMouseWheel:function(){var a=this;a.mouseWheelZoomEnabled&&window.addEventListener&&(window.addEventListener("DOMMouseScroll",function(b){a.handleWheel.call(a,b)},!1),document.addEventListener("mousewheel",function(b){a.handleWheel.call(a,b)},!1))},handleWheel:function(a){if(this.mouseIsOver){var b=0;a||(a=window.event);a.wheelDelta?
b=a.wheelDelta/120:a.detail&&(b=-a.detail/3);b&&this.handleWheelReal(b);a.preventDefault&&a.preventDefault();a.returnValue=!1}},handleWheelReal:function(a){if(!this.wheelBusy){this.stopAnimation();var b=this.zoomLevel(),c=this.zoomControl,d=c.zoomFactor;this.wheelBusy=!0;a=AmCharts.fitToBounds(0<a?b*d:b/d,c.minZoomLevel,c.maxZoomLevel);d=this.mouseX/this.mapWidth;c=this.mouseY/this.mapHeight;d=(this.zoomX()-d)*(a/b)+d;b=(this.zoomY()-c)*(a/b)+c;this.zoomTo(a,d,b)}},addLegend:function(a){a.position=
"absolute";a.autoMargins=!1;a.valueWidth=0;a.switchable=!1;AmCharts.AmMap.base.addLegend.call(this,a)},handleLegendEvent:function(){},createDescriptionsDiv:function(){if(!this.descriptionsDiv){var a=document.createElement("div");a.style.position="absolute";a.style.left=AmCharts.findPosX(this.div)+"px";a.style.top=AmCharts.findPosY(this.div)+"px";this.descriptionsDiv=a}this.div.appendChild(this.descriptionsDiv)},drawChart:function(){AmCharts.AmMap.base.drawChart.call(this);var a=this.dataProvider;
AmCharts.extend(a,new AmCharts.MapData);AmCharts.extend(this.areasSettings,new AmCharts.AreasSettings);AmCharts.extend(this.imagesSettings,new AmCharts.ImagesSettings);AmCharts.extend(this.linesSettings,new AmCharts.LinesSettings);this.mapContainer=this.container.set();this.graphsSet.push(this.mapContainer);var b=a.mapVar;b?(this.svgData=b.svg,this.getBounds(),this.buildEverything()):(a=a.mapURL)&&this.loadXml(a);this.balloonsSet.toFront()},drawBg:function(){var a=this;AmCharts.remove(a.bgSet);var b=
AmCharts.rect(a.container,a.realWidth,a.realHeight,"#000",0.001);b.click(function(){a.handleBackgroundClick()});a.bgSet=b;a.set.push(b)},buildEverything:function(){var a=this;if(0<a.realWidth&&0<a.realHeight){var b=a.container;a.zoomControl.init(this,b);a.drawBg();a.buildSVGMap();var c=a.smallMap;c&&c.init(a,b);c=a.dataProvider;isNaN(c.zoomX)&&(isNaN(c.zoomY)&&isNaN(c.zoomLatitude)&&isNaN(c.zoomLongitude))&&(a.centerMap?(c.zoomLatitude=a.coordinateToLatitude(a.mapHeight/2),c.zoomLongitude=a.coordinateToLongitude(a.mapWidth/
2)):(c.zoomX=0,c.zoomY=0),a.zoomInstantly=!0);a.selectObject(a.dataProvider);a.processAreas();(c=a.valueLegend)&&c.init(a,b);if(b=a.objectList)a.clearObjectList(),b.init(a);clearInterval(a.interval);a.interval=setInterval(function(){a.update.call(a)},AmCharts.updateRate);a.dispDUpd();a.linkSet.toFront();a.chartCreated=!0}else a.cleanChart()},hideGroup:function(a){this.showHideGroup(a,!1)},showGroup:function(a){this.showHideGroup(a,!0)},showHideGroup:function(a,b){this.showHideReal(this.imagesProcessor.allObjects,
a,b);this.showHideReal(this.areasProcessor.allObjects,a,b);this.showHideReal(this.linesProcessor.allObjects,a,b)},showHideReal:function(a,b,c){var d;for(d=0;d<a.length;d++){var f=a[d];f.groupId==b&&(c?f.displayObject.show():f.displayObject.hide())}},update:function(){this.zoomControl.update()},animateMap:function(){var a=this;a.totalFrames=1E3*a.zoomDuration/AmCharts.updateRate;a.totalFrames+=1;a.frame=0;a.tweenPercent=0;setTimeout(function(){a.updateSize.call(a)},AmCharts.updateRate)},updateSize:function(){var a=
this,b=a.totalFrames;a.frame<=b?(a.frame++,b=a.container.easeOutSine(0,a.frame,0,1,b),1<=b?(b=1,a.wheelBusy=!1):setTimeout(function(){a.updateSize.call(a)},AmCharts.updateRate)):(b=1,a.wheelBusy=!1);a.tweenPercent=b;a.rescaleMapAndObjects()},rescaleMapAndObjects:function(){var a=this.initialScale,b=this.initialX,c=this.initialY,d=this.tweenPercent;this.mapContainer.translate(b+(this.finalX-b)*d,c+(this.finalY-c)*d,a+(this.finalScale-a)*d);this.rescaleObjects();this.updateSmallMap();1==d&&(a={type:"zoomCompleted",
chart:this},this.fire(a.type,a))},updateSmallMap:function(){this.smallMap&&this.smallMap.update()},rescaleObjects:function(){var a=this.mapContainer.scale,b=this.imagesProcessor.objectsToResize,c;for(c=0;c<b.length;c++){var d=b[c].image;d.translate(d.x,d.y,b[c].scale/a,!0)}b=this.linesProcessor;if(d=b.linesToResize)for(c=0;c<d.length;c++){var f=d[c];f.line.setAttr("stroke-width",f.thickness/a)}b=b.objectsToResize;for(c=0;c<b.length;c++)d=b[c],d.translate(d.x,d.y,1/a)},handleTouchStart:function(a){this.handleMouseMove(a);
this.handleMouseDown(a)},handleTouchEnd:function(a){this.previousDistance=NaN;this.handleReleaseOutside(a)},handleMouseDown:function(a){if(this.chartCreated&&this.mouseIsOver&&(AmCharts.resetMouseOver(),this.mouseIsOver=!0,this.dragMap&&(this.stopAnimation(),this.isDragging=!0,this.mapContainerClickX=this.mapContainer.x,this.mapContainerClickY=this.mapContainer.y,this.panEventsEnabled||a&&a.preventDefault&&a.preventDefault()),a||(a=window.event),a.shiftKey&&!0===this.developerMode&&this.getDevInfo(),
a&&a.touches)){var b=this.mouseX,c=this.mouseY,d=a.touches.item(1);d&&(a=d.pageX-AmCharts.findPosX(this.div),d=d.pageY-AmCharts.findPosY(this.div),this.middleXP=(b+(a-b)/2)/this.realWidth,this.middleYP=(c+(d-c)/2)/this.realHeight)}},stopDrag:function(){this.isDragging=!1},handleReleaseOutside:function(){this.isDragging=!1;this.zoomControl.draggerUp();this.mapWasDragged=!1;var a=this.mapContainer,b=this.mapContainerClickX,c=this.mapContainerClickY;isNaN(b)||isNaN(c)||!(2<Math.abs(a.x-b)||Math.abs(a.y-
c))||(this.mapWasDragged=!0);!this.mouseIsOver||(this.mapWasDragged||this.skipClick)||(a={type:"click",x:this.mouseX,y:this.mouseY,chart:this},this.fire(a.type,a),this.skipClick=!1);this.mapContainerClickY=this.mapContainerClickX=NaN;this.objectWasClicked=!1;this.zoomOnDoubleClick&&this.mouseIsOver&&(a=(new Date).getTime(),200>a-this.previousClickTime&&20<a-this.previousClickTime&&this.doDoubleClickZoom(),this.previousClickTime=a)},handleTouchMove:function(a){this.handleMouseMove(a)},resetPinch:function(){this.mapWasPinched=
!1},handleMouseMove:function(a){var b=this;AmCharts.AmMap.base.handleMouseMove.call(b,a);var c=b.previuosMouseX,d=b.previuosMouseY,f=b.mouseX,e=b.mouseY;isNaN(c)&&(c=f);isNaN(d)&&(d=e);b.mouse2X=NaN;b.mouse2Y=NaN;if(a&&a.touches){var g=a.touches.item(1);g&&(b.mouse2X=g.pageX-AmCharts.findPosX(b.div),b.mouse2Y=g.pageY-AmCharts.findPosY(b.div))}var g=b.mapContainer,h=b.mouse2X,k=b.mouse2Y;b.pinchTO&&clearTimeout(b.pinchTO);b.pinchTO=setTimeout(function(){b.resetPinch.call(b)},1E3);if(!isNaN(h)){b.isDragging=
!1;a.preventDefault&&a.preventDefault();var h=Math.sqrt(Math.pow(h-f,2)+Math.pow(k-e,2)),l=b.previousDistance,k=Math.max(b.realWidth,b.realHeight);5>Math.abs(l-h)&&(b.isDragging=!0);if(!isNaN(l)){var m=5*Math.abs(l-h)/k,k=g.scale,k=l<h?k+k*m:k-k*m,l=b.zoomLevel(),n=b.middleXP,m=b.middleYP,v=b.realHeight/b.mapHeight,u=b.realWidth/b.mapWidth,n=(b.zoomX()-n*u)*(k/l)+n*u,m=(b.zoomY()-m*v)*(k/l)+m*v;0.1<Math.abs(k-l)&&(b.zoomTo(k,n,m,!0),b.mapWasPinched=!0,clearTimeout(b.pinchTO))}b.previousDistance=h}b.isDragging&&
(b.hideBalloon(),g.translate(g.x+(f-c),g.y+(e-d),g.scale),b.updateSmallMap(),a&&a.preventDefault&&a.preventDefault());b.previuosMouseX=f;b.previuosMouseY=e},selectObject:function(a){var b=this;a||(a=b.dataProvider);var c=a.linkToObject;a.useTargetsZoomValues&&c&&(a.zoomX=c.zoomX,a.zoomY=c.zoomY,a.zoomLatitude=c.zoomLatitude,a.zoomLongitude=c.zoomLongitude,a.zoomLevel=c.zoomLevel);var d=b.selectedObject;d&&b.returnInitialColor(d);b.selectedObject=a;var f=!1;"MapArea"==a.objectType&&a.autoZoomReal&&
(f=!0);if(c&&!f&&("string"==typeof c&&(c=b.getObjectById(c)),isNaN(a.zoomLevel)&&isNaN(a.zoomX)&&isNaN(a.zoomY))){if(b.extendMapData(c))return;b.selectObject(c);return}b.allowMultipleDescriptionWindows||b.closeAllDescriptions();clearTimeout(b.selectedObjectTimeOut);clearTimeout(b.processObjectsTimeOut);c=b.zoomDuration;!f&&isNaN(a.zoomLevel)&&isNaN(a.zoomX)&&isNaN(a.zoomY)?(b.showDescriptionAndGetUrl(),b.processObjects()):(b.selectedObjectTimeOut=setTimeout(function(){b.showDescriptionAndGetUrl.call(b)},
1E3*c+200),b.showObjectsAfterZoom?b.processObjectsTimeOut=setTimeout(function(){b.processObjects.call(b)},1E3*c+200):b.processObjects());c=a.displayObject;f=b.areasSettings.selectedOutlineColor;if(c){c.toFront();c.setAttr("stroke",a.outlineColorReal);var e=a.selectedColorReal;void 0!==e&&c.setAttr("fill",e);void 0!==f&&c.setAttr("stroke",f);if(e=a.imageLabel){var g=a.selectedLabelColorReal;void 0!==g&&e.setAttr("fill",g)}a.selectable||(c.setAttr("cursor","default"),e&&e.setAttr("cursor","default"))}else b.returnInitialColorReal(a);
if(c=a.groupId)for(e=b.getGroupById(c),g=0;g<e.length;g++){var h=e[g];if(c=h.displayObject){var k=h.selectedColorReal;void 0!==f&&c.setAttr("stroke",f);void 0!==k?c.setAttr("fill",k):b.returnInitialColor(h)}}b.zoomToSelectedObject();d!=a&&(a={type:"selectedObjectChanged",chart:b},b.fire(a.type,a))},returnInitialColor:function(a,b){this.returnInitialColorReal(a);b&&(a.isFirst=!1);var c=a.groupId;if(c){var c=this.getGroupById(c),d;for(d=0;d<c.length;d++)this.returnInitialColorReal(c[d]),b&&(c[d].isFirst=
!1)}},closeAllDescriptions:function(){this.descriptionsDiv.innerHTML=""},returnInitialColorReal:function(a){a.isOver=!1;var b=a.displayObject;if(b){b.toPrevious();if("MapImage"==a.objectType){var c=a.tempScale;isNaN(c)||b.translate(b.x,b.y,c,!0);a.tempScale=NaN}c=a.colorReal;a.showAsSelected&&(c=a.selectedColorReal);"bubble"==a.type&&(c=void 0);void 0!==c&&b.setAttr("fill",c);var d=a.image;d&&d.setAttr("fill",c);b.setAttr("stroke",a.outlineColorReal);"MapArea"==a.objectType&&b.setAttr("fill-opacity",
a.alphaReal);(b=a.imageLabel)&&!a.labelInactive&&b.setAttr("fill",a.labelColorReal)}},zoomToRectangle:function(a,b,c,d){var f=this.realWidth,e=this.realHeight,g=this.mapSet.scale,h=this.zoomControl,f=AmCharts.fitToBounds(c/f>d/e?0.8*f/(c*g):0.8*e/(d*g),h.minZoomLevel,h.maxZoomLevel);this.zoomToMapXY(f,(a+c/2)*g,(b+d/2)*g)},zoomToLatLongRectangle:function(a,b,c,d){var f=this.dataProvider,e=this.zoomControl,g=Math.abs(c-a),h=Math.abs(b-d),k=Math.abs(f.rightLongitude-f.leftLongitude),f=Math.abs(f.topLatitude-
f.bottomLatitude),e=AmCharts.fitToBounds(g/k>h/f?0.8*k/g:0.8*f/h,e.minZoomLevel,e.maxZoomLevel);this.zoomToLongLat(e,a+(c-a)/2,d+(b-d)/2)},getGroupById:function(a){var b=[];this.getGroup(this.imagesProcessor.allObjects,a,b);this.getGroup(this.linesProcessor.allObjects,a,b);this.getGroup(this.areasProcessor.allObjects,a,b);return b},zoomToGroup:function(a){a="object"==typeof a?a:this.getGroupById(a);var b,c,d,f,e;for(e=0;e<a.length;e++){var g=a[e].displayObject.getBBox(),h=g.y,k=g.y+g.height,l=g.x,
g=g.x+g.width;if(h<b||isNaN(b))b=h;if(k>f||isNaN(f))f=k;if(l<c||isNaN(c))c=l;if(g>d||isNaN(d))d=g}a=this.mapSet.getBBox();c-=a.x;d-=a.x;f-=a.y;b-=a.y;this.zoomToRectangle(c,b,d-c,f-b)},getGroup:function(a,b,c){if(a){var d;for(d=0;d<a.length;d++){var f=a[d];f.groupId==b&&c.push(f)}}},zoomToStageXY:function(a,b,c,d){if(!this.objectWasClicked){var f=this.zoomControl;a=AmCharts.fitToBounds(a,f.minZoomLevel,f.maxZoomLevel);f=this.zoomLevel();c=this.coordinateToLatitude((c-this.mapContainer.y)/f);b=this.coordinateToLongitude((b-
this.mapContainer.x)/f);this.zoomToLongLat(a,b,c,d)}},zoomToLongLat:function(a,b,c,d){b=this.longitudeToCoordinate(b);c=this.latitudeToCoordinate(c);this.zoomToMapXY(a,b,c,d)},zoomToMapXY:function(a,b,c,d){var f=this.mapWidth,e=this.mapHeight;this.zoomTo(a,-(b/f)*a+this.realWidth/f/2,-(c/e)*a+this.realHeight/e/2,d)},zoomToObject:function(a){var b=a.zoomLatitude,c=a.zoomLongitude,d=a.zoomLevel,f=this.zoomInstantly,e=a.zoomX,g=a.zoomY,h=this.realWidth,k=this.realHeight;isNaN(d)||(isNaN(b)||isNaN(c)?
this.zoomTo(d,e,g,f):this.zoomToLongLat(d,c,b,f));this.zoomInstantly=!1;"MapImage"==a.objectType&&isNaN(a.zoomX)&&(isNaN(a.zoomY)&&isNaN(a.zoomLatitude)&&isNaN(a.zoomLongitude)&&!isNaN(a.latitude)&&!isNaN(a.longitude))&&this.zoomToLongLat(a.zoomLevel,a.longitude,a.latitude);"MapArea"==a.objectType&&(e=a.displayObject.getBBox(),b=this.mapScale,c=e.x*b,d=e.y*b,f=e.width*b,e=e.height*b,h=a.autoZoomReal&&isNaN(a.zoomLevel)?f/h>e/k?0.8*h/f:0.8*k/e:a.zoomLevel,k=this.zoomControl,h=AmCharts.fitToBounds(h,
k.minZoomLevel,k.maxZoomLevel),isNaN(a.zoomX)&&(isNaN(a.zoomY)&&isNaN(a.zoomLatitude)&&isNaN(a.zoomLongitude))&&(a=this.mapSet.getBBox(),this.zoomToMapXY(h,-a.x*b+c+f/2,-a.y*b+d+e/2)))},zoomToSelectedObject:function(){this.zoomToObject(this.selectedObject)},zoomTo:function(a,b,c,d){var f=this.zoomControl;a=AmCharts.fitToBounds(a,f.minZoomLevel,f.maxZoomLevel);f=this.zoomLevel();isNaN(b)&&(b=this.realWidth/this.mapWidth,b=(this.zoomX()-0.5*b)*(a/f)+0.5*b);isNaN(c)&&(c=this.realHeight/this.mapHeight,
c=(this.zoomY()-0.5*c)*(a/f)+0.5*c);this.stopAnimation();isNaN(a)||(f=this.mapContainer,this.initialX=f.x,this.initialY=f.y,this.initialScale=f.scale,this.finalX=this.mapWidth*b,this.finalY=this.mapHeight*c,this.finalScale=a,this.finalX!=this.initialX||this.finalY!=this.initialY||this.finalScale!=this.initialScale?d?(this.tweenPercent=1,this.rescaleMapAndObjects(),this.wheelBusy=!1):this.animateMap():this.wheelBusy=!1)},loadXml:function(a){var b;b=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");
b.overrideMimeType&&b.overrideMimeType("text/xml");b.open("GET",a,!1);b.send();this.parseXMLObject(b.responseXML);this.svgData&&this.buildEverything()},stopAnimation:function(){this.frame=this.totalFrames},processObjects:function(){var a=this.container,b=this.stageObjectsContainer;b&&b.remove();this.stageObjectsContainer=b=a.set();this.trendLinesSet.push(b);var c=this.mapObjectsContainer;c&&c.remove();this.mapObjectsContainer=c=a.set();this.mapContainer.push(c);c.toFront();b.toFront();if(a=this.selectedObject)this.imagesProcessor.reset(),
this.linesProcessor.reset(),this.linesAboveImages?(this.imagesProcessor.process(a),this.linesProcessor.process(a)):(this.linesProcessor.process(a),this.imagesProcessor.process(a));this.rescaleObjects()},processAreas:function(){this.areasProcessor.process(this.dataProvider)},buildSVGMap:function(){var a=this.svgData.g.path,b=this.container,c=b.set();void 0===a.length&&(a=[a]);var d;for(d=0;d<a.length;d++){var f=a[d],e=f.title,g=b.path(f.d);g.id=f.id;this.svgAreasById[f.id]={area:g,title:e};this.svgAreas.push(g);
c.push(g)}this.mapSet=c;this.mapContainer.push(c);this.resizeMap()},addObjectEventListeners:function(a,b){var c=this;a.mouseup(function(){c.clickMapObject(b)}).mouseover(function(){c.rollOverMapObject(b)}).mouseout(function(){c.rollOutMapObject(b)}).touchend(function(){c.clickMapObject(b)}).touchstart(function(){c.rollOverMapObject(b)})},checkIfSelected:function(a){var b=this.selectedObject;if(b==a)return!0;if(b=b.groupId){var b=this.getGroupById(b),c;for(c=0;c<b.length;c++)if(b[c]==a)return!0}return!1},
clearMap:function(){this.chartDiv.innerHTML="";this.clearObjectList()},clearObjectList:function(){var a=this.objectList;a&&(a.div.innerHTML="")},checkIfLast:function(a){if(a){var b=a.parentNode;if(b&&b.lastChild==a)return!0}return!1},showAsRolledOver:function(a){var b=a.displayObject;if(!a.showAsSelected&&b&&!a.isOver){b.node.onmouseout=function(){};b.node.onmouseover=function(){};b.node.onclick=function(){};a.isFirst||(b.toFront(),a.isFirst=!0);var c=a.rollOverColorReal,d;void 0!=c&&("MapImage"==
a.objectType?(d=a.image)&&d.setAttr("fill",c):b.setAttr("fill",c));(d=a.imageLabel)&&!a.labelInactive&&(c=a.labelRollOverColorReal,void 0!=c&&d.setAttr("fill",c));c=a.rollOverOutlineColorReal;void 0!=c&&("MapImage"==a.objectType?(d=a.image)&&d.setAttr("stroke",c):b.setAttr("stroke",c));"MapArea"==a.objectType&&(d=a.rollOverAlphaReal,isNaN(d)||b.setAttr("fill-opacity",d));"MapImage"==a.objectType&&(d=a.rollOverScaleReal,isNaN(d)||(a.tempScale=b.scale,b.translate(b.x,b.y,b.scale*d,!0)));this.useHandCursorOnClickableOjects&&
this.checkIfClickable(a)&&b.setAttr("cursor","pointer");this.addObjectEventListeners(b,a);a.isOver=!0}},rollOverMapObject:function(a,b){if(this.chartCreated){this.handleMouseMove();var c=this.previouslyHovered;c&&c!=a&&!1===this.checkIfSelected(c)&&(this.returnInitialColor(c,!0),this.previouslyHovered=null);if(!1===this.checkIfSelected(a)){if(c=a.groupId){var c=this.getGroupById(c),d;for(d=0;d<c.length;d++)c[d]!=a&&this.showAsRolledOver(c[d])}this.showAsRolledOver(a)}else(c=a.displayObject)&&c.setAttr("cursor",
"default");if(this.showDescriptionOnHover)this.showDescription(a);else if((this.showBalloonOnSelectedObject||!this.checkIfSelected(a))&&!1!==b){var f=this.balloon;d=a.colorReal;c="";void 0!==d&&this.useObjectColorForBalloon||(d=f.fillColor);clearTimeout(this.hoverInt);(f=a.balloonTextReal)&&(c=this.formatString(f,a));this.balloonLabelFunction&&(c=this.balloonLabelFunction(a,this));c&&""!==c&&this.showBalloon(c,d,!0)}c={type:"rollOverMapObject",mapObject:a,chart:this};this.fire(c.type,c);this.previouslyHovered=
a}},rollOutMapObject:function(a){this.hideBalloon();this.chartCreated&&a.isOver&&(this.checkIfSelected(a)||this.returnInitialColor(a),a={type:"rollOutMapObject",mapObject:a,chart:this},this.fire(a.type,a))},formatString:function(a,b){var c=this.numberFormatter,d=this.percentFormatter,f=b.title;void 0==f&&(f="");var e=b.value,e=isNaN(e)?"":AmCharts.formatNumber(e,c),c=b.percents,c=isNaN(c)?"":AmCharts.formatNumber(c,d),d=b.description;void 0==d&&(d="");var g=b.customData;void 0==g&&(g="");return a=
AmCharts.massReplace(a,{"[[title]]":f,"[[value]]":e,"[[percent]]":c,"[[description]]":d,"[[customData]]":g})},clickMapObject:function(a){this.hideBalloon();this.chartCreated&&(!this.mapWasDragged&&this.checkIfClickable(a)&&!this.mapWasPinched)&&(this.selectObject(a),a={type:"clickMapObject",mapObject:a,chart:this},this.fire(a.type,a),this.objectWasClicked=!0)},checkIfClickable:function(a){if(!0===a.selectable||"MapArea"==a.objectType&&a.autoZoomReal||a.url||a.linkToObject||(0<a.images.length||0<a.lines.length)||
(!isNaN(a.zoomLevel)||!isNaN(a.zoomX)||!isNaN(a.zoomY))||a.description)return!0;var b=this.allowClickOnSelectedObject;return this.selectedObject==a&&b?!0:!1},handleResize:function(){(AmCharts.isPercents(this.width)||AmCharts.isPercents(this.height))&&this.invalidateSize();this.renderFix()},resizeMap:function(){var a=this.mapSet;if(a)if(this.fitMapToContainer){var b=a.getBBox(),c=this.realWidth,d=this.realHeight,f=b.width,e=b.height,c=f/c>e/d?c/f:d/e;a.translate(-b.x*c,-b.y*c,c);this.mapScale=c;this.mapHeight=
e*c;this.mapWidth=f*c}else b=group.transform.match(/([\-]?[\d.]+)/g),a.translate(b[0],b[1],b[2])},zoomIn:function(){this.skipClick=!0;var a=this.zoomLevel()*this.zoomControl.zoomFactor;this.zoomTo(a)},zoomOut:function(){this.skipClick=!0;var a=this.zoomLevel()/this.zoomControl.zoomFactor;this.zoomTo(a)},moveLeft:function(){this.skipClick=!0;var a=this.zoomX()+this.zoomControl.panStepSize;this.zoomTo(this.zoomLevel(),a,this.zoomY())},moveRight:function(){this.skipClick=!0;var a=this.zoomX()-this.zoomControl.panStepSize;
this.zoomTo(this.zoomLevel(),a,this.zoomY())},moveUp:function(){this.skipClick=!0;var a=this.zoomY()+this.zoomControl.panStepSize;this.zoomTo(this.zoomLevel(),this.zoomX(),a)},moveDown:function(){this.skipClick=!0;var a=this.zoomY()-this.zoomControl.panStepSize;this.zoomTo(this.zoomLevel(),this.zoomX(),a)},zoomX:function(){return this.mapSet?Math.round(1E4*this.mapContainer.x/this.mapWidth)/1E4:NaN},zoomY:function(){return this.mapSet?Math.round(1E4*this.mapContainer.y/this.mapHeight)/1E4:NaN},goHome:function(){this.selectObject(this.dataProvider);
var a={type:"homeButtonClicked",chart:this};this.fire(a.type,a)},zoomLevel:function(){return Math.round(1E5*this.mapContainer.scale)/1E5},showDescriptionAndGetUrl:function(){var a=this.selectedObject;if(a){this.showDescription();var b=a.url;if(b)AmCharts.getURL(b,a.urlTarget);else if(b=a.linkToObject){if("string"==typeof b){var c=this.getObjectById(b);if(c){this.selectObject(c);return}}b&&a.passZoomValuesToTarget&&(b.zoomLatitude=this.zoomLatitude(),b.zoomLongitude=this.zoomLongitude(),b.zoomLevel=
this.zoomLevel());this.extendMapData(b)||this.selectObject(b)}}},extendMapData:function(a){var b=a.objectType;if("MapImage"!=b&&"MapArea"!=b&&"MapLine"!=b)return AmCharts.extend(a,new AmCharts.MapData),this.dataProvider=a,this.zoomInstantly=!0,this.validateData(),!0},showDescription:function(a){a||(a=this.selectedObject);this.allowMultipleDescriptionWindows||this.closeAllDescriptions();if(a.description){var b=a.descriptionWindow;b&&b.close();b=new AmCharts.DescriptionWindow;a.descriptionWindow=b;
var c=a.descriptionWindowWidth,d=a.descriptionWindowHeight,f=a.descriptionWindowX,e=a.descriptionWindowY;isNaN(f)&&(f=this.mouseX,f=f>this.realWidth/2?f-c-20:f+20);isNaN(e)&&(e=this.mouseY);b.maxHeight=d;b.show(this,this.descriptionsDiv,a.description,a.title);a=b.div.style;a.width=c+"px";a.maxHeight=d+"px";a.left=f+"px";a.top=e+"px"}},parseXMLObject:function(a){var b={root:{}};this.parseXMLNode(b,"root",a);this.svgData=b.root.svg;this.getBounds()},getBounds:function(){var a=this.dataProvider;try{var b=
this.svgData.defs["amcharts:ammap"];a.leftLongitude=Number(b.leftLongitude);a.rightLongitude=Number(b.rightLongitude);a.topLatitude=Number(b.topLatitude);a.bottomLatitude=Number(b.bottomLatitude);a.projection=b.projection}catch(c){}},latitudeToCoordinate:function(a){var b,c=this.dataProvider;if(this.mapSet){b=c.topLatitude;var d=c.bottomLatitude;"mercator"==c.projection&&(a=this.mercatorLatitudeToCoordinate(a),b=this.mercatorLatitudeToCoordinate(b),d=this.mercatorLatitudeToCoordinate(d));b=(a-b)/
(d-b)*this.mapHeight}return b},longitudeToCoordinate:function(a){var b,c=this.dataProvider;this.mapSet&&(b=c.leftLongitude,b=(a-b)/(c.rightLongitude-b)*this.mapWidth);return b},mercatorLatitudeToCoordinate:function(a){89.5<a&&(a=89.5);-89.5>a&&(a=-89.5);a=AmCharts.degreesToRadians(a);a=0.5*Math.log((1+Math.sin(a))/(1-Math.sin(a)));return AmCharts.radiansToDegrees(a/2)},zoomLatitude:function(){return this.coordinateToLatitude((-this.mapContainer.y+this.previousHeight/2)/this.zoomLevel())},zoomLongitude:function(){return this.coordinateToLongitude((-this.mapContainer.x+
this.previousWidth/2)/this.zoomLevel())},getAreaCenterLatitude:function(a){a=a.displayObject.getBBox();var b=this.mapScale;a=-this.mapSet.getBBox().y*b+(a.y+a.height/2)*b;return this.coordinateToLatitude(a)},getAreaCenterLongitude:function(a){a=a.displayObject.getBBox();var b=this.mapScale;a=-this.mapSet.getBBox().x*b+(a.x+a.width/2)*b;return this.coordinateToLongitude(a)},coordinateToLatitude:function(a){var b;if(this.mapSet){var c=this.dataProvider,d=c.bottomLatitude,f=c.topLatitude;b=this.mapHeight;
"mercator"==c.projection?(c=this.mercatorLatitudeToCoordinate(d),f=this.mercatorLatitudeToCoordinate(f),a=2*Math.atan(Math.exp(2*(a*(c-f)/b+f)*Math.PI/180))-0.5*Math.PI,b=AmCharts.radiansToDegrees(a)):b=a/b*(d-f)+f}return Math.round(1E6*b)/1E6},coordinateToLongitude:function(a){var b,c=this.dataProvider;this.mapSet&&(b=a/this.mapWidth*(c.rightLongitude-c.leftLongitude)+c.leftLongitude);return Math.round(1E6*b)/1E6},milesToPixels:function(a){var b=this.dataProvider;return a*(this.mapWidth/(b.rightLongitude-
b.leftLongitude))/69.172},kilometersToPixels:function(a){var b=this.dataProvider;return a*(this.mapWidth/(b.rightLongitude-b.leftLongitude))/111.325},handleBackgroundClick:function(a){if(this.backgroundZoomsToTop&&!this.mapWasDragged){var b=this.dataProvider;if(this.checkIfClickable(b))this.clickMapObject(b);else{a=b.zoomX;var c=b.zoomY,d=b.zoomLongitude,f=b.zoomLatitude,b=b.zoomLevel;isNaN(a)||isNaN(c)||this.zoomTo(b,a,c);isNaN(d)||isNaN(f)||this.zoomToLongLat(b,d,f,!0)}}},parseXMLNode:function(a,
b,c,d){void 0===d&&(d="");var f,e,g;if(c){var h=c.childNodes.length;for(f=0;f<h;f++){e=c.childNodes[f];var k=e.nodeName,l=e.nodeValue?this.trim(e.nodeValue):"",m=!1;e.attributes&&0<e.attributes.length&&(m=!0);if(0!==e.childNodes.length||""!==l||!1!==m)if(3==e.nodeType||4==e.nodeType){if(""!==l){e=0;for(g in a[b])a[b].hasOwnProperty(g)&&e++;e?a[b]["#text"]=l:a[b]=l}}else if(1==e.nodeType){var n;void 0!==a[b][k]?void 0===a[b][k].length?(n=a[b][k],a[b][k]=[],a[b][k].push(n),a[b][k].push({}),n=a[b][k][1]):
"object"==typeof a[b][k]&&(a[b][k].push({}),n=a[b][k][a[b][k].length-1]):(a[b][k]={},n=a[b][k]);if(e.attributes&&e.attributes.length)for(l=0;l<e.attributes.length;l++)n[e.attributes[l].name]=e.attributes[l].value;void 0!==a[b][k].length?this.parseXMLNode(a[b][k],a[b][k].length-1,e,d+"  "):this.parseXMLNode(a[b],k,e,d+"  ")}}e=0;c="";for(g in a[b])"#text"==g?c=a[b][g]:e++;0===e&&void 0===a[b].length&&(a[b]=c)}},doDoubleClickZoom:function(){if(!this.mapWasDragged){var a=this.zoomLevel()*this.zoomControl.zoomFactor;
this.zoomToStageXY(a,this.mouseX,this.mouseY)}},getDevInfo:function(){var a=this.zoomLevel(),a={chart:this,type:"writeDevInfo",zoomLevel:a,zoomX:this.zoomX(),zoomY:this.zoomY(),zoomLatitude:this.zoomLatitude(),zoomLongitude:this.zoomLongitude(),latitude:this.coordinateToLatitude((this.mouseY-this.mapContainer.y)/a),longitude:this.coordinateToLongitude((this.mouseX-this.mapContainer.x)/a),left:this.mouseX,top:this.mouseY,right:this.realWidth-this.mouseX,bottom:this.realHeight-this.mouseY,percentLeft:Math.round(100*
(this.mouseX/this.realWidth))+"%",percentTop:Math.round(100*(this.mouseY/this.realHeight))+"%",percentRight:Math.round(100*((this.realWidth-this.mouseX)/this.realWidth))+"%",percentBottom:Math.round(100*((this.realHeight-this.mouseY)/this.realHeight))+"%"},b="zoomLevel:"+a.zoomLevel+", zoomLongitude:"+a.zoomLongitude+", zoomLatitude:"+a.zoomLatitude+"\n",b=b+("zoomX:"+a.zoomX+", zoomY:"+a.zoomY+"\n"),b=b+("latitude:"+a.latitude+", longitude:"+a.longitude+"\n"),b=b+("left:"+a.left+", top:"+a.top+"\n"),
b=b+("right:"+a.right+", bottom:"+a.bottom+"\n"),b=b+('left:"'+a.percentLeft+'", top:"'+a.percentTop+'"\n'),b=b+('right:"'+a.percentRight+'", bottom:"'+a.percentBottom+'"\n');a.str=b;this.fire(a.type,a);return a},getXY:function(a,b,c){void 0!==a&&(-1!=String(a).indexOf("%")?(a=Number(a.split("%").join("")),c&&(a=100-a),a=Number(a)*b/100):c&&(a=b-a));return a},getObjectById:function(a){var b=this.dataProvider;if(b.areas){var c=this.getObject(a,b.areas);if(c)return c}if(c=this.getObject(a,b.images))return c;
if(a=this.getObject(a,b.lines))return a},getObject:function(a,b){if(b){var c;for(c=0;c<b.length;c++){var d=b[c];if(d.id==a)return d;if(d.areas){var f=this.getObject(a,d.areas);if(f)return f}if(f=this.getObject(a,d.images))return f;if(d=this.getObject(a,d.lines))return d}}},parseData:function(){var a=this.dataProvider;this.processObject(a.areas,a,"area");this.processObject(a.images,a,"image");this.processObject(a.lines,a,"line")},processObject:function(a,b,c){if(a){var d;for(d=0;d<a.length;d++){var f=
a[d];f.parentObject=b;"area"==c&&AmCharts.extend(f,new AmCharts.MapArea);"image"==c&&AmCharts.extend(f,new AmCharts.MapImage);"line"==c&&AmCharts.extend(f,new AmCharts.MapLine);f.areas&&this.processObject(f.areas,f,"area");f.images&&this.processObject(f.images,f,"image");f.lines&&this.processObject(f.lines,f,"line")}}},getX:function(a,b){return this.getXY(a,this.realWidth,b)},getY:function(a,b){return this.getXY(a,this.realHeight,b)},trim:function(a){if(a){var b;for(b=0;b<a.length;b++)if(-1===" \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))){a=
a.substring(b);break}for(b=a.length-1;0<=b;b--)if(-1===" \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))){a=a.substring(0,b+1);break}return-1===" \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(0))?a:""}},drb:function(){var a=this.product,b=a+".com",c=window.location.hostname.split("."),d;2<=c.length&&(d=c[c.length-2]+"."+c[c.length-1]);
AmCharts.remove(this.bbset);if(d!=b){var b=b+"/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo"+a,f="chart by ",c=145;"ammap"==a&&(f="tool by ",c=125);d=AmCharts.rect(this.container,c,20,"#FFFFFF",1);f=AmCharts.text(this.container,f+a+".com","#000000","Verdana",11,"start");f.translate(7,9);d=this.container.set([d,f]);"ammap"==a&&d.translate(this.realWidth-c,0);this.bbset=d;this.linkSet.push(d);d.setAttr("cursor","pointer");d.click(function(){window.location.href="http://"+b});for(a=0;a<d.length;a++)d[a].attr({cursor:"pointer"})}}});AmCharts.ZoomControl=AmCharts.Class({construct:function(){this.panStepSize=0.1;this.zoomFactor=2;this.maxZoomLevel=4;this.minZoomLevel=1;this.zoomControlEnabled=this.panControlEnabled=!0;this.buttonRollOverColor="#BDBDBD";this.buttonFillColor="#FFFFFF";this.buttonFillAlpha=0;this.buttonBorderColor="#FFFFFF";this.buttonBorderThickness=1;this.buttonBorderAlpha=0;this.buttonIconColor="#FFFFFF";this.buttonColorHover="#FF0000";this.gridColor=this.homeIconColor="#FFFFFF";this.gridBackgroundColor="#000000";
this.gridBackgroundAlpha=0;this.gridAlpha=1;this.buttonSize=35;this.iconSize=25;this.buttonCornerRadius=3;this.gridHeight=70;this.top=400;this.left=10},init:function(a,b){var c=this;c.chart=a;AmCharts.remove(c.set);var d=b.set();d.translate(a.getX(c.left),a.getY(c.top));var f=c.buttonSize,e=c.buttonFillColor,g=c.buttonFillAlpha,h=c.buttonBorderThickness,k=c.buttonBorderColor,l=c.buttonBorderAlpha,m=c.buttonCornerRadius,n=c.buttonRollOverColor,v=c.gridHeight,u=c.zoomFactor,y=c.minZoomLevel,q=c.maxZoomLevel;
c.previousDY=NaN;var r;if(c.zoomControlEnabled){r=b.set();d.push(r);c.set=d;c.zoomSet=r;var s=AmCharts.rect(b,f+6,v+2*f+6,c.gridBackgroundColor,c.gridBackgroundAlpha,0,0,0,4);s.translate(-3,-3);s.mouseup(function(){c.handleBgUp()});r.push(s);s=new AmCharts.SimpleButton;s.setIcon(a.pathToImages+"plus.svg",c.iconSize);s.setClickHandler(a.zoomIn,a);s.init(b,f,f,e,g,h,k,l,m,n);r.push(s.set);s=new AmCharts.SimpleButton;s.setIcon(a.pathToImages+"minus.svg",c.iconSize);s.setClickHandler(a.zoomOut,a);s.init(b,
f,f,e,g,h,k,l,m,n);s.set.translate(0,v+f);r.push(s.set);var t=Math.log(q/y)/Math.log(u)+1,s=v/t,w;for(w=1;w<t;w++){var x=f+w*s,x=AmCharts.line(b,[1,f-2],[x,x],c.gridColor,c.gridAlpha,1);r.push(x)}t=new AmCharts.SimpleButton;t.setDownHandler(c.draggerDown,c);t.setClickHandler(c.draggerUp,c);t.init(b,f,s,e,g,h,k,l,m,n);r.push(t.set);c.dragger=t.set;c.previousY=NaN;v-=s;y=Math.log(y/100)/Math.log(u);u=Math.log(q/100)/Math.log(u);c.realStepSize=v/(u-y);c.realGridHeight=v;c.stepMax=u}c.panControlEnabled&&
(u=b.set(),d.push(u),r&&r.translate(f,4*f),r=new AmCharts.SimpleButton,r.setIcon(a.pathToImages+"panLeft.svg",c.iconSize),r.setClickHandler(a.moveLeft,a),r.init(b,f,f,e,g,h,k,l,m,n),r.set.translate(0,f),u.push(r.set),r=new AmCharts.SimpleButton,r.setIcon(a.pathToImages+"panRight.svg",c.iconSize),r.setClickHandler(a.moveRight,a),r.init(b,f,f,e,g,h,k,l,m,n),r.set.translate(2*f,f),u.push(r.set),r=new AmCharts.SimpleButton,r.setIcon(a.pathToImages+"panUp.svg",c.iconSize),r.setClickHandler(a.moveUp,a),
r.init(b,f,f,e,g,h,k,l,m,n),r.set.translate(f,0),u.push(r.set),r=new AmCharts.SimpleButton,r.setIcon(a.pathToImages+"panDown.svg",c.iconSize),r.setClickHandler(a.moveDown,a),r.init(b,f,f,e,g,h,k,l,m,n),r.set.translate(f,2*f),u.push(r.set),g=new AmCharts.SimpleButton,g.setIcon(a.pathToImages+"homeIcon.svg",c.iconSize),g.setClickHandler(a.goHome,a),g.init(b,f,f,e,0,0,k,0,m,n),g.set.translate(f,f),u.push(g.set),d.push(u))},draggerDown:function(){this.chart.stopDrag();this.isDragging=!0},draggerUp:function(){this.isDragging=
!1},handleBgUp:function(){var a=this.chart,b=100*Math.pow(this.zoomFactor,this.stepMax-(a.mouseY-this.zoomSet.y-this.set.y-this.buttonSize-this.realStepSize/2)/this.realStepSize);a.zoomTo(b)},update:function(){var a,b=this.zoomFactor,c=this.realStepSize,d=this.stepMax,f=this.dragger,e=this.buttonSize,g=this.chart;this.isDragging?(g.stopDrag(),a=f.y+(g.mouseY-this.previousY),a=AmCharts.fitToBounds(a,e,this.realGridHeight+e),c=100*Math.pow(b,d-(a-e)/c),g.zoomTo(c,NaN,NaN,!0)):(a=Math.log(g.zoomLevel()/
100)/Math.log(b),a=(d-a)*c+e);this.previousY=g.mouseY;this.previousDY!=a&&f&&(f.translate(0,a),this.previousDY=a)}});AmCharts.SimpleButton=AmCharts.Class({construct:function(){},init:function(a,b,c,d,f,e,g,h,k,l){var m=this;m.rollOverColor=l;m.color=d;l=a.set();m.set=l;d=AmCharts.rect(a,b,c,d,f,e,g,h,k);l.push(d);if(f=m.iconPath)e=m.iconSize,a=a.image(f,(b-e)/2,(c-e)/2,e,e),l.push(a),a.mousedown(function(){m.handleDown()}).mouseup(function(){m.handleUp()}).mouseover(function(){m.handleOver()}).mouseout(function(){m.handleOut()});d.mousedown(function(){m.handleDown()}).mouseup(function(){m.handleUp()}).mouseover(function(){m.handleOver()}).mouseout(function(){m.handleOut()});
m.bg=d},setIcon:function(a,b){this.iconPath=a;this.iconSize=b},setClickHandler:function(a,b){this.clickHandler=a;this.scope=b},setDownHandler:function(a,b){this.downHandler=a;this.scope=b},handleUp:function(){var a=this.clickHandler;a&&a.call(this.scope)},handleDown:function(){var a=this.downHandler;a&&a.call(this.scope)},handleOver:function(){this.bg.setAttr("fill",this.rollOverColor)},handleOut:function(){this.bg.setAttr("fill",this.color)}});AmCharts.SmallMap=AmCharts.Class({construct:function(){this.mapColor="#e6e6e6";this.rectangleColor="#FFFFFF";this.top=this.right=10;this.minimizeButtonWidth=16;this.backgroundColor="#9A9A9A";this.backgroundAlpha=1;this.borderColor="#FFFFFF";this.borderThickness=3;this.borderAlpha=1;this.size=0.2},init:function(a,b){var c=this;c.chart=a;c.container=b;c.width=a.realWidth*c.size;c.height=a.realHeight*c.size;AmCharts.remove(c.set);var d=b.set();c.set=d;var f=b.set();c.allSet=f;d.push(f);c.buildSVGMap();
var e=c.borderThickness,g=c.borderColor,h=AmCharts.rect(b,c.width+e,c.height+e,c.backgroundColor,c.backgroundAlpha,e,g,c.borderAlpha);h.translate(-e/2,-e/2);f.push(h);h.toBack();var k,l,h=c.minimizeButtonWidth,m=new AmCharts.SimpleButton;m.setIcon(a.pathToImages+"arrowDown.gif",h);m.setClickHandler(c.minimize,c);m.init(b,h,h,g,1,1,g,1);m=m.set;c.downButtonSet=m;d.push(m);var n=new AmCharts.SimpleButton;n.setIcon(a.pathToImages+"arrowUp.gif",h);n.setClickHandler(c.maximize,c);n.init(b,h,h,g,1,1,g,
1);g=n.set;c.upButtonSet=g;g.hide();d.push(g);var v,u;isNaN(c.top)||(k=a.getY(c.top)+e,u=0);isNaN(c.bottom)||(k=a.getY(c.bottom,!0)-c.height-e,u=c.height-h+e/2);isNaN(c.left)||(l=a.getX(c.left)+e,v=-e/2);isNaN(c.right)||(l=a.getX(c.right,!0)-c.width-e,v=c.width-h+e/2);e=b.set();e.clipRect(1,1,c.width,c.height);f.push(e);c.rectangleC=e;d.translate(l,k);m.translate(v,u);g.translate(v,u);f.mouseup(function(){c.handleMouseUp()});c.drawRectangle()},minimize:function(){this.downButtonSet.hide();this.upButtonSet.show();
this.allSet.hide()},maximize:function(){this.downButtonSet.show();this.upButtonSet.hide();this.allSet.show()},buildSVGMap:function(){var a=this.chart,b={fill:this.mapColor,stroke:this.mapColor,"stroke-opacity":1},c=a.svgData.g.path,d=this.container,f=d.set(),e;for(e=0;e<c.length;e++){var g=d.path(c[e].d).attr(b);f.push(g)}this.allSet.push(f);b=f.getBBox();c=this.size*a.mapScale;d=-b.x*c;e=-b.y*c;var h=g=0;a.centerMap&&(g=(this.width-b.width*c)/2,h=(this.height-b.height*c)/2);this.mapWidth=b.width*
c;this.mapHeight=b.height*c;this.dx=g;this.dy=h;f.translate(d+g,e+h,c)},update:function(){var a=this.chart,b=a.zoomLevel(),c=this.width,d=a.mapContainer,a=c/(a.realWidth*b),c=c/b,b=this.height/b,f=this.rectangle;f.translate(-d.x*a+this.dx,-d.y*a+this.dy);0<c&&0<b&&(f.setAttr("width",c),f.setAttr("height",b));this.rWidth=c;this.rHeight=b},drawRectangle:function(){var a=this.rectangle;AmCharts.remove(a);a=AmCharts.rect(this.container,10,10,"#000",0,1,this.rectangleColor,1);this.rectangleC.push(a);this.rectangle=
a},handleMouseUp:function(){var a=this.chart,b=a.zoomLevel();a.zoomTo(b,-((a.mouseX-this.set.x-this.dx-this.rWidth/2)/this.mapWidth)*b,-((a.mouseY-this.set.y-this.dy-this.rHeight/2)/this.mapHeight)*b)}});AmCharts.AreasProcessor=AmCharts.Class({construct:function(a){this.chart=a},process:function(a){this.updateAllAreas();this.allObjects=[];a=a.areas;var b=this.chart,c=b.areasSettings,d=a.length,f,e,g=0,h=b.svgAreasById,k=c.color,l=c.alpha,m=c.outlineThickness,n=c.rollOverColor,v=c.selectedColor,u=c.rollOverAlpha,y=c.outlineColor,q=c.outlineAlpha,r=c.balloonText,s=c.selectable,t=c.rollOverOutlineColor,w=0,x=0;for(f=0;f<d;f++)e=a[f],e=e.value,w<e&&(w=e),x>e&&(x=e),isNaN(e)||(g+=Math.abs(e));isNaN(b.minValue)||
(x=b.minValue);isNaN(b.maxValue)||(w=b.maxValue);b.maxValueReal=w;b.minValueReal=x;for(f=0;f<d;f++)e=a[f],isNaN(e.value)?e.percents=void 0:e.percents=100*((e.value-x)/g);for(f=0;f<d;f++){e=a[f];this.allObjects.push(e);e.chart=b;e.baseSettings=c;e.autoZoomReal=void 0==e.autoZoom?c.autoZoom:e.autoZoom;g=e.color;void 0==g&&(g=k);var p=e.alpha;isNaN(p)&&(p=l);var z=e.rollOverAlpha;isNaN(z)&&(z=u);isNaN(z)&&(z=p);var A=e.rollOverColor;void 0==A&&(A=n);var D=e.selectedColor;void 0==D&&(D=v);var E=e.balloonText;
E||(E=r);if(void 0!=c.colorSolid&&!isNaN(e.value)){var B=(e.value-x)/(w-x),C=100/(b.colorSteps-1),B=Math.ceil(100*B/C)*C/100;e.colorReal=AmCharts.getColorFade(g,c.colorSolid,B)}void 0!=e.color&&(e.colorReal=e.color);void 0==e.selectable&&(e.selectable=s);void 0==e.colorReal&&(e.colorReal=k);B=e.outlineColor;void 0==B&&(B=y);C=e.outlineAlpha;isNaN(C)&&(C=q);var F=e.outlineThickness;isNaN(F)&&(F=m);var K=e.rollOverOutlineColor;void 0==K&&(K=t);e.alphaReal=p;e.rollOverColorReal=A;e.rollOverAlphaReal=
z;e.balloonTextReal=E;e.selectedColorReal=D;e.outlineColorReal=B;e.outlineAlphaReal=C;e.rollOverOutlineColorReal=K;AmCharts.processDescriptionWindow(c,e);if(A=h[e.id])if(z=A.area,(A=A.title)&&!e.title&&(e.title=A),z){e.displayObject=z;e.mouseEnabled&&b.addObjectEventListeners(z,e);var H;void 0!=g&&(H=g);void 0!=e.colorReal&&(H=e.showAsSelected||b.selectedObject==e?e.selectedColorReal:e.colorReal);z.setAttr("fill",H);z.setAttr("stroke",B);z.setAttr("stroke-opacity",C);z.setAttr("stroke-width",F);z.setAttr("fill-opacity",
p)}}},updateAllAreas:function(){var a=this.chart,b=a.areasSettings,c=b.unlistedAreasColor,d=b.unlistedAreasAlpha,f=b.unlistedAreasOutlineColor,e=b.unlistedAreasOutlineAlpha,g=a.svgAreas,a=a.dataProvider,h=a.areas,k={},l;for(l=0;l<h.length;l++)k[h[l].id]=h[l];for(l=0;l<g.length;l++)if(h=g[l],void 0!=c&&h.setAttr("fill",c),isNaN(d)||h.setAttr("fill-opacity",d),void 0!=f&&h.setAttr("stroke",f),isNaN(e)||h.setAttr("stroke-opacity",e),h.setAttr("stroke-width",b.outlineThickness),a.getAreasFromMap&&!k[h.id]){var m=
new AmCharts.MapArea;m.parentObject=a;m.id=h.id;a.areas.push(m)}}});AmCharts.AreasSettings=AmCharts.Class({construct:function(){this.alpha=1;this.autoZoom=!1;this.balloonText="[[title]]";this.color="#FFCC00";this.colorSolid="#990000";this.unlistedAreasAlpha=1;this.unlistedAreasColor="#DDDDDD";this.outlineColor="#FFFFFF";this.outlineAlpha=1;this.outlineThickness=0.5;this.selectedColor=this.rollOverOutlineColor="#CC0000";this.unlistedAreasOutlineColor="#FFFFFF";this.unlistedAreasOutlineAlpha=1;this.descriptionWindowWidth=250}});AmCharts.ImagesProcessor=AmCharts.Class({construct:function(a){this.chart=a;this.reset()},process:function(a){var b=a.images,c;for(c=0;c<b.length;c++)this.createImage(b[c],c);a.parentObject&&a.remainVisible&&this.process(a.parentObject)},createImage:function(a,b){var c=this.chart,d=c.container,f=c.mapObjectsContainer,e=c.stageObjectsContainer,g=c.imagesSettings;a.remove();var h=g.color,k=g.alpha,l=g.rollOverColor,m=g.selectedColor,n=g.balloonText,v=g.outlineColor,u=g.outlineAlpha,y=g.outlineThickness,
q=g.selectedScale,r=g.labelPosition,s=g.labelColor,t=g.labelFontSize,w=g.labelRollOverColor,x=g.selectedLabelColor;a.index=b;a.chart=c;a.baseSettings=c.imagesSettings;var p=d.set();a.displayObject=p;var z=a.color;void 0==z&&(z=h);h=a.alpha;isNaN(h)&&(h=k);k=a.outlineAlpha;isNaN(k)&&(k=u);u=a.rollOverColor;void 0==u&&(u=l);l=a.selectedColor;void 0==l&&(l=m);(m=a.balloonText)||(m=n);n=a.outlineColor;void 0==n&&(n=v);void 0==n&&(n=z);v=a.outlineThickness;isNaN(v)&&(v=y);(y=a.labelPosition)||(y=r);r=
a.labelColor;void 0==r&&(r=s);s=a.labelRollOverColor;void 0==s&&(s=w);w=a.selectedLabelColor;void 0==w&&(w=x);x=a.labelFontSize;isNaN(x)&&(x=t);t=a.selectedScale;isNaN(t)&&(t=q);isNaN(a.rollOverScale);a.colorReal=z;a.alphaReal=h;a.rollOverColorReal=u;a.balloonTextReal=m;a.selectedColorReal=l;a.labelColorReal=r;a.labelRollOverColorReal=s;a.selectedLabelColorReal=w;a.labelFontSizeReal=x;a.labelPositionReal=y;a.selectedScaleReal=t;a.rollOverScaleReal=t;AmCharts.processDescriptionWindow(g,a);a.centeredReal=
void 0==a.centered?g.centered:a.centered;x=a.type;w=a.imageURL;u=a.svgPath;s=a.width;l=a.height;g=a.scale;isNaN(a.percentWidth)||(s=a.percentWidth/100*c.realWidth);isNaN(a.percentHeight)||(l=a.percentHeight/100*c.realHeight);var A;w||(x||u)||(x="circle",s=1,k=h=0);r=q=0;t=a.selectedColorReal;x?(isNaN(s)&&(s=10),isNaN(l)&&(l=10),"kilometers"==a.widthAndHeightUnits&&(s=c.kilometersToPixels(a.width),l=c.kilometersToPixels(a.height)),"miles"==a.widthAndHeightUnits&&(s=c.milesToPixels(a.width),l=c.milesToPixels(a.height)),
A=this.createPredefinedImage(z,n,v,x,s,l),r=q=0,a.centeredReal&&(q=isNaN(a.right)?-s/2:s/2,r=isNaN(a.bottom)?-l/2:l/2),A.translate(q,r)):w?(isNaN(s)&&(s=10),isNaN(l)&&(l=10),A=d.image(w,0,0,s,l),A.node.setAttribute("preserveAspectRatio","none"),A.setAttr("opacity",h),a.centeredReal&&(q=isNaN(a.right)?-s/2:s/2,r=isNaN(a.bottom)?-l/2:l/2,A.translate(q,r))):u&&(A=d.path(u),n=A.getBBox(),a.centeredReal?(q=-n.x*g-n.width*g/2,isNaN(a.right)||(q=-q),r=-n.y*g-n.height*g/2,isNaN(a.bottom)||(r=-r)):q=r=0,A.translate(q,
r,g),A.x=q,A.y=r);A&&(p.push(A),a.image=A,A.setAttr("stroke-opacity",k),A.setAttr("fill-opacity",h),A.setAttr("fill",z));!a.showAsSelected&&c.selectedObject!=a||void 0==t||A.setAttr("fill",t);z=null;void 0!=a.label&&(z=AmCharts.text(d,a.label,a.labelColorReal,c.fontFamily,a.labelFontSizeReal,a.labelAlign),a.imageLabel=z,!a.labelInactive&&a.mouseEnabled&&c.addObjectEventListeners(z,a),p.push(z));isNaN(a.latitude)||isNaN(a.longitude)?e.push(p):f.push(p);p&&(p.rotation=a.rotation);this.updateSizeAndPosition(a);
a.mouseEnabled&&c.addObjectEventListeners(p,a)},updateSizeAndPosition:function(a){var b=this.chart,c=a.displayObject,d=b.getX(a.left),f=b.getY(a.top),e=a.image.getBBox();isNaN(a.right)||(d=b.getX(a.right,!0)-e.width*a.scale);isNaN(a.bottom)||(f=b.getY(a.bottom,!0)-e.height*a.scale);var g=a.longitude,h=a.latitude,e=this.objectsToResize;this.allSvgObjects.push(c);this.allObjects.push(a);var k=a.imageLabel;if(!isNaN(d)&&!isNaN(f))c.translate(d,f);else if(!isNaN(h)&&!isNaN(g)&&(d=b.longitudeToCoordinate(g),
f=b.latitudeToCoordinate(h),c.translate(d,f,NaN,!0),a.fixedSize)){d=1;if(a.showAsSelected||b.selectedObject==a)d=a.selectedScaleReal;e.push({image:c,scale:d})}this.positionLabel(k,a,a.labelPositionReal)},positionLabel:function(a,b,c){if(a){var d=b.image,f=0,e=0,g=0,h=0;d&&(h=d.getBBox(),e=d.y,f=d.x,g=h.width,h=h.height,b.svgPath&&(g*=b.scale,h*=b.scale));var k=a.getBBox(),d=k.width,k=k.height;"right"==c&&(f+=g+d/2+5,e+=h/2-2);"left"==c&&(f+=-d/2-5,e+=h/2-2);"top"==c&&(e-=k/2+3,f+=g/2);"bottom"==c&&
(e+=h+k/2,f+=g/2);"middle"==c&&(f+=g/2,e+=h/2);a.translate(f+b.labelShiftX,e+b.labelShiftY)}},createPredefinedImage:function(a,b,c,d,f,e){var g=this.chart.container,h;switch(d){case "circle":h=AmCharts.circle(g,f/2,a,1,c,b,1);break;case "rectangle":h=AmCharts.rect(g,f,e,a,1,c,b,1);h.translate(-f/2,-e/2);break;case "bubble":h=AmCharts.circle(g,f/2,a,1,c,b,1,!0)}return h},reset:function(){this.objectsToResize=[];this.allSvgObjects=[];this.allObjects=[];this.allLabels=[]}});AmCharts.ImagesSettings=AmCharts.Class({construct:function(){this.balloonText="[[title]]";this.alpha=1;this.borderAlpha=0;this.borderThickness=1;this.labelPosition="right";this.labelColor="#000000";this.labelFontSize=11;this.color="#000000";this.labelRollOverColor="#00CC00";this.centered=!0;this.rollOverScale=this.selectedScale=1;this.descriptionWindowWidth=250}});AmCharts.LinesProcessor=AmCharts.Class({construct:function(a){this.chart=a;this.reset()},process:function(a){var b=a.lines,c=this.chart,d=c.linesSettings,f=this.objectsToResize,e=c.mapObjectsContainer,g=c.stageObjectsContainer,h=d.thickness,k=d.dashLength,l=d.arrow,m=d.arrowSize,n=d.arrowColor,v=d.arrowAlpha,u=d.color,y=d.alpha,q=d.rollOverColor,r=d.selectedColor,s=d.rollOverAlpha,t=d.balloonText,w=c.container,x;for(x=0;x<b.length;x++){var p=b[x];p.chart=c;p.baseSettings=d;var z=w.set();p.displayObject=
z;this.allSvgObjects.push(z);this.allObjects.push(p);p.mouseEnabled&&c.addObjectEventListeners(z,p);if(p.remainVisible||c.selectedObject==p.parentObject){var A=p.thickness;isNaN(A)&&(A=h);var D=p.dashLength;isNaN(D)&&(D=k);var E=p.color;void 0==E&&(E=u);var B=p.alpha;isNaN(B)&&(B=y);var C=p.rollOverAlpha;isNaN(C)&&(C=s);isNaN(C)&&(C=B);var F=p.rollOverColor;void 0==F&&(F=q);var K=p.selectedColor;void 0==K&&(K=r);var H=p.balloonText;H||(H=t);var I=p.arrow;if(!I||"none"==I&&"none"!=l)I=l;var L=p.arrowColor;
void 0==L&&(L=n);void 0==L&&(L=E);var M=p.arrowAlpha;isNaN(M)&&(M=v);isNaN(M)&&(M=B);var J=p.arrowSize;isNaN(J)&&(J=m);p.alphaReal=B;p.colorReal=E;p.rollOverColorReal=F;p.rollOverAlphaReal=C;p.balloonTextReal=H;p.selectedColorReal=K;p.thicknessReal=A;AmCharts.processDescriptionWindow(d,p);var C=this.processCoordinates(p.x,c.realWidth),F=this.processCoordinates(p.y,c.realHeight),P=p.longitudes,H=p.latitudes,R=P.length,N;if(0<R)for(C=[],N=0;N<R;N++)C.push(c.longitudeToCoordinate(P[N]));R=H.length;if(0<
R)for(F=[],N=0;N<R;N++)F.push(c.latitudeToCoordinate(H[N]));if(0<C.length){AmCharts.dx=0;AmCharts.dy=0;P=AmCharts.line(w,C,F,E,1,A,D,!1,!1,!0);D=AmCharts.line(w,C,F,E,0.001,3,D,!1,!1,!0);AmCharts.dx=0.5;AmCharts.dy=0.5;z.push(P);z.push(D);z.setAttr("opacity",B);if("none"!=I){var G,O,Q;if("end"==I||"both"==I)B=C[C.length-1],D=F[F.length-1],1<C.length?(E=C[C.length-2],G=F[F.length-2]):(E=B,G=D),G=180*Math.atan((D-G)/(B-E))/Math.PI,O=B,Q=D,G=0>B-E?G-90:G+90;"both"==I&&(B=AmCharts.polygon(w,[-J/2,0,J/
2],[1.5*J,0,1.5*J],L,M,1,L,M),z.push(B),B.translate(O,Q),B.rotate(G),p.fixedSize&&f.push(B));if("start"==I||"both"==I)B=C[0],Q=F[0],1<C.length?(D=C[1],O=F[1]):(D=B,O=Q),G=180*Math.atan((Q-O)/(B-D))/Math.PI,O=B,G=0>B-D?G-90:G+90;"middle"==I&&(B=C[C.length-1],D=F[F.length-1],1<C.length?(E=C[C.length-2],G=F[F.length-2]):(E=B,G=D),O=E+(B-E)/2,Q=G+(D-G)/2,G=180*Math.atan((D-G)/(B-E))/Math.PI,G=0>B-E?G-90:G+90);B=AmCharts.polygon(w,[-J/2,0,J/2],[1.5*J,0,1.5*J],L,M,1,L,M);z.push(B);B.translate(O,Q);B.rotate(G);
p.fixedSize&&f.push(B)}p.fixedSize&&P&&this.linesToResize.push({line:P,thickness:A});p.showAsSelected&&!isNaN(K)&&P.setAttr("stroke",K);0<H.length?e.push(z):g.push(z)}}}a.parentObject&&a.remainVisible&&this.process(a.parentObject)},processCoordinates:function(a,b){var c=[],d;for(d=0;d<a.length;d++){var f=a[d],e=Number(f);isNaN(e)&&(e=Number(f.replace("%",""))*b/100);isNaN(e)||c.push(e)}return c},reset:function(){this.objectsToResize=[];this.allSvgObjects=[];this.allObjects=[];this.linesToResize=[]}});AmCharts.LinesSettings=AmCharts.Class({construct:function(){this.balloonText="[[title]]";this.thickness=1;this.dashLength=0;this.arrowSize=10;this.arrowAlpha=1;this.arrow="none";this.color="#990000";this.descriptionWindowWidth=250}});AmCharts.MapObject=AmCharts.Class({construct:function(){this.fixedSize=this.mouseEnabled=!0;this.images=[];this.lines=[];this.areas=[];this.remainVisible=!0;this.passZoomValuesToTarget=!1}});AmCharts.MapArea=AmCharts.Class({inherits:AmCharts.MapObject,construct:function(){this.objectType="MapArea";AmCharts.MapArea.base.construct.call(this)}});AmCharts.MapLine=AmCharts.Class({inherits:AmCharts.MapObject,construct:function(){this.longitudes=[];this.latitudes=[];this.x=[];this.y=[];this.objectType="MapLine";this.arrow="none";AmCharts.MapLine.base.construct.call(this)}});AmCharts.MapImage=AmCharts.Class({inherits:AmCharts.MapObject,construct:function(){this.scale=1;this.widthAndHeightUnits="pixels";this.objectType="MapImage";this.labelShiftY=this.labelShiftX=0;AmCharts.MapImage.base.construct.call(this)},remove:function(){var a=this.displayObject;a&&a.remove();(a=this.imageLabel)&&a.remove()}});AmCharts.degreesToRadians=function(a){return a/180*Math.PI};AmCharts.radiansToDegrees=function(a){return 180*(a/Math.PI)};AmCharts.getColorFade=function(a,b,c){var d=AmCharts.hex2RGB(b);b=d[0];var f=d[1],d=d[2],e=AmCharts.hex2RGB(a);a=e[0];var g=e[1],e=e[2];a+=Math.round((b-a)*c);g+=Math.round((f-g)*c);e+=Math.round((d-e)*c);return"rgb("+a+","+g+","+e+")"};AmCharts.hex2RGB=function(a){return[parseInt(a.substring(1,3),16),parseInt(a.substring(3,5),16),parseInt(a.substring(5,7),16)]};
AmCharts.processDescriptionWindow=function(a,b){var c=a.descriptionWindowX,d=a.descriptionWindowY,f=a.descriptionWindowWidth,e=a.descriptionWindowHeight,g=b.descriptionWindowX;isNaN(g)&&(g=c);c=b.descriptionWindowY;isNaN(c)&&(c=d);d=b.descriptionWindowWidth;isNaN(d)&&(d=f);f=b.descriptionWindowHeight;isNaN(f)&&(f=e);b.descriptionWindowX=g;b.descriptionWindowY=c;b.descriptionWindowWidth=d;b.descriptionWindowHeight=f};AmCharts.MapData=AmCharts.Class({inherits:AmCharts.MapObject,construct:function(){AmCharts.MapData.base.construct.call(this);this.projection="mercator";this.topLatitude=90;this.bottomLatitude=-90;this.leftLongitude=-180;this.rightLongitude=180;this.zoomLevel=1;this.objectType="MapData";this.getAreasFromMap=!1}});AmCharts.DescriptionWindow=AmCharts.Class({construct:function(){},show:function(a,b,c,d){var f=this,e=document.createElement("div");e.style.position="absolute";e.className="ammapDescriptionWindow";f.div=e;b.appendChild(e);var g=document.createElement("img");g.className="ammapDescriptionWindowCloseButton";g.src=a.pathToImages+"xIcon.svg";g.style.cssFloat="right";g.onclick=function(){f.close()};g.onmouseover=function(){g.src=a.pathToImages+"xIconH.svg"};g.onmouseout=function(){g.src=a.pathToImages+
"xIcon.svg"};e.appendChild(g);b=document.createElement("div");b.className="ammapDescriptionTitle";b.onmousedown=function(){f.div.style.zIndex=1E3};e.appendChild(b);d=document.createTextNode(d);b.appendChild(d);d=b.offsetHeight;b=document.createElement("div");b.className="ammapDescriptionText";b.style.maxHeight=f.maxHeight-d-20+"px";e.appendChild(b);b.innerHTML=c},close:function(){try{this.div.parentNode.removeChild(this.div)}catch(a){}}});AmCharts.ValueLegend=AmCharts.Class({construct:function(){this.showAsGradient=!1;this.minValue=0;this.height=12;this.width=200;this.bottom=this.left=10;this.borderColor="#FFFFFF";this.borderAlpha=this.borderThickness=1;this.color="#000000";this.fontSize=11},init:function(a,b){var c=a.areasSettings.color,d=a.areasSettings.colorSolid,f=a.colorSteps;AmCharts.remove(this.set);var e=b.set();this.set=e;var g=0,h=this.minValue,k=this.fontSize,l=a.fontFamily,m=this.color;void 0==h&&(h=a.minValueReal);void 0!==
h&&(g=AmCharts.text(b,h,m,l,k,"left"),g.translate(0,k/2-1),e.push(g),g=g.getBBox().height);h=this.maxValue;void 0===h&&(h=a.maxValueReal);void 0!==h&&(g=AmCharts.text(b,h,m,l,k,"right"),g.translate(this.width,k/2-1),e.push(g),g=g.getBBox().height);if(this.showAsGradient)c=AmCharts.rect(b,this.width,this.height,[c,d],1,this.borderThickness,this.borderColor,1,0,0),c.translate(0,g),e.push(c);else for(k=this.width/f,l=0;l<f;l++)m=AmCharts.getColorFade(c,d,1*l/(f-1)),m=AmCharts.rect(b,k,this.height,m,
1,this.borderThickness,this.borderColor,1),m.translate(k*l,g),e.push(m);d=c=0;f=e.getBBox();g=a.getY(this.bottom,!0);k=a.getY(this.top);l=a.getX(this.right,!0);m=a.getX(this.left);isNaN(k)||(c=k);isNaN(g)||(c=g-f.height);isNaN(m)||(d=m);isNaN(l)||(d=l-f.width);e.translate(d,c)}});AmCharts.ObjectList=AmCharts.Class({construct:function(a){this.div="object"!=typeof a?document.getElementById(a):a},init:function(a){this.chart=a;var b=document.createElement("div");b.className="ammapObjectList";this.div.appendChild(b);this.addObjects(a.dataProvider,b)},addObjects:function(a,b){var c=this.chart,d=document.createElement("ul"),f;if(a.areas)for(f=0;f<a.areas.length;f++){var e=a.areas[f];void 0===e.showInList&&(e.showInList=c.showAreasInList);this.addObject(e,d)}if(a.images)for(f=0;f<
a.images.length;f++)e=a.images[f],void 0===e.showInList&&(e.showInList=c.showImagesInList),this.addObject(e,d);if(a.lines)for(f=0;f<a.lines.length;f++)e=a.lines[f],void 0===e.showInList&&(e.showInList=c.showLinesInList),this.addObject(e,d);0<d.childNodes.length&&b.appendChild(d)},addObject:function(a,b){var c=this;if(a.showInList&&void 0!==a.title){var d=document.createElement("li"),f=document.createTextNode(a.title),e=document.createElement("a");e.appendChild(f);d.appendChild(e);b.appendChild(d);
this.addObjects(a,d);e.onmouseover=function(){c.chart.rollOverMapObject(a,!1)};e.onmouseout=function(){c.chart.rollOutMapObject(a)};e.onclick=function(){c.chart.clickMapObject(a)}}}});
/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/

if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el    = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    this.sliding = true

    isCycling && this.pause()

    $next = $next.length ? $next : this.$element.find('.item')[fallback]()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .accordion-group > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent=' + parent + ']').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')
    }

    $this.focus()

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element).on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function () {
    return this[!this.isShown ? 'show' : 'hide']()
  }

  Modal.prototype.show = function () {
    var that = this
    var e    = $.Event('show.bs.modal')

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      transition ?
        that.$element
          .one($.support.transition.end, function () {
            that.$element.focus().trigger('shown.bs.modal')
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger('shown.bs.modal')
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(function () {
    var $body = $(document.body)
      .on('shown.bs.modal',  '.modal', function () { $body.addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $body.removeClass('modal-open') })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var defaults = this.getDefaults()
    var options  = {}

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](options).data('bs.' + this.type)

    clearTimeout(self.timeout)

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.hoverState = 'in'
    self.timeout    = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this._options).data('bs.' + this.type)

    clearTimeout(self.timeout)

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.hoverState = 'out'
    self.timeout    = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var tp = placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
               placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
               placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
            /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

      this.applyPlacement(tp, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    offset.top  = offset.top  + parseInt($tip.css('margin-top'), 10)
    offset.left = offset.left + parseInt($tip.css('margin-left'), 10)

    $tip
      .offset(offset)
      .addClass('in')

    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top  = offset.top + height - actualHeight
    }

    if (placement == 'bottom' || placement == 'top') {
      var delta = 0

      if (offset.left < 0){
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() { $tip.detach() }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow =function(){
    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this._options).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    $tip.find('.popover-title:empty').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
d3=function(){function n(n){return null!=n&&!isNaN(n)}function t(n){return n.length}function e(n){for(var t=1;n*t%1;)t*=10;return t}function r(n,t){try{for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}catch(r){n.prototype=t}}function i(){}function u(){}function a(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function o(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.substring(1);for(var e=0,r=Ca.length;r>e;++e){var i=Ca[e]+t;if(i in n)return i}}function c(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}function l(n){return Array.prototype.slice.call(n)}function s(){}function f(){}function h(n){function t(){for(var t,r=e,i=-1,u=r.length;++i<u;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new i;return t.on=function(t,i){var u,a=r.get(t);return arguments.length<2?a&&a.on:(a&&(a.on=null,e=e.slice(0,u=e.indexOf(a)).concat(e.slice(u+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function g(){ya.event.preventDefault()}function p(){for(var n,t=ya.event;n=t.sourceEvent;)t=n;return t}function m(n){for(var t=new f,e=0,r=arguments.length;++e<r;)t[arguments[e]]=h(t);return t.of=function(e,r){return function(i){try{var u=i.sourceEvent=ya.event;i.target=n,ya.event=i,t[i.type].apply(e,r)}finally{ya.event=u}}},t}function d(n){return La(n,Ya),n}function v(n){return"function"==typeof n?n:function(){return Ha(n,this)}}function y(n){return"function"==typeof n?n:function(){return Fa(n,this)}}function M(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function u(){this.setAttributeNS(n.space,n.local,t)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ya.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?o:a:n.local?u:i}function x(n){return n.trim().replace(/\s+/g," ")}function b(n){return new RegExp("(?:^|\\s+)"+ya.requote(n)+"(?:\\s+|$)","g")}function _(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=n.trim().split(/\s+/).map(w);var i=n.length;return"function"==typeof t?r:e}function w(n){var t=b(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",x(i+" "+n))):e.setAttribute("class",x(i.replace(t," ")))}}function S(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function u(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?u:i}function E(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function k(n){return"function"==typeof n?n:(n=ya.ns.qualify(n)).local?function(){return Ma.createElementNS(n.space,n.local)}:function(){return Ma.createElementNS(this.namespaceURI,n)}}function A(n){return{__data__:n}}function N(n){return function(){return Oa(this,n)}}function q(n){return arguments.length||(n=ya.ascending),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function T(n,t){for(var e=0,r=n.length;r>e;e++)for(var i,u=n[e],a=0,o=u.length;o>a;a++)(i=u[a])&&t(i,a,e);return n}function C(n){return La(n,Ua),n}function z(n){var t,e;return function(r,i,u){var a,o=n[u].update,c=o.length;for(u!=e&&(e=u,t=0),i>=t&&(t=i+1);!(a=o[t])&&++t<c;);return a}}function D(n,t,e){function r(){var t=this[a];t&&(this.removeEventListener(n,t,t.$),delete this[a])}function i(){var i=c(t,za(arguments));r.call(this),this.addEventListener(n,this[a]=i,i.$=e),i._=t}function u(){var t,e=new RegExp("^__on([^.]+)"+ya.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var a="__on"+n,o=n.indexOf("."),c=j;o>0&&(n=n.substring(0,o));var l=Va.get(n);return l&&(n=l,c=L),o?t?i:r:t?s:u}function j(n,t){return function(e){var r=ya.event;ya.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ya.event=r}}}function L(n,t){var e=j(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function H(){var n=".dragsuppress-"+ ++Za,t="touchmove"+n,e="selectstart"+n,r="dragstart"+n,i="click"+n,u=ya.select(ba).on(t,g).on(e,g).on(r,g),a=xa.style,o=a[Xa];return a[Xa]="none",function(t){function e(){u.on(i,null)}u.on(n,null),a[Xa]=o,t&&(u.on(i,function(){g(),e()},!0),setTimeout(e,0))}}function F(n,t){var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>Ba&&(ba.scrollX||ba.scrollY)){e=ya.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var i=e[0][0].getScreenCTM();Ba=!(i.f||i.e),e.remove()}return Ba?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var u=n.getBoundingClientRect();return[t.clientX-u.left-n.clientLeft,t.clientY-u.top-n.clientTop]}function P(){}function O(n,t,e){return new Y(n,t,e)}function Y(n,t,e){this.h=n,this.s=t,this.l=e}function R(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?u+(a-u)*n/60:180>n?a:240>n?u+(a-u)*(240-n)/60:u}function i(n){return Math.round(255*r(n))}var u,a;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,a=.5>=e?e*(1+t):e+t-e*t,u=2*e-a,at(i(n+120),i(n),i(n-120))}function U(n){return n>0?1:0>n?-1:0}function I(n){return n>1?0:-1>n?Ka:Math.acos(n)}function V(n){return n>1?Ka/2:-1>n?-Ka/2:Math.asin(n)}function X(n){return(Math.exp(n)-Math.exp(-n))/2}function Z(n){return(Math.exp(n)+Math.exp(-n))/2}function B(n){return(n=Math.sin(n/2))*n}function $(n,t,e){return new W(n,t,e)}function W(n,t,e){this.h=n,this.c=t,this.l=e}function J(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),G(e,Math.cos(n*=to)*t,Math.sin(n)*t)}function G(n,t,e){return new K(n,t,e)}function K(n,t,e){this.l=n,this.a=t,this.b=e}function Q(n,t,e){var r=(n+16)/116,i=r+t/500,u=r-e/200;return i=tt(i)*uo,r=tt(r)*ao,u=tt(u)*oo,at(rt(3.2404542*i-1.5371385*r-.4985314*u),rt(-.969266*i+1.8760108*r+.041556*u),rt(.0556434*i-.2040259*r+1.0572252*u))}function nt(n,t,e){return n>0?$(Math.atan2(e,t)*eo,Math.sqrt(t*t+e*e),n):$(0/0,0/0,n)}function tt(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function et(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function rt(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function it(n){return at(n>>16,255&n>>8,255&n)}function ut(n){return it(n)+""}function at(n,t,e){return new ot(n,t,e)}function ot(n,t,e){this.r=n,this.g=t,this.b=e}function ct(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function lt(n,t,e){var r,i,u,a=0,o=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(gt(i[0]),gt(i[1]),gt(i[2]))}return(u=so.get(n))?t(u.r,u.g,u.b):(null!=n&&"#"===n.charAt(0)&&(4===n.length?(a=n.charAt(1),a+=a,o=n.charAt(2),o+=o,c=n.charAt(3),c+=c):7===n.length&&(a=n.substring(1,3),o=n.substring(3,5),c=n.substring(5,7)),a=parseInt(a,16),o=parseInt(o,16),c=parseInt(c,16)),t(a,o,c))}function st(n,t,e){var r,i,u=Math.min(n/=255,t/=255,e/=255),a=Math.max(n,t,e),o=a-u,c=(a+u)/2;return o?(i=.5>c?o/(a+u):o/(2-a-u),r=n==a?(t-e)/o+(e>t?6:0):t==a?(e-n)/o+2:(n-t)/o+4,r*=60):(r=0/0,i=c>0&&1>c?0:r),O(r,i,c)}function ft(n,t,e){n=ht(n),t=ht(t),e=ht(e);var r=et((.4124564*n+.3575761*t+.1804375*e)/uo),i=et((.2126729*n+.7151522*t+.072175*e)/ao),u=et((.0193339*n+.119192*t+.9503041*e)/oo);return G(116*i-16,500*(r-i),200*(i-u))}function ht(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function gt(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function pt(n){return"function"==typeof n?n:function(){return n}}function mt(n){return n}function dt(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),vt(t,e,n,r)}}function vt(n,t,e,r){function i(){var n,t=c.status;if(!t&&c.responseText||t>=200&&300>t||304===t){try{n=e.call(u,c)}catch(r){return a.error.call(u,r),void 0}a.load.call(u,n)}else a.error.call(u,c)}var u={},a=ya.dispatch("progress","load","error"),o={},c=new XMLHttpRequest,l=null;return!ba.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=i:c.onreadystatechange=function(){c.readyState>3&&i()},c.onprogress=function(n){var t=ya.event;ya.event=n;try{a.progress.call(u,c)}finally{ya.event=t}},u.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?o[n]:(null==t?delete o[n]:o[n]=t+"",u)},u.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",u):t},u.responseType=function(n){return arguments.length?(l=n,u):l},u.response=function(n){return e=n,u},["get","post"].forEach(function(n){u[n]=function(){return u.send.apply(u,[n].concat(za(arguments)))}}),u.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),c.open(e,n,!0),null==t||"accept"in o||(o.accept=t+",*/*"),c.setRequestHeader)for(var a in o)c.setRequestHeader(a,o[a]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=l&&(c.responseType=l),null!=i&&u.on("error",i).on("load",function(n){i(null,n)}),c.send(null==r?null:r),u},u.abort=function(){return c.abort(),u},ya.rebind(u,a,"on"),null==r?u:u.get(yt(r))}function yt(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Mt(){var n=bt(),t=_t()-n;t>24?(isFinite(t)&&(clearTimeout(po),po=setTimeout(Mt,t)),go=0):(go=1,vo(Mt))}function xt(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now()),mo.callback=n,mo.time=e+t}function bt(){var n=Date.now();for(mo=fo;mo;)n>=mo.time&&(mo.flush=mo.callback(n-mo.time)),mo=mo.next;return n}function _t(){for(var n,t=fo,e=1/0;t;)t.flush?t=n?n.next=t.next:fo=t.next:(t.time<e&&(e=t.time),t=(n=t).next);return ho=n,e}function wt(n,t){var e=Math.pow(10,3*Math.abs(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function St(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Et(n){return n+""}function kt(){}function At(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}function Nt(n,t){n&&qo.hasOwnProperty(n.type)&&qo[n.type](n,t)}function qt(n,t,e){var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1]);t.lineEnd()}function Tt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)qt(n[e],t,1);t.polygonEnd()}function Ct(){function n(n,t){n*=to,t=t*to/2+Ka/4;var e=n-r,a=Math.cos(t),o=Math.sin(t),c=u*o,l=i*a+c*Math.cos(e),s=c*Math.sin(e);Co.add(Math.atan2(s,l)),r=n,i=a,u=o}var t,e,r,i,u;zo.point=function(a,o){zo.point=n,r=(t=a)*to,i=Math.cos(o=(e=o)*to/2+Ka/4),u=Math.sin(o)},zo.lineEnd=function(){n(t,e)}}function zt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function Dt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function jt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Lt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function Ht(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Ft(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function Pt(n){return[Math.atan2(n[1],n[0]),V(n[2])]}function Ot(n,t){return Math.abs(n[0]-t[0])<Qa&&Math.abs(n[1]-t[1])<Qa}function Yt(n,t){n*=to;var e=Math.cos(t*=to);Rt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Rt(n,t,e){++Do,Lo+=(n-Lo)/Do,Ho+=(t-Ho)/Do,Fo+=(e-Fo)/Do}function Ut(){function n(n,i){n*=to;var u=Math.cos(i*=to),a=u*Math.cos(n),o=u*Math.sin(n),c=Math.sin(i),l=Math.atan2(Math.sqrt((l=e*c-r*o)*l+(l=r*a-t*c)*l+(l=t*o-e*a)*l),t*a+e*o+r*c);jo+=l,Po+=l*(t+(t=a)),Oo+=l*(e+(e=o)),Yo+=l*(r+(r=c)),Rt(t,e,r)}var t,e,r;Vo.point=function(i,u){i*=to;var a=Math.cos(u*=to);t=a*Math.cos(i),e=a*Math.sin(i),r=Math.sin(u),Vo.point=n,Rt(t,e,r)}}function It(){Vo.point=Yt}function Vt(){function n(n,t){n*=to;var e=Math.cos(t*=to),a=e*Math.cos(n),o=e*Math.sin(n),c=Math.sin(t),l=i*c-u*o,s=u*a-r*c,f=r*o-i*a,h=Math.sqrt(l*l+s*s+f*f),g=r*a+i*o+u*c,p=h&&-I(g)/h,m=Math.atan2(h,g);Ro+=p*l,Uo+=p*s,Io+=p*f,jo+=m,Po+=m*(r+(r=a)),Oo+=m*(i+(i=o)),Yo+=m*(u+(u=c)),Rt(r,i,u)}var t,e,r,i,u;Vo.point=function(a,o){t=a,e=o,Vo.point=n,a*=to;var c=Math.cos(o*=to);r=c*Math.cos(a),i=c*Math.sin(a),u=Math.sin(o),Rt(r,i,u)},Vo.lineEnd=function(){n(t,e),Vo.lineEnd=It,Vo.point=Yt}}function Xt(){return!0}function Zt(n,t,e,r,i){var u=[],a=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Ot(e,r)){i.lineStart();for(var o=0;t>o;++o)i.point((e=n[o])[0],e[1]);return i.lineEnd(),void 0}var c={point:e,points:n,other:null,visited:!1,entry:!0,subject:!0},l={point:e,points:[e],other:c,visited:!1,entry:!1,subject:!1};c.other=l,u.push(c),a.push(l),c={point:r,points:[r],other:null,visited:!1,entry:!1,subject:!0},l={point:r,points:[r],other:c,visited:!1,entry:!0,subject:!1},c.other=l,u.push(c),a.push(l)}}),a.sort(t),Bt(u),Bt(a),u.length){if(e)for(var o=1,c=!e(a[0].point),l=a.length;l>o;++o)a[o].entry=c=!c;for(var s,f,h,g=u[0];;){for(s=g;s.visited;)if((s=s.next)===g)return;f=s.points,i.lineStart();do{if(s.visited=s.other.visited=!0,s.entry){if(s.subject)for(var o=0;o<f.length;o++)i.point((h=f[o])[0],h[1]);else r(s.point,s.next.point,1,i);s=s.next}else{if(s.subject){f=s.prev.points;for(var o=f.length;--o>=0;)i.point((h=f[o])[0],h[1])}else r(s.point,s.prev.point,-1,i);s=s.prev}s=s.other,f=s.points}while(!s.visited);i.lineEnd()}}}function Bt(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.next=e=n[r],e.prev=i,i=e;i.next=e=n[0],e.prev=i}}function $t(n,t,e,r){return function(i){function u(t,e){n(t,e)&&i.point(t,e)}function a(n,t){m.point(n,t)}function o(){d.point=a,m.lineStart()}function c(){d.point=u,m.lineEnd()}function l(n,t){y.point(n,t),p.push([n,t])}function s(){y.lineStart(),p=[]}function f(){l(p[0][0],p[0][1]),y.lineEnd();var n,t=y.clean(),e=v.buffer(),r=e.length;if(p.pop(),g.push(p),p=null,r){if(1&t){n=e[0];var u,r=n.length-1,a=-1;for(i.lineStart();++a<r;)i.point((u=n[a])[0],u[1]);return i.lineEnd(),void 0}r>1&&2&t&&e.push(e.pop().concat(e.shift())),h.push(e.filter(Wt))}}var h,g,p,m=t(i),d={point:u,lineStart:o,lineEnd:c,polygonStart:function(){d.point=l,d.lineStart=s,d.lineEnd=f,h=[],g=[],i.polygonStart()},polygonEnd:function(){d.point=u,d.lineStart=o,d.lineEnd=c,h=ya.merge(h),h.length?Zt(h,Gt,null,e,i):r(g)&&(i.lineStart(),e(null,null,1,i),i.lineEnd()),i.polygonEnd(),h=g=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},v=Jt(),y=t(v);return d}}function Wt(n){return n.length>1}function Jt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:s,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Gt(n,t){return((n=n.point)[0]<0?n[1]-Ka/2-Qa:Ka/2-n[1])-((t=t.point)[0]<0?t[1]-Ka/2-Qa:Ka/2-t[1])}function Kt(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,a=!1,o=!1,c=0;Co.reset();for(var l=0,s=t.length;s>l;++l){var f=t[l],h=f.length;if(h){for(var g=f[0],p=g[0],m=g[1]/2+Ka/4,d=Math.sin(m),v=Math.cos(m),y=1;;){y===h&&(y=0),n=f[y];var M=n[0],x=n[1]/2+Ka/4,b=Math.sin(x),_=Math.cos(x),w=M-p,S=Math.abs(w)>Ka,E=d*b;if(Co.add(Math.atan2(E*Math.sin(w),v*_+E*Math.cos(w))),Math.abs(x)<Qa&&(o=!0),u+=S?w+(w>=0?2:-2)*Ka:w,S^p>=e^M>=e){var k=jt(zt(g),zt(n));Ft(k);var A=jt(i,k);Ft(A);var N=(S^w>=0?-1:1)*V(A[2]);r>N&&(c+=S^w>=0?1:-1)}if(!y++)break;p=M,d=b,v=_,g=n}Math.abs(u)>Qa&&(a=!0)}}return(!o&&!a&&0>Co||-Qa>u)^1&c}function Qt(n){var t,e=0/0,r=0/0,i=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(u,a){var o=u>0?Ka:-Ka,c=Math.abs(u-e);Math.abs(c-Ka)<Qa?(n.point(e,r=(r+a)/2>0?Ka/2:-Ka/2),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),n.point(u,r),t=0):i!==o&&c>=Ka&&(Math.abs(e-i)<Qa&&(e-=i*Qa),Math.abs(u-o)<Qa&&(u-=o*Qa),r=ne(e,r,u,a),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(o,r),t=0),n.point(e=u,r=a),i=o},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function ne(n,t,e,r){var i,u,a=Math.sin(n-e);return Math.abs(a)>Qa?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*a)):(t+r)/2}function te(n,t,e,r){var i;if(null==n)i=e*Ka/2,r.point(-Ka,i),r.point(0,i),r.point(Ka,i),r.point(Ka,0),r.point(Ka,-i),r.point(0,-i),r.point(-Ka,-i),r.point(-Ka,0),r.point(-Ka,i);else if(Math.abs(n[0]-t[0])>Qa){var u=(n[0]<t[0]?1:-1)*Ka;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)}else r.point(t[0],t[1])}function ee(n){return Kt(Zo,n)}function re(n){function t(n,t){return Math.cos(n)*Math.cos(t)>a}function e(n){var e,u,a,c,s;return{lineStart:function(){c=a=!1,s=1},point:function(f,h){var g,p=[f,h],m=t(f,h),d=o?m?0:i(f,h):m?i(f+(0>f?Ka:-Ka),h):0;if(!e&&(c=a=m)&&n.lineStart(),m!==a&&(g=r(e,p),(Ot(e,g)||Ot(p,g))&&(p[0]+=Qa,p[1]+=Qa,m=t(p[0],p[1]))),m!==a)s=0,m?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(l&&e&&o^m){var v;d&u||!(v=r(p,e,!0))||(s=0,o?(n.lineStart(),n.point(v[0][0],v[0][1]),n.point(v[1][0],v[1][1]),n.lineEnd()):(n.point(v[1][0],v[1][1]),n.lineEnd(),n.lineStart(),n.point(v[0][0],v[0][1])))}!m||e&&Ot(e,p)||n.point(p[0],p[1]),e=p,a=m,u=d},lineEnd:function(){a&&n.lineEnd(),e=null},clean:function(){return s|(c&&a)<<1}}}function r(n,t,e){var r=zt(n),i=zt(t),u=[1,0,0],o=jt(r,i),c=Dt(o,o),l=o[0],s=c-l*l;if(!s)return!e&&n;var f=a*c/s,h=-a*l/s,g=jt(u,o),p=Ht(u,f),m=Ht(o,h);Lt(p,m);var d=g,v=Dt(p,d),y=Dt(d,d),M=v*v-y*(Dt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=Ht(d,(-v-x)/y);if(Lt(b,p),b=Pt(b),!e)return b;var _,w=n[0],S=t[0],E=n[1],k=t[1];w>S&&(_=w,w=S,S=_);var A=S-w,N=Math.abs(A-Ka)<Qa,q=N||Qa>A;if(!N&&E>k&&(_=E,E=k,k=_),q?N?E+k>0^b[1]<(Math.abs(b[0]-w)<Qa?E:k):E<=b[1]&&b[1]<=k:A>Ka^(w<=b[0]&&b[0]<=S)){var T=Ht(d,(-v+x)/y);return Lt(T,p),[b,Pt(T)]}}}function i(t,e){var r=o?n:Ka-n,i=0;return-r>t?i|=1:t>r&&(i|=2),-r>e?i|=4:e>r&&(i|=8),i}function u(n){return Kt(c,n)}var a=Math.cos(n),o=a>0,c=[n,0],l=Math.abs(a)>Qa,s=Ne(n,6*to);return $t(t,e,s,u)}function ie(n,t,e,r){function i(r,i){return Math.abs(r[0]-n)<Qa?i>0?0:3:Math.abs(r[0]-e)<Qa?i>0?2:1:Math.abs(r[1]-t)<Qa?i>0?1:0:i>0?3:2}function u(n,t){return a(n.point,t.point)}function a(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}function o(i,u){var a=u[0]-i[0],o=u[1]-i[1],c=[0,1];return Math.abs(a)<Qa&&Math.abs(o)<Qa?n<=i[0]&&i[0]<=e&&t<=i[1]&&i[1]<=r:ue(n-i[0],a,c)&&ue(i[0]-e,-a,c)&&ue(t-i[1],o,c)&&ue(i[1]-r,-o,c)?(c[1]<1&&(u[0]=i[0]+c[1]*a,u[1]=i[1]+c[1]*o),c[0]>0&&(i[0]+=c[0]*a,i[1]+=c[0]*o),!0):!1}return function(c){function l(u){var a=i(u,-1),o=s([0===a||3===a?n:e,a>1?r:t]);return o}function s(n){for(var t=0,e=M.length,r=n[1],i=0;e>i;++i)for(var u,a=1,o=M[i],c=o.length,l=o[0];c>a;++a)u=o[a],l[1]<=r?u[1]>r&&f(l,u,n)>0&&++t:u[1]<=r&&f(l,u,n)<0&&--t,l=u;return 0!==t}function f(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(e[0]-n[0])*(t[1]-n[1])}function h(u,o,c,l){var s=0,f=0;if(null==u||(s=i(u,c))!==(f=i(o,c))||a(u,o)<0^c>0){do l.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+c+4)%4)!==f)}else l.point(o[0],o[1])}function g(i,u){return i>=n&&e>=i&&u>=t&&r>=u}function p(n,t){g(n,t)&&c.point(n,t)}function m(){T.point=v,M&&M.push(x=[]),A=!0,k=!1,S=E=0/0}function d(){y&&(v(b,_),w&&k&&q.rejoin(),y.push(q.buffer())),T.point=p,k&&c.lineEnd()}function v(n,t){n=Math.max(-Bo,Math.min(Bo,n)),t=Math.max(-Bo,Math.min(Bo,t));var e=g(n,t);if(M&&x.push([n,t]),A)b=n,_=t,w=e,A=!1,e&&(c.lineStart(),c.point(n,t));else if(e&&k)c.point(n,t);else{var r=[S,E],i=[n,t];o(r,i)?(k||(c.lineStart(),c.point(r[0],r[1])),c.point(i[0],i[1]),e||c.lineEnd()):e&&(c.lineStart(),c.point(n,t))}S=n,E=t,k=e}var y,M,x,b,_,w,S,E,k,A,N=c,q=Jt(),T={point:p,lineStart:m,lineEnd:d,polygonStart:function(){c=q,y=[],M=[]},polygonEnd:function(){c=N,(y=ya.merge(y)).length?(c.polygonStart(),Zt(y,u,l,h,c),c.polygonEnd()):s([n,t])&&(c.polygonStart(),c.lineStart(),h(null,null,1,c),c.lineEnd(),c.polygonEnd()),y=M=x=null}};return T}}function ue(n,t,e){if(Math.abs(t)<Qa)return 0>=n;var r=n/t;if(t>0){if(r>e[1])return!1;r>e[0]&&(e[0]=r)}else{if(r<e[0])return!1;r<e[1]&&(e[1]=r)}return!0}function ae(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function oe(n){var t=0,e=Ka/3,r=be(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*Ka/180,e=n[1]*Ka/180):[180*(t/Ka),180*(e/Ka)]},i}function ce(n,t){function e(n,t){var e=Math.sqrt(u-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),a-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,u=1+r*(2*i-r),a=Math.sqrt(u)/i;return e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/i,V((u-(n*n+e*e)*i*i)/(2*i))]},e}function le(){function n(n,t){Wo+=i*n-r*t,r=n,i=t}var t,e,r,i;nc.point=function(u,a){nc.point=n,t=r=u,e=i=a},nc.lineEnd=function(){n(t,e)}}function se(n,t){Jo>n&&(Jo=n),n>Ko&&(Ko=n),Go>t&&(Go=t),t>Qo&&(Qo=t)}function fe(){function n(n,t){a.push("M",n,",",t,u)}function t(n,t){a.push("M",n,",",t),o.point=e}function e(n,t){a.push("L",n,",",t)}function r(){o.point=n}function i(){a.push("Z")}var u=he(4.5),a=[],o={point:n,lineStart:function(){o.point=t},lineEnd:r,polygonStart:function(){o.lineEnd=i},polygonEnd:function(){o.lineEnd=r,o.point=n},pointRadius:function(n){return u=he(n),o},result:function(){if(a.length){var n=a.join("");return a=[],n}}};return o}function he(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function ge(n,t){Lo+=n,Ho+=t,++Fo}function pe(){function n(n,r){var i=n-t,u=r-e,a=Math.sqrt(i*i+u*u);Po+=a*(t+n)/2,Oo+=a*(e+r)/2,Yo+=a,ge(t=n,e=r)}var t,e;ec.point=function(r,i){ec.point=n,ge(t=r,e=i)}}function me(){ec.point=ge}function de(){function n(n,t){var e=n-r,u=t-i,a=Math.sqrt(e*e+u*u);Po+=a*(r+n)/2,Oo+=a*(i+t)/2,Yo+=a,a=i*n-r*t,Ro+=a*(r+n),Uo+=a*(i+t),Io+=3*a,ge(r=n,i=t)}var t,e,r,i;ec.point=function(u,a){ec.point=n,ge(t=r=u,e=i=a)},ec.lineEnd=function(){n(t,e)}}function ve(n){function t(t,e){n.moveTo(t,e),n.arc(t,e,a,0,2*Ka)}function e(t,e){n.moveTo(t,e),o.point=r}function r(t,e){n.lineTo(t,e)}function i(){o.point=t}function u(){n.closePath()}var a=4.5,o={point:t,lineStart:function(){o.point=e},lineEnd:i,polygonStart:function(){o.lineEnd=u},polygonEnd:function(){o.lineEnd=i,o.point=t},pointRadius:function(n){return a=n,o},result:s};return o}function ye(n){function t(t){function r(e,r){e=n(e,r),t.point(e[0],e[1])}function i(){M=0/0,S.point=a,t.lineStart()}function a(r,i){var a=zt([r,i]),o=n(r,i);e(M,x,y,b,_,w,M=o[0],x=o[1],y=r,b=a[0],_=a[1],w=a[2],u,t),t.point(M,x)}function o(){S.point=r,t.lineEnd()}function c(){i(),S.point=l,S.lineEnd=s}function l(n,t){a(f=n,h=t),g=M,p=x,m=b,d=_,v=w,S.point=a}function s(){e(M,x,y,b,_,w,g,p,f,m,d,v,u,t),S.lineEnd=o,o()}var f,h,g,p,m,d,v,y,M,x,b,_,w,S={point:r,lineStart:i,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=c},polygonEnd:function(){t.polygonEnd(),S.lineStart=i}};return S}function e(t,u,a,o,c,l,s,f,h,g,p,m,d,v){var y=s-t,M=f-u,x=y*y+M*M;if(x>4*r&&d--){var b=o+g,_=c+p,w=l+m,S=Math.sqrt(b*b+_*_+w*w),E=Math.asin(w/=S),k=Math.abs(Math.abs(w)-1)<Qa?(a+h)/2:Math.atan2(_,b),A=n(k,E),N=A[0],q=A[1],T=N-t,C=q-u,z=M*T-y*C;(z*z/x>r||Math.abs((y*T+M*C)/x-.5)>.3||i>o*g+c*p+l*m)&&(e(t,u,a,o,c,l,N,q,k,b/=S,_/=S,w,d,v),v.point(N,q),e(N,q,k,b,_,w,s,f,h,g,p,m,d,v))}}var r=.5,i=Math.cos(30*to),u=16;return t.precision=function(n){return arguments.length?(u=(r=n*n)>0&&16,t):Math.sqrt(r)},t}function Me(n){var t=ye(function(t,e){return n([t*eo,e*eo])});return function(n){return n=t(n),{point:function(t,e){n.point(t*to,e*to)},sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}}function xe(n){return be(function(){return n})()}function be(n){function t(n){return n=o(n[0]*to,n[1]*to),[n[0]*h+c,l-n[1]*h]}function e(n){return n=o.invert((n[0]-c)/h,(l-n[1])/h),n&&[n[0]*eo,n[1]*eo]}function r(){o=ae(a=Se(v,y,M),u);var n=u(m,d);return c=g-n[0]*h,l=p+n[1]*h,i()}function i(){return s&&(s.valid=!1,s=null),t}var u,a,o,c,l,s,f=ye(function(n,t){return n=u(n,t),[n[0]*h+c,l-n[1]*h]}),h=150,g=480,p=250,m=0,d=0,v=0,y=0,M=0,x=Xo,b=mt,_=null,w=null;return t.stream=function(n){return s&&(s.valid=!1),s=_e(a,x(f(b(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(x=null==n?(_=n,Xo):re((_=+n)*to),i()):_},t.clipExtent=function(n){return arguments.length?(w=n,b=null==n?mt:ie(n[0][0],n[0][1],n[1][0],n[1][1]),i()):w},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(m=n[0]%360*to,d=n[1]%360*to,r()):[m*eo,d*eo]},t.rotate=function(n){return arguments.length?(v=n[0]%360*to,y=n[1]%360*to,M=n.length>2?n[2]%360*to:0,r()):[v*eo,y*eo,M*eo]},ya.rebind(t,f,"precision"),function(){return u=n.apply(this,arguments),t.invert=u.invert&&e,r()}}function _e(n,t){return{point:function(e,r){r=n(e*to,r*to),e=r[0],t.point(e>Ka?e-2*Ka:-Ka>e?e+2*Ka:e,r[1])},sphere:function(){t.sphere()},lineStart:function(){t.lineStart()},lineEnd:function(){t.lineEnd()},polygonStart:function(){t.polygonStart()},polygonEnd:function(){t.polygonEnd()}}}function we(n,t){return[n,t]}function Se(n,t,e){return n?t||e?ae(ke(n),Ae(t,e)):ke(n):t||e?Ae(t,e):we}function Ee(n){return function(t,e){return t+=n,[t>Ka?t-2*Ka:-Ka>t?t+2*Ka:t,e]}}function ke(n){var t=Ee(n);return t.invert=Ee(-n),t}function Ae(n,t){function e(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*r+o*i;return[Math.atan2(c*u-s*a,o*r-l*i),V(s*u+c*a)]}var r=Math.cos(n),i=Math.sin(n),u=Math.cos(t),a=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),o=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*u-c*a;return[Math.atan2(c*u+l*a,o*r+s*i),V(s*r-o*i)]},e}function Ne(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,u,a,o){null!=i?(i=qe(e,i),u=qe(e,u),(a>0?u>i:i>u)&&(i+=2*a*Ka)):(i=n+2*a*Ka,u=n);for(var c,l=a*t,s=i;a>0?s>u:u>s;s-=l)o.point((c=Pt([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],c[1])}}function qe(n,t){var e=zt(t);e[0]-=n,Ft(e);var r=I(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Qa)%(2*Math.PI)}function Te(n,t,e){var r=ya.range(n,t-Qa,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function Ce(n,t,e){var r=ya.range(n,t-Qa,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function ze(n){return n.source}function De(n){return n.target}function je(n,t,e,r){var i=Math.cos(t),u=Math.sin(t),a=Math.cos(r),o=Math.sin(r),c=i*Math.cos(n),l=i*Math.sin(n),s=a*Math.cos(e),f=a*Math.sin(e),h=2*Math.asin(Math.sqrt(B(r-t)+i*a*B(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*s,i=e*l+t*f,a=e*u+t*o;return[Math.atan2(i,r)*eo,Math.atan2(a,Math.sqrt(r*r+i*i))*eo]}:function(){return[n*eo,t*eo]};return p.distance=h,p}function Le(){function n(n,i){var u=Math.sin(i*=to),a=Math.cos(i),o=Math.abs((n*=to)-t),c=Math.cos(o);rc+=Math.atan2(Math.sqrt((o=a*Math.sin(o))*o+(o=r*u-e*a*c)*o),e*u+r*a*c),t=n,e=u,r=a}var t,e,r;ic.point=function(i,u){t=i*to,e=Math.sin(u*=to),r=Math.cos(u),ic.point=n},ic.lineEnd=function(){ic.point=ic.lineEnd=s}}function He(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i);return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),a=Math.cos(i);return[Math.atan2(n*u,r*a),Math.asin(r&&e*u/r)]},e}function Fe(n,t){function e(n,t){var e=Math.abs(Math.abs(t)-Ka/2)<Qa?0:a/Math.pow(i(t),u);return[e*Math.sin(u*n),a-e*Math.cos(u*n)]}var r=Math.cos(n),i=function(n){return Math.tan(Ka/4+n/2)},u=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),a=r*Math.pow(i(n),u)/u;return u?(e.invert=function(n,t){var e=a-t,r=U(u)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/u,2*Math.atan(Math.pow(a/r,1/u))-Ka/2]},e):Oe}function Pe(n,t){function e(n,t){var e=u-t;return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),u=r/i+n;return Math.abs(i)<Qa?we:(e.invert=function(n,t){var e=u-t;return[Math.atan2(n,e)/i,u-U(i)*Math.sqrt(n*n+e*e)]},e)}function Oe(n,t){return[n,Math.log(Math.tan(Ka/4+t/2))]}function Ye(n){var t,e=xe(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var a=u.apply(e,arguments);if(a===e){if(t=null==n){var o=Ka*r(),c=i();u([[c[0]-o,c[1]-o],[c[0]+o,c[1]+o]])}}else t&&(a=null);return a},e.clipExtent(null)}function Re(n,t){var e=Math.cos(t)*Math.sin(n);return[Math.log((1+e)/(1-e))/2,Math.atan2(Math.tan(t),Math.cos(n))]}function Ue(n){function t(t){function a(){l.push("M",u(n(s),o))}for(var c,l=[],s=[],f=-1,h=t.length,g=pt(e),p=pt(r);++f<h;)i.call(this,c=t[f],f)?s.push([+g.call(this,c,f),+p.call(this,c,f)]):s.length&&(a(),s=[]);return s.length&&a(),l.length?l.join(""):null}var e=Ie,r=Ve,i=Xt,u=Xe,a=u.key,o=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(a="function"==typeof n?u=n:(u=sc.get(n)||Xe).key,t):a},t.tension=function(n){return arguments.length?(o=n,t):o},t}function Ie(n){return n[0]}function Ve(n){return n[1]}function Xe(n){return n.join("L")}function Ze(n){return Xe(n)+"Z"}function Be(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function $e(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function We(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function Je(n,t){return n.length<4?Xe(n):n[1]+Qe(n.slice(1,n.length-1),nr(n,t))}function Ge(n,t){return n.length<3?Xe(n):n[0]+Qe((n.push(n[0]),n),nr([n[n.length-2]].concat(n,[n[1]]),t))}function Ke(n,t){return n.length<3?Xe(n):n[0]+Qe(n,nr(n,t))}function Qe(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Xe(n);var e=n.length!=t.length,r="",i=n[0],u=n[1],a=t[0],o=a,c=1;if(e&&(r+="Q"+(u[0]-2*a[0]/3)+","+(u[1]-2*a[1]/3)+","+u[0]+","+u[1],i=n[1],c=2),t.length>1){o=t[1],u=n[c],c++,r+="C"+(i[0]+a[0])+","+(i[1]+a[1])+","+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1];for(var l=2;l<t.length;l++,c++)u=n[c],o=t[l],r+="S"+(u[0]-o[0])+","+(u[1]-o[1])+","+u[0]+","+u[1]}if(e){var s=n[c];r+="Q"+(u[0]+2*o[0]/3)+","+(u[1]+2*o[1]/3)+","+s[0]+","+s[1]}return r}function nr(n,t){for(var e,r=[],i=(1-t)/2,u=n[0],a=n[1],o=1,c=n.length;++o<c;)e=u,u=a,a=n[o],r.push([i*(a[0]-e[0]),i*(a[1]-e[1])]);return r}function tr(n){if(n.length<3)return Xe(n);var t=1,e=n.length,r=n[0],i=r[0],u=r[1],a=[i,i,i,(r=n[1])[0]],o=[u,u,u,r[1]],c=[i,",",u,"L",ur(gc,a),",",ur(gc,o)];for(n.push(n[e-1]);++t<=e;)r=n[t],a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),ar(c,a,o);return n.pop(),c.push("L",r),c.join("")}function er(n){if(n.length<4)return Xe(n);for(var t,e=[],r=-1,i=n.length,u=[0],a=[0];++r<3;)t=n[r],u.push(t[0]),a.push(t[1]);for(e.push(ur(gc,u)+","+ur(gc,a)),--r;++r<i;)t=n[r],u.shift(),u.push(t[0]),a.shift(),a.push(t[1]),ar(e,u,a);return e.join("")}function rr(n){for(var t,e,r=-1,i=n.length,u=i+4,a=[],o=[];++r<4;)e=n[r%i],a.push(e[0]),o.push(e[1]);for(t=[ur(gc,a),",",ur(gc,o)],--r;++r<u;)e=n[r%i],a.shift(),a.push(e[0]),o.shift(),o.push(e[1]),ar(t,a,o);return t.join("")}function ir(n,t){var e=n.length-1;if(e)for(var r,i,u=n[0][0],a=n[0][1],o=n[e][0]-u,c=n[e][1]-a,l=-1;++l<=e;)r=n[l],i=l/e,r[0]=t*r[0]+(1-t)*(u+i*o),r[1]=t*r[1]+(1-t)*(a+i*c);return tr(n)}function ur(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]
}function ar(n,t,e){n.push("C",ur(fc,t),",",ur(fc,e),",",ur(hc,t),",",ur(hc,e),",",ur(gc,t),",",ur(gc,e))}function or(n,t){return(t[1]-n[1])/(t[0]-n[0])}function cr(n){for(var t=0,e=n.length-1,r=[],i=n[0],u=n[1],a=r[0]=or(i,u);++t<e;)r[t]=(a+(a=or(i=u,u=n[t+1])))/2;return r[t]=a,r}function lr(n){for(var t,e,r,i,u=[],a=cr(n),o=-1,c=n.length-1;++o<c;)t=or(n[o],n[o+1]),Math.abs(t)<1e-6?a[o]=a[o+1]=0:(e=a[o]/t,r=a[o+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),a[o]=i*e,a[o+1]=i*r));for(o=-1;++o<=c;)i=(n[Math.min(c,o+1)][0]-n[Math.max(0,o-1)][0])/(6*(1+a[o]*a[o])),u.push([i||0,a[o]*i||0]);return u}function sr(n){return n.length<3?Xe(n):n[0]+Qe(n,lr(n))}function fr(n,t,e,r){var i,u,a,o,c,l,s;return i=r[n],u=i[0],a=i[1],i=r[t],o=i[0],c=i[1],i=r[e],l=i[0],s=i[1],(s-a)*(o-u)-(c-a)*(l-u)>0}function hr(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function gr(n,t,e,r){var i=n[0],u=e[0],a=t[0]-i,o=r[0]-u,c=n[1],l=e[1],s=t[1]-c,f=r[1]-l,h=(o*(c-l)-f*(i-u))/(f*a-o*s);return[i+h*a,c+h*s]}function pr(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function mr(n,t){var e={list:n.map(function(n,t){return{index:t,x:n[0],y:n[1]}}).sort(function(n,t){return n.y<t.y?-1:n.y>t.y?1:n.x<t.x?-1:n.x>t.x?1:0}),bottomSite:null},r={list:[],leftEnd:null,rightEnd:null,init:function(){r.leftEnd=r.createHalfEdge(null,"l"),r.rightEnd=r.createHalfEdge(null,"l"),r.leftEnd.r=r.rightEnd,r.rightEnd.l=r.leftEnd,r.list.unshift(r.leftEnd,r.rightEnd)},createHalfEdge:function(n,t){return{edge:n,side:t,vertex:null,l:null,r:null}},insert:function(n,t){t.l=n,t.r=n.r,n.r.l=t,n.r=t},leftBound:function(n){var t=r.leftEnd;do t=t.r;while(t!=r.rightEnd&&i.rightOf(t,n));return t=t.l},del:function(n){n.l.r=n.r,n.r.l=n.l,n.edge=null},right:function(n){return n.r},left:function(n){return n.l},leftRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[n.side]},rightRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[mc[n.side]]}},i={bisect:function(n,t){var e={region:{l:n,r:t},ep:{l:null,r:null}},r=t.x-n.x,i=t.y-n.y,u=r>0?r:-r,a=i>0?i:-i;return e.c=n.x*r+n.y*i+.5*(r*r+i*i),u>a?(e.a=1,e.b=i/r,e.c/=r):(e.b=1,e.a=r/i,e.c/=i),e},intersect:function(n,t){var e=n.edge,r=t.edge;if(!e||!r||e.region.r==r.region.r)return null;var i=e.a*r.b-e.b*r.a;if(Math.abs(i)<1e-10)return null;var u,a,o=(e.c*r.b-r.c*e.b)/i,c=(r.c*e.a-e.c*r.a)/i,l=e.region.r,s=r.region.r;l.y<s.y||l.y==s.y&&l.x<s.x?(u=n,a=e):(u=t,a=r);var f=o>=a.region.r.x;return f&&"l"===u.side||!f&&"r"===u.side?null:{x:o,y:c}},rightOf:function(n,t){var e=n.edge,r=e.region.r,i=t.x>r.x;if(i&&"l"===n.side)return 1;if(!i&&"r"===n.side)return 0;if(1===e.a){var u=t.y-r.y,a=t.x-r.x,o=0,c=0;if(!i&&e.b<0||i&&e.b>=0?c=o=u>=e.b*a:(c=t.x+t.y*e.b>e.c,e.b<0&&(c=!c),c||(o=1)),!o){var l=r.x-e.region.l.x;c=e.b*(a*a-u*u)<l*u*(1+2*a/l+e.b*e.b),e.b<0&&(c=!c)}}else{var s=e.c-e.a*t.x,f=t.y-s,h=t.x-r.x,g=s-r.y;c=f*f>h*h+g*g}return"l"===n.side?c:!c},endPoint:function(n,e,r){n.ep[e]=r,n.ep[mc[e]]&&t(n)},distance:function(n,t){var e=n.x-t.x,r=n.y-t.y;return Math.sqrt(e*e+r*r)}},u={list:[],insert:function(n,t,e){n.vertex=t,n.ystar=t.y+e;for(var r=0,i=u.list,a=i.length;a>r;r++){var o=i[r];if(!(n.ystar>o.ystar||n.ystar==o.ystar&&t.x>o.vertex.x))break}i.splice(r,0,n)},del:function(n){for(var t=0,e=u.list,r=e.length;r>t&&e[t]!=n;++t);e.splice(t,1)},empty:function(){return 0===u.list.length},nextEvent:function(n){for(var t=0,e=u.list,r=e.length;r>t;++t)if(e[t]==n)return e[t+1];return null},min:function(){var n=u.list[0];return{x:n.vertex.x,y:n.ystar}},extractMin:function(){return u.list.shift()}};r.init(),e.bottomSite=e.list.shift();for(var a,o,c,l,s,f,h,g,p,m,d,v,y,M=e.list.shift();;)if(u.empty()||(a=u.min()),M&&(u.empty()||M.y<a.y||M.y==a.y&&M.x<a.x))o=r.leftBound(M),c=r.right(o),h=r.rightRegion(o),v=i.bisect(h,M),f=r.createHalfEdge(v,"l"),r.insert(o,f),m=i.intersect(o,f),m&&(u.del(o),u.insert(o,m,i.distance(m,M))),o=f,f=r.createHalfEdge(v,"r"),r.insert(o,f),m=i.intersect(f,c),m&&u.insert(f,m,i.distance(m,M)),M=e.list.shift();else{if(u.empty())break;o=u.extractMin(),l=r.left(o),c=r.right(o),s=r.right(c),h=r.leftRegion(o),g=r.rightRegion(c),d=o.vertex,i.endPoint(o.edge,o.side,d),i.endPoint(c.edge,c.side,d),r.del(o),u.del(c),r.del(c),y="l",h.y>g.y&&(p=h,h=g,g=p,y="r"),v=i.bisect(h,g),f=r.createHalfEdge(v,y),r.insert(l,f),i.endPoint(v,mc[y],d),m=i.intersect(l,f),m&&(u.del(l),u.insert(l,m,i.distance(m,h))),m=i.intersect(f,s),m&&u.insert(f,m,i.distance(m,h))}for(o=r.right(r.leftEnd);o!=r.rightEnd;o=r.right(o))t(o.edge)}function dr(n){return n.x}function vr(n){return n.y}function yr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function Mr(n,t,e,r,i,u){if(!n(t,e,r,i,u)){var a=.5*(e+i),o=.5*(r+u),c=t.nodes;c[0]&&Mr(n,c[0],e,r,a,o),c[1]&&Mr(n,c[1],a,r,i,o),c[2]&&Mr(n,c[2],e,o,a,u),c[3]&&Mr(n,c[3],a,o,i,u)}}function xr(n,t){n=ya.rgb(n),t=ya.rgb(t);var e=n.r,r=n.g,i=n.b,u=t.r-e,a=t.g-r,o=t.b-i;return function(n){return"#"+ct(Math.round(e+u*n))+ct(Math.round(r+a*n))+ct(Math.round(i+o*n))}}function br(n,t){var e,r={},i={};for(e in n)e in t?r[e]=Sr(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function _r(n,t){return t-=n=+n,function(e){return n+t*e}}function wr(n,t){var e,r,i,u,a,o=0,c=0,l=[],s=[];for(n+="",t+="",dc.lastIndex=0,r=0;e=dc.exec(t);++r)e.index&&l.push(t.substring(o,c=e.index)),s.push({i:l.length,x:e[0]}),l.push(null),o=dc.lastIndex;for(o<t.length&&l.push(t.substring(o)),r=0,u=s.length;(e=dc.exec(n))&&u>r;++r)if(a=s[r],a.x==e[0]){if(a.i)if(null==l[a.i+1])for(l[a.i-1]+=a.x,l.splice(a.i,1),i=r+1;u>i;++i)s[i].i--;else for(l[a.i-1]+=a.x+l[a.i+1],l.splice(a.i,2),i=r+1;u>i;++i)s[i].i-=2;else if(null==l[a.i+1])l[a.i]=a.x;else for(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1),i=r+1;u>i;++i)s[i].i--;s.splice(r,1),u--,r--}else a.x=_r(parseFloat(e[0]),parseFloat(a.x));for(;u>r;)a=s.pop(),null==l[a.i+1]?l[a.i]=a.x:(l[a.i]=a.x+l[a.i+1],l.splice(a.i+1,1)),u--;return 1===l.length?null==l[0]?(a=s[0].x,function(n){return a(n)+""}):function(){return t}:function(n){for(r=0;u>r;++r)l[(a=s[r]).i]=a.x(n);return l.join("")}}function Sr(n,t){for(var e,r=ya.interpolators.length;--r>=0&&!(e=ya.interpolators[r](n,t)););return e}function Er(n,t){var e,r=[],i=[],u=n.length,a=t.length,o=Math.min(n.length,t.length);for(e=0;o>e;++e)r.push(Sr(n[e],t[e]));for(;u>e;++e)i[e]=n[e];for(;a>e;++e)i[e]=t[e];return function(n){for(e=0;o>e;++e)i[e]=r[e](n);return i}}function kr(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function Ar(n){return function(t){return 1-n(1-t)}}function Nr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function qr(n){return n*n}function Tr(n){return n*n*n}function Cr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function zr(n){return function(t){return Math.pow(t,n)}}function Dr(n){return 1-Math.cos(n*Ka/2)}function jr(n){return Math.pow(2,10*(n-1))}function Lr(n){return 1-Math.sqrt(1-n*n)}function Hr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/(2*Ka)*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,10*-r)*Math.sin(2*(r-e)*Ka/t)}}function Fr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Pr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Or(n,t){n=ya.hcl(n),t=ya.hcl(t);var e=n.h,r=n.c,i=n.l,u=t.h-e,a=t.c-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.c:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return J(e+u*n,r+a*n,i+o*n)+""}}function Yr(n,t){n=ya.hsl(n),t=ya.hsl(t);var e=n.h,r=n.s,i=n.l,u=t.h-e,a=t.s-r,o=t.l-i;return isNaN(a)&&(a=0,r=isNaN(r)?t.s:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return R(e+u*n,r+a*n,i+o*n)+""}}function Rr(n,t){n=ya.lab(n),t=ya.lab(t);var e=n.l,r=n.a,i=n.b,u=t.l-e,a=t.a-r,o=t.b-i;return function(n){return Q(e+u*n,r+a*n,i+o*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Ir(n){var t=[n.a,n.b],e=[n.c,n.d],r=Xr(t),i=Vr(t,e),u=Xr(Zr(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*eo,this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*eo:0}function Vr(n,t){return n[0]*t[0]+n[1]*t[1]}function Xr(n){var t=Math.sqrt(Vr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Zr(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Br(n,t){var e,r=[],i=[],u=ya.transform(n),a=ya.transform(t),o=u.translate,c=a.translate,l=u.rotate,s=a.rotate,f=u.skew,h=a.skew,g=u.scale,p=a.scale;return o[0]!=c[0]||o[1]!=c[1]?(r.push("translate(",null,",",null,")"),i.push({i:1,x:_r(o[0],c[0])},{i:3,x:_r(o[1],c[1])})):c[0]||c[1]?r.push("translate("+c+")"):r.push(""),l!=s?(l-s>180?s+=360:s-l>180&&(l+=360),i.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:_r(l,s)})):s&&r.push(r.pop()+"rotate("+s+")"),f!=h?i.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:_r(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),i.push({i:e-4,x:_r(g[0],p[0])},{i:e-2,x:_r(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=i.length,function(n){for(var t,u=-1;++u<e;)r[(t=i[u]).i]=t.x(n);return r.join("")}}function $r(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return(e-n)*t}}function Wr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return Math.max(0,Math.min(1,(e-n)*t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),i=e.pop(),u=r.pop(),a=null;i===u;)a=i,i=e.pop(),u=r.pop();return a}function Qr(n){n.fixed|=2}function ni(n){n.fixed&=-7}function ti(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ei(n){n.fixed&=-5}function ri(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var u,a=n.nodes,o=a.length,c=-1;++c<o;)u=a[c],null!=u&&(ri(u,t,e),n.charge+=u.charge,r+=u.charge*u.cx,i+=u.charge*u.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,i+=l*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function ii(n,t){return ya.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=ci,n}function ui(n){return n.children}function ai(n){return n.value}function oi(n,t){return t.value-n.value}function ci(n){return ya.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function li(n){return n.x}function si(n){return n.y}function fi(n,t,e){n.y0=t,n.y=e}function hi(n){return ya.range(n.length)}function gi(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function pi(n){for(var t,e=1,r=0,i=n[0][1],u=n.length;u>e;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function mi(n){return n.reduce(di,0)}function di(n,t){return n+t[1]}function vi(n,t){return yi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function yi(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r;return u}function Mi(n){return[ya.min(n),ya.max(n)]}function xi(n,t){return n.parent==t.parent?1:2}function bi(n){var t=n.children;return t&&t.length?t[0]:n._tree.thread}function _i(n){var t,e=n.children;return e&&(t=e.length)?e[t-1]:n._tree.thread}function wi(n,t){var e=n.children;if(e&&(i=e.length))for(var r,i,u=-1;++u<i;)t(r=wi(e[u],t),n)>0&&(n=r);return n}function Si(n,t){return n.x-t.x}function Ei(n,t){return t.x-n.x}function ki(n,t){return n.depth-t.depth}function Ai(n,t){function e(n,r){var i=n.children;if(i&&(a=i.length))for(var u,a,o=null,c=-1;++c<a;)u=i[c],e(u,o),o=u;t(n,r)}e(n,null)}function Ni(n){for(var t,e=0,r=0,i=n.children,u=i.length;--u>=0;)t=i[u]._tree,t.prelim+=e,t.mod+=e,e+=t.shift+(r+=t.change)}function qi(n,t,e){n=n._tree,t=t._tree;var r=e/(t.number-n.number);n.change+=r,t.change-=r,t.shift+=e,t.prelim+=e,t.mod+=e}function Ti(n,t,e){return n._tree.ancestor.parent==t.parent?n._tree.ancestor:e}function Ci(n,t){return n.value-t.value}function zi(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Di(n,t){n._pack_next=t,t._pack_prev=n}function ji(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Li(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(l=e.length)){var e,r,i,u,a,o,c,l,s=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(Hi),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(i=e[1],i.x=i.r,i.y=0,t(i),l>2))for(u=e[2],Oi(r,i,u),t(u),zi(r,u),r._pack_prev=u,zi(u,i),i=r._pack_next,a=3;l>a;a++){Oi(r,i,u=e[a]);var p=0,m=1,d=1;for(o=i._pack_next;o!==i;o=o._pack_next,m++)if(ji(o,u)){p=1;break}if(1==p)for(c=r._pack_prev;c!==o._pack_prev&&!ji(c,u);c=c._pack_prev,d++);p?(d>m||m==d&&i.r<r.r?Di(r,i=o):Di(r=c,i),a--):(zi(r,u),i=u,t(u))}var v=(s+f)/2,y=(h+g)/2,M=0;for(a=0;l>a;a++)u=e[a],u.x-=v,u.y-=y,M=Math.max(M,u.r+Math.sqrt(u.x*u.x+u.y*u.y));n.r=M,e.forEach(Fi)}}function Hi(n){n._pack_next=n._pack_prev=n}function Fi(n){delete n._pack_next,delete n._pack_prev}function Pi(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var u=-1,a=i.length;++u<a;)Pi(i[u],t,e,r)}function Oi(n,t,e){var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){var a=t.r+e.r,o=i*i+u*u;a*=a,r*=r;var c=.5+(r-a)/(2*o),l=Math.sqrt(Math.max(0,2*a*(r+o)-(r-=o)*r-a*a))/(2*o);e.x=n.x+c*i+l*u,e.y=n.y+c*u-l*i}else e.x=n.x+r,e.y=n.y}function Yi(n){return 1+ya.max(n,function(n){return n.y})}function Ri(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Ui(n){var t=n.children;return t&&t.length?Ui(t[0]):n}function Ii(n){var t,e=n.children;return e&&(t=e.length)?Ii(e[t-1]):n}function Vi(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Xi(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return 0>i&&(e+=i/2,i=0),0>u&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function Zi(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Bi(n){return n.rangeExtent?n.rangeExtent():Zi(n.range())}function $i(n,t,e,r){var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}function Wi(n,t){var e,r=0,i=n.length-1,u=n[r],a=n[i];return u>a&&(e=r,r=i,i=e,e=u,u=a,a=e),n[r]=t.floor(u),n[i]=t.ceil(a),n}function Ji(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:kc}function Gi(n,t,e,r){var i=[],u=[],a=0,o=Math.min(n.length,t.length)-1;for(n[o]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<=o;)i.push(e(n[a-1],n[a])),u.push(r(t[a-1],t[a]));return function(t){var e=ya.bisect(n,t,1,o)-1;return u[e](i[e](t))}}function Ki(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Gi:$i,c=r?Wr:$r;return a=i(n,t,c,e),o=i(t,n,c,Sr),u}function u(n){return a(n)}var a,o;return u.invert=function(n){return o(n)},u.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},u.range=function(n){return arguments.length?(t=n,i()):t},u.rangeRound=function(n){return u.range(n).interpolate(Ur)},u.clamp=function(n){return arguments.length?(r=n,i()):r},u.interpolate=function(n){return arguments.length?(e=n,i()):e},u.ticks=function(t){return ru(n,t)},u.tickFormat=function(t,e){return iu(n,t,e)},u.nice=function(t){return nu(n,t),i()},u.copy=function(){return Ki(n,t,e,r)},i()}function Qi(n,t){return ya.rebind(n,t,"range","rangeRound","interpolate","clamp")}function nu(n,t){return Wi(n,Ji(t?eu(n,t)[2]:tu(n)))}function tu(n){var t=Zi(n),e=t[1]-t[0];return Math.pow(10,Math.round(Math.log(e)/Math.LN10)-1)}function eu(n,t){var e=Zi(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i;return.15>=u?i*=10:.35>=u?i*=5:.75>=u&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function ru(n,t){return ya.range.apply(ya,eu(n,t))}function iu(n,t,e){var r=-Math.floor(Math.log(eu(n,t)[2])/Math.LN10+.01);return ya.format(e?e.replace(wo,function(n,t,e,i,u,a,o,c,l,s){return[t,e,i,u,a,o,c,l||"."+(r-2*("%"===s)),s].join("")}):",."+r+"f")}function uu(n,t,e,r){function i(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function u(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function a(t){return n(i(t))}return a.invert=function(t){return u(n.invert(t))},a.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(i)),a):r},a.base=function(e){return arguments.length?(t=+e,n.domain(r.map(i)),a):t},a.nice=function(){var t=Wi(r.map(i),e?Math:Nc);return n.domain(t),r=t.map(u),a},a.ticks=function(){var n=Zi(r),a=[],o=n[0],c=n[1],l=Math.floor(i(o)),s=Math.ceil(i(c)),f=t%1?2:t;if(isFinite(s-l)){if(e){for(;s>l;l++)for(var h=1;f>h;h++)a.push(u(l)*h);a.push(u(l))}else for(a.push(u(l));l++<s;)for(var h=f-1;h>0;h--)a.push(u(l)*h);for(l=0;a[l]<o;l++);for(s=a.length;a[s-1]>c;s--);a=a.slice(l,s)}return a},a.tickFormat=function(n,t){if(!arguments.length)return Ac;arguments.length<2?t=Ac:"function"!=typeof t&&(t=ya.format(t));var r,o=Math.max(.1,n/a.ticks().length),c=e?(r=1e-12,Math.ceil):(r=-1e-12,Math.floor);return function(n){return n/u(c(i(n)+r))<=o?t(n):""}},a.copy=function(){return uu(n.copy(),t,e,r)},Qi(a,n)}function au(n,t,e){function r(t){return n(i(t))}var i=ou(t),u=ou(1/t);return r.invert=function(t){return u(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return ru(e,n)},r.tickFormat=function(n,t){return iu(e,n,t)},r.nice=function(n){return r.domain(nu(e,n))},r.exponent=function(a){return arguments.length?(i=ou(t=a),u=ou(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return au(n.copy(),t,e)},Qi(r,n)}function ou(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function cu(n,t){function e(t){return a[((u.get(t)||u.set(t,n.push(t)))-1)%a.length]}function r(t,e){return ya.range(n.length).map(function(n){return t+e*n})}var u,a,o;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new i;for(var a,o=-1,c=r.length;++o<c;)u.has(a=r[o])||u.set(a,n.push(a));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(a=n,o=0,t={t:"range",a:arguments},e):a},e.rangePoints=function(i,u){arguments.length<2&&(u=0);var c=i[0],l=i[1],s=(l-c)/(Math.max(1,n.length-1)+u);return a=r(n.length<2?(c+l)/2:c+s*u/2,s),o=0,t={t:"rangePoints",a:arguments},e},e.rangeBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=(f-s)/(n.length-u+2*c);return a=r(s+h*c,h),l&&a.reverse(),o=h*(1-u),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,u,c){arguments.length<2&&(u=0),arguments.length<3&&(c=u);var l=i[1]<i[0],s=i[l-0],f=i[1-l],h=Math.floor((f-s)/(n.length-u+2*c)),g=f-s-(n.length-u)*h;return a=r(s+Math.round(g/2),h),l&&a.reverse(),o=Math.round(h*(1-u)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Zi(t.a[0])},e.copy=function(){return cu(n,t)},e.domain(n)}function lu(n,t){function e(){var e=0,u=t.length;for(i=[];++e<u;)i[e-1]=ya.quantile(n,e/u);return r}function r(n){return isNaN(n=+n)?void 0:t[ya.bisect(i,n)]}var i;return r.domain=function(t){return arguments.length?(n=t.filter(function(n){return!isNaN(n)}).sort(ya.ascending),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return i},r.invertExtent=function(e){return e=t.indexOf(e),0>e?[0/0,0/0]:[e>0?i[e-1]:n[0],e<i.length?i[e]:n[n.length-1]]},r.copy=function(){return lu(n,t)},e()}function su(n,t,e){function r(t){return e[Math.max(0,Math.min(a,Math.floor(u*(t-n))))]}function i(){return u=e.length/(t-n),a=e.length-1,r}var u,a;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/u+n,[t,t+1/u]},r.copy=function(){return su(n,t,e)},i()}function fu(n,t){function e(e){return e>=e?t[ya.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return fu(n,t)},e}function hu(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return ru(n,t)},t.tickFormat=function(t,e){return iu(n,t,e)},t.copy=function(){return hu(n)},t}function gu(n){return n.innerRadius}function pu(n){return n.outerRadius}function mu(n){return n.startAngle}function du(n){return n.endAngle}function vu(n){for(var t,e,r,i=-1,u=n.length;++i<u;)t=n[i],e=t[0],r=t[1]+Dc,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function yu(n){function t(t){function c(){m.push("M",o(n(v),f),s,l(n(d.reverse()),f),"Z")}for(var h,g,p,m=[],d=[],v=[],y=-1,M=t.length,x=pt(e),b=pt(i),_=e===r?function(){return g}:pt(r),w=i===u?function(){return p}:pt(u);++y<M;)a.call(this,h=t[y],y)?(d.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),v.push([+_.call(this,h,y),+w.call(this,h,y)])):d.length&&(c(),d=[],v=[]);return d.length&&c(),m.length?m.join(""):null}var e=Ie,r=Ie,i=0,u=Ve,a=Xt,o=Xe,c=o.key,l=o,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=u=n,t):u},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(u=n,t):u},t.defined=function(n){return arguments.length?(a=n,t):a},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?o=n:(o=sc.get(n)||Xe).key,l=o.reverse||o,s=o.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Mu(n){return n.radius}function xu(n){return[n.x,n.y]}function bu(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]+Dc;return[e*Math.cos(r),e*Math.sin(r)]}}function _u(){return 64}function wu(){return"circle"}function Su(n){var t=Math.sqrt(n/Ka);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Eu(n,t){return La(n,Yc),n.id=t,n}function ku(n,t,e,r){var i=n.id;return T(n,"function"==typeof e?function(n,u,a){n.__transition__[i].tween.set(t,r(e.call(n,n.__data__,u,a)))}:(e=r(e),function(n){n.__transition__[i].tween.set(t,e)}))}function Au(n){return null==n&&(n=""),function(){this.textContent=n}}function Nu(n,t,e,r){var u=n.__transition__||(n.__transition__={active:0,count:0}),a=u[e];if(!a){var o=r.time;a=u[e]={tween:new i,time:o,ease:r.ease,delay:r.delay,duration:r.duration},++u.count,ya.timer(function(r){function i(r){return u.active>e?l():(u.active=e,a.event&&a.event.start.call(n,s,t),a.tween.forEach(function(e,r){(r=r.call(n,s,t))&&p.push(r)}),c(r)?1:(xt(c,0,o),void 0))}function c(r){if(u.active!==e)return l();for(var i=(r-h)/g,o=f(i),c=p.length;c>0;)p[--c].call(n,o);return i>=1?(l(),a.event&&a.event.end.call(n,s,t),1):void 0}function l(){return--u.count?delete u[e]:delete n.__transition__,1}var s=n.__data__,f=a.ease,h=a.delay,g=a.duration,p=[];return r>=h?i(r):(xt(i,h,o),void 0)},0,o)}}function qu(n,t){n.attr("transform",function(n){return"translate("+t(n)+",0)"})}function Tu(n,t){n.attr("transform",function(n){return"translate(0,"+t(n)+")"})}function Cu(n,t,e){if(r=[],e&&t.length>1){for(var r,i,u,a=Zi(n.domain()),o=-1,c=t.length,l=(t[1]-t[0])/++e;++o<c;)for(i=e;--i>0;)(u=+t[o]-i*l)>=a[0]&&r.push(u);for(--o,i=0;++i<e&&(u=+t[o]+i*l)<a[1];)r.push(u)}return r}function zu(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Du(n,t,e){function r(t){var e=n(t),r=u(e,1);return r-t>t-e?e:r}function i(e){return t(e=n(new Zc(e-1)),1),e}function u(n,e){return t(n=new Zc(+n),e),n}function a(n,r,u){var a=i(n),o=[];if(u>1)for(;r>a;)e(a)%u||o.push(new Date(+a)),t(a,1);else for(;r>a;)o.push(new Date(+a)),t(a,1);return o}function o(n,t,e){try{Zc=zu;var r=new zu;return r._=n,a(r,t,e)}finally{Zc=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=a;var c=n.utc=ju(n);return c.floor=c,c.round=ju(r),c.ceil=ju(i),c.offset=ju(u),c.range=o,n}function ju(n){return function(t,e){try{Zc=zu;var r=new zu;return r._=t,n(r,e)._}finally{Zc=Date}}}function Lu(n,t,e,r){for(var i,u,a=0,o=t.length,c=e.length;o>a;){if(r>=c)return-1;if(i=t.charCodeAt(a++),37===i){if(u=gl[t.charAt(a++)],!u||(r=u(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function Hu(n){return new RegExp("^(?:"+n.map(ya.requote).join("|")+")","i")}function Fu(n){for(var t=new i,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Pu(n,t,e){var r=0>n?"-":"",i=(r?-n:n)+"",u=i.length;return r+(e>u?new Array(e-u+1).join(t)+i:i)}function Ou(n,t,e){il.lastIndex=0;var r=il.exec(t.substring(e));return r?(n.w=ul.get(r[0].toLowerCase()),e+r[0].length):-1}function Yu(n,t,e){el.lastIndex=0;var r=el.exec(t.substring(e));return r?(n.w=rl.get(r[0].toLowerCase()),e+r[0].length):-1}function Ru(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Uu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e));return r?(n.U=+r[0],e+r[0].length):-1}function Iu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e));return r?(n.W=+r[0],e+r[0].length):-1}function Vu(n,t,e){cl.lastIndex=0;var r=cl.exec(t.substring(e));return r?(n.m=ll.get(r[0].toLowerCase()),e+r[0].length):-1}function Xu(n,t,e){al.lastIndex=0;var r=al.exec(t.substring(e));return r?(n.m=ol.get(r[0].toLowerCase()),e+r[0].length):-1}function Zu(n,t,e){return Lu(n,hl.c.toString(),t,e)}function Bu(n,t,e){return Lu(n,hl.x.toString(),t,e)}function $u(n,t,e){return Lu(n,hl.X.toString(),t,e)}function Wu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Ju(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.y=Gu(+r[0]),e+r[0].length):-1}function Gu(n){return n+(n>68?1900:2e3)}function Ku(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function Qu(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function na(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function ta(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ea(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ra(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ia(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ua(n,t,e){var r=ml.get(t.substring(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}function aa(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=~~(Math.abs(t)/60),i=Math.abs(t)%60;return e+Pu(r,"0",2)+Pu(i,"0",2)}function oa(n,t,e){sl.lastIndex=0;var r=sl.exec(t.substring(e,e+1));return r?e+r[0].length:-1}function ca(n){return n.toISOString()}function la(n,t,e){function r(t){return n(t)}return r.invert=function(t){return sa(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(sa)},r.nice=function(n){return r.domain(Wi(r.domain(),n))},r.ticks=function(e,i){var u=Zi(r.domain());if("function"!=typeof e){var a=u[1]-u[0],o=a/e,c=ya.bisect(vl,o);if(c==vl.length)return t.year(u,e);if(!c)return n.ticks(e).map(sa);o/vl[c-1]<vl[c]/o&&--c,e=t[c],i=e[1],e=e[0].range}return e(u[0],new Date(+u[1]+1),i)},r.tickFormat=function(){return e},r.copy=function(){return la(n.copy(),t,e)},Qi(r,n)}function sa(n){return new Date(n)}function fa(n){return function(t){for(var e=n.length-1,r=n[e];!r[1](t);)r=n[--e];return r[0](t)}}function ha(n){var t=new Date(n,0,1);return t.setFullYear(n),t}function ga(n){var t=n.getFullYear(),e=ha(t),r=ha(t+1);return t+(n-e)/(r-e)}function pa(n){var t=new Date(Date.UTC(n,0,1));return t.setUTCFullYear(n),t}function ma(n){var t=n.getUTCFullYear(),e=pa(t),r=pa(t+1);return t+(n-e)/(r-e)}function da(n){return JSON.parse(n.responseText)}function va(n){var t=Ma.createRange();return t.selectNode(Ma.body),t.createContextualFragment(n.responseText)}var ya={version:"3.2.8"};Date.now||(Date.now=function(){return+new Date});var Ma=document,xa=Ma.documentElement,ba=window;try{Ma.createElement("div").style.setProperty("opacity",0,"")}catch(_a){var wa=ba.Element.prototype,Sa=wa.setAttribute,Ea=wa.setAttributeNS,ka=ba.CSSStyleDeclaration.prototype,Aa=ka.setProperty;wa.setAttribute=function(n,t){Sa.call(this,n,t+"")},wa.setAttributeNS=function(n,t,e){Ea.call(this,n,t,e+"")},ka.setProperty=function(n,t,e){Aa.call(this,n,t+"",e)}}ya.ascending=function(n,t){return t>n?-1:n>t?1:n>=t?0:0/0},ya.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},ya.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ya.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u&&!(null!=(e=n[i])&&e>=e);)e=void 0;for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<u&&!(null!=(e=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ya.extent=function(n,t){var e,r,i,u=-1,a=n.length;if(1===arguments.length){for(;++u<a&&!(null!=(e=i=n[u])&&e>=e);)e=i=void 0;for(;++u<a;)null!=(r=n[u])&&(e>r&&(e=r),r>i&&(i=r))}else{for(;++u<a&&!(null!=(e=i=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<a;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),r>i&&(i=r))}return[e,i]},ya.sum=function(n,t){var e,r=0,i=n.length,u=-1;if(1===arguments.length)for(;++u<i;)isNaN(e=+n[u])||(r+=e);else for(;++u<i;)isNaN(e=+t.call(n,n[u],u))||(r+=e);return r},ya.mean=function(t,e){var r,i=t.length,u=0,a=-1,o=0;if(1===arguments.length)for(;++a<i;)n(r=t[a])&&(u+=(r-u)/++o);else for(;++a<i;)n(r=e.call(t,t[a],a))&&(u+=(r-u)/++o);return o?u:void 0},ya.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},ya.median=function(t,e){return arguments.length>1&&(t=t.map(e)),t=t.filter(n),t.length?ya.quantile(t.sort(ya.ascending),.5):void 0},ya.bisector=function(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;n.call(t,t[u],u)<e?r=u+1:i=u}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;e<n.call(t,t[u],u)?i=u:r=u+1}return r}}};var Na=ya.bisector(function(n){return n});ya.bisectLeft=Na.left,ya.bisect=ya.bisectRight=Na.right,ya.shuffle=function(n){for(var t,e,r=n.length;r;)e=0|Math.random()*r--,t=n[r],n[r]=n[e],n[e]=t;return n},ya.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ya.zip=function(){if(!(i=arguments.length))return[];for(var n=-1,e=ya.min(arguments,t),r=new Array(e);++n<e;)for(var i,u=-1,a=r[n]=new Array(i);++u<i;)a[u]=arguments[u][n];return r},ya.transpose=function(n){return ya.zip.apply(ya,n)},ya.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ya.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ya.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ya.merge=function(n){return Array.prototype.concat.apply([],n)},ya.range=function(n,t,r){if(arguments.length<3&&(r=1,arguments.length<2&&(t=n,n=0)),1/0===(t-n)/r)throw new Error("infinite range");var i,u=[],a=e(Math.abs(r)),o=-1;if(n*=a,t*=a,r*=a,0>r)for(;(i=n+r*++o)>t;)u.push(i/a);else for(;(i=n+r*++o)<t;)u.push(i/a);return u},ya.map=function(n){var t=new i;if(n instanceof i)n.forEach(function(n,e){t.set(n,e)});else for(var e in n)t.set(e,n[e]);return t},r(i,{has:function(n){return qa+n in this},get:function(n){return this[qa+n]},set:function(n,t){return this[qa+n]=t},remove:function(n){return n=qa+n,n in this&&delete this[n]},keys:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},values:function(){var n=[];return this.forEach(function(t,e){n.push(e)}),n},entries:function(){var n=[];
return this.forEach(function(t,e){n.push({key:t,value:e})}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Ta&&n.call(this,t.substring(1),this[t])}});var qa="\0",Ta=qa.charCodeAt(0);ya.nest=function(){function n(t,o,c){if(c>=a.length)return r?r.call(u,o):e?o.sort(e):o;for(var l,s,f,h,g=-1,p=o.length,m=a[c++],d=new i;++g<p;)(h=d.get(l=m(s=o[g])))?h.push(s):d.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,c))}):(s={},f=function(e,r){s[e]=n(t,r,c)}),d.forEach(f),s}function t(n,e){if(e>=a.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,u={},a=[],o=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(ya.map,e,0),0)},u.key=function(n){return a.push(n),u},u.sortKeys=function(n){return o[a.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},ya.set=function(n){var t=new u;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},r(u,{has:function(n){return qa+n in this},add:function(n){return this[qa+n]=!0,n},remove:function(n){return n=qa+n,n in this&&delete this[n]},values:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Ta&&n.call(this,t.substring(1))}}),ya.behavior={},ya.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=a(n,t,t[e]);return n};var Ca=["webkit","ms","moz","Moz","o","O"],za=l;try{za(xa.childNodes)[0].nodeType}catch(Da){za=c}ya.dispatch=function(){for(var n=new f,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=h(n);return n},f.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.substring(e+1),n=n.substring(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ya.event=null,ya.requote=function(n){return n.replace(ja,"\\$&")};var ja=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,La={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Ha=function(n,t){return t.querySelector(n)},Fa=function(n,t){return t.querySelectorAll(n)},Pa=xa[o(xa,"matchesSelector")],Oa=function(n,t){return Pa.call(n,t)};"function"==typeof Sizzle&&(Ha=function(n,t){return Sizzle(n,t)[0]||null},Fa=function(n,t){return Sizzle.uniqueSort(Sizzle(n,t))},Oa=Sizzle.matchesSelector),ya.selection=function(){return Ia};var Ya=ya.selection.prototype=[];Ya.select=function(n){var t,e,r,i,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]),t.parentNode=(r=this[a]).parentNode;for(var c=-1,l=r.length;++c<l;)(i=r[c])?(t.push(e=n.call(i,i.__data__,c,a)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return d(u)},Ya.selectAll=function(n){var t,e,r=[];n=y(n);for(var i=-1,u=this.length;++i<u;)for(var a=this[i],o=-1,c=a.length;++o<c;)(e=a[o])&&(r.push(t=za(n.call(e,e.__data__,o,i))),t.parentNode=e);return d(r)};var Ra={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ya.ns={prefix:Ra,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.substring(0,t),n=n.substring(t+1)),Ra.hasOwnProperty(e)?{space:Ra[e],local:n}:n}},Ya.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ya.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(M(t,n[t]));return this}return this.each(M(n,t))},Ya.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=n.trim().split(/^|\s+/g)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!b(n[i]).test(t))return!1;return!0}for(t in n)this.each(_(t,n[t]));return this}return this.each(_(n,t))},Ya.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(S(e,n[e],t));return this}if(2>r)return ba.getComputedStyle(this.node(),null).getPropertyValue(n);e=""}return this.each(S(n,t,e))},Ya.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(E(t,n[t]));return this}return this.each(E(n,t))},Ya.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Ya.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Ya.append=function(n){return n=k(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Ya.insert=function(n,t){return n=k(n),t=v(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments))})},Ya.remove=function(){return this.each(function(){var n=this.parentNode;n&&n.removeChild(this)})},Ya.data=function(n,t){function e(n,e){var r,u,a,o=n.length,f=e.length,h=Math.min(o,f),g=new Array(f),p=new Array(f),m=new Array(o);if(t){var d,v=new i,y=new i,M=[];for(r=-1;++r<o;)d=t.call(u=n[r],u.__data__,r),v.has(d)?m[r]=u:v.set(d,u),M.push(d);for(r=-1;++r<f;)d=t.call(e,a=e[r],r),(u=v.get(d))?(g[r]=u,u.__data__=a):y.has(d)||(p[r]=A(a)),y.set(d,a),v.remove(d);for(r=-1;++r<o;)v.has(M[r])&&(m[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],a=e[r],u?(u.__data__=a,g[r]=u):p[r]=A(a);for(;f>r;++r)p[r]=A(e[r]);for(;o>r;++r)m[r]=n[r]}p.update=g,p.parentNode=g.parentNode=m.parentNode=n.parentNode,c.push(p),l.push(g),s.push(m)}var r,u,a=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++a<o;)(u=r[a])&&(n[a]=u.__data__);return n}var c=C([]),l=d([]),s=d([]);if("function"==typeof n)for(;++a<o;)e(r=this[a],n.call(r,r.parentNode.__data__,a));else for(;++a<o;)e(r=this[a],n);return l.enter=function(){return c},l.exit=function(){return s},l},Ya.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Ya.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]),t.parentNode=(e=this[u]).parentNode;for(var o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return d(i)},Ya.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),u=e);return this},Ya.sort=function(n){n=q.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Ya.each=function(n){return T(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Ya.call=function(n){var t=za(arguments);return n.apply(t[0]=this,t),this},Ya.empty=function(){return!this.node()},Ya.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,i=e.length;i>r;r++){var u=e[r];if(u)return u}return null},Ya.size=function(){var n=0;return this.each(function(){++n}),n};var Ua=[];ya.selection.enter=C,ya.selection.enter.prototype=Ua,Ua.append=Ya.append,Ua.empty=Ya.empty,Ua.node=Ya.node,Ua.call=Ya.call,Ua.size=Ya.size,Ua.select=function(n){for(var t,e,r,i,u,a=[],o=-1,c=this.length;++o<c;){r=(i=this[o]).update,a.push(t=[]),t.parentNode=i.parentNode;for(var l=-1,s=i.length;++l<s;)(u=i[l])?(t.push(r[l]=e=n.call(i.parentNode,u.__data__,l,o)),e.__data__=u.__data__):t.push(null)}return d(a)},Ua.insert=function(n,t){return arguments.length<2&&(t=z(this)),Ya.insert.call(this,n,t)},Ya.transition=function(){for(var n,t,e=Hc||++Rc,r=[],i=Fc||{time:Date.now(),ease:Cr,delay:0,duration:250},u=-1,a=this.length;++u<a;){r.push(n=[]);for(var o=this[u],c=-1,l=o.length;++c<l;)(t=o[c])&&Nu(t,c,e,i),n.push(t)}return Eu(r,e)},ya.select=function(n){var t=["string"==typeof n?Ha(n,Ma):n];return t.parentNode=xa,d([t])},ya.selectAll=function(n){var t=za("string"==typeof n?Fa(n,Ma):n);return t.parentNode=xa,d([t])};var Ia=ya.select(xa);Ya.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(D(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(D(n,t,e))};var Va=ya.map({mouseenter:"mouseover",mouseleave:"mouseout"});Va.forEach(function(n){"on"+n in Ma&&Va.remove(n)});var Xa=o(xa.style,"userSelect"),Za=0;ya.mouse=function(n){return F(n,p())};var Ba=/WebKit/.test(ba.navigator.userAgent)?-1:0;ya.touches=function(n,t){return arguments.length<2&&(t=p().touches),t?za(t).map(function(t){var e=F(n,t);return e.identifier=t.identifier,e}):[]},ya.behavior.drag=function(){function n(){this.on("mousedown.drag",a).on("touchstart.drag",o)}function t(){return ya.event.changedTouches[0].identifier}function e(n,t){return ya.touches(n).filter(function(n){return n.identifier===t})[0]}function r(n,t,e,r){return function(){function a(){if(!s)return o();var n=t(s,g),e=n[0]-m[0],r=n[1]-m[1];d|=e|r,m=n,f({type:"drag",x:n[0]+c[0],y:n[1]+c[1],dx:e,dy:r})}function o(){v.on(e+"."+p,null).on(r+"."+p,null),y(d&&ya.event.target===h),f({type:"dragend"})}var c,l=this,s=l.parentNode,f=i.of(l,arguments),h=ya.event.target,g=n(),p=null==g?"drag":"drag-"+g,m=t(s,g),d=0,v=ya.select(ba).on(e+"."+p,a).on(r+"."+p,o),y=H();u?(c=u.apply(l,arguments),c=[c.x-m[0],c.y-m[1]]):c=[0,0],f({type:"dragstart"})}}var i=m(n,"drag","dragstart","dragend"),u=null,a=r(s,ya.mouse,"mousemove","mouseup"),o=r(t,e,"touchmove","touchend");return n.origin=function(t){return arguments.length?(u=t,n):u},ya.rebind(n,i,"on")},ya.behavior.zoom=function(){function n(){this.on(w,o).on(Ja+".zoom",l).on(S,s).on("dblclick.zoom",f).on(k,c)}function t(n){return[(n[0]-x[0])/b,(n[1]-x[1])/b]}function e(n){return[n[0]*b+x[0],n[1]*b+x[1]]}function r(n){b=Math.max(_[0],Math.min(_[1],n))}function i(n,t){t=e(t),x[0]+=n[0]-t[0],x[1]+=n[1]-t[1]}function u(){v&&v.domain(d.range().map(function(n){return(n-x[0])/b}).map(d.invert)),M&&M.domain(y.range().map(function(n){return(n-x[1])/b}).map(y.invert))}function a(n){u(),n({type:"zoom",scale:b,translate:x})}function o(){function n(){c=1,i(ya.mouse(r),f),a(u)}function e(){l.on(S,ba===r?s:null).on(E,null),h(c&&ya.event.target===o)}var r=this,u=q.of(r,arguments),o=ya.event.target,c=0,l=ya.select(ba).on(S,n).on(E,e),f=t(ya.mouse(r)),h=H()}function c(){function n(){var n=ya.touches(h);return f=b,s={},n.forEach(function(n){s[n.identifier]=t(n)}),n}function e(){var t=Date.now(),e=n();if(1===e.length){if(500>t-p){var u=e[0],o=s[u.identifier];r(2*b),i(u,o),g(),a(m)}p=t}else if(e.length>1){var u=e[0],c=e[1],l=u[0]-c[0],f=u[1]-c[1];d=l*l+f*f}}function u(){var n=ya.touches(h),t=n[0],e=s[t.identifier];if(u=n[1]){var u,o=s[u.identifier],c=ya.event.scale;if(null==c){var l=(l=u[0]-t[0])*l+(l=u[1]-t[1])*l;c=d&&Math.sqrt(l/d)}t=[(t[0]+u[0])/2,(t[1]+u[1])/2],e=[(e[0]+o[0])/2,(e[1]+o[1])/2],r(c*f)}p=null,i(t,e),a(m)}function l(){ya.event.touches.length?n():(v.on(A,null).on(N,null),y.on(w,o).on(k,c),M())}var s,f,h=this,m=q.of(h,arguments),d=0,v=ya.select(ba).on(A,u).on(N,l),y=ya.select(h).on(w,null).on(k,e),M=H();e()}function l(){g(),h||(h=t(ya.mouse(this))),r(Math.pow(2,.002*$a())*b),i(ya.mouse(this),h),a(q.of(this,arguments))}function s(){h=null}function f(){var n=ya.mouse(this),e=t(n),u=Math.log(b)/Math.LN2;r(Math.pow(2,ya.event.shiftKey?Math.ceil(u)-1:Math.floor(u)+1)),i(n,e),a(q.of(this,arguments))}var h,p,d,v,y,M,x=[0,0],b=1,_=Wa,w="mousedown.zoom",S="mousemove.zoom",E="mouseup.zoom",k="touchstart.zoom",A="touchmove.zoom",N="touchend.zoom",q=m(n,"zoom");return n.translate=function(t){return arguments.length?(x=t.map(Number),u(),n):x},n.scale=function(t){return arguments.length?(b=+t,u(),n):b},n.scaleExtent=function(t){return arguments.length?(_=null==t?Wa:t.map(Number),n):_},n.x=function(t){return arguments.length?(v=t,d=t.copy(),x=[0,0],b=1,n):v},n.y=function(t){return arguments.length?(M=t,y=t.copy(),x=[0,0],b=1,n):M},ya.rebind(n,q,"on")};var $a,Wa=[0,1/0],Ja="onwheel"in Ma?($a=function(){return-ya.event.deltaY*(ya.event.deltaMode?120:1)},"wheel"):"onmousewheel"in Ma?($a=function(){return ya.event.wheelDelta},"mousewheel"):($a=function(){return-ya.event.detail},"MozMousePixelScroll");P.prototype.toString=function(){return this.rgb()+""},ya.hsl=function(n,t,e){return 1===arguments.length?n instanceof Y?O(n.h,n.s,n.l):lt(""+n,st,O):O(+n,+t,+e)};var Ga=Y.prototype=new P;Ga.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),O(this.h,this.s,this.l/n)},Ga.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),O(this.h,this.s,n*this.l)},Ga.rgb=function(){return R(this.h,this.s,this.l)};var Ka=Math.PI,Qa=1e-6,no=Qa*Qa,to=Ka/180,eo=180/Ka;ya.hcl=function(n,t,e){return 1===arguments.length?n instanceof W?$(n.h,n.c,n.l):n instanceof K?nt(n.l,n.a,n.b):nt((n=ft((n=ya.rgb(n)).r,n.g,n.b)).l,n.a,n.b):$(+n,+t,+e)};var ro=W.prototype=new P;ro.brighter=function(n){return $(this.h,this.c,Math.min(100,this.l+io*(arguments.length?n:1)))},ro.darker=function(n){return $(this.h,this.c,Math.max(0,this.l-io*(arguments.length?n:1)))},ro.rgb=function(){return J(this.h,this.c,this.l).rgb()},ya.lab=function(n,t,e){return 1===arguments.length?n instanceof K?G(n.l,n.a,n.b):n instanceof W?J(n.l,n.c,n.h):ft((n=ya.rgb(n)).r,n.g,n.b):G(+n,+t,+e)};var io=18,uo=.95047,ao=1,oo=1.08883,co=K.prototype=new P;co.brighter=function(n){return G(Math.min(100,this.l+io*(arguments.length?n:1)),this.a,this.b)},co.darker=function(n){return G(Math.max(0,this.l-io*(arguments.length?n:1)),this.a,this.b)},co.rgb=function(){return Q(this.l,this.a,this.b)},ya.rgb=function(n,t,e){return 1===arguments.length?n instanceof ot?at(n.r,n.g,n.b):lt(""+n,at,R):at(~~n,~~t,~~e)};var lo=ot.prototype=new P;lo.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&i>t&&(t=i),e&&i>e&&(e=i),r&&i>r&&(r=i),at(Math.min(255,~~(t/n)),Math.min(255,~~(e/n)),Math.min(255,~~(r/n)))):at(i,i,i)},lo.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),at(~~(n*this.r),~~(n*this.g),~~(n*this.b))},lo.hsl=function(){return st(this.r,this.g,this.b)},lo.toString=function(){return"#"+ct(this.r)+ct(this.g)+ct(this.b)};var so=ya.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});so.forEach(function(n,t){so.set(n,it(t))}),ya.functor=pt,ya.xhr=dt(mt),ya.dsv=function(n,t){function e(n,e,u){arguments.length<3&&(u=e,e=null);var a=ya.xhr(n,t,u);return a.row=function(n){return arguments.length?a.response(null==(e=n)?r:i(n)):e},a.row(e)}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function a(t){return t.map(o).join(n)}function o(n){return c.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var c=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(s>=c)return a;if(i)return i=!1,u;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(i=!0),n.substring(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),o=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(s)&&(++s,++o);else if(r!==l)continue;return n.substring(t,s-o)}return n.substring(t)}for(var r,i,u={},a={},o=[],c=n.length,s=0,f=0;(r=e())!==a;){for(var h=[];r!==u&&r!==a;)h.push(r),r=e();(!t||(h=t(h,f++)))&&o.push(h)}return o},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new u,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(a).join("\n")},e},ya.csv=ya.dsv(",","text/csv"),ya.tsv=ya.dsv("	","text/tab-separated-values");var fo,ho,go,po,mo,vo=ba[o(ba,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ya.timer=function(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var i=e+t,u={callback:n,time:i,next:null};ho?ho.next=u:fo=u,ho=u,go||(po=clearTimeout(po),go=1,vo(Mt))},ya.timer.flush=function(){bt(),_t()};var yo=".",Mo=",",xo=[3,3],bo="$",_o=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(wt);ya.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=ya.round(n,St(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((0>=e?e+1:e-1)/3)))),_o[8+e/3]},ya.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)},ya.format=function(n){var t=wo.exec(n),e=t[1]||" ",r=t[2]||">",i=t[3]||"",u=t[4]||"",a=t[5],o=+t[6],c=t[7],l=t[8],s=t[9],f=1,h="",g=!1;switch(l&&(l=+l.substring(1)),(a||"0"===e&&"="===r)&&(a=e="0",r="=",c&&(o-=Math.floor((o-1)/4))),s){case"n":c=!0,s="g";break;case"%":f=100,h="%",s="f";break;case"p":f=100,h="%",s="r";break;case"b":case"o":case"x":case"X":"#"===u&&(u="0"+s.toLowerCase());case"c":case"d":g=!0,l=0;break;case"s":f=-1,s="r"}"#"===u?u="":"$"===u&&(u=bo),"r"!=s||l||(s="g"),null!=l&&("g"==s?l=Math.max(1,Math.min(21,l)):("e"==s||"f"==s)&&(l=Math.max(0,Math.min(20,l)))),s=So.get(s)||Et;var p=a&&c;return function(n){if(g&&n%1)return"";var t=0>n||0===n&&0>1/n?(n=-n,"-"):i;if(0>f){var m=ya.formatPrefix(n,l);n=m.scale(n),h=m.symbol}else n*=f;n=s(n,l);var d=n.lastIndexOf("."),v=0>d?n:n.substring(0,d),y=0>d?"":yo+n.substring(d+1);!a&&c&&(v=Eo(v));var M=u.length+v.length+y.length+(p?0:t.length),x=o>M?new Array(M=o-M+1).join(e):"";return p&&(v=Eo(x+v)),t+=u,n=v+y,("<"===r?t+n+x:">"===r?x+t+n:"^"===r?x.substring(0,M>>=1)+t+n+x.substring(M):t+(p?n:x+n))+h}};var wo=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,So=ya.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ya.round(n,St(n,t))).toFixed(Math.max(0,Math.min(20,St(n*(1+1e-15),t))))}}),Eo=mt;if(xo){var ko=xo.length;Eo=function(n){for(var t=n.length,e=[],r=0,i=xo[0];t>0&&i>0;)e.push(n.substring(t-=i,t+i)),i=xo[r=(r+1)%ko];return e.reverse().join(Mo)}}ya.geo={},kt.prototype={s:0,t:0,add:function(n){At(n,this.t,Ao),At(Ao.s,this.s,this),this.s?this.t+=Ao.t:this.s=Ao.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var Ao=new kt;ya.geo.stream=function(n,t){n&&No.hasOwnProperty(n.type)?No[n.type](n,t):Nt(n,t)};var No={Feature:function(n,t){Nt(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)Nt(e[r].geometry,t)}},qo={Sphere:function(n,t){t.sphere()},Point:function(n,t){var e=n.coordinates;t.point(e[0],e[1])},MultiPoint:function(n,t){for(var e,r=n.coordinates,i=-1,u=r.length;++i<u;)e=r[i],t.point(e[0],e[1])},LineString:function(n,t){qt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)qt(e[r],t,0)},Polygon:function(n,t){Tt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)Tt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)Nt(e[r],t)}};ya.geo.area=function(n){return To=0,ya.geo.stream(n,zo),To};var To,Co=new kt,zo={sphere:function(){To+=4*Ka},point:s,lineStart:s,lineEnd:s,polygonStart:function(){Co.reset(),zo.lineStart=Ct},polygonEnd:function(){var n=2*Co;To+=0>n?4*Ka+n:n,zo.lineStart=zo.lineEnd=zo.point=s}};ya.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=zt([t*to,e*to]);if(v){var i=jt(v,r),u=[i[1],-i[0],0],a=jt(u,i);Ft(a),a=Pt(a);var c=t-p,l=c>0?1:-1,m=a[0]*eo*l,d=Math.abs(c)>180;if(d^(m>l*p&&l*t>m)){var y=a[1]*eo;y>g&&(g=y)}else if(m=(m+360)%360-180,d^(m>l*p&&l*t>m)){var y=-a[1]*eo;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t)}else n(t,e);v=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,v=null}function i(n,e){if(v){var r=n-p;y+=Math.abs(r)>180?r+(r>0?360:-360):r}else m=n,d=e;zo.point(n,e),t(n,e)}function u(){zo.lineStart()}function a(){i(m,d),zo.lineEnd(),Math.abs(y)>Qa&&(s=-(h=180)),x[0]=s,x[1]=h,v=null}function o(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,m,d,v,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=i,b.lineStart=u,b.lineEnd=a,y=0,zo.polygonStart()},polygonEnd:function(){zo.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>Co?(s=-(h=180),f=-(g=90)):y>Qa?g=90:-Qa>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],ya.geo.stream(n,b);var t=M.length;if(t){M.sort(c);for(var e,r=1,i=M[0],u=[i];t>r;++r)e=M[r],l(e[0],i)||l(e[1],i)?(o(i[0],e[1])>o(i[0],i[1])&&(i[1]=e[1]),o(e[0],i[1])>o(i[0],i[1])&&(i[0]=e[0])):u.push(i=e);for(var a,e,p=-1/0,t=u.length-1,r=0,i=u[t];t>=r;i=e,++r)e=u[r],(a=o(i[1],e[0]))>p&&(p=a,s=e[0],h=i[1])}return M=x=null,1/0===s||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[s,f],[h,g]]}}(),ya.geo.centroid=function(n){Do=jo=Lo=Ho=Fo=Po=Oo=Yo=Ro=Uo=Io=0,ya.geo.stream(n,Vo);var t=Ro,e=Uo,r=Io,i=t*t+e*e+r*r;return no>i&&(t=Po,e=Oo,r=Yo,Qa>jo&&(t=Lo,e=Ho,r=Fo),i=t*t+e*e+r*r,no>i)?[0/0,0/0]:[Math.atan2(e,t)*eo,V(r/Math.sqrt(i))*eo]};var Do,jo,Lo,Ho,Fo,Po,Oo,Yo,Ro,Uo,Io,Vo={sphere:s,point:Yt,lineStart:Ut,lineEnd:It,polygonStart:function(){Vo.lineStart=Vt},polygonEnd:function(){Vo.lineStart=Ut}},Xo=$t(Xt,Qt,te,ee),Zo=[-Ka,0],Bo=1e9;(ya.geo.conicEqualArea=function(){return oe(ce)}).raw=ce,ya.geo.albers=function(){return ya.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ya.geo.albersUsa=function(){function n(n){var u=n[0],a=n[1];return t=null,e(u,a),t||(r(u,a),t)||i(u,a),t}var t,e,r,i,u=ya.geo.albers(),a=ya.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),o=ya.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&.234>i&&r>=-.425&&-.214>r?a:i>=.166&&.234>i&&r>=-.214&&-.115>r?o:u).invert(n)},n.stream=function(n){var t=u.stream(n),e=a.stream(n),r=o.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(u.precision(t),a.precision(t),o.precision(t),n):u.precision()},n.scale=function(t){return arguments.length?(u.scale(t),a.scale(.35*t),o.scale(t),n.translate(u.translate())):u.scale()},n.translate=function(t){if(!arguments.length)return u.translate();var l=u.scale(),s=+t[0],f=+t[1];return e=u.translate(t).clipExtent([[s-.455*l,f-.238*l],[s+.455*l,f+.238*l]]).stream(c).point,r=a.translate([s-.307*l,f+.201*l]).clipExtent([[s-.425*l+Qa,f+.12*l+Qa],[s-.214*l-Qa,f+.234*l-Qa]]).stream(c).point,i=o.translate([s-.205*l,f+.212*l]).clipExtent([[s-.214*l+Qa,f+.166*l+Qa],[s-.115*l-Qa,f+.234*l-Qa]]).stream(c).point,n},n.scale(1070)};var $o,Wo,Jo,Go,Ko,Qo,nc={point:s,lineStart:s,lineEnd:s,polygonStart:function(){Wo=0,nc.lineStart=le},polygonEnd:function(){nc.lineStart=nc.lineEnd=nc.point=s,$o+=Math.abs(Wo/2)}},tc={point:se,lineStart:s,lineEnd:s,polygonStart:s,polygonEnd:s},ec={point:ge,lineStart:pe,lineEnd:me,polygonStart:function(){ec.lineStart=de},polygonEnd:function(){ec.point=ge,ec.lineStart=pe,ec.lineEnd=me}};ya.geo.path=function(){function n(n){return n&&("function"==typeof o&&u.pointRadius(+o.apply(this,arguments)),a&&a.valid||(a=i(u)),ya.geo.stream(n,a)),u.result()}function t(){return a=null,n}var e,r,i,u,a,o=4.5;return n.area=function(n){return $o=0,ya.geo.stream(n,i(nc)),$o},n.centroid=function(n){return Lo=Ho=Fo=Po=Oo=Yo=Ro=Uo=Io=0,ya.geo.stream(n,i(ec)),Io?[Ro/Io,Uo/Io]:Yo?[Po/Yo,Oo/Yo]:Fo?[Lo/Fo,Ho/Fo]:[0/0,0/0]},n.bounds=function(n){return Ko=Qo=-(Jo=Go=1/0),ya.geo.stream(n,i(tc)),[[Jo,Go],[Ko,Qo]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||Me(n):mt,t()):e},n.context=function(n){return arguments.length?(u=null==(r=n)?new fe:new ve(n),"function"!=typeof o&&u.pointRadius(o),t()):r},n.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(u.pointRadius(+t),+t),n):o},n.projection(ya.geo.albersUsa()).context(null)},ya.geo.projection=xe,ya.geo.projectionMutator=be,(ya.geo.equirectangular=function(){return xe(we)}).raw=we.invert=we,ya.geo.rotation=function(n){function t(t){return t=n(t[0]*to,t[1]*to),t[0]*=eo,t[1]*=eo,t}return n=Se(n[0]%360*to,n[1]*to,n.length>2?n[2]*to:0),t.invert=function(t){return t=n.invert(t[0]*to,t[1]*to),t[0]*=eo,t[1]*=eo,t},t},ya.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=Se(-n[0]*to,-n[1]*to,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=eo,n[1]*=eo}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=Ne((t=+r)*to,i*to),n):t},n.precision=function(r){return arguments.length?(e=Ne(t*to,(i=+r)*to),n):i},n.angle(90)},ya.geo.distance=function(n,t){var e,r=(t[0]-n[0])*to,i=n[1]*to,u=t[1]*to,a=Math.sin(r),o=Math.cos(r),c=Math.sin(i),l=Math.cos(i),s=Math.sin(u),f=Math.cos(u);return Math.atan2(Math.sqrt((e=f*a)*e+(e=l*s-c*f*o)*e),c*s+l*f*o)},ya.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ya.range(Math.ceil(u/d)*d,i,d).map(h).concat(ya.range(Math.ceil(l/v)*v,c,v).map(g)).concat(ya.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Math.abs(n%d)>Qa}).map(s)).concat(ya.range(Math.ceil(o/m)*m,a,m).filter(function(n){return Math.abs(n%v)>Qa}).map(f))}var e,r,i,u,a,o,c,l,s,f,h,g,p=10,m=p,d=90,v=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(u).concat(g(c).slice(1),h(i).reverse().slice(1),g(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(u=+t[0][0],i=+t[1][0],l=+t[0][1],c=+t[1][1],u>i&&(t=u,u=i,i=t),l>c&&(t=l,l=c,c=t),n.precision(y)):[[u,l],[i,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],o=+t[0][1],a=+t[1][1],r>e&&(t=r,r=e,e=t),o>a&&(t=o,o=a,a=t),n.precision(y)):[[r,o],[e,a]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],v=+t[1],n):[d,v]},n.minorStep=function(t){return arguments.length?(p=+t[0],m=+t[1],n):[p,m]},n.precision=function(t){return arguments.length?(y=+t,s=Te(o,a,90),f=Ce(r,e,y),h=Te(l,c,90),g=Ce(u,i,y),n):y},n.majorExtent([[-180,-90+Qa],[180,90-Qa]]).minorExtent([[-180,-80-Qa],[180,80+Qa]])},ya.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=ze,i=De;return n.distance=function(){return ya.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ya.geo.interpolate=function(n,t){return je(n[0]*to,n[1]*to,t[0]*to,t[1]*to)},ya.geo.length=function(n){return rc=0,ya.geo.stream(n,ic),rc};var rc,ic={sphere:s,point:s,lineStart:Le,lineEnd:s,polygonStart:s,polygonEnd:s},uc=He(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ya.geo.azimuthalEqualArea=function(){return xe(uc)}).raw=uc;var ac=He(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},mt);(ya.geo.azimuthalEquidistant=function(){return xe(ac)}).raw=ac,(ya.geo.conicConformal=function(){return oe(Fe)}).raw=Fe,(ya.geo.conicEquidistant=function(){return oe(Pe)}).raw=Pe;var oc=He(function(n){return 1/n},Math.atan);(ya.geo.gnomonic=function(){return xe(oc)}).raw=oc,Oe.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ka/2]},(ya.geo.mercator=function(){return Ye(Oe)}).raw=Oe;var cc=He(function(){return 1},Math.asin);(ya.geo.orthographic=function(){return xe(cc)}).raw=cc;var lc=He(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ya.geo.stereographic=function(){return xe(lc)}).raw=lc,Re.invert=function(n,t){return[Math.atan2(X(n),Math.cos(t)),V(Math.sin(t)/Z(n))]},(ya.geo.transverseMercator=function(){return Ye(Re)}).raw=Re,ya.geom={},ya.svg={},ya.svg.line=function(){return Ue(mt)};var sc=ya.map({linear:Xe,"linear-closed":Ze,step:Be,"step-before":$e,"step-after":We,basis:tr,"basis-open":er,"basis-closed":rr,bundle:ir,cardinal:Ke,"cardinal-open":Je,"cardinal-closed":Ge,monotone:sr});
sc.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var fc=[0,2/3,1/3,0],hc=[0,1/3,2/3,0],gc=[0,1/6,2/3,1/6];ya.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i,u,a,o,c,l,s,f,h,g,p,m=pt(e),d=pt(r),v=n.length,y=v-1,M=[],x=[],b=0;if(m===Ie&&r===Ve)t=n;else for(u=0,t=[];v>u;++u)t.push([+m.call(this,i=n[u],u),+d.call(this,i,u)]);for(u=1;v>u;++u)(t[u][1]<t[b][1]||t[u][1]==t[b][1]&&t[u][0]<t[b][0])&&(b=u);for(u=0;v>u;++u)u!==b&&(c=t[u][1]-t[b][1],o=t[u][0]-t[b][0],M.push({angle:Math.atan2(c,o),index:u}));for(M.sort(function(n,t){return n.angle-t.angle}),g=M[0].angle,h=M[0].index,f=0,u=1;y>u;++u){if(a=M[u].index,g==M[u].angle){if(o=t[h][0]-t[b][0],c=t[h][1]-t[b][1],l=t[a][0]-t[b][0],s=t[a][1]-t[b][1],o*o+c*c>=l*l+s*s){M[u].index=-1;continue}M[f].index=-1}g=M[u].angle,f=u,h=a}for(x.push(b),u=0,a=0;2>u;++a)M[a].index>-1&&(x.push(M[a].index),u++);for(p=x.length;y>a;++a)if(!(M[a].index<0)){for(;!fr(x[p-2],x[p-1],M[a].index,t);)--p;x[p++]=M[a].index}var _=[];for(u=p-1;u>=0;--u)_.push(n[x[u]]);return _}var e=Ie,r=Ve;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ya.geom.polygon=function(n){return La(n,pc),n};var pc=ya.geom.polygon.prototype=[];pc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},pc.centroid=function(n){var t,e,r=-1,i=this.length,u=0,a=0,o=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=o,o=this[r],e=t[0]*o[1]-o[0]*t[1],u+=(t[0]+o[0])*e,a+=(t[1]+o[1])*e;return[u*n,a*n]},pc.clip=function(n){for(var t,e,r,i,u,a,o=pr(n),c=-1,l=this.length-pr(this),s=this[l-1];++c<l;){for(t=n.slice(),n.length=0,i=this[c],u=t[(r=t.length-o)-1],e=-1;++e<r;)a=t[e],hr(a,s,i)?(hr(u,s,i)||n.push(gr(u,a,s,i)),n.push(a)):hr(u,s,i)&&n.push(gr(u,a,s,i)),u=a;o&&n.push(n[0]),s=i}return n},ya.geom.delaunay=function(n){var t=n.map(function(){return[]}),e=[];return mr(n,function(e){t[e.region.l.index].push(n[e.region.r.index])}),t.forEach(function(t,r){var i=n[r],u=i[0],a=i[1];t.forEach(function(n){n.angle=Math.atan2(n[0]-u,n[1]-a)}),t.sort(function(n,t){return n.angle-t.angle});for(var o=0,c=t.length-1;c>o;o++)e.push([i,t[o],t[o+1]])}),e},ya.geom.voronoi=function(n){function t(n){var t,u,a,o=n.map(function(){return[]}),c=pt(e),l=pt(r),s=n.length,f=1e6;if(c===Ie&&l===Ve)t=n;else for(t=new Array(s),a=0;s>a;++a)t[a]=[+c.call(this,u=n[a],a),+l.call(this,u,a)];if(mr(t,function(n){var t,e,r,i,u,a;1===n.a&&n.b>=0?(t=n.ep.r,e=n.ep.l):(t=n.ep.l,e=n.ep.r),1===n.a?(u=t?t.y:-f,r=n.c-n.b*u,a=e?e.y:f,i=n.c-n.b*a):(r=t?t.x:-f,u=n.c-n.a*r,i=e?e.x:f,a=n.c-n.a*i);var c=[r,u],l=[i,a];o[n.region.l.index].push(c,l),o[n.region.r.index].push(c,l)}),o=o.map(function(n,e){var r=t[e][0],i=t[e][1],u=n.map(function(n){return Math.atan2(n[0]-r,n[1]-i)}),a=ya.range(n.length).sort(function(n,t){return u[n]-u[t]});return a.filter(function(n,t){return!t||u[n]-u[a[t-1]]>Qa}).map(function(t){return n[t]})}),o.forEach(function(n,e){var r=n.length;if(!r)return n.push([-f,-f],[-f,f],[f,f],[f,-f]);if(!(r>2)){var i=t[e],u=n[0],a=n[1],o=i[0],c=i[1],l=u[0],s=u[1],h=a[0],g=a[1],p=Math.abs(h-l),m=g-s;if(Math.abs(m)<Qa){var d=s>c?-f:f;n.push([-f,d],[f,d])}else if(Qa>p){var v=l>o?-f:f;n.push([v,-f],[v,f])}else{var d=(l-o)*(g-s)>(h-l)*(s-c)?f:-f,y=Math.abs(m)-p;Math.abs(y)<Qa?n.push([0>m?d:-d,d]):(y>0&&(d*=-1),n.push([-f,d],[f,d]))}}}),i)for(a=0;s>a;++a)i.clip(o[a]);for(a=0;s>a;++a)o[a].point=n[a];return o}var e=Ie,r=Ve,i=null;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.clipExtent=function(n){if(!arguments.length)return i&&[i[0],i[2]];if(null==n)i=null;else{var e=+n[0][0],r=+n[0][1],u=+n[1][0],a=+n[1][1];i=ya.geom.polygon([[e,r],[e,a],[u,a],[u,r]])}return t},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):i&&i[2]},t.links=function(n){var t,i,u,a=n.map(function(){return[]}),o=[],c=pt(e),l=pt(r),s=n.length;if(c===Ie&&l===Ve)t=n;else for(t=new Array(s),u=0;s>u;++u)t[u]=[+c.call(this,i=n[u],u),+l.call(this,i,u)];return mr(t,function(t){var e=t.region.l.index,r=t.region.r.index;a[e][r]||(a[e][r]=a[r][e]=!0,o.push({source:n[e],target:n[r]}))}),o},t.triangles=function(n){if(e===Ie&&r===Ve)return ya.geom.delaunay(n);for(var t,i=new Array(c),u=pt(e),a=pt(r),o=-1,c=n.length;++o<c;)(i[o]=[+u.call(this,t=n[o],o),+a.call(this,t,o)]).data=t;return ya.geom.delaunay(i).map(function(n){return n.map(function(n){return n.data})})},t)};var mc={l:"r",r:"l"};ya.geom.quadtree=function(n,t,e,r,i){function u(n){function u(n,t,e,r,i,u,a,o){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,s=n.y;if(null!=c)if(Math.abs(c-e)+Math.abs(s-r)<.01)l(n,t,e,r,i,u,a,o);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,c,s,i,u,a,o),l(n,t,e,r,i,u,a,o)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,i,u,a,o)}function l(n,t,e,r,i,a,o,c){var l=.5*(i+o),s=.5*(a+c),f=e>=l,h=r>=s,g=(h<<1)+f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=yr()),f?i=l:o=l,h?a=s:c=s,u(n,t,e,r,i,a,o,c)}var s,f,h,g,p,m,d,v,y,M=pt(o),x=pt(c);if(null!=t)m=t,d=e,v=r,y=i;else if(v=y=-(m=d=1/0),f=[],h=[],p=n.length,a)for(g=0;p>g;++g)s=n[g],s.x<m&&(m=s.x),s.y<d&&(d=s.y),s.x>v&&(v=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);m>b&&(m=b),d>_&&(d=_),b>v&&(v=b),_>y&&(y=_),f.push(b),h.push(_)}var w=v-m,S=y-d;w>S?y=d+w:v=m+S;var E=yr();if(E.add=function(n){u(E,n,+M(n,++g),+x(n,g),m,d,v,y)},E.visit=function(n){Mr(n,E,m,d,v,y)},g=-1,null==t){for(;++g<p;)u(E,n[g],f[g],h[g],m,d,v,y);--g}else n.forEach(E.add);return f=h=n=s=null,E}var a,o=Ie,c=Ve;return(a=arguments.length)?(o=dr,c=vr,3===a&&(i=e,r=t,e=t=0),u(n)):(u.x=function(n){return arguments.length?(o=n,u):o},u.y=function(n){return arguments.length?(c=n,u):c},u.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),u):null==t?null:[[t,e],[r,i]]},u.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),u):null==t?null:[r-t,i-e]},u)},ya.interpolateRgb=xr,ya.interpolateObject=br,ya.interpolateNumber=_r,ya.interpolateString=wr;var dc=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;ya.interpolate=Sr,ya.interpolators=[function(n,t){var e=typeof t;return("string"===e?so.has(t)||/^(#|rgb\(|hsl\()/.test(t)?xr:wr:t instanceof P?xr:"object"===e?Array.isArray(t)?Er:br:_r)(n,t)}],ya.interpolateArray=Er;var vc=function(){return mt},yc=ya.map({linear:vc,poly:zr,quad:function(){return qr},cubic:function(){return Tr},sin:function(){return Dr},exp:function(){return jr},circle:function(){return Lr},elastic:Hr,back:Fr,bounce:function(){return Pr}}),Mc=ya.map({"in":mt,out:Ar,"in-out":Nr,"out-in":function(n){return Nr(Ar(n))}});ya.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.substring(0,t):n,r=t>=0?n.substring(t+1):"in";return e=yc.get(e)||vc,r=Mc.get(r)||mt,kr(r(e.apply(null,Array.prototype.slice.call(arguments,1))))},ya.interpolateHcl=Or,ya.interpolateHsl=Yr,ya.interpolateLab=Rr,ya.interpolateRound=Ur,ya.transform=function(n){var t=Ma.createElementNS(ya.ns.prefix.svg,"g");return(ya.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Ir(e?e.matrix:xc)})(n)},Ir.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var xc={a:1,b:0,c:0,d:1,e:0,f:0};ya.interpolateTransform=Br,ya.layout={},ya.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},ya.layout.chord=function(){function n(){var n,l,f,h,g,p={},m=[],d=ya.range(u),v=[];for(e=[],r=[],n=0,h=-1;++h<u;){for(l=0,g=-1;++g<u;)l+=i[h][g];m.push(l),v.push(ya.range(u)),n+=l}for(a&&d.sort(function(n,t){return a(m[n],m[t])}),o&&v.forEach(function(n,t){n.sort(function(n,e){return o(i[t][n],i[t][e])})}),n=(2*Ka-s*u)/n,l=0,h=-1;++h<u;){for(f=l,g=-1;++g<u;){var y=d[h],M=v[y][g],x=i[y][M],b=l,_=l+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:l,value:(l-f)/n},l+=s}for(h=-1;++h<u;)for(g=h-1;++g<u;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,u,a,o,c,l={},s=0;return l.matrix=function(n){return arguments.length?(u=(i=n)&&i.length,e=r=null,l):i},l.padding=function(n){return arguments.length?(s=n,e=r=null,l):s},l.sortGroups=function(n){return arguments.length?(a=n,e=r=null,l):a},l.sortSubgroups=function(n){return arguments.length?(o=n,e=null,l):o},l.sortChords=function(n){return arguments.length?(c=n,e&&t(),l):c},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},ya.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var u=t.cx-n.x,a=t.cy-n.y,o=1/Math.sqrt(u*u+a*a);if(m>(i-e)*o){var c=t.charge*o*o;return n.px-=u*c,n.py-=a*c,!0}if(t.point&&isFinite(o)){var c=t.pointCharge*o*o;n.px-=u*c,n.py-=a*c}}return!t.charge}}function t(n){n.px=ya.event.x,n.py=ya.event.y,o.resume()}var e,r,i,u,a,o={},c=ya.dispatch("start","tick","end"),l=[1,1],s=.9,f=bc,h=_c,g=-30,p=.1,m=.8,d=[],v=[];return o.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,o,f,h,m,y,M,x,b=d.length,_=v.length;for(e=0;_>e;++e)o=v[e],f=o.source,h=o.target,M=h.x-f.x,x=h.y-f.y,(m=M*M+x*x)&&(m=r*u[e]*((m=Math.sqrt(m))-i[e])/m,M*=m,x*=m,h.x-=M*(y=f.weight/(h.weight+f.weight)),h.y-=x*y,f.x+=M*(y=1-y),f.y+=x*y);if((y=r*p)&&(M=l[0]/2,x=l[1]/2,e=-1,y))for(;++e<b;)o=d[e],o.x+=(M-o.x)*y,o.y+=(x-o.y)*y;if(g)for(ri(t=ya.geom.quadtree(d),r,a),e=-1;++e<b;)(o=d[e]).fixed||t.visit(n(o));for(e=-1;++e<b;)o=d[e],o.fixed?(o.x=o.px,o.y=o.py):(o.x-=(o.px-(o.px=o.x))*s,o.y-=(o.py-(o.py=o.y))*s);c.tick({type:"tick",alpha:r})},o.nodes=function(n){return arguments.length?(d=n,o):d},o.links=function(n){return arguments.length?(v=n,o):v},o.size=function(n){return arguments.length?(l=n,o):l},o.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,o):f},o.distance=o.linkDistance,o.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,o):h},o.friction=function(n){return arguments.length?(s=+n,o):s},o.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,o):g},o.gravity=function(n){return arguments.length?(p=+n,o):p},o.theta=function(n){return arguments.length?(m=+n,o):m},o.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),ya.timer(o.tick)),o):r},o.start=function(){function n(n,r){for(var i,u=t(e),a=-1,o=u.length;++a<o;)if(!isNaN(i=u[a][n]))return i;return Math.random()*r}function t(){if(!c){for(c=[],r=0;p>r;++r)c[r]=[];for(r=0;m>r;++r){var n=v[r];c[n.source.index].push(n.target),c[n.target.index].push(n.source)}}return c[e]}var e,r,c,s,p=d.length,m=v.length,y=l[0],M=l[1];for(e=0;p>e;++e)(s=d[e]).index=e,s.weight=0;for(e=0;m>e;++e)s=v[e],"number"==typeof s.source&&(s.source=d[s.source]),"number"==typeof s.target&&(s.target=d[s.target]),++s.source.weight,++s.target.weight;for(e=0;p>e;++e)s=d[e],isNaN(s.x)&&(s.x=n("x",y)),isNaN(s.y)&&(s.y=n("y",M)),isNaN(s.px)&&(s.px=s.x),isNaN(s.py)&&(s.py=s.y);if(i=[],"function"==typeof f)for(e=0;m>e;++e)i[e]=+f.call(this,v[e],e);else for(e=0;m>e;++e)i[e]=f;if(u=[],"function"==typeof h)for(e=0;m>e;++e)u[e]=+h.call(this,v[e],e);else for(e=0;m>e;++e)u[e]=h;if(a=[],"function"==typeof g)for(e=0;p>e;++e)a[e]=+g.call(this,d[e],e);else for(e=0;p>e;++e)a[e]=g;return o.resume()},o.resume=function(){return o.alpha(.1)},o.stop=function(){return o.alpha(0)},o.drag=function(){return e||(e=ya.behavior.drag().origin(mt).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",ni)),arguments.length?(this.on("mouseover.force",ti).on("mouseout.force",ei).call(e),void 0):e},ya.rebind(o,c,"on")};var bc=20,_c=1;ya.layout.hierarchy=function(){function n(t,a,o){var c=i.call(e,t,a);if(t.depth=a,o.push(t),c&&(l=c.length)){for(var l,s,f=-1,h=t.children=[],g=0,p=a+1;++f<l;)s=n(c[f],p,o),s.parent=t,h.push(s),g+=s.value;r&&h.sort(r),u&&(t.value=g)}else u&&(t.value=+u.call(e,t,a)||0);return t}function t(n,r){var i=n.children,a=0;if(i&&(o=i.length))for(var o,c=-1,l=r+1;++c<o;)a+=t(i[c],l);else u&&(a=+u.call(e,n,r)||0);return u&&(n.value=a),a}function e(t){var e=[];return n(t,0,e),e}var r=oi,i=ui,u=ai;return e.sort=function(n){return arguments.length?(r=n,e):r},e.children=function(n){return arguments.length?(i=n,e):i},e.value=function(n){return arguments.length?(u=n,e):u},e.revalue=function(n){return t(n,0),n},e},ya.layout.partition=function(){function n(t,e,r,i){var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(a=u.length)){var a,o,c,l=-1;for(r=t.value?r/t.value:0;++l<a;)n(o=u[l],e,c=o.value*r,i),e+=c}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,t(e[u]));return 1+r}function e(e,u){var a=r.call(this,e,u);return n(a[0],0,i[0],i[1]/t(a[0])),a}var r=ya.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},ii(e,r)},ya.layout.pie=function(){function n(u){var a=u.map(function(e,r){return+t.call(n,e,r)}),o=+("function"==typeof r?r.apply(this,arguments):r),c=(("function"==typeof i?i.apply(this,arguments):i)-o)/ya.sum(a),l=ya.range(u.length);null!=e&&l.sort(e===wc?function(n,t){return a[t]-a[n]}:function(n,t){return e(u[n],u[t])});var s=[];return l.forEach(function(n){var t;s[n]={data:u[n],value:t=a[n],startAngle:o,endAngle:o+=t*c}}),s}var t=Number,e=wc,r=0,i=2*Ka;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n};var wc={};ya.layout.stack=function(){function n(o,c){var l=o.map(function(e,r){return t.call(n,e,r)}),s=l.map(function(t){return t.map(function(t,e){return[u.call(n,t,e),a.call(n,t,e)]})}),f=e.call(n,s,c);l=ya.permute(l,f),s=ya.permute(s,f);var h,g,p,m=r.call(n,s,c),d=l.length,v=l[0].length;for(g=0;v>g;++g)for(i.call(n,l[0][g],p=m[g],s[0][g][1]),h=1;d>h;++h)i.call(n,l[h][g],p+=s[h-1][g][1],s[h][g][1]);return o}var t=mt,e=hi,r=gi,i=fi,u=li,a=si;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:Sc.get(t)||hi,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:Ec.get(t)||gi,n):r},n.x=function(t){return arguments.length?(u=t,n):u},n.y=function(t){return arguments.length?(a=t,n):a},n.out=function(t){return arguments.length?(i=t,n):i},n};var Sc=ya.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(pi),u=n.map(mi),a=ya.range(r).sort(function(n,t){return i[n]-i[t]}),o=0,c=0,l=[],s=[];for(t=0;r>t;++t)e=a[t],c>o?(o+=u[e],l.push(e)):(c+=u[e],s.push(e));return s.reverse().concat(l)},reverse:function(n){return ya.range(n.length).reverse()},"default":hi}),Ec=ya.map({silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,a=[],o=0,c=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];r>o&&(o=r),a.push(r)}for(e=0;u>e;++e)c[e]=(o-a[e])/2;return c},wiggle:function(n){var t,e,r,i,u,a,o,c,l,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=l=0,e=1;h>e;++e){for(t=0,i=0;s>t;++t)i+=n[t][e][1];for(t=0,u=0,o=f[e][0]-f[e-1][0];s>t;++t){for(r=0,a=(n[t][e][1]-n[t][e-1][1])/(2*o);t>r;++r)a+=(n[r][e][1]-n[r][e-1][1])/o;u+=a*n[t][e][1]}g[e]=c-=i?u/i*o:0,l>c&&(l=c)}for(e=0;h>e;++e)g[e]-=l;return g},expand:function(n){var t,e,r,i=n.length,u=n[0].length,a=1/i,o=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];if(r)for(t=0;i>t;t++)n[t][e][1]/=r;else for(t=0;i>t;t++)n[t][e][1]=a}for(e=0;u>e;++e)o[e]=0;return o},zero:gi});ya.layout.histogram=function(){function n(n,u){for(var a,o,c=[],l=n.map(e,this),s=r.call(this,l,u),f=i.call(this,s,l,u),u=-1,h=l.length,g=f.length-1,p=t?1:1/h;++u<g;)a=c[u]=[],a.dx=f[u+1]-(a.x=f[u]),a.y=0;if(g>0)for(u=-1;++u<h;)o=l[u],o>=s[0]&&o<=s[1]&&(a=c[ya.bisect(f,o,1,g)-1],a.y+=p,a.push(n[u]));return c}var t=!0,e=Number,r=Mi,i=vi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=pt(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return yi(n,t)}:pt(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ya.layout.tree=function(){function n(n,u){function a(n,t){var r=n.children,i=n._tree;if(r&&(u=r.length)){for(var u,o,l,s=r[0],f=s,h=-1;++h<u;)l=r[h],a(l,o),f=c(l,o,f),o=l;Ni(n);var g=.5*(s._tree.prelim+l._tree.prelim);t?(i.prelim=t._tree.prelim+e(n,t),i.mod=i.prelim-g):i.prelim=g}else t&&(i.prelim=t._tree.prelim+e(n,t))}function o(n,t){n.x=n._tree.prelim+t;var e=n.children;if(e&&(r=e.length)){var r,i=-1;for(t+=n._tree.mod;++i<r;)o(e[i],t)}}function c(n,t,r){if(t){for(var i,u=n,a=n,o=t,c=n.parent.children[0],l=u._tree.mod,s=a._tree.mod,f=o._tree.mod,h=c._tree.mod;o=_i(o),u=bi(u),o&&u;)c=bi(c),a=_i(a),a._tree.ancestor=n,i=o._tree.prelim+f-u._tree.prelim-l+e(o,u),i>0&&(qi(Ti(o,n,r),n,i),l+=i,s+=i),f+=o._tree.mod,l+=u._tree.mod,h+=c._tree.mod,s+=a._tree.mod;o&&!_i(a)&&(a._tree.thread=o,a._tree.mod+=f-s),u&&!bi(c)&&(c._tree.thread=u,c._tree.mod+=l-h,r=n)}return r}var l=t.call(this,n,u),s=l[0];Ai(s,function(n,t){n._tree={ancestor:n,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),a(s),o(s,-s._tree.prelim);var f=wi(s,Ei),h=wi(s,Si),g=wi(s,ki),p=f.x-e(f,h)/2,m=h.x+e(h,f)/2,d=g.depth||1;return Ai(s,i?function(n){n.x*=r[0],n.y=n.depth*r[1],delete n._tree}:function(n){n.x=(n.x-p)/(m-p)*r[0],n.y=n.depth/d*r[1],delete n._tree}),l}var t=ya.layout.hierarchy().sort(null).value(null),e=xi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ya.layout.pack=function(){function n(n,u){var a=e.call(this,n,u),o=a[0],c=i[0],l=i[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(o.x=o.y=0,Ai(o,function(n){n.r=+s(n.value)}),Ai(o,Li),r){var f=r*(t?1:Math.max(2*o.r/c,2*o.r/l))/2;Ai(o,function(n){n.r+=f}),Ai(o,Li),Ai(o,function(n){n.r-=f})}return Pi(o,c/2,l/2,t?1:1/Math.max(2*o.r/c,2*o.r/l)),a}var t,e=ya.layout.hierarchy().sort(Ci),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},ii(n,e)},ya.layout.cluster=function(){function n(n,u){var a,o=t.call(this,n,u),c=o[0],l=0;Ai(c,function(n){var t=n.children;t&&t.length?(n.x=Ri(t),n.y=Yi(t)):(n.x=a?l+=e(n,a):0,n.y=0,a=n)});var s=Ui(c),f=Ii(c),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return Ai(c,i?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),o}var t=ya.layout.hierarchy().sort(null).value(null),e=xi,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ya.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var u=e.children;if(u&&u.length){var a,o,c,l=f(e),s=[],h=u.slice(),p=1/0,m="slice"===g?l.dx:"dice"===g?l.dy:"slice-dice"===g?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),s.area=0;(c=h.length)>0;)s.push(a=h[c-1]),s.area+=a.area,"squarify"!==g||(o=r(s,m))<=p?(h.pop(),p=o):(s.area-=s.pop().area,i(s,m,l,!1),m=Math.min(l.dx,l.dy),s.length=s.area=0,p=1/0);s.length&&(i(s,m,l,!0),s.length=s.area=0),u.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var u,a=f(t),o=r.slice(),c=[];for(n(o,a.dx*a.dy/t.value),c.area=0;u=o.pop();)c.push(u),c.area+=u.area,null!=u.z&&(i(c,u.z?a.dx:a.dy,a,!o.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,u=1/0,a=-1,o=n.length;++a<o;)(e=n[a].area)&&(u>e&&(u=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*p/r,r/(t*u*p)):1/0}function i(n,t,e,r){var i,u=-1,a=n.length,o=e.x,l=e.y,s=t?c(n.area/t):0;if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++u<a;)i=n[u],i.x=o,i.y=l,i.dy=s,o+=i.dx=Math.min(e.x+e.dx-o,s?c(i.area/s):0);i.z=!0,i.dx+=e.x+e.dx-o,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++u<a;)i=n[u],i.x=o,i.y=l,i.dx=s,l+=i.dy=Math.min(e.y+e.dy-l,s?c(i.area/s):0);i.z=!1,i.dy+=e.y+e.dy-l,e.x+=s,e.dx-=s}}function u(r){var i=a||o(r),u=i[0];return u.x=0,u.y=0,u.dx=l[0],u.dy=l[1],a&&o.revalue(u),n([u],u.dx*u.dy/u.value),(a?e:t)(u),h&&(a=i),i}var a,o=ya.layout.hierarchy(),c=Math.round,l=[1,1],s=null,f=Vi,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return u.size=function(n){return arguments.length?(l=n,u):l},u.padding=function(n){function t(t){var e=n.call(u,t,t.depth);return null==e?Vi(t):Xi(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Xi(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Vi:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,u},u.round=function(n){return arguments.length?(c=n?Math.round:Number,u):c!=Number},u.sticky=function(n){return arguments.length?(h=n,a=null,u):h},u.ratio=function(n){return arguments.length?(p=n,u):p},u.mode=function(n){return arguments.length?(g=n+"",u):g},ii(u,o)},ya.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ya.random.normal.apply(ya,arguments);return function(){return Math.exp(n())}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t/n}}},ya.scale={};var kc={floor:mt,ceil:mt};ya.scale.linear=function(){return Ki([0,1],[0,1],Sr,!1)},ya.scale.log=function(){return uu(ya.scale.linear().domain([0,1]),10,!0,[1,10])};var Ac=ya.format(".0e"),Nc={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ya.scale.pow=function(){return au(ya.scale.linear(),1,[0,1])},ya.scale.sqrt=function(){return ya.scale.pow().exponent(.5)},ya.scale.ordinal=function(){return cu([],{t:"range",a:[[]]})},ya.scale.category10=function(){return ya.scale.ordinal().range(qc)},ya.scale.category20=function(){return ya.scale.ordinal().range(Tc)},ya.scale.category20b=function(){return ya.scale.ordinal().range(Cc)},ya.scale.category20c=function(){return ya.scale.ordinal().range(zc)};var qc=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(ut),Tc=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(ut),Cc=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(ut),zc=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(ut);ya.scale.quantile=function(){return lu([],[])},ya.scale.quantize=function(){return su(0,1,[0,1])},ya.scale.threshold=function(){return fu([.5],[0,1])},ya.scale.identity=function(){return hu([0,1])},ya.svg.arc=function(){function n(){var n=t.apply(this,arguments),u=e.apply(this,arguments),a=r.apply(this,arguments)+Dc,o=i.apply(this,arguments)+Dc,c=(a>o&&(c=a,a=o,o=c),o-a),l=Ka>c?"0":"1",s=Math.cos(a),f=Math.sin(a),h=Math.cos(o),g=Math.sin(o);return c>=jc?n?"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"M0,"+n+"A"+n+","+n+" 0 1,0 0,"+-n+"A"+n+","+n+" 0 1,0 0,"+n+"Z":"M0,"+u+"A"+u+","+u+" 0 1,1 0,"+-u+"A"+u+","+u+" 0 1,1 0,"+u+"Z":n?"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L"+n*h+","+n*g+"A"+n+","+n+" 0 "+l+",0 "+n*s+","+n*f+"Z":"M"+u*s+","+u*f+"A"+u+","+u+" 0 "+l+",1 "+u*h+","+u*g+"L0,0"+"Z"}var t=gu,e=pu,r=mu,i=du;return n.innerRadius=function(e){return arguments.length?(t=pt(e),n):t},n.outerRadius=function(t){return arguments.length?(e=pt(t),n):e},n.startAngle=function(t){return arguments.length?(r=pt(t),n):r},n.endAngle=function(t){return arguments.length?(i=pt(t),n):i},n.centroid=function(){var n=(t.apply(this,arguments)+e.apply(this,arguments))/2,u=(r.apply(this,arguments)+i.apply(this,arguments))/2+Dc;return[Math.cos(u)*n,Math.sin(u)*n]},n};var Dc=-Ka/2,jc=2*Ka-1e-6;ya.svg.line.radial=function(){var n=Ue(vu);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},$e.reverse=We,We.reverse=$e,ya.svg.area=function(){return yu(mt)},ya.svg.area.radial=function(){var n=yu(vu);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ya.svg.chord=function(){function n(n,o){var c=t(this,u,n,o),l=t(this,a,n,o);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,l)?i(c.r,c.p1,c.r,c.p0):i(c.r,c.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+i(l.r,l.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),u=o.call(n,i,r),a=c.call(n,i,r)+Dc,s=l.call(n,i,r)+Dc;return{r:u,a0:a,a1:s,p0:[u*Math.cos(a),u*Math.sin(a)],p1:[u*Math.cos(s),u*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Ka)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var u=ze,a=De,o=Mu,c=mu,l=du;return n.radius=function(t){return arguments.length?(o=pt(t),n):o},n.source=function(t){return arguments.length?(u=pt(t),n):u},n.target=function(t){return arguments.length?(a=pt(t),n):a},n.startAngle=function(t){return arguments.length?(c=pt(t),n):c},n.endAngle=function(t){return arguments.length?(l=pt(t),n):l},n},ya.svg.diagonal=function(){function n(n,i){var u=t.call(this,n,i),a=e.call(this,n,i),o=(u.y+a.y)/2,c=[u,{x:u.x,y:o},{x:a.x,y:o},a];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=ze,e=De,r=xu;return n.source=function(e){return arguments.length?(t=pt(e),n):t},n.target=function(t){return arguments.length?(e=pt(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ya.svg.diagonal.radial=function(){var n=ya.svg.diagonal(),t=xu,e=n.projection;return n.projection=function(n){return arguments.length?e(bu(t=n)):t},n},ya.svg.symbol=function(){function n(n,r){return(Lc.get(t.call(this,n,r))||Su)(e.call(this,n,r))}var t=wu,e=_u;return n.type=function(e){return arguments.length?(t=pt(e),n):t},n.size=function(t){return arguments.length?(e=pt(t),n):e},n};var Lc=ya.map({circle:Su,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Oc)),e=t*Oc;return"M0,"+-t+"L"+e+",0"+" 0,"+t+" "+-e+",0"+"Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Pc),e=t*Pc/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Pc),e=t*Pc/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ya.svg.symbolTypes=Lc.keys();var Hc,Fc,Pc=Math.sqrt(3),Oc=Math.tan(30*to),Yc=[],Rc=0;Yc.call=Ya.call,Yc.empty=Ya.empty,Yc.node=Ya.node,Yc.size=Ya.size,ya.transition=function(n){return arguments.length?Hc?n.transition():n:Ia.transition()},ya.transition.prototype=Yc,Yc.select=function(n){var t,e,r,i=this.id,u=[];n=v(n);for(var a=-1,o=this.length;++a<o;){u.push(t=[]);for(var c=this[a],l=-1,s=c.length;++l<s;)(r=c[l])&&(e=n.call(r,r.__data__,l,a))?("__data__"in r&&(e.__data__=r.__data__),Nu(e,l,i,r.__transition__[i]),t.push(e)):t.push(null)}return Eu(u,i)},Yc.selectAll=function(n){var t,e,r,i,u,a=this.id,o=[];n=y(n);for(var c=-1,l=this.length;++c<l;)for(var s=this[c],f=-1,h=s.length;++f<h;)if(r=s[f]){u=r.__transition__[a],e=n.call(r,r.__data__,f,c),o.push(t=[]);for(var g=-1,p=e.length;++g<p;)(i=e[g])&&Nu(i,g,a,u),t.push(i)}return Eu(o,a)},Yc.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=N(n));for(var u=0,a=this.length;a>u;u++){i.push(t=[]);for(var e=this[u],o=0,c=e.length;c>o;o++)(r=e[o])&&n.call(r,r.__data__,o)&&t.push(r)}return Eu(i,this.id)},Yc.tween=function(n,t){var e=this.id;return arguments.length<2?this.node().__transition__[e].tween.get(n):T(this,null==t?function(t){t.__transition__[e].tween.remove(n)}:function(r){r.__transition__[e].tween.set(n,t)})},Yc.attr=function(n,t){function e(){this.removeAttribute(o)}function r(){this.removeAttributeNS(o.space,o.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(o);return e!==n&&(t=a(e,n),function(n){this.setAttribute(o,t(n))})})}function u(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(o.space,o.local);return e!==n&&(t=a(e,n),function(n){this.setAttributeNS(o.space,o.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var a="transform"==n?Br:Sr,o=ya.ns.qualify(n);return ku(this,"attr."+n,t,o.local?u:i)},Yc.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ya.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},Yc.style=function(n,t,e){function r(){this.style.removeProperty(n)}function i(t){return null==t?r:(t+="",function(){var r,i=ba.getComputedStyle(this,null).getPropertyValue(n);return i!==t&&(r=Sr(i,t),function(t){this.style.setProperty(n,r(t),e)})})}var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return ku(this,"style."+n,t,i)},Yc.styleTween=function(n,t,e){function r(r,i){var u=t.call(this,r,i,ba.getComputedStyle(this,null).getPropertyValue(n));return u&&function(t){this.style.setProperty(n,u(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},Yc.text=function(n){return ku(this,"text",n,Au)},Yc.remove=function(){return this.each("end.transition",function(){var n;!this.__transition__&&(n=this.parentNode)&&n.removeChild(this)})},Yc.ease=function(n){var t=this.id;return arguments.length<1?this.node().__transition__[t].ease:("function"!=typeof n&&(n=ya.ease.apply(ya,arguments)),T(this,function(e){e.__transition__[t].ease=n}))},Yc.delay=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].delay=0|n.call(e,e.__data__,r,i)}:(n|=0,function(e){e.__transition__[t].delay=n}))},Yc.duration=function(n){var t=this.id;return T(this,"function"==typeof n?function(e,r,i){e.__transition__[t].duration=Math.max(1,0|n.call(e,e.__data__,r,i))}:(n=Math.max(1,0|n),function(e){e.__transition__[t].duration=n}))},Yc.each=function(n,t){var e=this.id;if(arguments.length<2){var r=Fc,i=Hc;Hc=e,T(this,function(t,r,i){Fc=t.__transition__[e],n.call(t,t.__data__,r,i)}),Fc=r,Hc=i}else T(this,function(r){var i=r.__transition__[e];(i.event||(i.event=ya.dispatch("start","end"))).on(n,t)});return this},Yc.transition=function(){for(var n,t,e,r,i=this.id,u=++Rc,a=[],o=0,c=this.length;c>o;o++){a.push(n=[]);for(var t=this[o],l=0,s=t.length;s>l;l++)(e=t[l])&&(r=Object.create(e.__transition__[i]),r.delay+=r.duration,Nu(e,l,u,r)),n.push(e)}return Eu(a,u)},ya.svg.axis=function(){function n(n){n.each(function(){var n,f=ya.select(this),h=null==l?e.ticks?e.ticks.apply(e,c):e.domain():l,g=null==t?e.tickFormat?e.tickFormat.apply(e,c):String:t,p=Cu(e,h,s),m=f.selectAll(".tick.minor").data(p,String),d=m.enter().insert("line",".tick").attr("class","tick minor").style("opacity",1e-6),v=ya.transition(m.exit()).style("opacity",1e-6).remove(),y=ya.transition(m).style("opacity",1),M=f.selectAll(".tick.major").data(h,String),x=M.enter().insert("g",".domain").attr("class","tick major").style("opacity",1e-6),b=ya.transition(M.exit()).style("opacity",1e-6).remove(),_=ya.transition(M).style("opacity",1),w=Bi(e),S=f.selectAll(".domain").data([0]),E=(S.enter().append("path").attr("class","domain"),ya.transition(S)),k=e.copy(),A=this.__chart__||k;
this.__chart__=k,x.append("line"),x.append("text");var N=x.select("line"),q=_.select("line"),T=M.select("text").text(g),C=x.select("text"),z=_.select("text");switch(r){case"bottom":n=qu,d.attr("y2",u),y.attr("x2",0).attr("y2",u),N.attr("y2",i),C.attr("y",Math.max(i,0)+o),q.attr("x2",0).attr("y2",i),z.attr("x",0).attr("y",Math.max(i,0)+o),T.attr("dy",".71em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+a+"V0H"+w[1]+"V"+a);break;case"top":n=qu,d.attr("y2",-u),y.attr("x2",0).attr("y2",-u),N.attr("y2",-i),C.attr("y",-(Math.max(i,0)+o)),q.attr("x2",0).attr("y2",-i),z.attr("x",0).attr("y",-(Math.max(i,0)+o)),T.attr("dy","0em").style("text-anchor","middle"),E.attr("d","M"+w[0]+","+-a+"V0H"+w[1]+"V"+-a);break;case"left":n=Tu,d.attr("x2",-u),y.attr("x2",-u).attr("y2",0),N.attr("x2",-i),C.attr("x",-(Math.max(i,0)+o)),q.attr("x2",-i).attr("y2",0),z.attr("x",-(Math.max(i,0)+o)).attr("y",0),T.attr("dy",".32em").style("text-anchor","end"),E.attr("d","M"+-a+","+w[0]+"H0V"+w[1]+"H"+-a);break;case"right":n=Tu,d.attr("x2",u),y.attr("x2",u).attr("y2",0),N.attr("x2",i),C.attr("x",Math.max(i,0)+o),q.attr("x2",i).attr("y2",0),z.attr("x",Math.max(i,0)+o).attr("y",0),T.attr("dy",".32em").style("text-anchor","start"),E.attr("d","M"+a+","+w[0]+"H0V"+w[1]+"H"+a)}if(e.rangeBand){var D=k.rangeBand()/2,j=function(n){return k(n)+D};x.call(n,j),_.call(n,j)}else x.call(n,A),_.call(n,k),b.call(n,k),d.call(n,A),y.call(n,k),v.call(n,k)})}var t,e=ya.scale.linear(),r=Uc,i=6,u=6,a=6,o=3,c=[10],l=null,s=0;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Ic?t+"":Uc,n):r},n.ticks=function(){return arguments.length?(c=arguments,n):c},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t,e){if(!arguments.length)return i;var r=arguments.length-1;return i=+t,u=r>1?+e:i,a=r>0?+arguments[r]:i,n},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(t){return arguments.length?(s=+t,n):s},n};var Uc="bottom",Ic={top:1,right:1,bottom:1,left:1};ya.svg.brush=function(){function n(u){u.each(function(){var u,a=ya.select(this),s=a.selectAll(".background").data([0]),f=a.selectAll(".extent").data([0]),h=a.selectAll(".resize").data(l,String);a.style("pointer-events","all").on("mousedown.brush",i).on("touchstart.brush",i),s.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),f.enter().append("rect").attr("class","extent").style("cursor","move"),h.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Vc[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),h.style("display",n.empty()?"none":null),h.exit().remove(),o&&(u=Bi(o),s.attr("x",u[0]).attr("width",u[1]-u[0]),e(a)),c&&(u=Bi(c),s.attr("y",u[0]).attr("height",u[1]-u[0]),r(a)),t(a)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)][0]+","+s[+/^s/.test(n)][1]+")"})}function e(n){n.select(".extent").attr("x",s[0][0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1][0]-s[0][0])}function r(n){n.select(".extent").attr("y",s[0][1]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",s[1][1]-s[0][1])}function i(){function i(){var n=ya.event.changedTouches;return n?ya.touches(M,n)[0]:ya.mouse(M)}function l(){32==ya.event.keyCode&&(k||(v=null,N[0]-=s[1][0],N[1]-=s[1][1],k=2),g())}function h(){32==ya.event.keyCode&&2==k&&(N[0]+=s[1][0],N[1]+=s[1][1],k=0,g())}function p(){var n=i(),u=!1;y&&(n[0]+=y[0],n[1]+=y[1]),k||(ya.event.altKey?(v||(v=[(s[0][0]+s[1][0])/2,(s[0][1]+s[1][1])/2]),N[0]=s[+(n[0]<v[0])][0],N[1]=s[+(n[1]<v[1])][1]):v=null),S&&m(n,o,0)&&(e(_),u=!0),E&&m(n,c,1)&&(r(_),u=!0),u&&(t(_),b({type:"brush",mode:k?"move":"resize"}))}function m(n,t,e){var r,i,a=Bi(t),o=a[0],c=a[1],l=N[e],h=s[1][e]-s[0][e];return k&&(o-=l,c-=h+l),r=f[e]?Math.max(o,Math.min(c,n[e])):n[e],k?i=(r+=l)+h:(v&&(l=Math.max(o,Math.min(c,2*v[e]-r))),r>l?(i=r,r=l):i=l),s[0][e]!==r||s[1][e]!==i?(u=null,s[0][e]=r,s[1][e]=i,!0):void 0}function d(){p(),_.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ya.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),A(),b({type:"brushend"})}var v,y,M=this,x=ya.select(ya.event.target),b=a.of(M,arguments),_=ya.select(M),w=x.datum(),S=!/^(n|s)$/.test(w)&&o,E=!/^(e|w)$/.test(w)&&c,k=x.classed("extent"),A=H(),N=i(),q=ya.select(ba).on("keydown.brush",l).on("keyup.brush",h);if(ya.event.changedTouches?q.on("touchmove.brush",p).on("touchend.brush",d):q.on("mousemove.brush",p).on("mouseup.brush",d),k)N[0]=s[0][0]-N[0],N[1]=s[0][1]-N[1];else if(w){var T=+/w$/.test(w),C=+/^n/.test(w);y=[s[1-T][0]-N[0],s[1-C][1]-N[1]],N[0]=s[T][0],N[1]=s[C][1]}else ya.event.altKey&&(v=N.slice());_.style("pointer-events","none").selectAll(".resize").style("display",null),ya.select("body").style("cursor",x.style("cursor")),b({type:"brushstart"}),p()}var u,a=m(n,"brushstart","brush","brushend"),o=null,c=null,l=Xc[0],s=[[0,0],[0,0]],f=[!0,!0];return n.x=function(t){return arguments.length?(o=t,l=Xc[!o<<1|!c],n):o},n.y=function(t){return arguments.length?(c=t,l=Xc[!o<<1|!c],n):c},n.clamp=function(t){return arguments.length?(o&&c?f=[!!t[0],!!t[1]]:(o||c)&&(f[+!o]=!!t),n):o&&c?f:o||c?f[+!o]:null},n.extent=function(t){var e,r,i,a,l;return arguments.length?(u=[[0,0],[0,0]],o&&(e=t[0],r=t[1],c&&(e=e[0],r=r[0]),u[0][0]=e,u[1][0]=r,o.invert&&(e=o(e),r=o(r)),e>r&&(l=e,e=r,r=l),s[0][0]=0|e,s[1][0]=0|r),c&&(i=t[0],a=t[1],o&&(i=i[1],a=a[1]),u[0][1]=i,u[1][1]=a,c.invert&&(i=c(i),a=c(a)),i>a&&(l=i,i=a,a=l),s[0][1]=0|i,s[1][1]=0|a),n):(t=u||s,o&&(e=t[0][0],r=t[1][0],u||(e=s[0][0],r=s[1][0],o.invert&&(e=o.invert(e),r=o.invert(r)),e>r&&(l=e,e=r,r=l))),c&&(i=t[0][1],a=t[1][1],u||(i=s[0][1],a=s[1][1],c.invert&&(i=c.invert(i),a=c.invert(a)),i>a&&(l=i,i=a,a=l))),o&&c?[[e,i],[r,a]]:o?[e,r]:c&&[i,a])},n.clear=function(){return u=null,s[0][0]=s[0][1]=s[1][0]=s[1][1]=0,n},n.empty=function(){return o&&s[0][0]===s[1][0]||c&&s[0][1]===s[1][1]},ya.rebind(n,a,"on")};var Vc={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Xc=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]];ya.time={};var Zc=Date,Bc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];zu.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){$c.setUTCDate.apply(this._,arguments)},setDay:function(){$c.setUTCDay.apply(this._,arguments)},setFullYear:function(){$c.setUTCFullYear.apply(this._,arguments)},setHours:function(){$c.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){$c.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){$c.setUTCMinutes.apply(this._,arguments)},setMonth:function(){$c.setUTCMonth.apply(this._,arguments)},setSeconds:function(){$c.setUTCSeconds.apply(this._,arguments)},setTime:function(){$c.setTime.apply(this._,arguments)}};var $c=Date.prototype,Wc="%a %b %e %X %Y",Jc="%m/%d/%Y",Gc="%H:%M:%S",Kc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Qc=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],nl=["January","February","March","April","May","June","July","August","September","October","November","December"],tl=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];ya.time.year=Du(function(n){return n=ya.time.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ya.time.years=ya.time.year.range,ya.time.years.utc=ya.time.year.utc.range,ya.time.day=Du(function(n){var t=new Zc(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ya.time.days=ya.time.day.range,ya.time.days.utc=ya.time.day.utc.range,ya.time.dayOfYear=function(n){var t=ya.time.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},Bc.forEach(function(n,t){n=n.toLowerCase(),t=7-t;var e=ya.time[n]=Du(function(n){return(n=ya.time.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ya.time[n+"s"]=e.range,ya.time[n+"s"].utc=e.utc.range,ya.time[n+"OfYear"]=function(n){var e=ya.time.year(n).getDay();return Math.floor((ya.time.dayOfYear(n)+(e+t)%7)/7)}}),ya.time.week=ya.time.sunday,ya.time.weeks=ya.time.sunday.range,ya.time.weeks.utc=ya.time.sunday.utc.range,ya.time.weekOfYear=ya.time.sundayOfYear,ya.time.format=function(n){function t(t){for(var r,i,u,a=[],o=-1,c=0;++o<e;)37===n.charCodeAt(o)&&(a.push(n.substring(c,o)),null!=(i=fl[r=n.charAt(++o)])&&(r=n.charAt(++o)),(u=hl[r])&&(r=u(t,null==i?"e"===r?" ":"0":i)),a.push(r),c=o+1);return a.push(n.substring(c,o)),a.join("")}var e=n.length;return t.parse=function(t){var e={y:1900,m:0,d:1,H:0,M:0,S:0,L:0},r=Lu(e,n,t,0);if(r!=t.length)return null;"p"in e&&(e.H=e.H%12+12*e.p);var i=new Zc;return"j"in e?i.setFullYear(e.y,0,e.j):"w"in e&&("W"in e||"U"in e)?(i.setFullYear(e.y,0,1),i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),i.setHours(e.H,e.M,e.S,e.L),i},t.toString=function(){return n},t};var el=Hu(Kc),rl=Fu(Kc),il=Hu(Qc),ul=Fu(Qc),al=Hu(nl),ol=Fu(nl),cl=Hu(tl),ll=Fu(tl),sl=/^%/,fl={"-":"",_:" ",0:"0"},hl={a:function(n){return Qc[n.getDay()]},A:function(n){return Kc[n.getDay()]},b:function(n){return tl[n.getMonth()]},B:function(n){return nl[n.getMonth()]},c:ya.time.format(Wc),d:function(n,t){return Pu(n.getDate(),t,2)},e:function(n,t){return Pu(n.getDate(),t,2)},H:function(n,t){return Pu(n.getHours(),t,2)},I:function(n,t){return Pu(n.getHours()%12||12,t,2)},j:function(n,t){return Pu(1+ya.time.dayOfYear(n),t,3)},L:function(n,t){return Pu(n.getMilliseconds(),t,3)},m:function(n,t){return Pu(n.getMonth()+1,t,2)},M:function(n,t){return Pu(n.getMinutes(),t,2)},p:function(n){return n.getHours()>=12?"PM":"AM"},S:function(n,t){return Pu(n.getSeconds(),t,2)},U:function(n,t){return Pu(ya.time.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Pu(ya.time.mondayOfYear(n),t,2)},x:ya.time.format(Jc),X:ya.time.format(Gc),y:function(n,t){return Pu(n.getFullYear()%100,t,2)},Y:function(n,t){return Pu(n.getFullYear()%1e4,t,4)},Z:aa,"%":function(){return"%"}},gl={a:Ou,A:Yu,b:Vu,B:Xu,c:Zu,d:Qu,e:Qu,H:ta,I:ta,j:na,L:ia,m:Ku,M:ea,p:ua,S:ra,U:Uu,w:Ru,W:Iu,x:Bu,X:$u,y:Ju,Y:Wu,"%":oa},pl=/^\s*\d+/,ml=ya.map({am:0,pm:1});ya.time.format.utc=function(n){function t(n){try{Zc=zu;var t=new Zc;return t._=n,e(t)}finally{Zc=Date}}var e=ya.time.format(n);return t.parse=function(n){try{Zc=zu;var t=e.parse(n);return t&&t._}finally{Zc=Date}},t.toString=e.toString,t};var dl=ya.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");ya.time.format.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?ca:dl,ca.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},ca.toString=dl.toString,ya.time.second=Du(function(n){return new Zc(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ya.time.seconds=ya.time.second.range,ya.time.seconds.utc=ya.time.second.utc.range,ya.time.minute=Du(function(n){return new Zc(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ya.time.minutes=ya.time.minute.range,ya.time.minutes.utc=ya.time.minute.utc.range,ya.time.hour=Du(function(n){var t=n.getTimezoneOffset()/60;return new Zc(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ya.time.hours=ya.time.hour.range,ya.time.hours.utc=ya.time.hour.utc.range,ya.time.month=Du(function(n){return n=ya.time.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ya.time.months=ya.time.month.range,ya.time.months.utc=ya.time.month.utc.range;var vl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],yl=[[ya.time.second,1],[ya.time.second,5],[ya.time.second,15],[ya.time.second,30],[ya.time.minute,1],[ya.time.minute,5],[ya.time.minute,15],[ya.time.minute,30],[ya.time.hour,1],[ya.time.hour,3],[ya.time.hour,6],[ya.time.hour,12],[ya.time.day,1],[ya.time.day,2],[ya.time.week,1],[ya.time.month,1],[ya.time.month,3],[ya.time.year,1]],Ml=[[ya.time.format("%Y"),Xt],[ya.time.format("%B"),function(n){return n.getMonth()}],[ya.time.format("%b %d"),function(n){return 1!=n.getDate()}],[ya.time.format("%a %d"),function(n){return n.getDay()&&1!=n.getDate()}],[ya.time.format("%I %p"),function(n){return n.getHours()}],[ya.time.format("%I:%M"),function(n){return n.getMinutes()}],[ya.time.format(":%S"),function(n){return n.getSeconds()}],[ya.time.format(".%L"),function(n){return n.getMilliseconds()}]],xl=ya.scale.linear(),bl=fa(Ml);yl.year=function(n,t){return xl.domain(n.map(ga)).ticks(t).map(ha)},ya.time.scale=function(){return la(ya.scale.linear(),yl,bl)};var _l=yl.map(function(n){return[n[0].utc,n[1]]}),wl=[[ya.time.format.utc("%Y"),Xt],[ya.time.format.utc("%B"),function(n){return n.getUTCMonth()}],[ya.time.format.utc("%b %d"),function(n){return 1!=n.getUTCDate()}],[ya.time.format.utc("%a %d"),function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],[ya.time.format.utc("%I %p"),function(n){return n.getUTCHours()}],[ya.time.format.utc("%I:%M"),function(n){return n.getUTCMinutes()}],[ya.time.format.utc(":%S"),function(n){return n.getUTCSeconds()}],[ya.time.format.utc(".%L"),function(n){return n.getUTCMilliseconds()}]],Sl=fa(wl);return _l.year=function(n,t){return xl.domain(n.map(ma)).ticks(t).map(pa)},ya.time.scale.utc=function(){return la(ya.scale.linear(),_l,Sl)},ya.text=dt(function(n){return n.responseText}),ya.json=function(n,t){return vt(n,"application/json",da,t)},ya.html=function(n,t){return vt(n,"text/html",va,t)},ya.xml=dt(function(n){return n.responseXML}),ya}();
// really, really, ridiculously (good looking) big object for our app
var solarEyes = {
    areasArray: [],
    originalTableData: [],
    input: "",
    oilBarrels: "",
    oilPrice: "",
    width: "",
    height: "",
    gradient: "",
    d3Data: [],
    stateInfo: function () {
        // function to grab JSON data from #index action in home_controller.rb
        // calls createAreas() function after receiving JSON data and passes the data as an argument
        // calls saveOriginalTableData() function after receiving JSON data and passes the data as an argument

        var that = this;
        $.ajax({
            url: '/home',
            dataType: 'json',
            type: 'GET'
        }).done(function (data) {
            console.log(data);
            that.createAreas(data);
            that.saveOriginalTableData(data);
        });
    },
    getOilPrice: function () {
        // function to grab JSON data from #get_oil_price action in home_controller.rb
        // assigns JSON data as oilPrice value
        // JSON data is latest crude oil stock price from Yahoo finance API

        var that = this;
        $.ajax({
            url: '/get_oil_price',
            dataType: 'json',
            type: 'GET'
        }).done(function (data) {
            console.log("get oil price data: " + data);
            that.oilPrice = data;
        });
    },
    enterKey: function (e) {
        // function lets user hit 'enter' key to submit desired input value
        // called by event listener when the map loads

        if (e.which == 13) {
            console.log("enter key pressed");
            solarEyes.mapClick();
        }

    },
    mapClick: function () {
        // function for when user clicks on calculate button
        // called by solarEyes.enterKey() and click event listener when the map loads

        var stateBarrels,
            stateAbbreviation,
            originalTableDataLength,
            calculation,
            oilCalculation,
            svg,
            installVal;

        console.log('map clicked');

        // if else statement to handle invalid user input
        // assigns user input as value to variable input
        installVal = parseInt($('#installs').val(), 10);
        if (installVal > 0) {
            solarEyes.input = installVal;
            console.log(solarEyes.input);
        } else {
            solarEyes.input = 0;
        }

        console.log("user input: " + solarEyes.input);
        console.log("oil price: " + solarEyes.oilPrice);

        // assigns id attribute of the state that the user clicked on to variable stateAbbreviation
        stateAbbreviation = $(".state-abbreviation").attr("id");

        // assigns value of variable stateBarrels to be equal to the number of barrels of oil (misleadingly named 'description') of the object in originalTableData array whose id is the same as stateAbbreviation
        originalTableDataLength = solarEyes.originalTableData.length;
        for (var k = 0; k < originalTableDataLength; k++) {
            if (solarEyes.originalTableData[k].id === stateAbbreviation) {
                stateBarrels = solarEyes.originalTableData[k].description;
            }
        }

        // updates text value of element in DOM
        calculation = solarEyes.input * stateBarrels;
        console.log("calculation: " + calculation);
        $('#barrels-display').text(calculation.formatMoney(2, '.', ','));

        // updates text value of element in DOM
        oilCalculation = solarEyes.input * stateBarrels * solarEyes.oilPrice;
        console.log("oilCalculation: " + oilCalculation);
        $('#oil-value').text(oilCalculation.formatMoney(2, '.', ','));

        // d3 oil drop visualization
        width = 290;
        height = 200;

        $("#d3-div").empty();

        d3DataArrayElementToBePushed = calculation / 30;
        if (d3DataArrayElementToBePushed > 90) {
            d3DataArrayElementToBePushed = 90;
            solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        } else {
            solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        }

        // solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        console.log(solarEyes.d3Data);

        var startVal = solarEyes.d3Data.slice(-2)[0];
        var endVal = solarEyes.d3Data.slice(-1)[0];

        console.log('startVal: ' + startVal + '/ endVal: ' + endVal);

        svg = d3.select("#d3-div").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 8 + "," + height / 2.3 + ")");

        gradient = svg.append("defs").append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "20%")
            .attr("x2", "20%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "20%")
            .attr("stop-color", "#ccf");

        gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#1C425C");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#19162B");

        // declare start value and transition to input value for animation
        svg.selectAll("path")
            .data(d3.range(endVal))
            .enter().append("path")
            .attr("fill", "url(#gradient)")
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

        function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }

        d3.select("#d3-div")
            .on("mouseover", function() {
            console.log("mouseover animation");
            svg.selectAll("path")
            .data(d3.range(endVal))
            .transition()
            .duration(2000)
            .each("start", function() {
               d3.select(this)
               .attr("fill", "url(#gradient)");
            })
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

            function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }
        });

        d3.select("#calc-button")
            .on("click", function() {
            console.log("click animation");
            svg.selectAll("path")
            .data(d3.range(endVal))
            .transition()
            .duration(2000)
            .each("start", function() {
               d3.select(this)
               .attr("fill", "url(#gradient)");
            })
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

        function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }
        });

    },
    area: {
        // object to clone
        id: "",
        description: ""
    },
    createAreas: function (data) {
        // function readies areas attribute of var dataProvider in makeMap function
        // calls makeMap()

        var j,
            newArea,
            createAreasDataLength;

        // creates content for each State balloon that the user will see after clicking on a state on the map
        createAreasDataLength = data.length;
        for (j = 0; j < createAreasDataLength; j++) {
            newArea = Object.create(this.area);
            newArea.id = data[j].state_name;
            newArea.description = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="number" class="form-control" autofocus="true" placeholder="installs" id="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button" id="calc-button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved/year: <span id="barrels-display"> '+ this.input +' </span><br><span class="glyphicon glyphicon-usd" style="color:#00AB01"></span> value: <span id="oil-value"></span><span class="state-abbreviation" id=' + data[j].state_name + '></span><br><br><div id="d3-div"> </div>';
            this.areasArray.push(newArea);
        }
        this.makeMap();
    },
    saveOriginalTableData: function (data) {
        // saves JSON data in originalTableData array

        var i,
            newTableData,
            saveOriginalTableDataLength;

        saveOriginalTableDataLength = data.length;
        for (i = 0; i < saveOriginalTableDataLength; i ++) {
            newTableData = Object.create(this.area);
            newTableData.id += data[i].state_name;
            newTableData.description += data[i].barrels_of_oil_per_year;
            this.originalTableData.push(newTableData);
        }
    },
    makeMap: function () {
        var map,
            dataProvider;

        // create AmMap object
        map = new AmCharts.AmMap();

        fitMapToContainer = true;
        // set path to images
        map.pathToImages = "/assets/";

        map.balloon.adjustBorderColor = true;
        map.balloon.borderColor = "#BDBDBD";
        map.balloon.color = "#333333";
        map.balloon.fillColor = "#FFFFFF";
        map.balloon.cornerRadius = "3";
        map.balloon.borderThickness = "1";
        map.balloon.fontSize = "20";
        map.balloon.horizontalPadding = "5";
        map.balloon.textShadowColor = "#FFFFFF";
        map.balloon.fillAlpha = "0.8";
        map.fontFamily = "HelveticaNeue-Light";

        /* create data provider object
         mapVar tells the map name of the variable of the map data. You have to
         view source of the map file you included in order to find the name of the
         variable - it's the very first line after commented lines.

         getAreasFromMap indicates that amMap should read all the areas available
         in the map data and treat them as they are included in your data provider.
         in case you don't set it to true, all the areas except listed in data
         provider will be treated as unlisted.
        */
        dataProvider = {
            mapVar: AmCharts.maps.usaHigh,
            getAreasFromMap:true,

            areas: this.areasArray,

            zoomLevel: .6,
            zoomLongitude: 150,
            zoomLatitude: -80
        };

        /* create area settings
         * autoZoom set to true means that the map will zoom-in when clicked on the area
         * selectedColor indicates color of the clicked area.
         */
        map.areasSettings = {
            autoZoom: true,
            descriptionWindowY: 300,
            descriptionWindowWidth: 275,
            descriptionWindowHeight: 335,
            rollOverColor: "#60ABEB",
            rollOverOutlinecolor: "#3277BA",
            selectedColor: "#60ABEB",
        };

        // pass data provider to the map object
        map.dataProvider = dataProvider;

        // let's say we want a small map to be displayed, so let's create it
        // map.smallMap = new AmCharts.SmallMap();

        // write the map to container div
        map.write("mapdiv");

    }
};

// For cloning objects
if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}

// TODO Better variable names here
// This is from StackOverflow to format numbers with commas, no idea what the variables actually are
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

// responsible for page load
AmCharts.ready(function() {

    solarEyes.stateInfo();
    solarEyes.getOilPrice();

    // event listeners
    $('#mapdiv').on('click', '#calc-button', solarEyes.mapClick);
    $('#mapdiv').on('keyup', '#installs', solarEyes.enterKey);

});
// (c) ammap.com | SVG (in JSON format) map of USA
// areas: {id:"US-AK"},{id:"US-AL"},{id:"US-AR"},{id:"US-AZ"},{id:"US-CA"},{id:"US-CO"},{id:"US-CT"},{id:"US-DC"},{id:"US-DE"},{id:"US-FL"},{id:"US-GA"},{id:"US-HI"},{id:"US-IA"},{id:"US-ID"},{id:"US-IL"},{id:"US-IN"},{id:"US-KS"},{id:"US-KY"},{id:"US-LA"},{id:"US-MA"},{id:"US-MD"},{id:"US-ME"},{id:"US-MI"},{id:"US-MN"},{id:"US-MO"},{id:"US-MS"},{id:"US-MT"},{id:"US-NC"},{id:"US-ND"},{id:"US-NE"},{id:"US-NH"},{id:"US-NJ"},{id:"US-NM"},{id:"US-NV"},{id:"US-NY"},{id:"US-OH"},{id:"US-OK"},{id:"US-OR"},{id:"US-PA"},{id:"US-RI"},{id:"US-SC"},{id:"US-SD"},{id:"US-TN"},{id:"US-TX"},{id:"US-UT"},{id:"US-VA"},{id:"US-VT"},{id:"US-WA"},{id:"US-WI"},{id:"US-WV"},{id:"US-WY"}
AmCharts.maps.usaHigh={
	"svg": {
		"g":{
			"path":[
				{
					"id":"US-AK",
					"title":"Alaska",
					"d":"M456.18,521.82l-0.1,4.96l-0.1,4.94l-0.1,4.92l-0.1,4.9l-0.1,4.88l-0.1,4.86l-0.1,4.84l-0.1,4.82l-0.1,4.8l-0.1,4.78l-0.1,4.77l-0.09,4.75l-0.1,4.73l-0.09,4.71l-0.09,4.7l-0.09,4.68l-0.09,4.66l-0.09,4.65l-0.09,4.64l-0.09,4.62l-0.09,4.61l-0.09,4.59l-0.09,4.58l-0.09,4.56l-0.09,4.55l-0.09,4.54l-0.09,4.53l-0.09,4.51l-0.09,4.5l-0.09,4.49l-0.09,4.48l-0.09,4.47l1.8,0.66l1.79,0.65l0.57,-1.23l1.93,0.97l1.69,0.85l1.09,-1.06l1.18,-1.14l1.58,-0.07l1.77,-0.09l1.18,-0.06l0,0.98l-0.44,1.63l-0.37,1.36l0.98,1.25l0.1,0.13l1.34,0.72l1.25,0.67l0.57,1.87l1.38,1.43l1.05,1.09l1.01,1.04l1.45,1.48l1.02,1.04l1.37,1.38l0.82,0.82l0.41,1.61l0.5,1.93l-0.27,1.15l0.65,0.17l1.23,-1.31l1.16,-0.82l1.43,-1.02l0.96,-0.69l1.82,-0.08l0.81,-1.96l-0.08,-2.71l0.92,0.02l0.53,-0.38l0.21,-0.8l-0.61,-1.07l1.71,-0.57l1.24,-0.41l1.74,-1.07l1.7,-1.05l0.86,0.73l0.85,0.7l1.69,1.69l0.13,0.42l-0.07,0.83l-0.12,0.83l1.09,2.27l0.3,0.25l0.83,0.28l1.01,0.72l0.46,0.64l1.46,0.99l0.26,0.43l0.17,0.7l0.26,0.6l0.29,0.42l0.29,0.61l0.65,0.7l1.21,0.75l0.84,0.52l1.18,0.73l1.25,1.55l1.09,1.35l1.23,1.32l-0.1,1.12l1.27,1.64l1.37,2.09l1.07,1.86l0.75,1.03l0.92,1.5l1.13,1.83l1.29,2.08l0.97,1.32l1.28,1.86l0.65,1.11l-0.32,0.82l-0.4,1.01l1.5,0.35l1.04,0.24l-0.17,1.11l-0.22,1.46l1.2,0.47l0.81,0.32l-0.1,0.77l0.5,0.81l0.19,1.4l1.4,-0.21l0.62,-0.09l0.9,0.55l1.18,0.72l1.18,0.67l1.01,0.57l1.29,0.27l1.6,0.42l0.87,1.07l1.46,0.35l0.68,1.54l1.69,0.42l0.92,-0.48l0.41,0.61l0.35,0.72l0.17,0.93l0,0.92l-0.33,0.81l-0.23,0.86l-0.12,0.91l0.02,0.96l0.15,1.01l0.25,0.87l0.67,1.59l0.27,0.99l0.09,0.67l-0.9,2.47l-0.28,1.16l0.09,0.5l-0.71,1.25l-1.37,1.78l-0.6,1.01l-0.37,-0.28l-2,-0.06l-0.91,-2.02l-0.53,-1.59l-0.7,-1.36l-0.01,-0.32l0.43,-0.99l1.88,-0.96l-0.01,-0.31l-0.75,-0.14l-0.21,-0.32l-0.34,-1.51l-0.07,-1.35l-0.13,-0.89l-0.49,-1.79l-0.59,-1.07l-1.44,-2.07l-0.15,-0.54l0.49,-0.74l0.28,-0.67l-2,1.3l-2.77,1.42l-1.17,0.92l-0.23,0.35l-0.07,0.28l0.29,0.75l-0.01,0.25l-0.21,0.48l-0.19,1.32l-0.52,1.42l-0.3,0.31l-1.17,-0.42l-0.34,-0.42l-0.7,-1.74l0.1,-0.49l0.38,-0.43l0.49,-0.91l0.6,-1.39l1.06,-3.5l0.87,-0.09l1.48,-0.8l-2.44,-0.14l-0.37,-0.15l-0.36,-0.44l-0.35,-0.73l-0.55,-0.79l-0.94,-0.22l-0.42,-0.28l-0.68,-0.97l-0.44,-0.42l-0.26,-0.55l-0.09,-0.67l-0.2,-0.32l-0.64,-0.07l-0.36,-0.21l-0.22,-1.72l-1.27,-0.35l-0.54,-0.35l-0.89,-1.02l-0.26,-0.51l-0.1,-0.43l0.11,-1.21l-0.1,-0.22l-0.71,0.17l-4.59,-1.56l0.08,-2.47l-1.02,-3.19l-0.96,-1.26l0.14,-0.52l0.17,-0.28l0.39,-0.03l1.76,0.85l1.67,1.03l0.2,-0.18l-2.71,-2.23l-0.68,-0.68l-0.21,-0.85l-0.04,-0.46l0.19,-0.26l2.4,0.06l0.13,-0.19l-2.46,-0.55l-0.49,0.03l-0.47,1.04l-0.24,0.25l-0.52,-0.02l-0.18,-0.14l-0.69,-1.19l-0.63,-0.82l-1.15,-1.12l-0.25,-0.83l-0.12,-1.24l0.08,-1.18l0.73,-2.73l0.33,-0.49l0.08,-0.3l-0.27,0.06l-0.24,0.27l-0.66,1.29l-0.64,2.08l-0.58,0.73l-0.39,-0.15l-0.63,-0.8l-1.27,-0.95l-1.42,-0.19l-0.94,-1l-1.45,-2.83l-0.24,-1.44l-0.18,-0.35l-0.73,-0.44l-0.46,-0.68l-0.82,-3.5l-0.98,-2.42l-0.27,-1.29l0.02,-1.29l-0.12,-0.14l-0.26,1.02l-0.06,0.53l-0.55,0.17l0.56,1l0.15,0.5l-0.26,-0.03l-0.53,0.15l0.97,1.7l0.52,2.67l0.69,1.96l0.46,1.59l0.23,1.21l0.31,1.16l0.82,2.54l0.12,0.51l-0.07,0.42l-0.21,0.51l-0.4,0.21l-1.29,-0.28l-0.51,-0.62l-0.73,-1.14l-0.98,-0.5l-2.37,0.36l-0.19,-0.08l-0.02,-0.96l0.21,-1.71l-0.24,-0.68l-1.31,-2.46l0,-0.49l1.65,-1.21l-0.83,-0.06l-0.65,0.47l-0.27,-0.28l-0.45,-1.6l-0.28,-0.59l-0.13,-0.12l-0.02,1.53l0.31,0.79l0.06,0.46l-0.02,0.65l-0.16,0.47l-0.3,0.29l-0.31,0.08l-0.58,-0.31l-0.65,-0.59l-0.56,-0.27l-0.21,-0.24l-0.28,-0.67l-0.44,-0.5l-2.08,-0.59l-1.25,-0.73l-0.1,0.2l0.4,0.81l0.05,0.48l-0.31,0.15l-0.54,0.79l0.16,0.1l0.58,-0.27l0.66,0.01l1.1,0.44l1,0.59l0.37,0.33l0.16,0.51l0.13,0.18l0.99,0.57l0.06,0.31l-0.6,0.95l1.28,-0.14l0.76,0.31l1,1.41l0.35,0.79l0.08,1.03l-0.19,0.31l-0.37,0.22l-2.62,0.42l-0.91,1.27l-0.2,0.02l-0.73,-0.32l-1.34,-0.96l-1.66,-0.9l-3.78,-2.72l-0.1,-0.13l-0.07,-0.54l-0.26,-0.27l-0.51,-0.23l-0.71,-0.7l-0.91,-1.17l-0.56,-0.92l-0.22,-0.66l-0.53,-0.76l-1.68,-1.57l-0.88,-0.6l-0.77,-0.34l-0.67,-0.07l-0.18,-0.21l0.31,-0.35l0.04,-0.21l-1.47,-0.32l-1.4,-0.74l-3.54,-2.1l-1.82,-1.32l-1.06,-0.63l-0.45,-0.36l-0.2,-0.29l0.26,-0.3l0.71,-0.31l0.48,-0.35l0.76,-1.33l0.06,-0.43l-0.4,-0.97l-0.18,-0.88l0.01,-0.49l0.09,-0.48l0.12,-0.32l0.32,-0.31l0.22,-0.15l0.28,0.11l0.88,1.22l0.12,0.44l-0.04,1.66l0.25,1.94l0.08,-0.14l0.08,-0.64l0.05,-1.23l0.1,-0.59l0.19,-0.57l0.32,-0.3l1,0.18l0.46,-0.1l-1.95,-0.88l-1.22,-1.65l-0.22,-0.17l-0.67,-0.08l-0.71,0.66l-1.84,2.16l-0.51,0.38l-2.31,1.18l-1.56,0.22l-1.75,-0.22l-1.49,-0.42l-3.7,-1.98l-0.57,-0.46l0.9,-1.15l0.04,-0.37l-0.27,-1.21l-0.24,-0.35l-0.35,-0.2l-0.1,0.13l-0.01,0.36l0.08,0.66l-0.29,0.34l-0.64,0.36l-1.08,0.35l-3.28,-1.07l-3.36,-0.92l-3.01,-0.28l-4.29,0.45l-2.31,0.53l-1.33,-0.01l-1.27,-0.18l-0.08,-0.45l0.6,-0.23l-0.02,-0.33l-0.68,-1.05l-1.08,-0.68l-1.48,-0.3l-0.84,-0.35l-0.19,-0.39l-0.51,-0.39l-0.82,-0.39l-0.33,-0.63l0.41,-1.87l0.36,-1.12l0.33,-0.76l0.8,-1.25l-0.26,0.08l-1.1,0.88l-0.97,0.92l-0.93,1.22l-0.54,0.55l-0.68,0.49l-1,-0.2l-1.31,-0.89l-1.14,-0.49l-0.97,-0.1l-0.38,-0.17l0.72,-0.66l0.42,-0.54l0.59,-0.88l0.15,-0.44l-3.54,-0.41l-0.09,-0.49l0.02,-0.36l-0.09,-0.3l-0.5,-0.26l-0.73,0.11l-1.21,0.48l-0.47,-0.47l0.2,-0.23l0.4,-0.15l0.84,-0.76l-1.01,-0.51l-0.49,-0.53l-0.23,-0.42l0.14,-1.46l0.35,-0.91l2.4,-0.72l-0.71,-0.41l-1.48,0l-1.05,0.69l-1.27,1.01l-0.82,0.35l-0.38,-0.32l-0.52,-0.14l-0.67,0.03l-0.47,0.24l-0.27,0.46l-0.29,0.3l-0.31,0.14l-0.21,-0.07l-0.27,-0.52l-0.64,-0.37l-0.29,-0.41l-0.21,0.22l-0.29,0.69l-0.27,0.34l-1.17,0.26l-0.61,-0.13l-0.65,-0.96l-0.08,-0.32l0.33,-0.75l1.92,-2.9l-0.16,0l-0.57,0.43l-1.17,1.12l-0.5,0.32l-0.81,-0.03l-0.36,-0.17l-0.46,0.05l-0.57,0.27l-0.38,0.32l-0.2,0.37l0.1,0.08l0.85,-0.36l0.47,-0.07l0.11,0.23l-0.77,1.32l-0.51,1.28l-0.4,0.29l-0.57,-0.11l-0.65,0.06l-0.05,0.37l1.08,1.17l0.41,0.19l0.51,0.43l0.05,0.38l-0.31,0.99l-0.2,0.38l-0.27,0.18l-0.97,-0.13l-0.32,0.07l-0.72,0.56l-0.38,0.49l0.11,0.06l0.61,-0.37l0.84,-0.15l1.08,0.08l0.82,-0.15l0.57,-0.38l0.5,0.17l0.44,0.72l0.09,0.6l-0.25,0.48l-0.45,0.32l-0.65,0.15l-0.43,0.28l-0.21,0.41l-0.16,0.63l-0.11,0.84l0.01,1.53l-0.14,0.19l-0.25,0.09l-0.35,-0.01l-0.35,0.32l-0.94,1.94l-0.28,0.19l-0.29,-0.25l-0.28,-0.01l-0.27,0.24l-0.55,0.15l-0.83,0.05l-0.69,-0.13l-1.18,-0.57l-0.47,-0.36l-0.33,-0.55l-1.16,0.41l-0.26,-0.26l-0.53,-1.47l-0.16,0.07l-0.3,1.49l-0.27,0.5l-0.8,1.01l-0.59,1.83l-0.12,0.04l-0.1,-0.28l-0.22,-1.72l-0.18,-0.39l-0.73,0.89l-0.11,0.34l0.02,1.26l-0.17,0.17l-1.17,-0.82l-0.3,-0.07l-0.09,0.1l0.31,1.02l-0.09,0.34l-1.99,1.65l-0.45,-0.12l-0.27,-0.22l-0.32,-0.01l-1.21,0.55l-0.31,-0.07l-0.37,-0.46l-0.2,-0.01l-0.16,0.41l-0.12,0.83l-0.52,0.74l-1.51,1.11l-0.43,0.54l-0.38,0.77l-0.21,0.05l-0.72,-0.62l-0.87,-0.46l-0.15,0.15l0.21,0.53l-0.1,0.29l-0.41,0.06l-0.5,-0.11l-0.58,-0.28l-0.88,0.11l-1.18,0.5l-0.91,-0.15l-1.12,-1.25l-0.34,-0.13l-0.07,-0.32l0.37,-0.83l0.45,-0.6l0.31,-0.26l1.32,-0.67l1.42,-0.12l0.93,-0.39l1.19,-0.9l0.66,-0.71l1.36,-1.88l-0.06,-0.17l-0.23,-0.14l-2.65,1.59l-0.38,0.13l-0.47,-0.08l-1.81,-1l-0.36,-0.37l-0.15,-0.96l0.82,-2.02l0.51,-0.96l1.14,-1.44l1.44,-1.51l0.56,-1.03l1.02,-2.82l0.14,-1.33l-0.06,-1.65l0.12,-0.96l0.3,-0.27l2.93,-1.13l1.44,-0.95l2.71,-1.34l0.68,0.1l0.43,0.63l0.53,0.53l0.62,0.42l0.86,0.07l1.1,-0.29l1.64,0.35l3.29,1.48l0.72,0.14l0.04,-0.14l-0.44,-0.82l-2.3,-0.71l-0.94,-0.56l-2.55,-2.28l-0.54,-0.83l0.3,-0.32l0.71,-0.21l0.27,-0.25l0.16,-0.48l0.47,-0.62l0.78,-0.78l1.13,-0.71l2.1,-1.01l-0.76,-0.14l-1.43,0.07l-0.54,0.17l-1.04,0.77l-0.44,0.57l-0.67,1.14l-0.25,0.2l-1,0.06l-2.69,-0.21l-0.37,-0.67l-0.24,-0.13l-0.34,0.04l-2.65,1.26l-0.98,0.69l-0.75,0.83l-1.06,0.54l-1.37,0.25l-1.06,0.39l-1.18,0.9l-0.46,0.75l-0.07,0.37l0.09,1.22l-0.29,0.19l-0.62,0.01l-1.08,0.65l-2.38,2.04l-0.39,0.81l-0.03,0.29l0.24,0.71l-0.3,0.39l-0.68,0.59l-1.45,0.88l-0.91,0.28l-0.55,-0.06l-0.51,-0.23l-0.84,-0.83l-0.75,-0.16l-0.06,0.09l0.92,0.9l0.91,1.11l0.54,0.89l0.17,0.66l-0.08,0.65l-0.34,0.63l-0.92,1.04l-0.79,0.23l-1.94,0.06l-0.65,0.18l-0.22,0.18l1.22,0.68l0.08,0.27l-0.33,0.93l-0.39,0.26l-1.17,0.41l-1,0.01l-0.13,-0.13l0.3,-0.73l-0.02,-0.19l-0.34,-0.21l-0.56,0.21l-1.47,0.9l-0.17,0.16l0.42,0.37l-0.14,0.23l-0.83,0.68l-0.38,0.48l-0.56,0.47l-2.36,1.31l0.09,0.43l-0.78,1.35l-0.51,1.21l0.28,0.59l1.66,0.91l0.83,0.29l0.94,0.6l1.65,1.47l0.49,0.86l0.04,0.38l-0.12,0.38l-0.3,0.5l-0.74,0.91l-1.63,1.27l-0.7,0.32l-1.01,0.18l-0.35,0.19l-1.46,1.21l-0.46,0.71l-0.06,0.67l-0.31,0.43l-1.74,0.65l0.03,0.17l0.56,0.17l-0.35,0.77l-0.28,1.1l-0.31,0.14l-0.99,-0.17l-1.34,0.22l-0.11,0.11l-0.16,0.8l-3.41,0.01l-0.99,1.39l-0.46,0.4l-1.5,0.87l-0.88,0.3l-0.96,0.1l-0.54,0.29l-0.13,0.47l-0.33,0.37l-0.92,0.54l-0.54,0.79l-0.31,0.08l-1.51,-0.07l-0.34,0.21l-0.36,1.13l-0.28,-0.02l-0.47,-0.37l-0.72,0.08l-1.78,1.02l-0.43,0.41l-0.01,0.26l0.19,0.3l0.21,0.85l-0.12,0.52l-0.87,1.34l-0.25,0.18l-0.79,0.22l-0.45,0.75l-0.65,-0.22l-0.57,0.05l-0.46,0.47l-0.44,0.24l-0.43,0l-0.6,0.32l-0.78,0.65l-0.68,0.38l-0.57,0.1l-0.53,-0.05l-0.48,-0.21l-0.47,0l-0.46,0.2l-0.48,0.37l-0.57,1.2l-0.51,0.48l-0.27,0.05l-0.5,-0.19l-0.72,-0.43l-0.81,-0.07l-1.43,0.5l-0.53,0.5l0.78,0.3l0.36,0.25l-0.04,0.16l-0.45,0.07l-0.71,-0.16l-0.46,0.04l-0.59,0.22l-1.39,0.08l-0.55,0.15l-1.3,1.24l-0.19,0.3l0.11,0.1l0.59,-0.03l0.6,0.38l0.27,0.38l0.14,0.43l0.05,0.77l0.1,0.13l-1.52,0.96l-0.47,0.44l-0.27,0.14l-0.12,-0.18l0.14,-1.4l-0.05,-0.25l-0.29,-0.09l-0.38,0.37l-0.98,1.48l-0.87,0.66l-5.65,0.93l-0.87,0.3l-0.35,0.85l-0.39,0.72l-0.48,0.53l-0.49,0.29l-0.02,-0.29l0.53,-2.15l-0.01,-0.45l-0.46,-0.4l-0.24,-0.01l-0.34,0.05l-0.63,0.35l-0.34,0.04l-0.39,-0.13l-0.78,0.3l-1.95,1.09l-1.14,0.12l-0.35,0.24l-0.64,0.7l-0.37,0.22l-0.45,-0.08l-0.53,-0.38l-0.51,0.06l-0.5,0.5l-0.42,0.14l-0.92,-0.68l-0.52,0.19l-0.77,0.61l-0.73,0.35l-0.7,0.08l-1.72,-0.16l-0.63,-0.33l-0.08,-0.25l0.27,-0.95l0.44,-0.63l0.33,-0.26l0.4,-0.21l0.49,0.09l0.85,0.44l-0.04,-0.26l-0.26,-0.36l-0.71,-0.68l-0.76,-0.45l-0.51,0.04l-0.75,0.2l-0.56,0.31l-0.36,0.42l-0.69,1.49l-0.28,0.38l-2.64,2.25l-0.98,0.65l-0.74,-0.26L274.9,725l-0.69,0.55l-0.56,0.2l-0.43,-0.14l-0.31,-0.22l-0.18,-0.29l0.1,-0.2l0.38,-0.12l0.03,-0.58l-0.32,-1.04l-0.25,-0.59l-0.71,-0.25l-0.22,0.38l-0.31,2.15l-0.16,0.46l-0.61,0.47l-1.36,0.35l-0.35,-0.16l-0.72,-1.59l-0.94,-0.53l-0.18,0.41l-0.01,0.93l-0.47,0.74l-0.94,0.56l-0.66,0.21l-0.38,-0.13l0.12,-0.53l0.62,-0.94l0.32,-0.84l0.02,-0.73l0.16,-0.52l0.3,-0.31l1.61,-0.66l0.6,0l0.23,0.33l0.36,0.14l0.5,-0.05l0.37,-0.25l0.25,-0.46l0.74,-0.47l1.23,-0.49l1.55,-1.1l1.87,-1.72l2.01,-1.38l2.16,-1.04l2.23,-0.7l4.28,-0.67l0.27,0.17l-0.49,0.44l0.16,0.39l0.37,0.14l1.49,0.09l0.65,-0.21l0.09,0.37l-0.3,0.37l-0.96,0.22l-0.06,0.36l0.84,1.96l0.33,0.35l0.33,0.05l0.19,-0.18l0.18,-1.22l0.48,-0.13l0.88,0.15l0.52,0.29l0.17,0.43l0.42,0.42l0.67,0.41l0.47,0.03l0.27,-0.35l-0.2,-0.54l-1.14,-1.35l-0.28,-0.52l0.05,-0.62l0.38,-0.71l0.7,-1.02l1.03,-1.34l0.85,-0.9l1.5,-0.9l0.96,-0.39l2.51,-1.32l4.43,-0.93l1.25,-0.96l1.63,-1.01l0.65,-0.19l-0.11,0.5l0.08,0.49l0.83,0.5l0.56,0.23l0.29,-0.03l0.18,-0.46l0.07,-0.9l0.15,-0.83l0.23,-0.76l0.26,-0.58l0.83,-0.96l1.15,-1.05l1.52,-1.18l0.9,-0.49l0.79,-0.19l0.83,-0.48l1.5,-1.24l0.43,-0.17l0.92,-0.12l0.29,0.19l0.11,0.41l0.18,0.28l0.83,0.39l0.65,-0.21l-0.06,-0.19l-0.45,-0.21l-0.26,-0.28l-0.1,-0.95l-0.46,-0.66l0,-0.63l0.3,-0.92l0.95,-2.12l0.55,-2.27l0.7,-1.22l0.97,-0.29l2,0.07l-1.01,-0.82l-0.42,-0.09l-0.68,-0.43l0.01,-1.49l0.22,-1.04l0.73,-1.1l2.2,-1.67l2.24,-1.02l-0.24,-0.17l-0.16,-0.47l1.46,-2.65l1.37,-2.36l-1.6,1.92l-1.7,1.38l-4.4,1.09l-3.07,1.03l-1.38,0.11l-0.77,-0.59l-0.34,-1.67l-0.26,-0.63l-0.27,-1.1l0.49,-1.25l0.58,-0.82l0.88,0.03l0.86,0.64l0.82,0.21l-0.88,-1.11l-1.37,-1.1l-0.75,0.1l-0.81,1.14l-0.9,0.71l-0.56,-0.44l-0.3,-0.43l0.03,1.11l-0.83,1.5l-0.42,1.07l0.04,3.07l-0.38,1.14l-1.37,0.26l-0.8,-1.18l-1.28,-4.17l-0.5,-1.22l-1.25,-2.11l-0.6,0.12l-0.89,0.7l-0.73,0.08l-1.47,-1.68l-0.59,-1.16l-0.5,-1.35l-1.34,0.36l-1.22,0.52l-1.51,0.93l-0.81,-0.21l-2.47,0.5l-0.24,-0.04l-0.45,0.49l-0.37,0.18l-0.52,1.02l-3.21,0.08l-2.84,-1.23l1.19,-0.33l1.28,-0.17l1.29,-0.87l-0.04,-1.62l0.12,-0.79l0.26,-0.97l1.43,-1.09l-1.13,-0.28l-0.85,0.3l-0.42,-1.2l0.2,-2.1l1.08,-1l0.59,-0.83l0.63,-1.19l0.3,-1.08l-0.12,-2l-0.7,-4.35l-0.01,-3.13l-0.91,-1.9l1.64,-2.3l1.69,-2.05l1.67,-0.69l-0.07,-0.18l-0.77,-0.19l-0.54,0.01l-0.65,0.64l-0.62,0.46l-2.26,2.58l-1.34,1.19l-0.73,0.25l0.86,0.82l0.03,0.51l-0.09,1.12l-0.6,1.23l-0.45,0.65l-1.18,-0.37l-1.35,0.76l-2.83,0.46l-3.58,-0.29l-1.65,-0.54l-1.37,-1.81l0.23,-0.76l0.26,-0.64l-1.84,-2.98l-0.75,-2.67l-0.99,-0.34l-0.7,-0.86l-0.75,-1.24l0.31,-0.73l0.32,-0.49l-0.52,-0.56l-0.82,-0.2l-0.86,-0.54l3.3,-2.2l1.41,-1.72l0.76,-0.08l0.79,0.56l1,1.13l0.93,0.63l0.27,0.47l0.19,0.8l-0.73,1.04l-0.6,0.7l0.52,-0.09l1.64,-0.89l1.26,-0.83l0.43,0.24l0.24,0.28l0.22,1.28l0.34,1.34l1.76,-0.7l1.16,-1.16l-0.49,-0.78l-0.7,-0.58l-1.92,-1.04l0.61,-0.25l1.3,0.41l0.6,-0.24l-0.38,-0.67l-0.52,-0.65l-2.2,1.06l-3.2,-0.99l-1.98,-1.55l-2.28,-0.49l-0.3,-0.28l-0.29,-0.61l1.59,-0.78l1.07,-0.38l0.15,-0.36l-0.5,-0.2l-1.06,0.02l-0.28,-0.66l0.34,-0.9l-0.18,0.04l-0.53,0.39l-0.47,-0.41l-0.34,-0.55l0.37,-0.37l0.66,-0.47l-0.19,-0.15l-0.46,0l-0.65,0.67l-0.1,0.67l-0.28,0.92l-0.76,-0.04l-0.58,-0.29l-0.16,-1.06l0.14,-2.12l-1.06,-0.9l0,-1.1l1.16,-1.06l-0.14,-0.77l-0.75,-0.46l-1.13,0.37l-0.24,-0.71l0.12,-0.66l0.25,-0.92l0.29,-0.02l0.16,0.25l2.02,0.06l0.25,-0.19l-1.25,-1.22l-0.17,-0.94l0.75,-0.27l1.11,0.3l1.69,-0.02l-0.39,-1.06l0.01,-0.51l0.1,-0.82l0.65,-1.24l2.71,-2.49l2.5,-2.01l0.72,-0.43l0.89,-0.08l0.67,0.46l0.62,0.77l0.22,-0.19l-0.2,-0.3l-0.03,-1.14l1.2,-0.1l0.97,-0.99l0.14,-0.33l-0.83,0.29l-0.95,0.6l0.05,-0.86l0.35,-1.91l0.82,-1.67l0.47,-0.72l0.81,-0.58l1.79,0.19l0.26,0.24l0.16,-0.34l-0.71,-1.4l0.67,-0.75l0.5,-0.35l2.25,-0.12l1.06,0.53l1.18,1.21l0.54,1.25l-0.26,0.49l-0.29,0.25l-0.52,0.22l-0.23,0.22l0.02,0.23l0.78,-0.44l1.2,-0.47l0.47,0.47l0.28,0.71l0.49,0.12l1.68,-0.08l0.93,-0.32l1.33,-1.13l1.51,-0.56l2.53,-2.37l0.83,-1.03l0.66,-0.02l0.52,0.25l0.14,1.06l0.49,0.42l3.25,0.58l1.74,-0.03l1.36,-0.65l1.56,-1.28l0.94,-0.89l0.66,-1.3l0.01,-1.88l-0.07,-1.58l0.27,-3.53l-1,-2.62l-0.94,-0.94l-0.72,-0.08l0.86,-1.3l1.44,0.52l1.03,-0.04l0.95,-0.5l0.38,-0.46l0.64,-0.98l0.15,-1.17l-0.06,-0.67l-0.37,-0.81l-0.39,-1.16l-0.36,-0.44l-0.38,-0.07l-2.34,1.54l-1.12,-0.24l-0.73,-0.58l-1.01,0.96l-2.26,0.48l-1.33,0.73l-2.65,1.97l-0.8,0.99l-0.65,-0.12l0.12,-2.31l-1.6,-2.67l-0.84,0.53l0.18,0.75l0.36,0.6l0.75,0.42l-0.52,0.54l-0.49,0.77l-0.6,-1.01l-1.14,-1.54l-1.34,-1l-3.91,-1.02l-2.89,0.44l-0.16,-0.31l-0.22,-0.17l-0.51,0.16l-0.32,0.42l-0.37,0.22l-0.55,-0.05l-1,-0.48l-1.81,-1.33l-4.25,-2.44l-0.99,-1.02l-0.54,-1.87l0.35,-1.05l0.59,-0.31l0.43,-1.53l-0.75,-0.68l-1.1,-2.74l-0.36,-1.14l0.17,-0.06l0.24,0.35l0.55,0.38l1.58,0.16l0.95,-1.26l1.23,-0.06l0.96,0.51l-0.11,-0.46l-0.17,-0.38l-2.42,-1.54l-0.43,0.11l-4.31,-2.78l-2.98,-3.43l-0.16,-0.53l-0.02,-1.06l0.81,-0.78l0.65,-0.28l-0.15,0.53l-0.09,0.53l2.5,-0.5l1.6,-1.2l2.17,0.39l0.62,-0.28l0.91,-0.63l1.37,-1.14l1.54,-0.35l1.1,-0.4l1.28,-0.04l0.78,0.97l0.28,0.18l1.75,0.68l0.68,-0.11l0.32,-0.14l0.29,-0.29l-1.39,-1.74l0.38,-0.62l0.37,-0.41l2.47,-0.8l1.71,0l0.83,0.28l2.97,-1.12l1.48,-0.14l2.61,0.36l2.09,0.49l0.38,0.81l-1.07,-0.45l-0.52,-0.02l0.29,0.32l0.26,0.59l-0.28,0.57l-1.18,1.6l-0.34,1.45l-0.58,0.34l-0.62,0.53l1.57,2.65l3.29,1.04l1.91,0.11l0.88,0.9l0.82,0.37l2.46,0.3l1.67,0.9l0.79,0.02l2.43,-2.68l0.77,-0.33l0.57,0.71l0.81,0.67l0.66,-0.17l0.28,0.92l0.19,-1.72l-0.17,-0.71l-2.4,-1.82l-1.94,0.12l-0.4,-0.79l0.51,-1.23l-1.09,-3.65l-0.63,-0.85l-0.93,-0.27l-0.19,-1.22l-0.02,-1.52l0.95,-0.37l0.79,-0.07l0.55,0.63l0.28,2.05l0.64,0.46l-0.68,1.79l0.45,1.93l1.61,2.09l1.76,-0.18l1.13,0.3l0.6,0.5l1.32,1.83l0.81,0.38l2.83,-0.11l0.36,-1.39l0.02,-1.07l-0.47,-0.78l-1.81,-0.31l-1.13,-1.38l-1.25,0l-2.58,1.06l-0.94,-0.9l-0.47,-1.03l-0.88,-1.15l0.28,-1.68l1.4,-1.65l0.91,-0.73l-0.44,-0.81l-1.41,-0.85l-2.77,-0.21l0.04,-0.67l0.19,-0.69l-1.43,1.07l-1.03,-0.58l-1.53,-0.25l-2.95,-2.08l-0.76,-1.79l-0.15,-1.33l0.04,-3.52l-0.53,-2.36l-5.56,-9.18l-2.89,-2.78l-1.04,-2.45l-0.87,-0.79l-0.91,-0.5l-1.05,-1.02l1.08,-0.51l0.66,-0.08l-0.85,0.62l0.39,0.35l0.87,-0.24l0.56,-0.44l1.3,-2.19l1.69,-3.41l0.28,-1.47l3.98,1.52l2.78,0.56l0.99,-0.06l3.58,0.43l1,-0.15l1.99,-0.76l2.53,-1.64l2.43,-2.41l0.47,-0.7l0.05,0.23l0.18,-0.08l0.47,-1.04l0.91,-2.51l1.46,-2.21l4.89,-4.65l2.15,-1.8l0.78,-0.87l0.73,-0.6l0.21,0.8l0.13,0.25l0.02,0.36l-0.36,0.07l-0.71,0.58l-0.86,0.29l-0.24,0.2l0.45,0.06l1.43,-0.19l0.89,-0.45l3.91,-0.27l2.43,-1.46l0.18,-0.41l3.48,-1.74l0.38,0.19l0.39,0.4l-1.18,1.42l0.47,0.55l-0.95,1.8l1.05,0.28l0.03,0.94l0.23,-0.75l0.24,-1.09l0.33,-1.05l0.33,-0.7l0.66,0.5l1.85,-0.42l-2,-0.56l-0.8,-2.02l-0.67,-0.17l2.83,-2.04l2.39,-1.09l0.45,0.13l0.16,0.34l-0.06,0.48l-0.51,0.21l-0.56,0.45l0.09,0.53l0.28,0.14l1.07,-0.18l0.55,-0.4l2.08,0.5l0.69,-0.22l0.23,-0.32l2.72,0.5l0.55,-0.15l1.98,-1.03l1.9,-1.36l0.9,-0.77l1.69,-2.1l1.35,-1.32l2.02,-1.19l0.38,0.27l-0.62,0.2l-0.51,0.57l0.37,0.96l3.31,2.46l0.9,0.27l0.17,1.13l-0.49,0.96l-1.15,0.96l-2.13,0.8l0.5,0.55l0.19,1.1l0.54,0.23l0.99,-0.22l0.84,-0.5l1.86,-1.8l0.67,-1.07l0.4,-0.23l1.19,0.5l0.6,0.72l0.62,1.19l-0.47,0.96l-0.43,0.52l0.91,0.97l1.13,0.36l1,0.82l1.77,-1.05l1.26,-0.08l1.14,0.23l1.6,-0.48l2.37,1.36l0.68,-0.16l0.99,0.32l0.99,0.74l0.29,0.68l-1.35,1.15l-0.39,1.34l0.32,0.63l0.72,0.21l-0.02,0.81l0.43,0.26l2.31,0.27l-0.23,0.35l-0.18,0.44l-0.86,0.91l4.04,1.14l0.63,-0.49l0.88,-0.11l1.91,-0.54l0.64,0.42l0.7,0.89l0.72,0.26l0.71,-0.08l1.75,-0.94l1.87,0.16l0.72,0.46l0.83,-0.07l2.3,1.56l0.88,0.25l1.03,1.81l0.62,0.11l0.78,-0.64l0.61,0.08l0.53,0.74l0.96,0.31l0.35,1.12l0.46,0.44l3.65,1.14l1.88,-0.21l2.68,0.31l1.26,0.61l1.37,0.04l2.1,2.03l1.17,0.37l0.2,0.45l3.35,0.67l1.24,-0.9l2.08,-0.14l1.9,-0.72l1.05,0.06l1.21,0.26l0.47,-0.08l0.35,-0.34l2.92,1.54l1.61,1.68l0.69,1.21l3.47,1.81l1,0.98l0.67,1.06l0.41,0.12l0.3,-0.3l1.24,0.12L456.18,521.82zM293.12,552.84l-0.27,0.01l0.09,-0.23l0.91,-0.41l1.55,-0.38l-0.1,0.16l-0.89,0.39L293.12,552.84zM245.5,580.41l-0.03,0.4l0.71,0.2l0.91,0.51l0.94,0.74l1.1,0.26l1.73,-0.63l0.9,0l0.86,0.13l0.77,0.58l0.64,0.89l0.2,0.46l0.05,0.7l-0.09,0.8l0.07,0.62l1.36,1.21l0.93,0.62l0.12,0.44l0.05,0.57l0.72,0.67l0.93,0.17l0.45,0.3l1.5,0.53l1.69,1.18l-0.79,1.34l-0.82,0.43l-1.65,-0.79l-1.78,-0.38l-0.97,0.49l-0.92,0.73l-0.4,0.88l-0.49,0.3l-0.42,0.06l-0.12,-0.6l0.15,-1.67l-0.13,-0.52l-0.21,-0.37l-0.67,-0.78l-0.74,-0.61l-0.48,-0.21l-0.17,-0.66l0.08,-0.84l-0.2,-0.52l-0.47,-0.8l-0.52,-0.69l-1.78,-1.73l-0.65,-0.38l-0.75,-0.16l-0.92,0.16l-0.98,0.38l-0.93,0.21l-0.82,-0.18l-0.64,-0.56l-0.46,-0.9l-0.18,-0.58l0.1,-0.84l0.3,-0.77l0.38,-0.71l1.05,-1.67l0.79,-0.11L245.5,580.41zM401.55,660.75l-0.96,0.03l-0.41,-0.24l-0.04,-0.22l0.26,-0.75l0.02,-0.33l0.49,-0.08l0.51,0.42l0.12,0.39L401.55,660.75zM219.3,623.28l1.16,1.52l1.01,0.28l0.48,1.08l0.08,0.76l-1,-0.9l-1.7,-0.62l-1.53,-2.79l-0.64,-0.75l0.6,-1l1.08,-0.21l-0.11,1.62L219.3,623.28zM370.14,664.16l-0.37,0l0.59,-0.68l0.54,-1.41l0.42,0.27l0.05,0.28l-0.96,1.39L370.14,664.16zM403.05,666.67l-0.04,0.4l-0.27,0.36l0.16,0.73l-0.51,1.17l-0.22,0.76l-0.26,0.46l-0.23,0.17l-0.2,-0.13l-0.02,-0.27l0.16,-0.41l-0.5,-0.03l-0.05,-1.07l0.31,-0.31l0.14,-0.44l0.06,-0.3l0.45,-1.32l0.13,-0.08l0.01,0.32l0.1,0.1l0.19,-0.11l0.31,-0.58l0.11,-0.06L403.05,666.67zM412.56,667.51l0.13,0.43l1.45,0.01l0.41,0.11l0.15,0.21l-0.22,0.27l-0.59,0.33l-1.69,0.53l-1.4,0.75l-0.17,-0.09l-0.17,-0.96l-0.21,-0.4l-0.11,-0.54l0.02,-0.2l0.27,-0.35l0.53,-0.5l0.36,-0.17L412.56,667.51zM422.05,669.92l-0.27,0.36l-0.65,-0.17l-0.34,-0.26l1.24,-0.9l0.18,0.21L422.05,669.92zM266.1,640.66l0.44,0.93l0.34,0.15l1.18,0.12l0.36,0.28l0.3,0.43l0.1,0.55l-0.21,0.85l-0.41,0.69l-0.26,1.07l-0.18,0.44l0.42,0.78l-0.06,0.87l-0.16,0.9l-1.39,-0.1l-1.31,-0.35l-1.3,0.25l-0.36,0.36l-0.02,0.7l-0.36,0.07l-0.24,-0.23l-0.36,-0.76l-0.51,-0.47l-1.94,-1.08l-2.06,-2.55l-1,-0.71l-0.73,-1.63l-0.51,-1.94l0.75,-0.05l0.71,0.08l2.93,1.19l0.74,-1.04l0.48,-0.17l1.06,-0.03l1.09,-0.37l0.39,0.14l0.33,0.37l0.96,-0.13l0.47,0.05L266.1,640.66zM401.55,676.29l-0.86,0.14l-0.16,-0.47l0.55,-1.07l0.41,-0.6l0.28,-0.13l1.08,-1.17l1.15,-0.82l1.1,-1.25l1.16,-1.83l0.25,-0.7l0.47,-0.03l0.71,0.54l0.41,0.7l-0.26,0.51l-2.75,2.5l-0.24,0.34l-0.31,0.9l-0.24,0.3l-0.35,0.12l-0.28,0.38l-0.21,0.65l-0.34,0.32l-0.47,-0.02l-0.34,0.15l-0.21,0.32L401.55,676.29zM399.74,672.26l-0.44,0.43l-1.47,-0.43l0.4,-0.88l1.2,-0.46l1.16,1.02L399.74,672.26zM425.76,678.07l-0.37,0.07l0.61,-0.96l0.8,-1.06l0.73,-0.65l0.92,-0.24l-0.13,0.5l-1.23,0.86L425.76,678.07zM297.65,677.72l-0.62,0.1l-0.57,-0.26l-0.11,-1.56l0.37,0.04l0.98,-0.77l1.84,-0.37l0.43,0.01L297.65,677.72zM362.51,691.8l-0.24,0.06l-0.5,-0.54l-0.3,-0.54l0.3,-0.33l1.22,-0.61l0.53,0.06l0.2,0.16l0.05,0.25l-0.09,0.35l-0.3,0.41L362.51,691.8zM362.77,693.73l0.27,0.16l0.42,-0.84l0.21,0l0.82,0.88l0.59,-0.08l0.23,0.97l0.32,0.13l0.32,-0.07l0.17,0.09l-0.2,0.96l-0.82,0.89l-0.35,0.2l-0.41,-0.32l-0.15,-0.12l-0.23,-0.48l-0.14,-0.58l-0.13,-0.03l-0.61,0.57l-0.03,0.32l0.15,0.51l-0.08,0.29l-0.58,0.06l-0.54,-0.16l-0.74,0.32l-0.12,-0.29l0.01,-0.75l-0.22,0.05l-0.45,0.85l-0.43,0.52l-0.71,0.38l-0.17,0.21l-0.47,-0.04l-0.73,0.19l-0.42,-0.11l-2.39,-1.37l-0.54,-0.45l2.43,-1.92l1.23,-0.7l0.62,0.14l0.59,0.37l0.34,0.01l0.18,-0.99l-0.48,-0.83l0.07,-0.31l1.38,-0.31l0.47,0.14l0.5,0.34l0.45,0.5L362.77,693.73zM502.66,703.44l2.03,0.24l1.47,-0.16l1.47,2.16l0.94,1.76l0.56,1.24l0.35,1.2l0.44,1.16l-0.02,0.17l-0.83,-0.75l-0.66,-1.58l-0.32,-0.61l-0.3,-0.27l-0.33,-0.58l-0.66,-1.51l-0.05,-0.43l-0.28,-0.39l-0.31,-0.15l-0.33,0.09l-0.11,0.16l0.11,1.06l0.33,1.17l1.61,2.5l1.06,1.41l0.22,0.47l0.21,1.33l-0.39,0.63l0.59,1.2l0,0.24l-0.1,0.24l-1.38,0.63l-1.17,2.35l-1.35,1.41l-0.64,0.25l-0.33,-0.21l-0.32,-0.5l-0.21,-0.68l-0.1,-0.85l0.33,-0.56l0.56,-2.84l-0.03,-0.92l-0.93,-1.24l-0.57,-1.02l-0.35,-1.45l-0.66,-3.85l-0.28,-1.23l-0.36,-1.02l-0.43,-0.81l-0.34,-0.9l-0.25,-0.98l0.06,-0.39l0.71,0.49l0.89,1.39L502.66,703.44zM505.52,702.28l-0.04,0.38l-1.08,0.02l-1.12,-0.49l-0.57,-0.69l0.09,-0.33l1,-0.35l0.99,0.63L505.52,702.28zM494.29,702.56l1.19,1.42l0.02,0.34l-0.19,1.01l-0.61,0.31l0.19,0.39l0.47,0.28l0.32,-0.26l1.14,-1.46l0.36,-0.31l0.22,-0.04l1.48,0.36l1.31,0.61l0.4,0.52l0.26,0.93l-0.25,2.04l-1.04,0.4l-0.5,-0.01l-0.54,-0.27l-0.83,0.74l0.73,0.51l2.17,0.03l0.71,1.11l0.23,0.87l-0.39,1.63l-1.25,-0.39l-1.13,-0.89l-2.28,-1.23l-0.53,-0.04l-0.35,0.25l-0.07,0.81l0.09,1.74l-0.56,0.92l-1.78,-0.33l-0.74,-1.29l-0.71,-2.07l-2.49,-2.39l-0.67,-0.48l-0.91,-1.46l0.31,-1.19l0.08,-0.68l0.45,-0.19l0.66,-0.54l0.34,-1.15l0.63,0.9l0.84,0.86l-0.02,-0.83l0.36,-0.68l0.79,0l0.37,-0.15l0.5,-0.64l0.74,-0.35L494.29,702.56zM357.81,701.13l-0.07,0.82l0.34,-0.05l1.34,-0.65l0.67,-0.15l0.83,0.08l0.6,0.48l0.09,0.31l-0.11,0.34l-0.63,0.63l-0.05,0.46l0.44,0.93l1.32,0.66l0.13,0.28l-0.05,0.3l-1.16,1.26l-0.4,0.28l-0.26,0.04l-1.7,-0.51l-1.52,-0.7l-0.63,-0.18l-0.25,0.11l-0.52,0.36l0.3,0.18l1.38,0.32l0.4,0.7l0.15,0.49l0.03,0.52l-0.31,0.17l-0.62,0.06l-0.72,-0.11l-0.98,0.44l-0.59,0.58l-1.81,-0.11l-1.49,0.66l-0.55,0.35l-0.25,0.49l-0.57,0.29l-1.22,0.19l0.64,0.45l0.06,0.3l-0.05,0.39l-0.15,0.32l-1.16,1.36l-1.94,0.95l-0.43,-0.13l-0.16,-0.18l-0.12,-0.26l0.03,-0.24l2.64,-2.11l-0.07,-0.14l-0.59,-0.18l-0.85,-0.84l-0.75,0.33l-0.15,-0.04l0.28,-0.55l0.56,-0.62l-0.04,-0.21l-0.21,-0.21l-0.54,-0.2l-0.87,-0.18l-0.67,0.06l-0.48,0.29l-0.06,0.15l0.9,0.11l0.21,0.23l0.18,0.39l0.08,0.42l-0.02,0.46l-0.29,0.58l-0.55,0.69l-0.6,-0.24l-0.99,-1.91l-0.14,-2.58l-0.76,-2.09l0.03,-0.46l0.51,-1.12l1.38,-1.48l1.25,-0.26l0.95,-0.56l0.84,-0.08l0.5,0.1l0.63,0.42l0.17,0.69l-0.21,0.27l0.04,0.17l0.42,0.46l0.3,1.43l0.41,1.29l0.33,0.55l0.48,0.38l-0.4,-1l-0.14,-1.18l0.2,-2.27l-0.06,-0.62l0.33,-0.11l0.85,0.23l0.03,-0.34l-0.79,-0.91l-0.46,-0.72l-0.13,-0.53l0.08,-0.43l0.6,-0.55l0.31,-0.13l0.3,-0.03l0.56,0.23l0.23,0.24l0.51,1.55l0.28,0.5l0.29,0.05l0.31,-0.19l0.32,-0.44l0.3,-0.25l0.28,-0.05l0.79,0.34l0.29,-0.03l0.19,-0.34l0.09,-0.64l0.24,-0.2l0.12,-0.46l-0.34,-0.77l0.55,-0.13l1.63,0.79l0.64,0.69L357.81,701.13zM355.16,700.32l-0.28,0.38l-0.19,-0.14l-0.36,-0.55l-0.79,-0.84l-0.33,-0.55l0.01,-0.21l0.34,-0.18l0.97,0.73l0.37,0.59L355.16,700.32zM500.93,715.66l0.76,1.6l0.56,1.24l0.52,1.5l0.9,3.11l0.41,1.17l0.14,0.65l0.17,1.7l-0.09,0.37l-0.21,0.35l-0.02,0.49l0.27,1.29l0.11,1.97l-0.14,1.12l-0.22,0.18l-0.58,-0.34l-0.49,-0.58l-0.37,-0.61l-0.93,-1.94l-0.29,-0.91l-0.05,-0.66l0.11,-0.49l0.26,-0.31l0.44,-0.82l-0.07,-0.13l-0.35,0.2l-0.73,0.14l-0.68,-0.61l-0.52,-0.31l0.05,-1.15l-0.15,-0.32l-0.98,0.4l-0.39,-0.3l-0.1,-0.43l-0.01,-0.64l0.17,-0.57l0.88,-1.46l-0.11,-0.26l-0.46,-0.04l-0.62,-0.46l-0.34,-1.58l-0.68,-0.88l-0.38,0.1l-0.76,2.6l-0.41,0.58l-1.21,0.41l0.22,-0.72l0.09,-0.64l-0.5,-1.92l-0.04,-0.75l0.27,-0.56l0.85,-0.26l0.44,-0.34l0.33,-0.55l0.07,-0.52l0.61,-1.4l0.3,-0.28l0.82,-0.02l1.8,1.44l0.54,0.2L500.93,715.66zM221.06,676.61l-1.02,0.38l-0.63,-0.5l-0.04,-0.56l0.07,-0.21l2.25,0.19L221.06,676.61zM355.36,711.31l-1.09,0.32l-0.18,-0.05l-0.78,0.86l-0.55,0.34l-0.52,-0.86l0.35,-1.15l0.68,-0.7l2.76,0.69l0.18,0.25l-0.02,0.19l-0.23,0.12L355.36,711.31zM514.17,720.12l0.57,0.43l0.26,-0.51l0.55,-0.01l1.04,0.37l0.65,0.61l0.39,0.72l0.06,0.44l-0.03,1.01l0.15,1.03l-0.01,0.54l-0.11,0.45l-0.21,0.37l-0.25,0.06l-0.86,-0.87l-1.02,-1.61l-0.72,-0.46l-0.02,0.17l0.22,0.47l0.62,0.86l0.14,0.53l0.44,0.63l0.21,0.49l0.15,0.65l0.03,0.57l-0.08,0.5l-0.16,0.33l-0.25,0.16l-1.4,-0.05l-0.81,0.38l-0.98,-0.12l-0.25,-0.28l-0.18,-0.48l-0.15,-1.17l-0.35,-1.67l-0.02,-1.3l-0.69,-1.14l-0.58,-0.68l-0.8,-0.59l-0.54,-0.6l0.11,-0.51l0.76,-0.42l1.29,0.01L514.17,720.12zM509.25,722.78l0.59,1l0.76,-0.13l0.48,0.75l0.39,1.14l-0.19,0.76l-0.35,-0.15l-0.35,0.45l-0.15,1.45l0.19,1.43l-0.03,1.43l-0.36,1.48l-0.04,0.98l-0.16,0.3l-0.19,0.11l-0.26,-0.25l-0.37,-0.19l-0.41,0.85l-0.55,0.04l-0.56,-1.84l0.24,-3.13l0.88,-0.68l-0.59,-0.82l-1.2,-0.92l0.07,-0.56l-0.95,-1.54l-0.07,-0.38l0.07,-1.33l0.74,-1.22l1.05,-0.27l0.77,0.46l0.44,0.41L509.25,722.78zM519.69,726.87l-0.07,0.22l-1.04,0.05l-0.39,-0.15l-0.18,-0.62l0.06,-0.59l0.21,-0.47l0.23,-0.89l0.13,-1.47l1.64,1.52l0.52,0.69l0.32,0.87l-0.52,0.37l-0.64,0.21L519.69,726.87zM221.45,685.41l0.92,0.63l0.63,0.02l0.45,0.32l-0.03,0.36l-1.12,0.42l-0.34,-0.17l-0.73,-1.23L221.45,685.41zM344.25,718.72l-0.4,-0.03l-0.54,-0.49l0.16,-0.45l0.95,-0.42l0.84,0.23l0.01,0.32l-0.1,0.34l-0.1,0.19l-0.31,0.17L344.25,718.72zM340.22,719.23l-0.61,0.25l-0.16,-0.15l0.02,-0.29l0.21,-0.43l0.33,-0.41l1,-0.72l0.96,-0.43l0.43,0.11l0.09,0.39l-0.66,0.67L340.22,719.23zM525.36,732.63l0.02,2.46l-0.34,-0.11l-0.31,0.02l-0.61,0.4l-0.68,-0.1l-0.33,-0.25l-0.14,-0.31l0.07,-0.74l-0.4,-0.38l-1.26,-0.06l-0.48,-0.14l-0.31,-0.75l-0.13,-1l0.17,-0.39l0.61,-0.31l0.4,-1.26l0.26,-0.18l0.85,-2.5l0.53,0.13l1.02,1.4l1.3,2.04L525.36,732.63zM519.71,731l-0.42,0.08l-0.51,-0.19l-1.26,-1.12l-0.05,-0.35l0.14,-0.41l0.62,-0.78l0.26,-0.2l1.61,-0.03l0.53,0.16l0.14,0.33l0,0.35l-0.14,0.37l-0.01,0.37l0.12,0.38l-0.16,0.4L519.71,731zM513.16,730.07l1.58,0.22l1.43,-0.12l0.53,0.58l0.37,0.62l0.23,0.59l0.09,0.56l-0.01,0.4l-0.15,0.44l0.05,0.14l2.9,1.21l1.43,1.38l0.59,0.74l0.35,0.63l0.68,1.59l1.32,1.81l0.66,0.53l0.39,0.54l-0.2,0.04l-0.86,-0.35l-1.89,-1.14l-0.14,0.06l-0.11,0.7l-0.23,0.62l-0.38,0.46l0.34,0.1l1.43,-0.38l1.31,1.15l0.49,0.19l0.53,0.85l0.04,0.34l-0.22,0.68l-0.18,0.28l0.08,0.18l0.35,0.07l1.33,-0.29l0.27,0.3l0,2.58l0.27,0.93l0.03,0.43l-0.11,0.58l0.03,0.48l0.16,0.48l0.05,0.44l-0.25,1.17l-0.35,0.22l-0.59,0.05l-0.49,-0.29l-0.73,-0.94l-0.75,-1.49l-0.26,-0.2l-0.85,-0.17l-0.16,-0.17l-0.53,0.01l-0.42,-0.6l-0.02,-0.83l-0.38,-0.82l0.01,-0.38l-0.37,-0.13l-0.29,0.26l0.22,0.82l-0.13,0.66l-0.68,-0.22l-1.24,-1.98l-1.35,-1.57l-0.51,-0.36l0.1,-0.49l0.59,-0.3l0.5,-0.01l0.08,-0.29l-1.14,-1.53l0,-0.46l0.32,-0.83l-0.49,-0.31l-1.27,0.34l-0.46,-0.14l-0.41,-0.62l-0.25,-0.55l-1.12,-0.03l-0.42,0.1l-0.78,-0.8l-0.36,-0.52l0.11,-0.28l0.64,-0.52l0.39,0.04l0.78,0.47l0.29,-0.04l0.7,-0.73l0.07,-0.62l0.52,-0.54l-0.12,-0.53l-0.37,-0.89l-0.69,-0.21l-1.35,0.63l-1.15,0.91l-0.5,-0.3l-0.14,-0.51l1.21,-1.47l0.52,-0.8l-0.14,-0.45l-0.45,-0.56l-0.13,-1.47L513.16,730.07zM535.53,740.97l-0.15,1.64l-0.43,1.7l-0.8,0.96l-0.64,-0.14l-0.52,-0.67l-0.42,0.08l-0.46,-0.11l-0.3,-0.57l0.17,-0.79l-0.26,-0.58l-0.18,0.54l-0.36,0.51l-0.95,0.7l-0.59,1.24l-0.26,0.8l-0.47,-0.81l-0.42,-1.97l-0.1,-0.84l0.62,-1.33l0.83,-1.29l-0.11,-3.64l2.79,-2.07l0.28,0.07l1.08,1.27l1.19,1.81l0.34,0.83l0.14,1.49L535.53,740.97zM331.44,726.91l-0.4,0.4l-0.61,-0.15l-0.32,-0.21l-0.04,-0.42l1.18,-1.04l0.25,-0.12l0.16,0.08l-0.02,0.51L331.44,726.91zM516.06,741.67l0.21,0.4l0.03,0.26l-1.15,1.05l-0.01,0.2l-0.25,0.62l-0.24,0.24l-0.41,0.68l-0.82,0.76l0,-2.13l-0.93,-1.18l0.82,-0.67l0.57,0.14l0.94,0.01l0.88,-0.6L516.06,741.67zM288.05,725.36l0.12,0.04l0.28,-0.05l0.72,-0.68l0.18,0l-0.06,0.25l-0.44,0.74l0.17,1.17l0.27,0.61l-0.08,0.17l-1.08,0.13l-0.7,-0.45l-0.42,0l-0.45,0.28l-0.15,-0.47l0.31,-2.01l0.14,-0.33l0.58,-0.58l0.61,-0.18l0.21,0.15l0.13,0.32l-0.02,0.3L288.05,725.36zM291.03,725.72l-0.38,1.1l-0.95,-0.99l-0.21,-0.43l0.26,-0.22l1.08,0.19L291.03,725.72zM520.42,750.96l0.22,0.18l0.2,-0.15l0.31,-0.55l0.61,0.06l0.45,0.14l0.28,0.2l-0.09,0.77l-0.02,1.24l-0.22,0.46l-0.2,0.63l-0.89,-0.3l-0.75,-0.74l-1.1,-1.28l-0.63,-0.94l-0.07,-0.41l-0.38,-0.28l-0.8,-1.64l-0.48,-1.3l-0.63,-0.11l-0.81,-0.32l-0.35,-0.71l0.17,-0.65l1.09,-0.39l1.78,1.54l0.3,0.68l0.66,0.78l0.19,1.13l0.34,0.43L520.42,750.96zM294.07,729.59l-0.57,0.2l-0.25,0.36l-0.42,0.08l-0.4,0.25L291,731.7l-0.54,0.16l0.82,-1.13l0.18,-0.38l0.07,-0.26l0.06,-0.99l0.3,0.12l0.31,-0.14l0.72,-0.72l0.49,0.03l0.73,-0.88l0.29,-0.02l0.1,0.17l-0.36,0.55l0.35,0.67l-0.25,0.51L294.07,729.59zM533.04,747.24l1.03,1.83l0.1,0.67l-0.8,0.31l-0.65,-0.04l-0.35,-0.19l-0.11,-0.3l0.13,-0.98L531.9,748l-0.51,-0.15l-0.41,0.37l-0.1,-0.95l0.27,-0.71l-0.26,-0.92l-0.06,-0.7l0.09,-0.23l0.44,-0.02l0.97,0.65L533.04,747.24zM297.08,729.94l-0.3,1.13l-0.16,0.15l-0.15,-0.36l-0.54,0.23l-0.2,-0.31l0.2,-0.37l0.04,-0.32l0.35,0.05l0.21,-0.55l0,-0.25l0.29,-0.47l0.27,-0.06L297.08,729.94zM297.76,732.8l-0.28,0.01l-0.19,-0.21l-0.12,-0.88l0.05,-0.35l0.53,0.39l0.09,0.64L297.76,732.8zM264.05,724.25l0.15,2.56l0.22,0.55l0.44,0.39l0.65,0.45l0.33,0.46l0.23,0.63l-0.02,0.25l-2,-1.55l-1.79,0.99l-0.48,0.06l-4.04,-1.05l-0.87,0.03l-0.65,0.3l-1.27,0.99l-0.6,0.35l-0.58,0.15l-1.14,0.02l-1.24,-0.41l-0.61,-0.35l-0.18,-0.7l0.03,-1.26l0.1,-0.33l0.29,-0.52l1.34,-0.45l0.49,-0.3l2.2,-2.25l0.52,-0.25l0.47,0.04l1.17,0.53l1.27,-0.48l2.59,-0.56l0.53,0l1.63,0.42l0.39,0.31l0.25,0.43L264.05,724.25zM273.17,728.72l-0.21,0.02l-0.45,-0.58l-0.12,-0.38l-0.02,-0.54l1.34,-0.43l0.24,0.05l0.11,0.46l-0.05,0.33l-0.56,0.84L273.17,728.72zM269.41,734.49l-0.8,0.12l-0.67,-0.52l-0.49,-0.77l0.12,-0.73l1.32,0.84l0.25,0.3L269.41,734.49zM243.56,731.26l-0.39,0l-0.04,-0.17l0.14,-0.63l0.02,-1.06l0.63,-0.2l0.35,0.01l0.09,0.19l0.16,0.84l0.32,0.31l0.23,0.24l-0.56,0.08L243.56,731.26zM240.98,731.49l-0.39,0.15l-0.27,-0.02l-0.15,-0.2l-0.9,-0.09l-0.14,-0.15l-0.13,-0.95l0.11,-0.44l0.25,-0.29l0.48,-0.19l0.7,-0.09l0.59,0.24l0.82,1.09l0.36,0.6l0.01,0.31l-0.45,0.15L240.98,731.49zM233.88,731.91l0.15,0.77l0.75,-0.23l0.63,-0.44l0.58,-0.63l0.32,-0.22l0.18,0.49l0.7,0.8l-0.98,0.6l-1.78,0.8l-0.73,0.68l-0.14,0.35l1.44,0.15l0.37,0.16l0.16,0.36l-0.48,0.22l-0.83,0.07l-0.83,0.39l-1.81,0.55l-0.83,0.67l-0.77,0.11l-0.93,-0.21l-1.77,0.04l-1.14,0.21l-0.33,0.2l-0.35,0.03l-0.36,-0.13l-0.47,0.1l-0.57,0.33l-0.42,0.1l-0.59,-0.14l-0.36,0.09l-0.34,-0.12l-0.74,-0.86l-0.13,-0.4l1.03,-0.39l0.66,-0.03l0.93,0.19l1.08,-0.32l2.07,-0.22l0.7,-0.26l0.85,-1.41l0.5,-0.13l0.41,-0.54l1,0.33l0.25,0.83l0.13,0.14l0.1,-0.04l0.22,-0.53l0.64,-0.22l-0.21,-0.37l-0.82,-0.65l-0.63,-0.38l-0.45,-0.12l-0.3,-0.31l-0.15,-0.51l0,-0.45l0.15,-0.4l0.37,-0.39l0.59,-0.37l0.58,-0.13l1.13,0.13l1.05,-0.04l0.52,0.1l0.33,0.26L233.88,731.91zM236.46,735.42l-0.13,0l-0.11,-0.41l0.09,-0.32l0.21,-0.19l0.55,-0.42l0.33,-0.11l0.37,0.01l0.05,0.17l-0.49,0.54l-0.5,0.31L236.46,735.42zM220.27,736.07l-3.03,0.64l-1.18,0.81l-0.98,0.83l-0.69,0.4l-0.39,-0.02l-0.5,0.14l-1.08,0.44l-0.38,-0.03l-3.28,0.77l-0.2,-0.04l0.28,-0.4l1.04,-0.34l0.73,-0.39l0.93,-0.74l0.45,-0.23l0.27,-0.44l0.37,-0.94l0.27,-0.31l0.82,-0.53l0.55,-0.25l0.6,0.05l1.08,0.5l0.59,-0.21l0.24,-0.23l-0.2,-0.35l0.08,-0.46l0.33,-0.74l0.55,-0.57l0.77,-0.4l0.93,-0.2l1.1,0l0.73,0.22l1.07,1.12l0.09,0.38l-0.55,0.59l-0.4,0.59L220.27,736.07zM203.62,738.08l-0.33,0.51l-0.19,0.16l-1.18,-0.74l-0.89,-0.2l0.02,-0.36l0.18,-0.26l1.5,0.03l0.55,0.19l0.28,0.36L203.62,738.08zM193.68,738.64l-0.69,0.24l-0.1,-0.22l0.1,-0.57l0.45,-0.31l1.23,-0.58l0.55,0.39l0.11,0.31l-0.14,0.34l-0.39,0.37l-0.37,0.12l-0.36,-0.13L193.68,738.64zM158.15,733.39l-4.65,-1.29l-0.51,-0.66l0.76,0.07l0.84,0.21l1.92,0.06l2.27,0.3l1.86,0l1.56,0.13l0.68,-0.55l-1.07,-0.86l-0.12,-0.38l0.71,-0.1l0.68,-0.29l1.36,-0.11l0.73,1.12l0.03,0.57l-0.32,0.53l-0.44,0.51l-1.02,-0.06l-0.26,0.25l0.13,1.07l-2.15,0.02L158.15,733.39zM177.73,737.48l-0.69,-0.04l-0.59,-0.46l0.59,-0.59l0.47,-0.26l0.78,-0.23l0.64,0.48l0.35,0.81L177.73,737.48zM167.99,735.79l1.41,1.19l2.05,0.73l0.69,0.42l-0.05,0.16l-1.38,-0.28l-0.41,-0.25l-1.25,-0.14l-0.79,-0.25l-1.64,-0.98l-1.43,-0.35l-0.33,-0.22l-0.33,-0.42l-0.32,-0.62l0.08,-0.28l0.49,0.07l1.05,0.84l0.2,-0.14l1.15,0.06L167.99,735.79zM146.91,729.17l-0.36,0.31l-0.62,-0.76l-0.14,-0.46l0.09,-0.37l0.48,-0.47l0.64,0.27l0.28,0.4l0.17,0.59l-0.01,0.32L146.91,729.17zM141.44,728.94l-0.15,0.46l0.97,0.35l0.2,0.36l-0.38,0.87l-0.23,0.19l-0.17,0l-0.26,-0.34l-0.58,0.28l-2.23,0.32l-0.28,-0.85l-1.45,0.5l1.81,-2.15l0.99,-0.01l0.43,-0.15l0.25,-0.76l0.91,-1.04l0.81,0.42l0.17,0.67l-0.16,0.32L141.44,728.94zM136.01,728.92l-0.31,0.07l-0.49,-0.06l-1.18,-0.71l-0.78,-0.29l-0.89,-0.29l-0.74,-0.05l0.02,-0.38l0.14,-0.25l3.05,0.5l0.8,-0.1l0.6,-0.31l0.76,-0.74l0.41,-0.14l0.17,0.09l0.23,0.53l-0.34,0.41l-0.52,0.25l-0.28,0.33L136.01,728.92zM129.62,727.12l-0.38,0.36l-0.19,-0.1l-0.76,-1.22l-0.05,-0.32l0.8,-0.05l0.31,-0.18l0.08,-0.38l-0.26,-0.7l-0.6,-1.02l-0.13,-0.6l0.34,-0.18l0.5,0.02l1.34,0.57l0.37,1.09l0.42,0.51l1.19,0.75l-0.8,0.03l-0.51,0.15l-1.01,1L129.62,727.12zM145.93,731.74l-0.82,-0.01l-0.66,-0.98l0.38,-0.65l0.76,1L145.93,731.74zM143.52,731.03l-0.85,0.55l-0.23,-0.52l0.32,-1.13l0.41,-0.15l0.47,1.12L143.52,731.03z"
				},
				{
					"id":"US-AL",
					"title":"Alabama",
					"d":"M955.38,371.42l0.81,2.77l0.81,2.77l0.81,2.77l0.81,2.77l0.81,2.77l0.81,2.77l0.82,2.77l0.82,2.77l0.82,2.77l0.82,2.77l0.82,2.77l0.83,2.77l0.83,2.77l0.83,2.77l0.83,2.77l0.83,2.77l0.62,1.23l0.62,2.04l3.4,5.85l1.09,2.5l-0.1,1.1l0.44,0.87l0.98,0.64l-0.05,0.89l-1.07,1.14l-0.64,1.31l-0.31,2.21l0,0.01l-0.68,3.91l0.26,2.31l1.47,3.01l0,0l0.4,1.36l0.02,6.24l0.96,3.9l1.46,2.44l-6.18,0.75l-6.2,0.72l-6.2,0.7l-6.21,0.68l-6.21,0.66l-6.21,0.63l-6.21,0.61l-6.21,0.59l-0.12,1.62l0.27,1.52l0.81,1.39l3.05,2.51l0.32,0.65l-0.29,2.18l0.23,1.51l-0.22,0.82l-0.62,0.75l-0.11,0.78l-0.44,0.26l-1.9,2.51l-7.38,1.43l0.36,-0.56l1.56,-0.25l2.14,-0.93l-0.56,-1.19l-0.97,-1.28l-0.8,-0.08l-0.59,-0.75l-0.2,-2.5l-0.63,-1.42l-1.34,-1.4l-0.38,0.33l-0.66,2.65l-0.44,3.44l-0.27,1.12l-2.2,0.27l-1.97,-0.07l-0.96,0.14l-0.64,-4.58l-0.55,-4.18l-0.55,-4.18l-0.55,-4.17l-0.55,-4.17l-0.55,-4.17l-0.55,-4.17l-0.55,-4.17l0.12,-4.16l0.12,-4.15l0.12,-4.15l0.12,-4.15l0.11,-4.15l0.11,-4.15l0.11,-4.15l0.11,-4.15l0.11,-4.14l0.1,-4.14l0.1,-4.14l0.1,-4.14l0.1,-4.14l0.09,-4.14l0.09,-4.14l0.09,-4.14l0.02,-1.05l-0.01,-0.36l0.02,-0.54l-1.74,-1.32l-0.34,-0.26l-0.25,-0.25l0.23,-0.04l2.93,-0.22l2.93,-0.23l2.93,-0.23l2.93,-0.24l2.93,-0.24l2.93,-0.25l2.93,-0.25l2.93,-0.26l2.93,-0.26l2.93,-0.27l2.93,-0.27l2.93,-0.28l2.92,-0.28l2.92,-0.29l2.92,-0.29L955.38,371.42zM920.01,481.61l-1.67,0.63l-2.54,0.17l-0.53,-0.12l0.99,-0.41l2.96,-0.68L920.01,481.61z"
				},
				{
					"id":"US-AR",
					"title":"Arkansas",
					"d":"M879.39,356.05L879.34,356.46L879.77,357.32L879.81,357.82L879.56,358.15L878.95,358.37L878.51,358.62L878.44,359L878.43,359.18L878.49,359.6L878.6,359.97L878.34,360.49L876.35,361.85L875.57,363.5L876,365.42L875.4,367.43L873.73,369.53L873.12,371.8L873.55,374.24L872.78,376.28L870.8,377.92L870.16,378.9L870.17,378.97L870.22,379.66L870.46,380.2L869.83,381.27L868.14,382.43L867.26,383.52L867.19,384.53L866.8,385.04L866.05,385.31L865.68,386.83L865.52,390.35L864.69,392.4L863.2,392.99L862.43,393.82L862.38,394.9L861.55,396.2L859.92,397.7L859.43,399.08L860.08,400.31L860,400.83L859.5,401.28L857.68,401.98L857.38,402.3L857.21,402.64L857.62,403.27L857.89,404.23L857.71,405.89L857.3,406.6L856.9,407.28L855.4,408.51L855.02,409.43L855.74,410.02L855.73,410.71L854.99,411.49L855.26,412.29L855.47,412.82L856.21,413.28L856.54,414.64L856.12,416.43L856.29,417.87L857.22,419.02L857.44,419.52L856.79,423.52L856.87,424.07L853.19,424.28L849.81,424.45L846.44,424.62L843.06,424.78L839.69,424.93L836.31,425.08L832.93,425.22L829.56,425.36L826.18,425.48L822.8,425.61L819.43,425.72L816.05,425.83L812.67,425.93L809.3,426.02L805.92,426.11L802.54,426.19L802.45,423.17L802.35,420.14L802.26,417.12L802.17,414.09L801.19,413.6L799.46,413.38L798.59,413.57L797.53,413.45L796.84,413.96L796.37,414.06L795.99,413.96L795.75,413.52L794.97,413.22L793.98,412.15L793.99,409.73L794,407.31L794.01,404.88L794.02,402.46L794.03,400.04L794.04,397.62L794.06,395.19L794.07,392.77L794.08,390.35L794.09,387.93L794.1,385.51L794.11,383.09L794.12,380.67L794.13,378.25L794.14,375.83L794.15,373.41L793.69,370.32L793.23,367.23L792.77,364.14L792.32,361.05L791.86,357.96L791.41,354.87L790.96,351.78L790.51,348.69L795.5,348.61L800.5,348.51L805.5,348.4L810.5,348.27L815.5,348.12L820.5,347.96L825.49,347.79L830.49,347.6L835.48,347.39L840.48,347.17L845.47,346.93L850.47,346.68L855.46,346.41L860.45,346.13L865.44,345.83L870.43,345.52L871.34,347.2L872.19,348.28L872.38,349.1L872.28,349.95L871.07,351.83L869.92,352.74L869.32,353.68L868.47,354.59L867.21,357.04L870.17,356.81L873.13,356.57L876.09,356.32z"
				},
				{
					"id":"US-AZ",
					"title":"Arizona",
					"d":"M533.89,321.1L532.76,328.9L531.63,336.7L530.5,344.5L529.37,352.31L528.24,360.12L527.11,367.93L525.98,375.74L524.85,383.56L523.72,391.38L522.58,399.2L521.45,407.03L520.32,414.87L519.18,422.7L518.05,430.54L516.91,438.39L515.77,446.26L511.45,445.64L504.73,444.66L498.01,443.64L491.3,442.6L484.59,441.54L477.88,440.45L469.46,435.65L461.08,430.82L452.73,425.95L444.44,421.04L436.18,416.09L427.97,411.1L419.8,406.08L411.67,401.01L412.82,399.96L414.68,396.92L414.79,396.73L414.79,396.73L417.4,397.04L418.79,396.46L419.82,395.1L420.29,393.59L420.21,391.95L419.35,390.56L417.72,389.42L417.13,387.07L417.59,383.49L418.31,381.66L419.29,381.57L420.36,380.9L421.51,379.64L422.46,378.2L423.22,376.57L423.75,374.43L424.03,371.78L426.34,368.9L428.36,367.25L431.87,365.43L432.7,364.84L432.83,364.25L432.85,364.18L432.4,363.22L430.05,360.98L429.16,359.53L429.28,358.39L429.25,358.36L429.12,357.22L427.17,352.16L426.72,349.5L427.11,347.68L427.14,347.54L429.09,339.87L428.62,336.97L428.7,335.41L429.39,333.62L429.54,332.44L429.27,331.34L429.53,329.49L429.94,327.22L429.44,325.6L429.42,324.92L430.2,323.46L431.19,322.83L432.65,322.55L434.24,322.68L435.96,323.21L437.13,324.18L437.77,325.58L438.51,326.38L439.37,326.59L440.71,325.81L442.16,323.87L442.52,323.79L444.44,314.41L446.17,305.87L451.63,306.97L457.09,308.04L462.55,309.09L468.02,310.13L473.49,311.15L478.97,312.15L484.44,313.13L489.92,314.09L495.41,315.03L500.9,315.95L506.39,316.86L511.88,317.74L517.38,318.61L522.88,319.46L528.38,320.29z"
				},
				{
					"id":"US-CA",
					"title":"California",
					"d":"M371.75,174.28l-1.09,4.03l-1.09,4.03l-1.09,4.03l-1.09,4.03l-1.09,4.03l-1.09,4.03l-1.09,4.03l-1.09,4.02l-1.09,4.03l-1.09,4.02l-1.09,4.02l-1.09,4.02l-1.09,4.02l-1.09,4.02l-1.09,4.02l-1.09,4.02l2.98,4.56l3,4.56l3.02,4.56l3.05,4.55l3.07,4.54l3.09,4.54l3.11,4.53l3.13,4.53l2.41,3.75l2.42,3.75l2.44,3.75l2.45,3.74l2.46,3.74l2.48,3.74l2.49,3.73l2.5,3.73l3.46,5.32l3.48,5.31l3.51,5.3l3.53,5.3l3.56,5.29l3.59,5.28l3.62,5.28l3.9,5.63l-0.39,1.82l0.45,2.66l1.95,5.06l0.13,1.14l0.03,0.03l-0.12,1.14l0.89,1.45l2.36,2.25l0.44,0.95l-0.01,0.07l-0.13,0.6l-0.83,0.59l-3.5,1.82l-2.02,1.65l-2.31,2.87l-0.28,2.66l-0.52,2.14l-0.76,1.62l-0.95,1.44l-1.15,1.26l-1.07,0.67l-0.98,0.09l-0.72,1.83l-0.46,3.58l0.59,2.36l1.64,1.14l0.86,1.39l0.08,1.64l-0.47,1.5l-1.03,1.37l-1.39,0.58l-2.61,-0.31l0,0l-0.11,0.19l-2.16,-0.21l-5.38,-0.65l-5.39,-0.67l-5.38,-0.69l-5.38,-0.7l-5.38,-0.72l-5.38,-0.74l-5.38,-0.76l-5.38,-0.77l-0.01,-0.15l0.44,-2.41l-0.65,-1.04l-1.22,0.26l0.24,-3.21l0.62,-1.39l0.21,-1.45l-0.19,-3.74l-1.69,-4.89l-4.56,-6.68l-2.53,-2.49l-1.78,-2.8l-1.32,-0.98l-1.81,-0.63l-0.79,0.87l-1.93,-1.21l0.94,-2.39l-1.17,-3.95l-1.57,-0.8l-4.25,-0.84l-5.11,-3.34l-1.36,-1.55l-0.04,-2.16l-2.15,-2.43l-2.98,-2.62l-2.02,-0.11l-2.43,-0.93l-3.22,-2.19l-2.03,-0.72l-4.14,-0.74l-1.44,-0.67l-0.97,-1.94l-1.29,-1.19l0.85,-1.82l0.29,-1.78l0.6,-1.28l0.15,-3.13l1.28,-2.58l-0.18,-1.11l-0.63,-0.99l-2.33,-1.86l-0.09,-1.53l0.98,-1.82l-0.33,-1.47l-1.82,-1.8l-1.25,-3.28l-2.13,-2.21l-0.34,-2.78l-1.13,-1.98l-0.15,-1.51l-2.06,-5.84l-2.58,-4.85l0.07,-2.34l0.73,-3.02l1.97,-1.4l1.24,-1.37l0.35,-1.49l0.09,-1.14l-0.71,-2.24l-4.53,-2.54L303,265.5l0.82,-3.6l-0.46,-4.07l0.68,-2.35l0.53,-2.61l1.33,-0.21l0.98,0.51l-0.41,0.98l-0.19,1.92l0.81,1.73l0.99,0.94l0.67,1.64l0.68,0.64l0.8,0.34l-0.19,-0.98l-0.31,-0.68l-0.05,-1.93l-0.42,-2.57l-0.88,-1.61l0.04,-2.45l-0.38,-0.69l-0.09,-0.94l1.5,-0.64l1.85,-0.22l2.25,0.46l6.14,2.16l1.5,-0.19l1.04,0.51l0.83,0.16l-1.52,-1.09l-1.01,-0.08l-1.08,-0.45l-2.26,-0.53l-0.83,-0.52l-0.78,-1l-0.63,-0.26l-2.42,0.63l-0.87,-0.42l-1.77,-1.99l-0.89,-0.47l-1.75,0.31l-1.18,3.25l-0.27,2.6l-0.99,-0.02l-0.76,-1.33l-1.45,-1.09l-1.06,-1.33l-1.37,-2.29l-0.8,-0.93l-1.56,1.08l0.16,-0.66l1.06,-1.48l0.69,-2.82l1.02,2.73l-0.05,-1.72l-0.79,-2.11l-0.82,-0.9l-0.31,-3.45l-2.24,-2.71l-1.33,-3.67l-3.05,-6.35l1.05,-4.41l0.06,-5.98l1.68,-2.88l0.6,-2.23l0.24,-3.58l-0.27,-2.07l-2.08,-6.11l-2.43,-4.46l0.29,-2.69l0.58,-2.62l1.49,-2.02l1.42,-2.17l0.68,-0.48l0.1,0.32l-0.3,0.47l0.44,0.31l0.52,-0.99l0.47,-0.45l-0.5,-0.24l0.16,-0.32l0.52,-0.56l2.08,-2.78l1.15,-3.98l2.69,-4.47l0.46,-1.61l0.37,-3.67l-0.06,-2.29l-0.82,-1.88l1.25,-1.95l0.61,-2.05l-0.15,-0.43l4.31,1.38l4.17,1.32l4.18,1.31l4.18,1.3l4.19,1.28l4.19,1.27l4.19,1.26l4.2,1.25l4.2,1.23l4.2,1.22l4.21,1.21l4.21,1.2l4.21,1.19l4.22,1.17l4.22,1.16L371.75,174.28zM327.88,344.91l3.35,2.08l2.11,0l0.21,0.63l-0.36,0.4l-4.66,-0.35l-1.21,-0.95l0.09,-0.83l-0.25,-0.89L327.88,344.91zM319.97,344.03l-0.97,-0.2l-1.4,-0.63l0.65,-0.36l0.91,-0.14l0.18,0.34L319.97,344.03zM324.06,347.59l-1.34,-0.04l-0.88,-0.55l-0.96,-2.47l3.3,0.61l1.15,1.27l0.12,0.3L324.06,347.59zM351.66,367.08l0.52,1.82l-1.27,-0.53l-1.4,-0.26l-0.2,-0.97l-0.11,-1.31l-0.2,-0.38l-0.92,-0.35l-0.04,-0.13l0.04,-0.61l0.34,-0.21l2.62,2.09L351.66,367.08zM330.94,365.63l-0.82,-0.17l-1.06,-0.49l-0.26,-1.31l0.93,0.16l0.8,0.38l0.43,1.09L330.94,365.63zM348.58,379.15l-1.11,-0.07l-1.07,-0.74l-0.49,-2.35l-0.7,-1.92l0.72,-0.31l0.51,1.8l1.67,2.96L348.58,379.15z"
				},
				{
					"id":"US-CO",
					"title":"Colorado",
					"d":"M662.79,267.67L662.52,271.83L662.26,275.99L661.99,280.15L661.73,284.31L661.47,288.47L661.21,292.63L660.94,296.79L660.68,300.95L660.42,305.11L660.15,309.27L659.89,313.42L659.63,317.58L659.36,321.74L659.1,325.9L658.84,330.06L658.58,334.22L654.18,333.92L649.79,333.62L645.4,333.29L641,332.96L634.29,332.43L627.58,331.87L620.86,331.28L614.16,330.67L607.45,330.02L600.75,329.35L594.04,328.65L587.35,327.92L580.65,327.17L573.96,326.38L567.27,325.57L560.59,324.73L553.91,323.87L547.23,322.97L540.56,322.05L533.89,321.1L534.68,315.6L535.48,310.1L536.27,304.6L537.07,299.1L537.86,293.6L538.66,288.1L539.45,282.6L540.25,277.11L541.04,271.61L541.84,266.11L542.63,260.61L543.43,255.11L544.22,249.61L545.02,244.11L545.81,238.61L546.61,233.1L551.85,233.85L557.09,234.58L562.33,235.29L567.58,235.99L572.83,236.66L578.08,237.32L583.33,237.96L588.59,238.58L593.85,239.18L599.11,239.77L604.37,240.34L609.63,240.88L614.9,241.41L620.17,241.93L625.43,242.42L630.7,242.9L634.89,243.26L639.09,243.61L643.28,243.96L647.47,244.29L651.66,244.61L655.86,244.92L660.05,245.21L664.25,245.5L664.07,248.27L663.88,251.04L663.7,253.82L663.52,256.59L663.33,259.36L663.15,262.13L662.97,264.9z"
				},
				{
					"id":"US-CT",
					"title":"Connecticut",
					"d":"M1162.77,173.18L1163.09,174.33L1163.54,175.94L1163.87,177.11L1164.33,178.72L1164.84,180.55L1165.32,182.24L1165.73,183.72L1165.92,184.61L1166.2,185.97L1165.93,186.6L1166.06,187.88L1164.61,188.15L1162.37,189.1L1159.46,190.67L1157.63,190.69L1156.08,191.94L1150.17,193.72L1148.8,193.63L1147.57,195.53L1145.22,197.07L1139.53,202.05L1138.91,202.89L1137.73,201.74L1136.79,200.84L1137.91,199.67L1138.76,198.77L1139.55,197.93L1140.07,197.39L1139.36,196.68L1138.66,195.98L1138.27,193.9L1137.89,191.81L1137.5,189.73L1137.11,187.65L1136.72,185.57L1136.34,183.49L1135.95,181.41L1135.56,179.32L1136.92,179.04L1138.29,178.75L1139.66,178.47L1141.03,178.18L1142.39,177.89L1143.76,177.59L1145.13,177.3L1146.49,177.01L1146.66,177.56L1147.33,177.31L1147.3,176.8L1149.22,176.33L1151.15,175.85L1153.08,175.37L1155,174.89L1156.92,174.41L1158.85,173.92L1160.77,173.44L1162.69,172.95z"
				},
				{
					"id":"US-DC",
					"title":"Washington, DC",
					"d":"M1092.78,261.54L1092.27,261.05L1091.35,260.78L1090.97,260.69L1092.02,258.91L1093.2,260.01L1094.47,261.2L1093.34,263.3z"
				},
				{
					"id":"US-DE",
					"title":"Delaware",
					"d":"M1115.45,235.44L1114.9,236.36L1114.58,237.88L1113.53,239.87L1113.89,240.96L1114.31,241.69L1114.57,243.36L1115.85,244.76L1118.26,246.98L1119.54,250.98L1121.55,253.4L1124.42,256.09L1126.26,256.61L1126.62,257.78L1126.32,259.91L1125.53,261.04L1126.79,260.56L1127.54,260.85L1128.55,262.34L1128.76,263.38L1126.94,263.82L1123.17,264.69L1119.4,265.56L1117.68,265.95L1117.64,265.96L1117.6,265.97L1117.56,265.98L1117.52,265.98L1117.48,265.99L1117.44,266L1117.4,266.01L1117.37,266.02L1116.42,262.62L1115.48,259.23L1114.53,255.83L1113.59,252.44L1112.65,249.04L1111.71,245.64L1110.77,242.25L1109.83,238.85L1110.7,236.82L1111.12,236.17L1111.76,235.74L1113.82,235.18z"
				},
				{
					"id":"US-FL",
					"title":"Florida",
					"d":"M1045.28,455.26l1.22,1.86l2.7,7.99l1.4,2.7l2.95,7.43l4.04,7.01l5.48,8.37l8.43,9.85l1.06,1.43l-0.63,1.47l-0.03,1.42l0.28,2.08l0.59,1.98l1.21,2.33l2.16,3.51l-0.97,-0.61l-3.11,-5.04l-0.8,-3.13l-0.46,-4.56l-0.49,0.2l-0.16,1.53l0.07,1.76l-0.44,0.76l-1.2,-2.5l-0.15,-1.19l0.56,-1.52l-0.32,-0.46l-1.41,-0.49l-0.46,-1.07l-0.01,-1.13l-0.84,-0.46l-0.57,0.13l0.84,2.65l0.89,1.56l1.43,3.87l1.64,2.21l1.06,1.91l12.16,20.24l2.49,2.41l1.09,1.86l1.51,4.02l1.12,5.31l0.33,10.02l0.86,6.73l-0.24,-0.17l-0.26,-0.68l-0.34,-0.04l-0.68,3.27l-1.18,3.05l0.2,4.39l-0.42,2.29l-2.01,2.69l-1.5,0.2l-3.37,2.33l-2.65,-0.01l-2.9,1.48l-2.04,0.23l-1.5,-1.84l0.03,-0.94l0.31,-0.99l0.75,-0.34l3.06,1.68l0.36,-0.98l-1,-0.93l-1.66,-0.33l-1.26,-0.46l-3.12,-4.48l-2.95,-2.94l-0.76,-2.16l-4.35,-0.69l-3.32,-1.58l-2.52,-3.35l-2.13,-6.31l-1.42,-0.52l-0.63,-0.42l0.9,-2.6l1.03,-2.22l-0.99,0.67l-0.67,0.87l-0.72,1.94l-0.69,0.39l-0.71,-0.17l-1.3,-3.29l-0.43,-4.23l0.83,-1.73l-1.66,0.21l-1.62,0.86l0.47,1.36l-0.12,0.81l-1.28,-0.01l-1.02,-0.35l-1.51,-1.26l-2.17,-2.51l-4.72,-7.11l-0.86,-0.98l-1.35,-0.95l0.51,-0.43l0.98,-0.36l1.78,-3.78l1.48,-2.35l0.38,-1.52l-0.2,-0.6l-0.93,-0.77l-0.92,0.94l-0.48,-0.16l-1.44,-1.63l-1.19,-0.34l-0.72,0.5l1.04,1.35l0.82,0.44l0.03,2.19l-0.2,0.74l-0.6,0.72l-1.13,-0.17l-0.47,0.61l-0.73,-0.47l-0.78,-0.85l-0.94,-1.45l0.6,-9.01l0.92,-5.81l-0.74,-6.36l-0.01,-0.96l-0.4,-1.66l-2.85,-3.32l-11.46,-7.45l-9.32,-9.47l-7.31,-3.05l-5.03,1.54l-0.79,0.91l-0.25,1.09l0.48,1.14l-0.41,0.55l-1.39,0.12l-1.83,0.51l-4.52,3.39l-1.73,0.11l-1.47,0.91l-1.11,0.68l-3.02,0.66l-2.52,0.93l-1.16,-0.2l-0.92,-1.53l-0.2,-1.67l0.74,1.21l1.03,0.89l0.37,-0.45l0.05,-0.91l-1.11,-1.63l-3.19,-1.89l-3.71,-2.88l1.03,-0.01l0.18,-0.73l-1.14,-0.8l0.31,-1.11l0.6,-1.2l-1.38,0.33l-1.17,0.92l0.07,0.97l-0.16,0.79l-0.69,-0.04l-1.36,-0.8l-6.48,-1.95l-5.56,-0.91l4.07,-1.11l2.3,0.28l-0.36,-0.77l-0.6,-0.45l-1.84,-0.45l-2.23,0.49l-1.46,-0.15l-1.39,0.79l-1.5,1.11l-1.37,0.63l-5.5,1.25l-4.45,1.19l0.65,-0.85l0.72,-0.58l2.59,-1.03l0.24,-1.63l-0.78,-1.46l-0.66,0.44l-0.62,1.27l-0.99,-0.77l-1,0.1l-0.09,1.93l-1.16,1.4l-0.46,1.34l-3.68,1.36l-0.52,-0.29l0.99,-1.32l-0.15,-0.67l-0.76,0.44l0.11,-0.78l0.62,-0.75l0.22,-0.82l-0.23,-1.51l0.29,-2.18l-0.32,-0.65l-3.05,-2.51l-0.81,-1.39l-0.27,-1.52l0.12,-1.62l6.21,-0.59l6.21,-0.61l6.21,-0.63l6.21,-0.66l6.21,-0.68l6.2,-0.7l6.2,-0.72l6.18,-0.75l1,1.66l1.97,3.45l0.16,0.84l1.82,-0.09l3.09,-0.17l3.09,-0.18l3.09,-0.19l3.09,-0.19l3.09,-0.2l3.09,-0.2l3.09,-0.21l3.09,-0.21l3.09,-0.22l3.09,-0.22l3.09,-0.23l3.09,-0.24l3.09,-0.24l3.09,-0.25l3.09,-0.25l3.09,-0.26l0.13,0.73l0.68,1.07l0.33,1.29l0.33,0.59l0.67,0.3l0.98,-0.05l0.86,-0.89l0.36,-1.72l-0.13,-1.84l-0.69,-2.01l-0.21,-1.75l0.32,-1.1l0.53,-0.34l0.41,-0.63l0.39,-0.18l1.1,0.13l4.19,0.84L1045.28,455.26zM982.99,488.77l-1.86,1.04l-2.19,-0.33l1.3,-0.27l0.98,0.12l2.27,-1.44l1.15,-1.02l1.42,-0.51L982.99,488.77zM1083.9,527.61l0.61,1.58l-2.5,-3.49l-3.3,-5.58l-2,-4.4l1.03,1.1l1.25,2.44L1083.9,527.61zM1048.56,550.12l0.17,1.32l-1.36,-2.05l-1.05,-2.33l1.09,0.64L1048.56,550.12zM1049.84,552.19l-0.63,0.7l-1.52,-0.21l-0.91,-0.65l-0.57,-1.45l1.51,1.4l0.51,0.29L1049.84,552.19zM1088.32,576.1l-3.34,4.93l0.27,-1.14l1.2,-2.54l0.33,-1.15l0.95,-0.86l0.79,-1.39l-0.17,-1.43l1.27,-1.25l0.45,-0.23L1088.32,576.1zM1083.99,582.38l-0.53,0.2l0.65,-1.1l0.24,0.03L1083.99,582.38zM1080.44,585.29l-0.39,0.06l0.14,-0.35l0.7,-0.78l0.33,0.2l0.02,0.33L1080.44,585.29zM1076.35,587.99l-0.85,0.69l-1.04,-0.23l0.98,-0.71l3.09,-1.1l-1.08,0.91L1076.35,587.99zM1070.61,590.46l-0.54,0.56l-0.32,-0.09l-0.11,-0.68l-1.12,-1.35l-0.03,-0.4l2.25,1.14l0.12,0.39L1070.61,590.46zM1066.01,592.38l-1.3,0.44l0.94,-1.06l0.13,-1.41l0.8,0.95l0.09,0.64L1066.01,592.38zM1061.73,594.34l-0.52,0.13l-0.1,-0.34l0.84,-0.57l0.6,-0.06l0.05,0.48L1061.73,594.34z"
				},
				{
					"id":"US-GA",
					"title":"Georgia",
					"d":"M1052.54,424.61l-0.65,2.03l-2.1,1.55l-0.71,0.07l-0.52,0.44l0.47,0.78l0.67,0.51l0.07,0.57l-0.48,0.86l-1.17,0.41l-0.53,0.98l0.35,0.79l0.47,0.39l0.05,0.81l-1.24,1.02l-0.19,0.83l0.72,0.12l0.49,-0.32l0.41,0.1l-0.61,1.44l-0.61,0.92l-0.47,1.55l-1.56,0.66l0.14,0.45l0.99,0.26l0.95,0.98l-1.12,2.27l-0.93,-0.02l-0.63,-0.36l-0.09,1.66l0.28,0.84l-0.06,1.81l-0.22,2.2l-0.24,0.93l0.34,1.6l0.49,1.52l-3.27,0.32l-4.19,-0.84l-1.1,-0.13l-0.39,0.18l-0.41,0.63l-0.53,0.34l-0.32,1.1l0.21,1.75l0.69,2.01l0.13,1.84l-0.36,1.72l-0.86,0.89l-0.98,0.05l-0.67,-0.3l-0.33,-0.59l-0.33,-1.29l-0.68,-1.07l-0.13,-0.73l-3.09,0.26l-3.09,0.25l-3.09,0.25l-3.09,0.24l-3.09,0.24l-3.09,0.23l-3.09,0.22l-3.09,0.22l-3.09,0.21l-3.09,0.21l-3.09,0.2l-3.09,0.2l-3.09,0.19l-3.09,0.19l-3.09,0.18l-3.09,0.17l-1.82,0.09l-0.16,-0.84l-1.97,-3.45l-1,-1.66l-1.46,-2.44l-0.96,-3.9l-0.02,-6.24l-0.4,-1.36l0,0l-1.47,-3.01l-0.26,-2.31l0.68,-3.91l0,-0.01l0.31,-2.21l0.64,-1.31l1.07,-1.14l0.05,-0.89l-0.98,-0.64l-0.44,-0.87l0.1,-1.1l-1.09,-2.5l-3.4,-5.85l-0.62,-2.04l-0.62,-1.23l-0.83,-2.77l-0.83,-2.77l-0.83,-2.77l-0.83,-2.77l-0.83,-2.77l-0.82,-2.77l-0.82,-2.77l-0.82,-2.77l-0.82,-2.77l-0.82,-2.77l-0.81,-2.77l-0.81,-2.77l-0.81,-2.77l-0.81,-2.77l-0.81,-2.77l-0.81,-2.77l5.92,-0.62l5.92,-0.64l5.91,-0.66l5.91,-0.68l5.49,-0.79l5.48,-0.81l5.48,-0.83l5.48,-0.85l-0.11,0.04l-0.68,1.62l-2.26,3.18l-0.41,2.25l3.78,1.91l0.01,0.02l2.34,1.64l1.52,0.56l1.47,0.02l0.99,0.51l0.76,1.48l0,0l5.33,7.07l0,0l4.96,3.31l2.05,1.68l1.18,1.75l4.22,2.52l1.54,1.47l0.26,1.25l0.59,0.83l0.91,0.4l0.97,1.01l1.03,1.62l1.74,1.27l2.45,0.92l2.11,2.67l1.78,4.41l1.49,2.49l1.8,0.84l2.86,3.54l1.11,2.21l0.3,2.05l1.39,1.41L1052.54,424.61zM1046.05,449.68l0.02,5.53l-0.68,-1.85l-0.33,-1.85l0.47,-1.2L1046.05,449.68z"
				},
				{
					"id":"US-HI",
					"title":"Hawaii",
					"d":"M590.47,592.69l-1.45,-0.14l-0.31,-0.72l-0.93,-0.95l0.01,-0.8l-0.7,-1.32l0.06,-0.94l1.58,-0.55l2.31,0.37l2.33,2.02l-0.12,1.15l-0.41,0.58l-0.82,0.35l-0.86,0.75L590.47,592.69zM581.2,586.6l-0.63,0.31l-0.29,-0.38l0.28,-0.52l0.75,-0.4l1.04,-0.01l1.33,-0.23l0.44,0.58l-0.73,0.27l-0.51,0.53l-1.03,-0.33L581.2,586.6zM602.65,611.73l0.31,0.36l0.53,0.3l-0.57,1.04l0.14,0.95l-0.04,0.46l-0.85,-0.16l-1.26,-0.8l-0.33,-0.69l-0.1,-1.02l-0.73,-0.33l0.26,-0.54l0,-0.22l-0.51,-0.21l-0.09,0.9l-1.08,-0.81l-0.27,-0.34l0.25,-0.9l-0.04,-2.15l0.41,-0.49l0.12,-0.89l1.73,1.13l1.94,-0.15l0.7,0.39l-0.18,2.64l-0.41,0.45l-0.11,0.67L602.65,611.73zM606.71,619.52l2.02,2.13l0.64,0.29l0.17,0.56l1.76,1.65l0.25,0.35l-0.85,0.29l-1.64,-0.41l-1.36,-1.85l-2.77,-2.48l0.48,-0.36l0.53,-0.1l0.49,-0.53L606.71,619.52zM611.98,628.99l0.12,0.43l1.4,0.6l0.92,0.54l0.81,1.86l0.08,0.9l0.49,1.28l0,0.65l-0.64,0.29l-1.65,0.02l-1.54,-0.9l-1.09,-0.3l-1.02,-0.92l-0.21,-0.4l0.69,-1.11l0.52,-1.36l-0.79,-0.42l-0.49,-0.98l-0.08,-1.55l0.35,-0.62l1.13,-0.52l0.86,0.5l0.2,0.93L611.98,628.99zM606.59,627.73l-0.9,-0.18l-0.58,-0.71l0.46,-0.91l0.12,-1.53l1.34,0.73l0.43,0.81l0.1,0.59l0,0.87L606.59,627.73zM604.57,659.11l-0.93,0.18l-0.58,-0.52l-1.31,-2.94l0.23,-0.86l2.49,-2.88l1.06,-3.08l0.53,-2.57l1.41,-0.44l1.45,-0.05l2.06,-0.64l0.58,-2.4l1.04,-0.92l0.61,0.18l1.3,3.09l3.17,5.57l0.19,2.35l-0.91,1.67l0.71,0.84l-0.37,1.34l0.56,1.84l0.03,0.83l-1.14,0.44l-3.48,-0.13l-3.39,-1.49l-3.88,-0.16L604.57,659.11z"
				},
				{
					"id":"US-IA",
					"title":"Iowa",
					"d":"M853.82,212.6L854.91,214.06L856.72,215.33L857.78,216.55L858.1,217.72L859.23,218.93L861.19,220.16L862.35,221.29L862.72,222.3L862.77,223.91L862.51,226.11L861.93,227.72L861.02,228.74L860.39,230.13L860.02,231.88L858.63,233.56L856.22,235.17L853.48,236.34L850.42,237.05L848.66,238.4L848.2,240.41L848.55,242.05L849.72,243.32L850.43,244.69L850.67,246.17L850.03,248.68L848.5,252.21L846.71,254.54L844.67,255.66L843.81,257.2L844.14,259.17L844.02,260.3L843.17,260.73L841.62,259.63L841.32,258.83L840.07,258.05L839.86,257.53L838.91,257.1L838,255.53L833.73,255.75L829.46,255.97L825.19,256.17L820.92,256.36L816.65,256.54L812.38,256.71L808.11,256.87L803.84,257.01L799.56,257.14L795.29,257.26L791.02,257.37L786.74,257.47L782.47,257.55L778.19,257.62L773.92,257.68L769.69,257.72L768.65,256.07L768.09,254.54L768.44,253.82L768.51,251.33L768.29,247.09L767.88,244.7L767.27,244.16L767.2,243.42L767.66,242.48L767.52,241.84L766.78,241.51L766.55,240.7L766.83,239.41L766.65,238.62L766.01,238.34L765.75,237.89L765.86,237.3L765.51,236.91L764.72,236.73L764.41,235.28L764.56,232.54L764.26,230.6L763.52,229.46L763.15,228.39L763.14,227.39L762.36,225.81L760.81,223.66L759.81,220.82L759.37,217.31L758.27,215.34L757.78,215.22L757.37,213.38L756.92,212.56L756.85,211.93L755.49,210.34L755.41,209.73L755.59,208.96L756.48,207.47L757.3,205.01L757.5,203.36L758.15,202.12L758.17,201.43L758.07,200.53L757.71,199.74L756.65,199.15L756.52,198.91L756.42,198L756.87,197.43L757,196.78L756.89,195.99L756.26,194.62L755.98,193.22L758.34,193.15L763.62,193.17L768.9,193.17L774.18,193.14L779.46,193.1L784.74,193.04L790.02,192.96L795.3,192.87L800.58,192.75L805.86,192.61L811.14,192.46L816.42,192.29L821.7,192.09L826.97,191.88L832.25,191.65L837.52,191.41L842.88,191.12L843.06,192.5L843.43,193.49L844.13,194.26L845.16,194.83L845.39,196L844.82,197.78L844.71,199.96L845.07,202.53L845.69,204.83L846.59,206.87L848.47,208.28L851.33,209.09L853.08,210.48L853.7,212.44z"
				},
				{
					"id":"US-ID",
					"title":"Idaho",
					"d":"M526.08,151.01L525.51,154.45L524.93,157.89L524.36,161.32L523.79,164.76L523.21,168.2L522.64,171.63L522.07,175.07L521.49,178.51L520.92,181.94L520.35,185.37L519.77,188.8L519.2,192.23L518.63,195.67L518.06,199.1L517.49,202.52L516.91,205.96L513.85,205.44L510.79,204.92L507.73,204.39L504.67,203.86L501.61,203.31L498.55,202.77L495.5,202.21L492.44,201.65L489.39,201.09L486.34,200.52L483.29,199.94L480.24,199.35L477.19,198.76L474.14,198.17L471.09,197.56L468.05,196.95L462,195.72L455.95,194.47L449.91,193.19L443.88,191.89L437.85,190.56L431.82,189.21L425.81,187.83L419.79,186.43L420.93,181.59L422.06,176.75L423.19,171.91L424.32,167.07L425.46,162.22L426.59,157.38L427.73,152.53L428.97,147.2L429,147.09L430.75,144.04L431.34,142.5L431.29,141.53L431.67,140.71L432.47,140.01L432.66,139.09L432.26,137.95L431.23,137.01L429.57,136.28L428.95,134.91L429.36,132.88L431.38,130.1L435,126.55L437.14,123.93L437.79,122.26L440.3,118.62L444.65,113.02L446.68,109.25L446.41,107.33L445.34,105.3L443.45,103.17L442.3,100.93L442.1,99.88L441.87,98.59L441.95,97.03L442.54,96.26L442.58,94.69L442.06,92.32L441.97,90.76L442.19,90.28L442.35,90.1L443.16,86.59L443.97,83.09L444.79,79.58L445.6,76.07L446.41,72.56L447.23,69.05L448.04,65.53L448.86,62.01L449.68,58.5L450.49,54.98L451.31,51.46L452.13,47.93L452.94,44.41L453.76,40.88L454.58,37.35L455.38,33.84L460.05,34.93L466.24,36.35L469.75,37.14L468.53,42.58L467.31,48.03L466.08,53.48L464.86,58.92L465.96,61.48L466.83,63.1L467.26,64.73L468.07,66.52L468.18,67.11L468.22,68.85L467.66,69.97L468.01,71.31L467.77,71.89L467.24,72.09L467.12,72.17L467.11,72.29L467.23,72.53L468.6,74.04L469.86,76L471.66,77.56L472.16,78.35L474.16,82.16L475.12,84.51L476.28,86.32L476.65,88.19L477.86,90.01L478.08,90.85L478.16,91.04L478.35,91.1L479.37,90.94L479.6,91.09L479.94,91.78L479.85,92.7L480.12,93.15L480.66,93.49L481.31,93.69L483.49,93.68L483.94,93.77L484.12,94L484.12,94.5L483.93,95.29L483.5,96.36L482.64,97.35L482.53,98.4L481.54,100.71L480.74,102.21L480.38,103.77L479.6,104.55L479.71,105.68L479.15,107.27L479.27,107.73L479.86,108.64L479.75,110.7L479.54,111.04L478.04,111.54L477.47,111.97L477.15,112.66L477.3,114.89L476.49,115.93L476.21,116.92L476.29,117.2L477.42,117.99L478.69,119.49L479.12,119.84L479.46,119.87L480.18,119.6L481.05,118.94L482.66,118.42L484.71,117.02L484.89,116.55L485.08,116.31L485.3,116.37L485.79,116.71L486.66,117.98L487.47,118.75L487.6,118.91L487.63,119.22L487.38,120.26L487.73,121.19L487.62,122.57L487.88,124.03L487.94,125.74L488.93,128.12L489.4,129.77L490.1,130.62L490.45,131.52L490.64,132.55L490.63,133.35L489.87,134.66L489.89,135.27L490.21,136L491.39,137.74L491.65,137.91L493.03,138.01L493.72,138.4L494.31,139.26L494.84,140.51L495.11,141.7L494.99,143.04L495.47,144.64L495.33,145.95L495.69,146.6L496.48,147.55L497.28,148.18L497.63,148.28L497.92,148.13L498.13,147.43L498.6,146.95L499.86,146.4L500.92,146.61L504.82,147.99L505.11,148L505.33,147.82L506.23,146.77L506.86,146.41L507.73,146.42L510.15,147.15L513.05,147.49L514.48,148.09L516.73,148.03L519.18,148.79L519.54,148.65L519.66,148.43L519.51,147.95L519.62,147.07L520.3,146.12L520.63,145.27L521.22,144.86L521.95,144.7L522.49,144.83L522.94,145.39L523.41,146.28L524.12,148.6L524.56,149.46L525.14,150.25z"
				},
				{
					"id":"US-IL",
					"title":"Illinois",
					"d":"M900.5,209.48L900.8,212.94L901.31,215.79L901.93,217.02L902.58,217.91L903.27,218.45L904.16,220.25L905.26,223.31L906.2,225.3L906.87,226.09L907.4,232.01L908,238.65L908.59,245.29L909.19,251.93L909.79,258.57L910.38,265.2L910.98,271.84L911.54,278.11L911.54,278.21L910.81,278.96L910.37,280.18L910.63,281.43L910.51,282.36L910,282.95L910.39,284.3L911.69,286.4L912.55,288.51L912.97,290.64L912.91,292.2L912.1,293.68L911.47,296.79L910.81,298.07L909.89,298.56L909.15,299.76L908.56,301.68L907.84,302.64L907,302.66L906.4,303.06L906.06,303.83L906.18,304.59L906.76,305.35L906.66,306.11L905.88,306.87L905.92,307.2L906.2,307.38L906.13,307.72L905.63,308.09L905.4,309.15L905.58,310.84L905.37,311.71L904.81,311.8L904.78,312.27L905.88,314.11L905.37,314.56L904.52,316.22L904.47,317.99L905.22,319.85L903.89,321.52L900.48,323L898.7,324.19L898.57,325.11L898.93,326.47L899.78,328.26L900.01,329.52L899.62,330.27L897.06,330L892.33,328.69L889.26,328.99L887.83,330.89L887.39,332.28L887.66,333.37L886.3,332.12L885.42,331.58L885.26,331.64L885.09,331.81L885.05,332.23L885.11,332.53L885.27,332.86L885.21,333.09L885.02,333.12L884.08,332.66L882.87,331.26L881.39,328.91L880.97,326.98L881.59,325.49L881.48,323.97L880.64,322.43L880.17,320.9L880.06,319.38L878.14,317.23L874.42,314.44L871.72,312.74L870.02,312.14L868,310.74L865.65,308.56L864.37,306.85L864.15,305.63L864.95,302.28L867.38,294.94L867.65,294.08L867.72,293.76L867.57,293.46L867.28,293.18L866.01,292.42L863.64,291.85L861.47,291.58L859.81,292.54L858.21,290.9L856.68,286.66L853.28,282.29L848.02,277.77L844.96,274.67L844.07,272.99L843.24,270.45L842.47,267.04L842.36,264.19L843.17,260.73L844.02,260.3L844.14,259.17L843.81,257.2L844.67,255.66L846.71,254.54L848.5,252.21L850.03,248.68L850.67,246.17L850.43,244.69L849.72,243.32L848.55,242.05L848.2,240.41L848.66,238.4L850.42,237.05L853.48,236.34L856.22,235.17L858.63,233.56L860.02,231.88L860.39,230.13L861.02,228.74L861.93,227.72L862.51,226.11L862.77,223.91L862.72,222.3L862.35,221.29L861.19,220.16L859.23,218.93L858.1,217.72L857.78,216.55L856.72,215.33L854.91,214.06L853.82,212.6L861.38,212.2L868.79,211.76L876.19,211.29L883.6,210.78L891,210.23L898.4,209.65z"
				},
				{
					"id":"US-IN",
					"title":"Indiana",
					"d":"M952.11,221.76L952.94,228.96L953.78,236.15L954.61,243.34L955.44,250.52L956.27,257.71L957.1,264.9L957.93,272.08L958.81,279.4L958.56,279.64L958.28,280.64L958.83,281.55L958.91,282.33L958.51,282.99L958.73,283.42L959.58,283.62L959.97,284.27L959.91,285.37L958.31,286.68L955.13,288.32L954.46,288.77L953.88,288.99L953.59,288.95L953.59,288.95L953.13,288.77L952.46,288.34L951.39,288.24L949.71,288.6L949.15,289.71L949.71,291.58L949.3,293.12L947.9,294.31L946.97,295.79L946.5,297.53L945.58,298.66L944.19,299.18L943.21,300.86L942.63,303.7L941.85,305.51L940.87,306.28L939.42,306.27L937.49,305.48L936.33,304.58L935.93,303.56L935.32,302.87L934.79,302.59L934.46,302.62L934.46,302.78L934.62,303.06L934.48,303.39L933.37,303.62L932.93,304.1L933.16,304.84L932.97,305.4L932.35,305.79L932.08,306.54L932.16,307.68L931.8,308.76L931.01,309.79L929.69,309.6L927.82,308.21L926.06,308.03L924.38,309.05L923.19,310.32L922.46,311.84L921.67,312.28L920.36,311.3L917.36,310.06L915.84,309.87L914.8,310.34L914.03,310.25L913.74,309.85L913.52,309.7L913.33,309.92L913.43,311.25L913.25,312.11L912.79,312.5L912.4,312.26L912.05,311.38L911.41,311.15L910.47,311.55L909.48,311.5L908.57,311.04L908.27,311.13L908.05,311.4L908.21,312.43L908.1,313.27L907.7,313.84L907.07,314.02L906.21,313.82L905.88,314.11L904.78,312.27L904.81,311.8L905.37,311.71L905.58,310.84L905.4,309.15L905.63,308.09L906.13,307.72L906.2,307.38L905.92,307.2L905.88,306.87L906.66,306.11L906.76,305.35L906.18,304.59L906.06,303.83L906.4,303.06L907,302.66L907.84,302.64L908.56,301.68L909.15,299.76L909.89,298.56L910.81,298.07L911.47,296.79L912.1,293.68L912.91,292.2L912.97,290.64L912.55,288.51L911.69,286.4L910.39,284.3L910,282.95L910.51,282.36L910.63,281.43L910.37,280.18L910.81,278.96L911.54,278.21L911.54,278.11L910.98,271.84L910.38,265.2L909.79,258.57L909.19,251.93L908.59,245.29L908,238.65L907.4,232.01L906.87,226.09L906.99,226.24L907.67,226.74L908.2,227.02L908.57,227.03L908.82,227.5L909.79,227.71L911.51,227.67L913.06,227.32L914.44,226.67L917.73,224.3L921.83,223.89L926.85,223.36L931.88,222.82L936.9,222.26L941.92,221.68L946.93,221.09L951.95,220.48z"
				},
				{
					"id":"US-KS",
					"title":"Kansas",
					"d":"M790.34,337.58L786.22,337.64L782.1,337.68L777.98,337.72L773.86,337.75L769.74,337.76L765.62,337.77L761.5,337.76L757.38,337.75L753.26,337.72L749.14,337.68L745.02,337.63L740.9,337.58L736.78,337.51L732.67,337.43L728.55,337.34L724.43,337.24L720.31,337.13L716.19,337.01L712.07,336.88L707.95,336.74L703.84,336.59L699.72,336.42L695.6,336.25L691.49,336.07L687.37,335.87L683.26,335.67L679.14,335.45L675.03,335.23L670.91,334.99L666.8,334.75L662.69,334.49L658.58,334.22L658.84,330.06L659.1,325.9L659.36,321.74L659.63,317.58L659.89,313.42L660.15,309.27L660.42,305.11L660.68,300.95L660.94,296.79L661.21,292.63L661.47,288.47L661.73,284.31L661.99,280.15L662.26,275.99L662.52,271.83L662.79,267.67L666.36,267.91L669.94,268.13L673.51,268.35L677.09,268.56L680.67,268.76L684.25,268.95L687.83,269.13L691.41,269.31L694.98,269.48L698.56,269.64L702.14,269.79L705.73,269.93L709.31,270.06L712.89,270.19L716.47,270.31L720.05,270.42L723.63,270.52L727.21,270.61L730.79,270.69L734.38,270.77L737.96,270.84L741.54,270.9L745.13,270.95L748.71,270.99L752.29,271.03L755.88,271.06L759.46,271.07L763.04,271.08L766.63,271.09L770.21,271.08L773.79,271.07L776.87,271.04L780.84,273.88L781.88,273.9L783.1,273.44L784.03,274.08L784.68,275.85L784.6,276.75L783.79,276.8L782.79,277.87L781.6,279.98L781.92,281.94L783.76,283.76L784.99,285.59L785.62,287.45L786.84,288.88L789.55,290.39L789.53,291.24L789.58,294.14L789.63,297.04L789.68,299.93L789.73,302.83L789.78,305.72L789.83,308.62L789.88,311.51L789.93,314.41L789.98,317.31L790.04,320.2L790.09,323.1L790.14,325.99L790.19,328.89L790.24,331.79L790.29,334.68z"
				},
				{
					"id":"US-KY",
					"title":"Kentucky",
					"d":"M998.81,288.4l0.49,0.55l0.68,3.23l-0.02,0.66l-0.39,1.42l0.14,0.7l0.67,1.03l2.23,2.28l0.33,0.96l0.88,0.86l0.84,1.35l2.45,2.8l3.48,2.09l2.52,0.3l-5.8,6.35l-2.75,2.39l-2.67,1.99l-0.2,0.3l-0.4,1.81l-1.54,1.77l-0.87,1.76l-2.45,1.72l-1.62,2.1l-4.47,2.46l-2.56,0.99l-1.66,1.29l-0.13,0.07l-0.13,0.07l-0.13,0.07l-0.13,0.07l-0.13,0.07l-0.13,0.07l-0.13,0.07l-0.13,0.07l-6.2,0.61l-6.2,0.59l-6.2,0.56l-6.2,0.54l-6.2,0.52l-6.21,0.49l-6.21,0.47l-6.21,0.44l-5.92,0.73l-5.92,0.7l-5.93,0.68l-5.93,0.66l-0.59,-0.64l-1.58,-0.01l-2.42,-0.03l-0.09,0l0.91,2.21l0.19,1.98l-0.05,0.03l-2.8,0.24l-3.09,0.26l-3.09,0.26l-3.09,0.25l-3.09,0.24l-3.09,0.24l-3.09,0.23l-3.55,0.26l0.8,-2.01l0.79,-0.58l0.36,-0.13l0.93,0.29l0.44,0.09l0.9,-0.76l0.68,-2.06l0.32,-2.15l-0.04,-2.24l-0.7,-1.74l-0.27,-1.08l0.44,-1.39l1.43,-1.9l3.07,-0.3l4.72,1.3l2.56,0.27l0.39,-0.75l-0.23,-1.27l-0.85,-1.79l-0.36,-1.35l0.14,-0.92l1.77,-1.19l3.41,-1.48l1.33,-1.67l-0.75,-1.86l0.05,-1.76l0.84,-1.67l0.51,-0.44l0.33,-0.29l0.85,0.2l0.63,-0.19l0.4,-0.57l0.11,-0.84l-0.16,-1.03l0.22,-0.27l0.31,-0.09l0.91,0.46l0.99,0.05l0.94,-0.41l0.64,0.24l0.34,0.88l0.4,0.24l0.46,-0.4l0.18,-0.86l-0.1,-1.32l0.19,-0.22l0.21,0.16l0.3,0.39l0.77,0.09l1.04,-0.47l1.52,0.18l3,1.24l1.31,0.98l0.8,-0.44l0.72,-1.53l1.2,-1.27l1.67,-1.02l1.76,0.19l1.86,1.39l1.33,0.18l0.79,-1.03l0.36,-1.08l-0.08,-1.13l0.27,-0.76l0.62,-0.38l0.19,-0.56l-0.24,-0.74l0.44,-0.48l1.11,-0.23l0.14,-0.33l-0.16,-0.28l0,-0.15l0.33,-0.03l0.53,0.28l0.62,0.69l0.39,1.02l1.16,0.9l1.93,0.79l1.45,0.01l0.98,-0.77l0.78,-1.81l0.58,-2.84l0.98,-1.68l1.39,-0.52l0.92,-1.13l0.46,-1.75l0.93,-1.47l1.4,-1.2l0.42,-1.53l-0.57,-1.87l0.56,-1.11l1.69,-0.36l1.07,0.1l0.67,0.43l0.46,0.18h0l0.29,0.04l0.58,-0.22l0.67,-0.45l3.18,-1.64l1.6,-1.31l0.06,-1.1l-0.39,-0.65l-0.84,-0.19l-0.22,-0.43l0.4,-0.66l-0.08,-0.79l-0.55,-0.91l0.28,-1l0.24,-0.24l0.87,-0.85l1,-0.21l0.89,0.66l1.16,0.05l1.42,-0.56l1.39,0.09l1.35,0.74l1.38,1.51l1.4,2.27l2.16,1.22l2.91,0.16l2.2,0.67l1.49,1.19l1.13,0.29l1.17,-0.91l1.29,-0.56l1.4,0.26l1.95,0.9l2.62,-0.63l3.27,-2.15l2.07,-0.22l0.88,1.73l1.77,1.68l2.66,1.64L998.81,288.4zM882.52,344.65l-1.25,0.13l-0.07,-0.26l0.04,-0.62l0.08,-0.28l0.25,-0.07l0.29,-0.01l0.45,0.55L882.52,344.65z"
				},
				{
					"id":"US-LA",
					"title":"Louisiana",
					"d":"M891.95,485.19l-1.27,0.69l-7.27,-1.81l-1.89,-1.73l-1.59,-0.29l-1.94,-0.1l-1.93,2.41l-1.39,3.17l2.6,1.53l2.19,0.67l3.49,-0.91l1.85,-1.62l1.6,-0.06l0.74,-0.36l0.64,-0.83l1.4,0.52l0.09,0.61l-0.91,0.93l-1.17,0.81l-0.68,0.91l1.51,1.64l2.23,0.43l0.81,-0.31l0.37,-1.99l1.25,-1.35l1.84,0.14l-0.2,0.81l0.31,0.73l0.93,1.21l0.04,1.83l0.2,0.43l-1.91,0.95l-1.45,0.38l-1.1,1.14l0.66,0.57l-1.16,0.62l-0.83,-0.16l-0.39,0.23l-0.08,0.65l-0.58,0.64l1.03,1.75l1.94,1.05l1.41,1.39l5.41,1.56l1.27,-0.15l1.41,1.87l1.06,0.6l1,0.27l-0.01,1.36l-1.66,1.12l-0.38,1.21l-0.39,0.7l-0.85,-0.78l-0.85,-0.55l-1.73,1.99l-0.87,0.46l0.3,-2.03l-0.76,-0.73l-1.21,-1.92l-1.64,-1.13l-1.12,-0.33l-0.9,-0.72l-1.05,-0.24l-0.87,0.14l-1.51,-0.35l-0.17,-1.06l-0.47,-0.77l-1.22,-0.86l-5.65,-1.41l0.01,0.74l0.42,0.53l0.82,0.32l1,0.65l0.13,2.12l-0.35,0.93l-0.09,1.29l-0.28,1.33l-0.61,1.07l-1.47,0.8l-0.71,-0.54l-1.26,-2.74l-1.58,-0.79l-2.43,0.04l-1.61,0.73l-1.64,2.82l-1.42,0.53l-5.05,-1.13l-5.78,-1.84l0.11,-0.72l0.88,-0.28l1.72,0.2l-0.13,-0.73l-1.87,-2.3l-0.38,-1.06l0.16,-1.33l-0.57,0.06l-0.99,1.16l-3.65,-0.76l-1.05,-1.07l-2.26,-3.06l-2.98,0.04l-1.43,-1.85l-2.39,0.91l-1.19,0.94l-1.02,1.42l0.45,0.7l1.13,1.09l-0.47,0.57l-3.44,0.95l-8.1,-0.59l-2.39,-0.76l-3.22,-1.68l-4.42,-1.31l-2.11,-0.17l-2.05,0.35l-6,0.31l-1.38,0.42l-1.17,0.65l-0.79,-0.67l-0.38,-1.21l0.69,-0.21l0.76,-0.74l0.67,-1.44l0.06,-0.86l-0.5,-0.55l1.25,-2.27l0.3,-0.81l-0.3,-3.81l-0.61,-1.37l0.05,-0.8l0.56,-2.1l-0.14,-1.91l1.01,-2.32l0.75,-1.22l0.82,-2.48l0.16,-1.59l0.34,-1.2l-0.29,-1.27l0.59,-0.94l-0.44,-1.29l-0.17,-1.71l-0.77,-0.64l-1.39,-2.49l0.01,-1.11l-1.45,-2.33l-0.05,-0.81l-1.36,-1.2l-0.28,-0.78l-0.19,-3.27l-0.38,-0.95l-1.18,-1.85l-2.7,-2.67l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l-0.06,-2.83l3.38,-0.08l3.38,-0.09l3.38,-0.09l3.38,-0.1l3.38,-0.11l3.38,-0.11l3.38,-0.12l3.38,-0.13l3.38,-0.13l3.38,-0.14l3.38,-0.15l3.38,-0.15l3.38,-0.16l3.38,-0.17l3.37,-0.17l3.68,-0.21l0.17,1.09l0.94,0.6l0.11,1.17l-0.71,1.74l0.07,1.18l0.86,0.62l0,0.71l-0.87,0.79l-0.09,0.81l0.68,0.83l0.34,0.99l0,1.14l0.92,1.44l1.36,0.88l0.92,1.08l0.11,0.61l0.09,0.57l-0.15,0.84l-1.01,1.28l-0.78,0.93l-0.48,0.35l-0.24,0.62l0,1.31l-1.13,1.74l-2.37,2.07l-1.51,2.55l-0.66,3.03l-0.75,1.94l-0.85,0.86l-0.37,1.58l0.11,2.32l-0.51,1.31l-1.13,0.3l-0.18,1.34l0.78,2.38l-0.23,1.02l-0.76,0.83l-0.04,0.62l4.61,-0.21l4.63,-0.24l4.63,-0.25l4.63,-0.26l4.63,-0.28l4.63,-0.29l4.63,-0.3l4.63,-0.31l-0.39,2.61l-1.12,3.57l0.01,0.91l0.43,1.11l0.04,0.64l0.57,0.91l1.18,0.87l1.08,1.36l1.05,2.49l0.31,1.16l0.84,1.59l0.4,0.28l0.54,0.15L891.95,485.19zM897.91,487.2l0.15,1.04l-0.99,-0.45l-1.42,0.06l0.6,-0.4l0.41,-0.38l0.19,-0.39l1.69,-1.43l-0.43,0.99L897.91,487.2zM906.12,492.79l-0.49,0.76l0.27,-3.46l-0.98,-2.82l0.9,1.2l0.38,1.48L906.12,492.79zM905.08,495.02l-0.97,1.26l0.01,-0.45l0.69,-1.24l0.52,-0.5L905.08,495.02zM848.42,503.32l-0.71,0.36l-3.34,-1.8l-0.24,-0.83l1.57,-0.83l0.98,0.02l1.59,0.92l0.58,0.25l0.28,0.39l-0.12,0.63L848.42,503.32z"
				},
				{
					"id":"US-MA",
					"title":"Massachusetts",
					"d":"M1173.41,150.21l-0.05,1.21l0.77,0.97l0.62,1.05l1.04,0.91l0.64,-0.07l0.61,-0.39l0.5,-0.09l0.45,0.38l0.02,0.61l-0.73,0.36l-1.15,1.4l-1.15,0.74l-0.29,1.38l-0.55,1.65l-1.23,2.68l0.98,0.44l3.06,-0.06l1.49,0.41l3.07,3.49l-0.32,0.53l0.04,0.79l2.01,0.54l1.38,2.74l1.69,0.58l2.28,0l2.31,-1.62l1.78,-1.83l-0.37,-0.96l-2.01,-1.9l-0.64,-0.98l-1.2,-0.41l-0.2,0.7l-0.87,-0.58l-0.2,-0.41l0.54,-0.38l0.72,-0.12l0.93,0.16l2.82,1.89l1.54,3.11l0.74,2.04l-0.03,0.78l-0.65,0.03l-1.12,0.48l-5.22,2.69l-0.96,1.31l-2.53,1.84l-0.32,-0.46l-0.1,-1.12l-0.8,-2.13l-0.58,0.06l-3.38,4.81l-1.64,0.7l-1.14,1.44l-0.48,-0.49l-1,-2.6l0.26,-2.49l-0.46,0.17l-0.66,1.05l-0.81,-0.8l-0.73,-0.35l-0.72,-0.34l-0.2,-0.81l-0.31,-1.22l-0.73,-0.05l-0.49,-1.47l-0.32,-0.95l-1.2,0.35l-0.98,0.29l-1.58,0.46l-1.64,0.48l-1.2,0.35l-0.08,-0.23l-1.92,0.49l-1.92,0.49l-1.92,0.48l-1.92,0.48l-1.92,0.48l-1.93,0.48l-1.92,0.47l-1.93,0.47l0.04,0.52l-0.67,0.25l-0.17,-0.56l-1.37,0.29l-1.37,0.29l-1.37,0.29l-1.37,0.29l-1.37,0.29l-1.37,0.29l-1.37,0.29l-1.37,0.28l-0.56,-0.42l0.05,-1.94l0.05,-1.94l0.05,-1.94l0.05,-1.94l0.05,-1.94l0.04,-1.94l0.04,-1.94l0.04,-1.94l1.58,-0.34l1.58,-0.34l1.58,-0.34l1.58,-0.35l1.58,-0.35l1.58,-0.35l1.58,-0.35l1.58,-0.35l2.28,-0.52l2.28,-0.53l2.28,-0.53l2.27,-0.54l2.27,-0.54l2.27,-0.54l2.27,-0.55l2.27,-0.55l1.22,-0.97l1.16,-2.14l0.89,-0.64l1.33,-1.45l0.74,-0.44L1173.41,150.21zM1187.32,180.98l-4.14,2.32l-0.9,-0.47l1.02,-0.63l0.94,-2l0.87,-0.45l1.72,0.49L1187.32,180.98zM1196.58,180.85l-1.14,0.71l-3.1,0.05l2.17,-1.36l0.32,-0.35l0.02,-1.07l-0.11,-0.5l1.52,1.85L1196.58,180.85z"
				},
				{
					"id":"US-MD",
					"title":"Maryland",
					"d":"M1109.83,238.85l0.94,3.4l0.94,3.4l0.94,3.4l0.94,3.4l0.94,3.4l0.94,3.4l0.94,3.4l0.95,3.39l0.04,-0.01l0.04,-0.01l0.04,-0.01l0.04,-0.01l0.04,-0.01l0.04,-0.01l0.04,-0.01l0.04,-0.01l1.72,-0.39l3.77,-0.87l3.77,-0.88l1.82,-0.44l0.13,0.64l0.01,0.99l-0.31,0.47l-0.21,-0.96l-0.36,-0.27l-0.36,0.52l-0.19,0.54l0.31,1.89l-0.1,1.01l-1.05,0.54l-0.56,2.71l-0.74,1.63l-0.18,0.96l-1.55,0.59l-2.5,0.93l-0.45,1.13l-1.4,-0.13l-1.97,0.49l0.07,-1.41l0.31,-1.3l-1.29,-0.93l-0.65,-0.01l-0.74,-0.33l0.52,-1.14l0.13,-1.11l-0.5,-1.2l0.1,-1.01l-0.48,0.26l-0.6,1.18l-0.43,0.51l-0.51,-0.81l-0.31,0.28l-0.1,0.66l-0.45,0.45l-1.3,-0.58l-1.83,-0.59l-1.27,-1.43l-0.79,-1.15l0.02,-2.4l1.03,-0.65l1.54,0.05l1.91,-0.43l-0.38,-0.45l-0.66,0.23l-2.42,-1.41l-0.89,-0.98l-1.18,-0.06l-0.27,1.19l-0.5,0.41l0.18,-2.51l0.88,-0.3l1.19,-0.95l-0.69,-1.28l-0.98,-0.41l-1.36,1.08l-0.19,-0.96l0.02,-1.29l1.15,-0.25l1.09,0.18l0.42,-2.17l-0.16,-0.9l-1.13,1.6l-0.93,-2.71l0.8,-2.99l1.07,-1.46l1.66,-0.34l1.64,-0.57l-1.17,-0.25l-1.14,-0.02l0.58,-1.24l0.65,-0.34l0.47,-1.08l-1.6,0.5l-0.2,-1.79l-0.72,0.53l-0.91,0.38l-0.21,0.82l0.35,1.21l-0.1,0.87l-0.6,0.81l-1.14,0.78l-0.32,-0.85l-0.5,-0.3l0.26,1.91l-0.19,0.71l-1.3,-1.56l-0.2,0.42l0.14,0.49l-0.04,0.92l-0.69,0.62l0.29,1.1l-0.17,0.67l-2.74,-0.41l0.01,0.34l1.88,1.77l1.2,0.48l0.38,1.1l-0.69,1.14l-1.42,-0.54l-0.2,0.1l0.98,1.24l0.69,1.12l-0.21,1.11l0.34,1.24l0.15,1.16l-0.05,1.05l1.6,4.44l1,1.08l0.98,1.03l0.63,1.03l-0.73,0.33l-1.42,-0.65l-1.22,-0.47l-1.76,-1.96l-0.4,-0.84l-0.46,-0.64l0.5,1.58l0.84,1.71l4.87,3.17l1.08,1.39l0.83,1.09l0.11,1.2l-1.22,-0.6l-1.13,-0.86l-2.64,-0.67l-3.17,-0.1l-2.29,-2.41l0.25,1.15l-0.17,1.06l-1.29,-0.97l-0.87,-0.88l-0.46,-1.07l-1.27,0.35l-1.15,1.26l-1.36,0.04l-0.55,-1.86l0.14,-1.08l0.97,-2.68l1.13,-1.5l0.28,-1.69l-0.72,-2.38l0.56,1.76l1.13,-2.1l-1.27,-1.19l-1.18,-1.1l-1.04,1.77l-1.27,-0.31l-2.27,-1.44l-3.32,-0.66l-0.57,-0.56l-0.09,-0.72l0.2,-1.08l-1.14,-0.78l-2.47,-0.49l-1.14,-0.6l-0.24,-0.13l-0.3,-0.98l-0.42,-0.57l-0.55,-0.17l-0.18,-0.41l0.18,-0.65l-0.44,-0.57l-1.06,-0.49l-0.44,-0.53l0.18,-0.58l-0.52,-0.15l-1.21,0.29l-1.3,-0.25l-1.39,-0.78l-1.44,0.11l-2.23,1.5l-1.32,0.52l-0.49,0.69l-0.1,1.05l-0.5,0.61l-1.34,0.27l-0.22,0.01l-1.59,-0.03l-1.2,-0.41l-0.25,-0.22l0.02,-0.55l-0.25,-0.2l-0.34,0.02l-0.25,0.36l-0.14,0.99l-2.17,3.05l-1.37,-0.27l-0.48,0.11l-3.03,4.28l-1.02,0.78l-1.88,2.03l-0.47,-2.8l-0.47,-2.81l-0.47,-2.81l-0.47,-2.81l3.9,-0.72l3.89,-0.73l3.89,-0.74l3.89,-0.75l3.89,-0.76l3.89,-0.77l3.88,-0.78l3.88,-0.79l3.88,-0.8l3.88,-0.81l3.88,-0.82l3.87,-0.83l3.87,-0.84l3.87,-0.85l3.87,-0.86L1109.83,238.85zM1127.65,273.11l-0.44,0.17l0.28,-0.86l0.67,-3.98l0.38,-1.41l-0.06,2.7l-0.6,2.61L1127.65,273.11z"
				},
				{
					"id":"US-ME",
					"title":"Maine",
					"d":"M1172.07,47.54l0.21,0.43l0.91,0.6l1.13,0.25l0.79,-0.04l0.86,-0.27l2.01,-1.8l2.53,-1.55l1.31,-1.12l0.08,-0.7l0.62,-0.43l1.16,-0.16l2.51,0.89l3.1,1.55l2.45,1.22l1.07,3.13l1.11,3.32l1.17,3.5l0.83,2.5l1.15,3.43l0.92,2.72l1.2,3.55l0.64,1.9l0.44,0.47l0.08,0.8l0.05,0.4l0.11,0.29l0.23,0.34l0.15,0.53l-0.09,0.55l0.05,0.59l0.25,0.91l0.44,0.47l0.54,0.18l0.37,-0.12l0.58,0.17l0.8,0.38l1.09,0.2l1.02,-0.14l0.63,-0.34l0.91,0.06l0.54,0.71l0.09,0.8l-0.34,0.5l-0.4,0.43l0.1,0.6l0.44,0.52l0.52,0.41l0.69,0.8l0.1,0.85l-0.13,0.79l0.07,0.75l0.49,0.5l1.05,0.54l0.75,0.61l0.92,0.17l0.27,-0.42l0.17,-0.5l0.22,-0.4l0.6,0l0.71,0.02l0.78,0.04l0.13,0.68l0.78,0.95l1.02,1.99l-0.19,1.12l0.52,1.23l1.52,-0.1l0.47,0.27l0.22,0.44l-2.03,4.25l-2.77,0.4l-1.14,1.32l-1.41,0.73l-0.19,1.66l-0.72,0.57l-1.15,0.27l-1.1,-0.1l-0.68,0.44l-0.2,2.94l-0.92,0.04l-0.04,1.05l-0.31,0.55l-0.54,0.56l-0.93,-0.98l-0.71,-0.99l-0.61,-0.07l-0.79,-0.06l-0.72,0.24l-0.43,0.31l-0.38,0.9l-0.68,0.89l-0.82,-0.3l-0.77,-0.66l-0.03,1.46l-0.21,1.59l0.61,1.59l0.03,1.05l-0.69,-0.07l-0.87,-0.66l-1.91,-0.15l-1.34,0.48l0,-0.99l0.88,-1.69l-0.47,-0.13l-0.57,0.38l-0.33,-0.1l0.08,-1.32l-0.36,-1.31l-0.43,0.63l-0.3,1.6l-1.41,1.63l0.64,1.81l-0.5,4.26l0.41,1.62l-0.67,1.6l-1.04,1.51l-1.92,0.24l-1.11,1.38l-0.38,1.31l-0.57,0.35l-0.74,-1.3l-0.36,-0.36l0.1,2.21l-0.49,0.28l-0.63,-1.4l-0.54,-0.89l-0.47,1.04l0.18,2.35l-0.55,-0.04l-0.4,-0.77l-0.43,-0.14l0.15,0.97l0.57,1.27l-0.05,0.78l-0.61,-0.23l-0.69,-0.49l-0.68,0.72l-0.7,0.42l-0.19,-0.65l-0.09,-0.83l-1.38,0.88l-1.38,1.99l-0.82,2.43l0.59,0.19l0.74,0.48l-1.54,3.84l-1.7,3.54l-0.59,5.14l-0.61,0.76l-0.42,1.03l-1.83,-1.65l-0.71,-1.55l-1.96,-1.51l-0.93,-1.16l-0.6,-1.42l-0.37,-1.61l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.79,-2.35l-0.71,-2.1l0.28,-0.43l0.75,-0.87l0.63,-0.08l0.77,0.77l0.6,0.49l0.45,-0.32l0.18,-0.98l-0.35,-1.19l0.35,-1l0.66,-0.33l0.65,-0.16l0.2,-0.5l-0.2,-0.57l-0.5,-0.87l-0.24,-1.15l1.03,-2.45l1.57,-1.92l0.49,-0.87l-0.2,-1.43l0.71,-1.75l0.32,-0.98l-0.07,-0.75l-0.54,-0.79l-0.46,-1.68l-0.2,-2.11l-0.17,-2.31l0.45,-2.26l1.05,-2.63l-0.39,-2.93l-0.42,-3.1l1.16,-3.48l1.3,-3.95l0.74,-2.25l1.31,-4.08l0.92,-2.91l0.5,-1.36l0.47,-1.58l1.53,-0.04l1.52,-0.04l0.38,1.97L1172.07,47.54zM1204.73,106.9l-0.76,0.7l-1.03,0.13l0.37,1.12l0.02,0.44l-1.26,-0.24l-0.51,-0.25l-0.43,-1.5l0.51,-1.71l0.55,-0.78l1.06,0.09l1.22,1.35L1204.73,106.9zM1198.97,111.9l-0.45,0.6l-0.66,0.06l-0.35,-1.05l0.08,-0.41l0.17,-0.23l0.41,0.2L1198.97,111.9z"
				},
				{
					"id":"US-MI",
					"title":"Michigan",
					"d":"M872.31,89.88l-0.05,0.38l0.56,0.07l-0.08,0.19l-0.57,0.38l-1.64,0.82l-1.12,0.31l-0.6,-0.2l-0.09,-0.46l0.41,-0.71l-0.03,-0.34l-0.47,0.04l0.09,-0.27l0.66,-0.58l5.63,-3.85l2.42,-1.44l1.31,-0.5l0.23,0.17l-1.35,1.39l-0.19,0.54l0.08,0.34l-0.42,0.71l-4.13,2.72L872.31,89.88zM884.76,105.02l-0.22,0.75l0.09,0.43l-1.7,2.07l-0.57,1.27l-0.55,0.24l-0.52,-0.79l-0.05,-0.66l0.42,-0.54l0.39,-0.75l-0.03,-0.99l-0.2,-0.34l-0.49,0.93l0.33,0.16l0.11,0.14l-0.08,0.33l-2.17,-0.29l-0.7,-0.64l0.03,-0.97l0.61,-1.29l2.34,-2.83l1.06,-0.82l3.1,-1.43l1.74,-0.42l1.77,-0.16l1.32,0.26l0.87,0.68l-0.71,0.57l-3.46,0.74l-0.08,0.15l0.7,0.35l0.15,0.28l-0.55,0.82L884.76,105.02zM945.65,114.44l0.51,0.23l0.38,0.46l0.98,1.27l0.52,0.88l0.42,1.35l0.23,0.44l0.08,0.81l-0.47,0.62l-0.09,0.45l0.38,0.39l1.84,-0.12l0.89,0.32l0.38,0.44l-0.14,0.56l0.19,0.55l0.53,0.54l1.58,0.71l0.42,0.38l-0.04,0.47l-0.4,0.35l-0.75,0.24l-5.72,-0.12l-1.67,0.07l-0.2,0.34l-0.15,0.07l-0.28,-0.05l-0.48,0.04l-0.27,-0.17l-0.27,-0.54l-0.54,-0.3l-0.79,-0.06l-0.61,0.51l-0.57,1.78l0.16,0.3l0.01,1.1l0.24,0.27l0.02,0.25l-0.19,0.23l-0.46,0.03l-0.73,-0.17l-2.95,-2.23l-2.15,-1.03l-2.58,-0.64l-2.01,-0.23l-1.44,0.19l-1.11,0.79l-0.78,1.39l-1.36,0.9l-1.94,0.4l-1.03,0.46l-0.11,0.53l-0.71,0.09l-1.3,-0.35l-1.31,0l-1.31,0.36l-0.92,0.61l-0.86,1.69l-0.12,0.8l-0.68,0.75l-1.88,1.27l-0.06,0.4l-0.92,1.31l-0.26,0.7l0.07,0.65l-0.36,0l-0.78,-0.66l-0.13,-0.98l0.53,-1.3l0.52,-0.66l0.51,-0.01l0.26,-0.58l0,-1.14l-0.24,-0.55l-0.97,0.33l-0.47,0.51l-0.65,0.16l-0.82,-0.18l-0.64,0.69l-0.46,1.55l-0.63,1.05l-0.8,0.55l-0.62,-0.45l-0.44,-1.45l-0.12,-1.17l0.2,-1.44l-0.2,-0.26l-0.31,0.48l-0.42,1.23l-0.46,2.63l-0.38,0.88l-0.58,0.41l-0.83,1.64l-1.08,2.88l-1.26,2.81l-1.45,2.74l-0.89,1.48l-0.32,0.23l-0.11,0.48l0.04,1.09l-0.78,-0.23l-0.72,-0.82l-0.47,-0.86l-0.12,-0.92l0.71,-2.37l0.05,-0.38l-0.12,-0.2l-0.53,-0.21l-1.1,0.51l-1.14,0.18l-0.38,-0.12l-0.18,-0.38l-0.04,-0.61l0.17,-0.75l0.57,-1.41l-0.11,-1.28l0.25,-0.76l-0.43,-1.33l0.02,-0.65l-0.55,-0.67l-1.38,-0.82l-3.13,-0.98l0.18,-1.42l-0.17,-0.59l-0.82,-0.83l-3.25,-0.78l-2.19,-0.29l-2.13,0.16l-1.55,-0.26l-1.72,0.01l-1.15,-0.54l-1.14,-0.54l-1.14,-0.55l-1.14,-0.55l-1.98,-0.39l-1.98,-0.4l-1.98,-0.4l-1.98,-0.4l-1.98,-0.4l-1.97,-0.41l-1.97,-0.41l-1.97,-0.41l-0.49,-0.91l-0.49,-0.91l-0.49,-0.91l-0.49,-0.91l-0.91,-0.34l-0.48,-0.18l-0.38,-0.47l-0.78,0.26l-0.36,-0.79l0.07,-0.18l1.01,-0.28l2.82,-1.35l2.38,-1.58l1.93,-1.81l2.48,-1.2l3.02,-0.59l2.14,-0.75l1.25,-0.91l1.64,-1.71l0.95,-0.54l1.23,-0.24l0.89,-0.68l0.54,-1.13l1.09,-1.32l1.63,-1.51l0.95,-0.64l0.27,0.24l0.13,0.48l-0.01,0.72l0.48,0.54l0.97,0.36l0.47,0.55l-0.02,0.73l0.3,0.6l0.63,0.46l0.25,1.1l-0.13,1.74l0.06,1.11l0.25,0.49l0.23,0.27l0.31,-0.3l0.37,-0.64l0.12,-0.38l0.07,-0.39l2.41,-1.95l0.49,-0.13l0.88,0.37l3.92,0.28l1.57,0.31l1.7,0.85l0.58,0.33l2.27,3.02l1.01,1.17l0.59,0.29l0.36,0.46l0.37,1.1l0.34,0.31l2.91,-0.04l1.29,-0.33l0.75,-0.54l0.91,0.21l1.08,0.95l0.99,0.2l0.9,-0.56l0.89,-0.07l0.88,0.4l0.42,0.32l0.25,-0.04l1.48,-1.77l1.83,-1.62l2.47,-1.81l1.45,-0.85l0.44,0.12l2.37,-0.78l2.18,-0.29l2.93,-0.02l2.64,-0.67l2.35,-1.31l2.11,-0.83l1.88,-0.35l0.75,0.2l-0.38,0.75l-0.1,1.22l0.17,1.69l-0.03,1.08l-0.23,0.48l0.02,0.43l0.27,0.38l1.88,0.04l1.04,0.43l1.12,-0.11l1.19,-0.65l0.98,0.07l0.78,0.79l0.99,0.03l0.86,-0.75l0.59,-0.67l0.54,-0.33L945.65,114.44zM949.53,117.16l0.07,0.48l-0.49,-0.05l-0.44,-0.27l-0.38,-0.5l-0.57,-1.29l-0.73,-0.88l0.76,-1.2l0.52,-0.2l0.61,0.17l0.16,0.62l-0.29,1.07l0.16,1.04L949.53,117.16zM950.06,119.72l-0.2,0.15l-0.89,-0.77l-0.23,-0.51l0.06,-0.46l0.3,-0.06l0.54,0.34l0.33,0.44l0.13,0.53L950.06,119.72zM960.29,123.6l0.22,0.48l-0.27,0.78l-1.04,0.52l-2.21,0.26l-1.47,-0.09l-0.73,-0.43l-0.18,-0.25l-0.02,-0.59l0.31,-0.08l0.51,0.25l0.68,-0.23l0.85,-0.71l0.43,-0.5l0.01,-0.3l-0.37,-0.52l0.21,-0.27l1.2,0.05l0.49,0.31l0.96,1.15L960.29,123.6zM944.52,130.05l2.03,0.06l0.17,-0.2l0.64,0.52l0.15,0.48l-0.19,0.45l-0.32,0.27l-0.45,0.1l-0.77,-0.33l-1.32,-0.97L944.52,130.05zM941.4,131.08l1.17,0.27l2.16,1.12l2,0.56l1.82,0l1.37,0.31l0.92,0.63l0.7,0.75l0.49,0.87l0.93,0.4l1.37,-0.06l1.11,0.25l0.86,0.56l4.53,1.13l1.92,0.65l1.11,0.74l0.36,0.53l-0.01,0.57l0.18,0.58l0.9,1.06l0.29,0.06l0.25,0.54l0.21,1.01l0.31,0.65l0.42,0.29l-0.2,0.17l-1.41,-0.4l-0.73,0.28l-0.24,0.81l0.05,0.73l0.33,0.64l1.99,1.8l0.71,1.8l0.4,2.24l-0.09,0.91l0.09,1.96l0.28,3.01l0.11,1.03l-0.43,1.08l-1.34,1.65l-0.06,-0.27l-0.38,-0.02l-0.37,0.27l-0.39,1.31l-0.17,2.31l-0.41,1.3l-0.66,0.29l-0.37,0.38l-0.08,0.47l-0.7,0.41l-1.32,0.34l-0.83,0.81l-0.42,2.02l0.15,0.92l-0.16,1.19l0.15,0.98l0.47,0.77l1.2,0.67l1.92,0.57l1.1,-0.02l0.7,-0.44l0.59,-1.45l0.68,-0.63l0.89,-0.35l0.26,-0.66l1.14,-2.88l-0.08,-0.6l-0.58,-0.15l0.06,-0.18l0.69,-0.21l0.57,-0.45l0.44,-0.69l0.85,-0.59l2.13,-1.01l1.08,-0.97l0.74,-0.24l1.16,0.27l1.59,0.77l1.35,1.26l1.12,1.75l1.79,4.69l2.46,7.64l1.54,4.25l0.62,0.86l0.31,0.43l-0.23,6.3l-0.55,2.67l-1.41,1.71l-1.41,1.66l-1.67,2.68l-2.05,1.5l-1.04,0.86l-0.18,0.48l-0.29,-0.1l-0.42,1.38l-0.29,1.87l-0.02,1.42l0.3,0.73l-0.4,0.55l-0.71,1.03l-0.11,0.35l0.13,0.53l-0.14,0.29l-0.41,0.05l-0.27,0.3l-0.62,1.06l-0.96,2.69l-0.15,0.49l-0.15,0.16l-5.47,0.96l-5.48,0.94l-5.48,0.92l-5.48,0.9l-0.17,-1.29l-5.01,0.61l-5.02,0.59l-5.02,0.58l-5.02,0.56l-5.02,0.54l-5.02,0.53l-4.1,0.42l1,-0.73l1.62,-1.62l0.85,-1.38l0.77,-1.79l0.69,-2.19l1.53,-3.33l0.7,-1.99l0.61,-2.49l0.38,-2.58l0.16,-2.68l-0.09,-2.75l-0.33,-2.82l-0.75,-2.8l-1.16,-2.77l-0.62,-1.42l-0.22,-0.37l-1.93,-3.5l-2.26,-4.93l-0.02,-0.44l1.29,-3.22l0,-0.41l-0.43,-2.45l-0.47,-1.2l-0.99,-1.58l-0.02,-0.42l1.44,-2.3l0.83,-1.72l0.7,-2.06l0.34,-2.35l-0.01,-2.65l-0.2,-1.74l-0.38,-0.84l-0.04,-0.68l0.29,-0.51l1.7,-0.8l0.48,-1.1l-0.07,-1.83l0.26,-0.94l0.6,-0.05l0.51,-0.43l0.42,-0.82l0.65,-0.29l0.87,0.23l1.04,-1.25l1.2,-2.75l0.98,-1.57l0.76,-0.4l0.18,0.22l-0.41,0.83l-0.06,0.86l0.3,0.9l-0.06,0.91l-0.23,1.26l0.27,0.35l-0.42,2.03l0.08,0.98l0.48,0.7l0.43,-0.31l0.39,-1.33l0.08,-0.69l-0.23,-0.06l0.02,-0.55l0.26,-1.04l0.28,-0.51l0.3,0.02l0.15,0.53l-0.01,1.04l-0.57,2.52l-0.08,0.76l0.22,0.19l0.85,-1.64l0.58,-2.52l0.44,-1.93l0,-1.02l-0.5,-2.59l-0.08,-1.07l0.16,-0.77l0.78,-0.94l1.41,-1.11l1.44,-0.67l1.47,-0.24l1,-0.38l0.53,-0.51l-0.25,-0.33l-1.03,-0.14l-0.82,-0.49l-0.63,-0.83l-0.3,-1.01l0.03,-1.18l0.49,-1.21l0.96,-1.25l0.24,-0.86l-0.47,-0.48l0.44,-0.24l1.35,-0.01l0.91,-0.26l0.47,-0.51L941.4,131.08zM929.61,136.77l-0.52,0.17l-0.44,-0.21l-0.05,-1.05l0.33,-1.88l0.44,-0.9l0.76,0.25l-0.12,0.24l0.37,1.93l-0.16,0.89L929.61,136.77zM924.21,148.66l-0.15,0.34l-0.44,0.02l-0.38,-0.27l-0.45,-0.94l0.09,-0.23l0.87,0.05l0.34,0.38L924.21,148.66z"
				},
				{
					"id":"US-MN",
					"title":"Minnesota",
					"d":"M804.97,77.87l1.79,-0.33l1.54,0.03l1.55,0.07l0.84,0.15l2.42,0.91l1.59,0.76l2.3,1.42l1.27,0.62l0.66,1.54l0.78,1.99l1,-0.04l0.7,-1.21l1.9,-0.29l2.54,0.72l2.31,2.25l3.28,1.95l2,0.95l1.98,-0.1l2.46,-1.17l2.56,-2.15l1.9,-0.45l1.15,0.13l0.74,1.53l0.83,0.55l2.06,-0.3l4.34,0.04l3.41,-0.65l0.84,0.85l0.79,1.37l1.43,0.35l1.87,-0.58l3.01,0.1l-0.4,0.26l-0.44,-0.02l-0.55,0.38l-0.67,0.77l-1.58,1.14l-2.5,1.52l-2.91,1.42l-5.93,2.59l-3.65,2.52l-1.6,1.48l-6.18,7.29l-3.79,3.89l-6.21,5.48l-0.58,0.69l-0.02,0.61l-0.28,0l-1.01,1.3l-0.42,0.83l-1.04,0.27l0.13,3.23l0.13,3.23l0.13,3.23l0.13,3.23l-0.5,0.35l-0.62,0.78l-0.89,0.22l-4.11,2.82l-0.66,0.79l-0.7,1.8l-1.31,2.05l-0.31,1.08l0.11,1.43l2.16,1.08l0.83,1.08l0.43,1.34l-0.01,1.18l-0.99,2.34l-0.16,0.93l0.21,2.81l-0.51,0.9l0.52,2.26l0.06,0.79l-0.25,2.51l-0.21,0.74l0.47,1.28l0.05,0.14l2.08,1.73l1.74,0.93l1.54,0.26l1.22,0.72l0.91,1.18l1.2,0.75l1.48,0.32l1.54,0.95l2.4,2.38l1.24,2.06l2.07,1.42l3.32,1.46l2.2,1.31l1.07,1.16l0.83,3.06l0.88,6.55l-5.35,0.28l-5.27,0.25l-5.28,0.23l-5.28,0.21l-5.28,0.19l-5.28,0.17l-5.28,0.15l-5.28,0.14l-5.28,0.12l-5.28,0.1l-5.28,0.08l-5.28,0.06l-5.28,0.04l-5.28,0.02l-5.28,0l-5.28,-0.02l0.02,-5.01l0.02,-5.01l0.03,-5.01l0.02,-5.02l0.02,-5.02l0.03,-5.02l0.03,-5.02l0.02,-5.02l-1.19,-1.67l-2.61,-1.37l-0.65,-0.81l-1.2,-2.02l-0.47,-0.87l-0.08,-0.67l0.59,-0.74l2.39,-2.14l0.76,-0.99l0.38,-0.97l0.56,-2.23l-0.21,-1.72l0.17,-2.67l-0.47,-2.01l-0.1,-1l-0.29,-1.24l-1.74,-3.28l-0.4,-2.64l-0.43,-1.3l-0.11,-3.34l0.06,-0.94l0.37,-1.81l-0.73,-1.23l-0.1,-1.01l-0.27,-7.97l-0.22,-1.14l0.1,-3.7l-1.29,-3.91l-0.62,-1.33l-0.3,-1.61l0.03,-0.77l-1.05,-2.67l-0.68,-2.94l0.1,-2.54l-0.2,-1.92l0.1,-1.49l-0.17,-2.25l0.24,-1.27l0.04,-1.98l-1.37,-7.07l1.82,0.02l6.35,0.06l6.35,0.03l6.34,0l6.35,-0.03l3.51,0l0.01,-4.78l0.01,-3.77l3.2,0.42l0.96,0.68l0.31,0.32l-0.08,1.04l0.3,3.15l0.62,2.62l1.39,3.14l0,0.01l0.13,1.23l0.46,0.77l0.82,0.71l3.1,0.82l5.39,0.91l3.07,1.1l0.75,1.3l1.45,0.49l2.14,-0.31l1.49,-0.59L804.97,77.87zM804.97,77.87l-0.05,0.01l0.07,-0.03L804.97,77.87z"
				},
				{
					"id":"US-MO",
					"title":"Missouri",
					"d":"M843.17,260.73L842.36,264.19L842.47,267.04L843.24,270.45L844.07,272.99L844.96,274.67L848.02,277.77L853.28,282.29L856.68,286.66L858.21,290.9L859.81,292.54L861.47,291.58L863.64,291.85L866.01,292.42L867.28,293.18L867.57,293.46L867.72,293.76L867.65,294.08L867.38,294.94L864.95,302.28L864.15,305.63L864.37,306.85L865.65,308.56L868,310.74L870.02,312.14L871.72,312.74L874.42,314.44L878.14,317.23L880.06,319.38L880.17,320.9L880.64,322.43L881.48,323.97L881.59,325.49L880.97,326.98L881.39,328.91L882.87,331.26L884.08,332.66L885.02,333.12L885.21,333.09L885.27,332.86L885.11,332.53L885.05,332.23L885.09,331.81L885.26,331.64L885.42,331.58L886.3,332.12L887.66,333.37L888.36,335.11L888.41,337.35L888.09,339.5L887.4,341.56L886.5,342.32L886.07,342.23L885.14,341.94L884.78,342.07L883.99,342.65L883.18,344.67L883.16,344.72L882.82,344.94L882.56,344.75L882.52,344.65L882.31,344.09L881.86,343.54L881.57,343.55L881.32,343.62L881.24,343.9L881.2,344.52L881.27,344.78L881.68,346.41L881.5,347.62L880.66,348.15L880.57,348.82L881.13,349.55L881.16,349.89L880.98,350.19L880.38,350.32L879.93,350.52L879.6,351.15L880.41,352.27L880.37,353.68L879.48,355.4L879.39,356.05L876.09,356.32L873.13,356.57L870.17,356.81L867.21,357.04L868.47,354.59L869.32,353.68L869.92,352.74L871.07,351.83L872.28,349.95L872.38,349.1L872.19,348.28L871.34,347.2L870.43,345.52L865.44,345.83L860.45,346.13L855.46,346.41L850.47,346.68L845.47,346.93L840.48,347.17L835.48,347.39L830.49,347.6L825.49,347.79L820.5,347.96L815.5,348.12L810.5,348.27L805.5,348.4L800.5,348.51L795.5,348.61L790.51,348.69L790.46,345.91L790.42,343.14L790.38,340.36L790.34,337.58L790.29,334.68L790.24,331.79L790.19,328.89L790.14,325.99L790.09,323.1L790.04,320.2L789.98,317.31L789.93,314.41L789.88,311.51L789.83,308.62L789.78,305.72L789.73,302.83L789.68,299.93L789.63,297.04L789.58,294.14L789.53,291.24L789.55,290.39L786.84,288.88L785.62,287.45L784.99,285.59L783.76,283.76L781.92,281.94L781.6,279.98L782.79,277.87L783.79,276.8L784.6,276.75L784.68,275.85L784.03,274.08L783.1,273.44L781.88,273.9L780.84,273.88L776.87,271.04L776.6,270.84L775.36,268.95L774.85,266.68L773.86,265.21L772.39,264.53L771.46,263.04L771.06,260.73L770.12,258.41L769.69,257.72L773.92,257.68L778.19,257.62L782.47,257.55L786.74,257.47L791.02,257.37L795.29,257.26L799.56,257.14L803.84,257.01L808.11,256.87L812.38,256.71L816.65,256.54L820.92,256.36L825.19,256.17L829.46,255.97L833.73,255.75L838,255.53L838.91,257.1L839.86,257.53L840.07,258.05L841.32,258.83L841.62,259.63z"
				},
				{
					"id":"US-MS",
					"title":"Mississippi",
					"d":"M908.91,376.13l1.74,1.32l-0.02,0.54l0.01,0.36l-0.02,1.05l-0.09,4.14l-0.09,4.14l-0.09,4.14l-0.1,4.14l-0.1,4.14l-0.1,4.14l-0.1,4.14l-0.11,4.14l-0.11,4.15l-0.11,4.15l-0.11,4.15l-0.11,4.15l-0.12,4.15l-0.12,4.15l-0.12,4.15l-0.12,4.16l0.55,4.17l0.55,4.17l0.55,4.17l0.55,4.17l0.55,4.17l0.55,4.18l0.55,4.18l0.64,4.58l-5.64,0.81l-2.57,-0.95l-1.05,-0.14l-0.62,0.08l-2.8,1.27l-3.23,1.05l-0.79,-0.2l-1.11,0.04l-2.19,2.91l-1.46,0.79l-0.48,-0.15l-0.54,-0.15l-0.4,-0.28l-0.84,-1.59l-0.31,-1.16l-1.05,-2.49l-1.08,-1.36l-1.18,-0.87l-0.57,-0.91l-0.04,-0.64l-0.43,-1.11l-0.01,-0.91l1.12,-3.57l0.39,-2.61l-4.63,0.31l-4.63,0.3l-4.63,0.29l-4.63,0.28l-4.63,0.26l-4.63,0.25l-4.63,0.24l-4.61,0.21l0.04,-0.62l0.76,-0.83l0.23,-1.02l-0.78,-2.38l0.18,-1.34l1.13,-0.3l0.51,-1.31l-0.11,-2.32l0.37,-1.58l0.85,-0.86l0.75,-1.94l0.66,-3.03l1.51,-2.55l2.37,-2.07l1.13,-1.74l0,-1.31l0.24,-0.62l0.48,-0.35l0.78,-0.93l1.01,-1.28l0.15,-0.84l-0.09,-0.57l-0.11,-0.61l-0.92,-1.08l-1.36,-0.88l-0.92,-1.44l0,-1.14l-0.34,-0.99l-0.68,-0.83l0.09,-0.81l0.87,-0.79l0,-0.71l-0.86,-0.62l-0.07,-1.18l0.71,-1.74l-0.11,-1.17l-0.94,-0.6l-0.17,-1.09l-0.08,-0.55l0.65,-4l-0.22,-0.5l-0.93,-1.15l-0.17,-1.44l0.42,-1.79l-0.32,-1.36l-0.75,-0.46l-0.21,-0.53l-0.26,-0.8l0.74,-0.78l0.01,-0.69l-0.72,-0.59l0.39,-0.92l1.5,-1.24l0.4,-0.68l0.42,-0.71l0.18,-1.66l-0.27,-0.96l-0.41,-0.63l0.16,-0.34l0.3,-0.32l1.82,-0.7l0.5,-0.45l0.08,-0.52l-0.65,-1.24l0.49,-1.37l1.63,-1.51l0.84,-1.3l0.04,-1.08l0.77,-0.83l1.49,-0.58l0.83,-2.05l0.16,-3.52l0.36,-1.52l0.76,-0.27l0.38,-0.51l0.07,-1.01l0.88,-1.09l1.69,-1.17l0.63,-1.07l-0.24,-0.54l-0.05,-0.69l4.66,-0.29l4.86,-0.32l4.85,-0.33l4.85,-0.35l4.85,-0.36l4.85,-0.38l4.85,-0.39L908.91,376.13zM910.63,483.23l-0.22,0.27l-1.76,-0.33l-1.08,-0.35l-0.22,-0.42l2.96,0.55L910.63,483.23z"
				},
				{
					"id":"US-MT",
					"title":"Montana",
					"d":"M640.59,133.06L640.16,138.25L639.72,143.43L639.29,148.62L638.86,153.8L638.85,153.87L638.84,153.94L638.83,154.01L638.82,154.08L638.7,154.07L638.57,154.05L638.45,154.04L638.32,154.03L634.86,153.72L631.39,153.4L627.93,153.07L624.47,152.73L621.01,152.39L617.55,152.04L614.09,151.67L610.63,151.31L607.17,150.93L603.72,150.54L600.26,150.15L596.8,149.74L593.35,149.33L589.9,148.91L586.44,148.48L582.99,148.05L579.54,147.6L576.1,147.15L572.65,146.69L569.2,146.22L565.76,145.74L562.31,145.25L558.87,144.76L555.43,144.26L551.99,143.74L548.55,143.22L545.11,142.7L541.67,142.16L538.24,141.62L534.8,141.06L531.37,140.5L527.94,139.93L527.48,142.7L527.01,145.47L526.54,148.24L526.08,151.01L525.14,150.25L524.56,149.46L524.12,148.6L523.41,146.28L522.94,145.39L522.49,144.83L521.95,144.7L521.22,144.86L520.63,145.27L520.3,146.12L519.62,147.07L519.51,147.95L519.66,148.43L519.54,148.65L519.18,148.79L516.73,148.03L514.48,148.09L513.05,147.49L510.15,147.15L507.73,146.42L506.86,146.41L506.23,146.77L505.33,147.82L505.11,148L504.82,147.99L500.92,146.61L499.86,146.4L498.6,146.95L498.13,147.43L497.92,148.13L497.63,148.28L497.28,148.18L496.48,147.55L495.69,146.6L495.33,145.95L495.47,144.64L494.99,143.04L495.11,141.7L494.84,140.51L494.31,139.26L493.72,138.4L493.03,138.01L491.65,137.91L491.39,137.74L490.21,136L489.89,135.27L489.87,134.66L490.63,133.35L490.64,132.55L490.45,131.52L490.1,130.62L489.4,129.77L488.93,128.12L487.94,125.74L487.88,124.03L487.62,122.57L487.73,121.19L487.38,120.26L487.63,119.22L487.6,118.91L487.47,118.75L486.66,117.98L485.79,116.71L485.3,116.37L485.08,116.31L484.89,116.55L484.71,117.02L482.66,118.42L481.05,118.94L480.18,119.6L479.46,119.87L479.12,119.84L478.69,119.49L477.42,117.99L476.29,117.2L476.21,116.92L476.49,115.93L477.3,114.89L477.15,112.66L477.47,111.97L478.04,111.54L479.54,111.04L479.75,110.7L479.86,108.64L479.27,107.73L479.15,107.27L479.71,105.68L479.6,104.55L480.38,103.77L480.74,102.21L481.54,100.71L482.53,98.4L482.64,97.35L483.5,96.36L483.93,95.29L484.12,94.5L484.12,94L483.94,93.77L483.49,93.68L481.31,93.69L480.66,93.49L480.12,93.15L479.85,92.7L479.94,91.78L479.6,91.09L479.37,90.94L478.35,91.1L478.16,91.04L478.08,90.85L477.86,90.01L476.65,88.19L476.28,86.32L475.12,84.51L474.16,82.16L472.16,78.35L471.66,77.56L469.86,76L468.6,74.04L467.23,72.53L467.11,72.29L467.12,72.17L467.24,72.09L467.77,71.89L468.01,71.31L467.66,69.97L468.22,68.85L468.18,67.11L468.07,66.52L467.26,64.73L466.83,63.1L465.96,61.48L464.86,58.92L466.08,53.48L467.31,48.03L468.53,42.58L469.75,37.14L472.43,37.74L478.63,39.1L484.83,40.43L491.04,41.74L497.26,43.01L498.66,43.3L503.48,44.26L509.71,45.47L515.94,46.66L522.18,47.82L528.42,48.94L534.67,50.04L540.93,51.11L547.19,52.15L553.45,53.16L558.18,53.91L559.72,54.14L565.99,55.1L572.27,56.02L578.56,56.91L584.84,57.77L591.13,58.61L597.43,59.41L603.73,60.19L610.03,60.93L616.33,61.65L622.64,62.33L628.95,62.99L635.27,63.62L641.58,64.21L646.3,64.64L645.95,68.92L645.59,73.21L645.23,77.5L644.87,81.79L644.51,86.08L644.15,90.36L643.8,94.64L643.44,98.92L643.08,103.19L642.72,107.46L642.37,111.73L642.01,116L641.66,120.27L641.3,124.53L640.95,128.8z"
				},
				{
					"id":"US-NC",
					"title":"North Carolina",
					"d":"M1122.2,308.31l-0.08,1.79l0.47,0.91l1.16,0.79l1.59,2.27l1.58,3.18l-1.41,-1.11l-1.34,-0.46l-1.96,-0.14l-1.85,-0.61l0.43,1.37l0.18,1.54l-1.36,-0.18l-0.97,-0.31l1.11,1.44l-1.76,-0.12l-1.08,0.34l-0.41,1.58l-0.77,1.07l-1.36,0.59l-2.4,-0.85l-1.02,-1.43l-0.66,-1.7l0.33,2.11l0.84,2.09l0.22,1.68l2.1,-0.14l1.84,-0.68l2.58,-0.49l1.61,-0.68l0.89,-0.75l2.52,-0.08l0.62,1.95l0.16,2.04l0.33,2.14l0.67,-0.16l0.64,-0.85l-0.45,-3.86l1.89,-1.89l0.76,-0.07l0.98,1.05l0.52,1.18l0.63,1.63l0.07,2.69l-2.73,3.78l-1.82,3.33l-1.13,0.85l-1.88,0.08l-2.2,-0.25l-1.04,0.08l-0.71,0.4l-0.65,-0.76l-0.64,-1.5l-0.91,-0.35l-0.59,0.19l-0.05,1.75l-1.81,0.88l-2.74,-0.13l-3.02,-0.82l1.49,1.25l7.35,1.35l0.87,0.36l0.88,0.61l-0.68,1.41l-0.45,1.51l0.13,1.08l-0.12,0.73l-2.32,2.39l-1.54,0l-4.44,-2.46l2.3,2.46l1.62,0.91l2.89,0.05l4.94,-2.17l1.94,0.78l-0.94,2.34l-1.07,1.73l-1.78,0.55l-1.52,0.73l-0.26,1.08l-1.13,0.31l-1.77,0.44l-2.74,0.68l-1.57,0.09l-1.7,2.46l-0.74,0.44l-1.2,-0.14l-0.8,-1.52l-0.67,-0.69l0.61,3.03l0.37,0.77l0.53,0.53l-2.15,2.16l-1.97,2.54l-0.74,0.73l-0.76,1.23l-1.4,3.37l-0.06,2.26l-0.24,2.56l-0.31,-1.07l-0.24,-1.85l-0.92,-1.99l0.46,3.9l-0.42,1.94l-7.18,1.29l-2.71,1.46l-3.14,-2.14l-2.94,-2.03l-2.93,-2.03l-2.93,-2.04l-2.92,-2.04l-2.91,-2.05l-2.91,-2.05l-2.9,-2.06l-2.57,0.37l-2.57,0.37l-2.57,0.37l-2.57,0.36l-2.57,0.36l-2.57,0.36l-2.57,0.35l-2.57,0.35l-0.39,-1.71l-0.27,-1.21l-1.95,-1.82l-1.14,-1.07l-1.84,1.39l-0.19,-0.5l-0.08,-0.94l-0.23,-0.29l-0.59,-0.13l-2.88,0.35l-2.88,0.34l-2.88,0.33l-2.88,0.33l-2.88,0.32l-2.88,0.32l-2.88,0.32l-2.88,0.31l-0.69,-0.1l-1.18,0.92l-3.23,1.6l-1.53,1.22l-0.62,0.03l-2.75,1.36l-2.76,1.35l-0.33,0.05l-5.48,0.85l-5.48,0.83l-5.48,0.81l-5.49,0.79l0.08,-4.79l0.33,-1.14l0.49,-0.31l1.88,-0.26l1.13,-0.7l0.68,-2.97l2.09,-2.54l1,-0.71l1.55,-0.65l3.74,-1.06l3.78,-2.73l2.65,-2.46l2.25,-0.9l0.62,-0.86l0.38,-1.05l0.14,-1.38l0.21,-0.31l1.35,-0.1l0.85,-1.3l0.9,-0.81l0.93,-0.52l0.6,-0.1l0.28,0.31l0.31,0.96l0.26,0.29l0.42,-0.03l0.54,-0.31l0.67,-0.75l1.67,-2.27l1.19,-0.96l1.94,-0.74l1.62,0.81l0.82,-0.49l1.92,-4.43l0.9,-0.89l0.72,-0.41l1.31,-0.27l-0.16,-1.11l0.19,-1.74l-0.12,-1.15l0.54,-1.81l0.36,0.29l6.41,-0.97l6.41,-1l6.41,-1.02l6.4,-1.05l6.4,-1.07l6.4,-1.1l6.39,-1.13l6.39,-1.15l6.38,-1.18l6.38,-1.2l6.37,-1.23l6.37,-1.25l6.36,-1.28l6.36,-1.3l6.35,-1.33L1122.2,308.31zM1123.55,308.02l0.55,-0.13l3.32,6.58l5.23,6.79l0.73,1.21l-1.08,-0.96l-3.75,-4.43l-2.26,-3.3L1123.55,308.02zM1131.42,322.08l-0.17,0.5l-1.72,-2.13l1.38,0.5l0.36,0.59L1131.42,322.08zM1136.1,335.07l-2.25,1.14l-0.25,-0.14l2.45,-1.86l-0.14,-4.56l-0.34,-2.03l-1.22,-3.45l-0.16,-0.74l0.71,1.04l1.15,3.21l0.43,2.54l0.05,3.83L1136.1,335.07zM1132.11,337.11l-2.89,2.28l-0.39,-0.01l1.88,-1.59L1132.11,337.11zM1121.83,351.88l-0.39,0.35l1.05,-3.07l2.49,-4.16l0.76,-0.72l-2.04,3.54L1121.83,351.88zM1121,351.78l-0.39,0.14l-0.76,-0.09l-1.07,-0.25l-0.29,-0.29l0.96,-0.08L1121,351.78z"
				},
				{
					"id":"US-ND",
					"title":"North Dakota",
					"d":"M757,138.56L753.36,138.53L749.72,138.49L746.08,138.45L742.43,138.39L738.79,138.33L735.15,138.25L731.51,138.17L727.86,138.08L724.22,137.97L720.58,137.86L716.94,137.74L713.3,137.61L709.66,137.47L706.02,137.33L702.38,137.17L698.74,137L695.1,136.82L691.46,136.64L687.83,136.44L684.19,136.24L680.55,136.02L676.92,135.8L673.28,135.57L669.65,135.33L666.01,135.08L662.38,134.81L658.75,134.55L655.11,134.27L651.48,133.98L647.85,133.68L644.22,133.37L640.59,133.06L640.95,128.8L641.3,124.53L641.66,120.27L642.01,116L642.37,111.73L642.72,107.46L643.08,103.19L643.44,98.92L643.8,94.64L644.15,90.36L644.51,86.08L644.87,81.79L645.23,77.5L645.59,73.21L645.95,68.92L646.3,64.64L647.9,64.78L654.23,65.32L660.55,65.83L666.88,66.31L673.21,66.75L679.54,67.17L685.88,67.56L692.21,67.92L698.55,68.25L704.88,68.55L711.22,68.82L717.57,69.06L723.91,69.27L730.25,69.46L736.59,69.61L742.94,69.73L747.46,69.8L748.83,76.87L748.79,78.85L748.55,80.13L748.72,82.37L748.61,83.87L748.82,85.79L748.72,88.33L749.4,91.27L750.45,93.94L750.41,94.7L750.71,96.31L751.33,97.64L752.63,101.56L752.53,105.26L752.75,106.4L753.02,114.37L753.12,115.38L753.85,116.61L753.48,118.42L753.43,119.36L753.54,122.7L753.97,124.01L754.37,126.65L756.11,129.93L756.39,131.17L756.49,132.17L756.96,134.17L756.79,136.84z"
				},
				{
					"id":"US-NE",
					"title":"Nebraska",
					"d":"M757.78,215.22L758.27,215.34L759.37,217.31L759.81,220.82L760.81,223.66L762.36,225.81L763.14,227.39L763.15,228.39L763.52,229.46L764.26,230.6L764.56,232.54L764.41,235.28L764.72,236.73L765.51,236.91L765.86,237.3L765.75,237.89L766.01,238.34L766.65,238.62L766.83,239.41L766.55,240.7L766.78,241.51L767.52,241.84L767.66,242.48L767.2,243.42L767.27,244.16L767.88,244.7L768.29,247.09L768.51,251.33L768.44,253.82L768.09,254.54L768.65,256.07L769.69,257.72L770.12,258.41L771.06,260.73L771.46,263.04L772.39,264.53L773.86,265.21L774.85,266.68L775.36,268.95L776.6,270.84L776.87,271.04L773.79,271.07L770.21,271.08L766.63,271.09L763.04,271.08L759.46,271.07L755.88,271.06L752.29,271.03L748.71,270.99L745.13,270.95L741.54,270.9L737.96,270.84L734.38,270.77L730.79,270.69L727.21,270.61L723.63,270.52L720.05,270.42L716.47,270.31L712.89,270.19L709.31,270.06L705.73,269.93L702.14,269.79L698.56,269.64L694.98,269.48L691.41,269.31L687.83,269.13L684.25,268.95L680.67,268.76L677.09,268.56L673.51,268.35L669.94,268.13L666.36,267.91L662.79,267.67L662.97,264.9L663.15,262.13L663.33,259.36L663.52,256.59L663.7,253.82L663.88,251.04L664.07,248.27L664.25,245.5L660.05,245.21L655.86,244.92L651.66,244.61L647.47,244.29L643.28,243.96L639.09,243.61L634.89,243.26L630.7,242.9L631.18,237.35L631.66,231.81L632.13,226.26L632.61,220.72L633.08,215.17L633.56,209.62L634.04,204.07L634.51,198.52L640.16,199.01L645.8,199.47L651.44,199.92L657.09,200.34L662.74,200.75L668.39,201.13L674.04,201.49L679.69,201.83L685.35,202.15L691,202.44L696.66,202.71L702.32,202.97L707.97,203.2L713.63,203.41L719.29,203.59L725.76,203.79L730.56,207.23L733.46,208.33L734.86,207.38L737.87,206.88L742.49,206.82L745.39,207.32L746.6,208.39L748.96,209.6L752.48,210.94L754.59,212.38L755.28,213.92L756.51,214.91z"
				},
				{
					"id":"US-NH",
					"title":"New Hampshire",
					"d":"M1173.38,145.74L1173.46,148.72L1173.41,150.21L1171.53,150.64L1170.79,151.07L1169.46,152.53L1168.56,153.17L1167.41,155.31L1166.19,156.28L1163.92,156.83L1161.64,157.38L1159.37,157.92L1157.09,158.46L1154.82,158.99L1152.54,159.53L1150.27,160.05L1147.99,160.58L1147.52,159.88L1146.27,158.74L1145.91,158.22L1145.79,157.56L1145.81,155.71L1146.03,155.07L1146.13,153.97L1145.62,149.81L1145.5,147.36L1144.72,143.02L1144.74,141.69L1144.92,140.82L1145.03,138.65L1145.76,136.7L1145.97,134.49L1146.42,132.49L1146.28,131.42L1146.36,129.01L1145.77,124.91L1146.06,124.16L1147.99,123.05L1148.53,122.46L1150.28,120.22L1150.79,119.35L1151.04,118.53L1151.07,117.34L1151.23,116.97L1151.11,116.34L1149.63,113.96L1149.34,113.02L1150.22,109.62L1149.39,108L1149.52,107.51L1149.87,102.93L1150.73,100.61L1152.82,100.72L1153.83,100.38L1154.4,99.49L1155.11,101.6L1155.9,103.95L1156.69,106.31L1157.48,108.66L1158.27,111.01L1159.05,113.36L1159.84,115.71L1160.63,118.06L1161.43,120.42L1162.21,122.77L1163.01,125.11L1163.8,127.46L1164.59,129.81L1165.38,132.16L1166.17,134.5L1166.96,136.85L1167.33,138.46L1167.94,139.88L1168.87,141.04L1170.84,142.55L1171.55,144.09z"
				},
				{
					"id":"US-NJ",
					"title":"New Jersey",
					"d":"M1134.34,204.02l0.14,1.75l-0.77,3.81l-0.49,0.96l-0.63,0.9l-0.53,0.45l-0.43,0.68l-0.44,1.02l-0.2,1.87l0.76,1.47l3.3,-0.2l0.73,-0.69l0.71,1.01l0.63,1.49l0.18,1.74l-0.11,1.84l0.12,2.22l0.46,3.32l0.2,3.04l-0.29,-0.87l-0.55,-3.62l-0.43,0.5l-0.16,0.91l0.15,4.81l-0.75,2.76l-0.83,1.99l-1.35,0.03l0.61,1.27l-0.18,0.78l0.05,1.53l-0.53,1.15l-0.74,0.08l-0.87,0.91l-0.29,0.61l0.2,0.98l-0.49,1.02l-1.44,5.05l-1.87,1.83l-0.57,-0.07l0.08,-2.24l-0.11,-2.22l-1.54,-0.61l-1.38,-0.19l-1.43,0.4l-1.98,-1.28l-2.34,-0.73l-3.62,-2.6l-0.12,-0.92l-0.42,-1.5l0.32,-2.59l0.45,-1.87l0.95,-1.13l3.12,-1.65l0.52,-1.52l0.23,-1.23l0.67,-0.93l1.58,-1.79l2.51,-2.31l-5.29,-4.49l-1.03,-0.09l-1.67,-2.41l-1.38,-0.45l-0.4,-0.34l-0.53,-2.02l-0.16,-1.19l0.02,-0.73l0.9,-0.82l0.32,-1.31l-0.13,-0.61l-1.23,-1.71l-0.14,-0.59l1.23,-1.49l1.42,-2.7l0.58,-2.73l0.3,-0.82l0.44,-0.65l1.12,-1l1.85,0.6l1.85,0.6l1.85,0.6l1.86,0.6l1.86,0.59l1.86,0.59l1.86,0.59L1134.34,204.02zM1137.64,233.24l-1.16,3.75l-0.2,-0.62l1.45,-4.66L1137.64,233.24z"
				},
				{
					"id":"US-NM",
					"title":"New Mexico",
					"d":"M640.16,344.04L639.41,343.99L638.9,350.22L638.39,356.46L637.88,362.69L637.37,368.92L636.86,375.16L636.34,381.4L635.83,387.64L635.32,393.88L634.8,400.12L634.29,406.37L633.78,412.62L633.26,418.87L632.75,425.12L632.23,431.38L631.72,437.64L631.2,443.9L626.93,443.57L622.66,443.22L618.39,442.86L614.13,442.5L609.86,442.12L605.59,441.73L601.33,441.33L597.07,440.92L592.8,440.5L588.54,440.07L584.28,439.63L580.02,439.18L575.76,438.71L571.51,438.24L567.25,437.76L563,437.26L562.88,437.26L564.34,441.51L564.34,441.51L566.5,442.92L566.36,442.86L562.19,442.35L558.02,441.83L553.85,441.29L549.69,440.75L545.52,440.2L541.36,439.63L537.19,439.06L533.04,438.48L532.69,440.97L532.34,443.46L531.99,445.96L531.64,448.45L524.9,447.54L518.18,446.61L515.77,446.26L516.91,438.39L518.05,430.54L519.18,422.7L520.32,414.87L521.45,407.03L522.58,399.2L523.72,391.38L524.85,383.56L525.98,375.74L527.11,367.93L528.24,360.12L529.37,352.31L530.5,344.5L531.63,336.7L532.76,328.9L533.89,321.1L540.56,322.05L547.23,322.97L553.91,323.87L560.59,324.73L567.27,325.57L573.96,326.38L580.65,327.17L587.35,327.92L594.04,328.65L600.75,329.35L607.45,330.02L614.16,330.67L620.86,331.28L627.58,331.87L634.29,332.43L641,332.96L640.79,335.73L640.58,338.5L640.37,341.27z"
				},
				{
					"id":"US-NV",
					"title":"Nevada",
					"d":"M446.17,305.87L444.44,314.41L442.52,323.79L442.16,323.87L440.71,325.81L439.37,326.59L438.51,326.38L437.77,325.58L437.13,324.18L435.96,323.21L434.24,322.68L432.65,322.55L431.19,322.83L430.2,323.46L429.42,324.92L429.44,325.6L429.94,327.22L429.53,329.49L429.27,331.34L429.54,332.44L429.39,333.62L428.7,335.41L428.62,336.97L429.09,339.87L427.14,347.54L427.11,347.68L423.21,342.05L419.59,336.77L416,331.49L412.44,326.2L408.91,320.9L405.39,315.6L401.91,310.29L398.46,304.98L395.95,301.25L393.46,297.52L390.98,293.78L388.52,290.04L386.06,286.3L383.63,282.56L381.2,278.81L378.79,275.06L375.66,270.53L372.56,266L369.47,261.46L366.4,256.92L363.36,252.37L360.33,247.82L357.33,243.26L354.35,238.69L355.44,234.67L356.52,230.65L357.61,226.62L358.7,222.6L359.78,218.58L360.87,214.55L361.96,210.53L363.04,206.5L364.13,202.48L365.22,198.45L366.31,194.42L367.4,190.4L368.49,186.37L369.57,182.34L370.66,178.31L371.75,174.28L377.74,175.89L383.73,177.47L389.72,179.02L395.72,180.55L401.73,182.06L407.75,183.54L413.77,185L419.79,186.43L425.81,187.83L431.82,189.21L437.85,190.56L443.88,191.89L449.91,193.19L455.95,194.47L462,195.72L468.05,196.95L467.36,200.36L466.68,203.77L465.99,207.17L465.31,210.58L464.63,213.99L463.94,217.39L463.26,220.8L462.57,224.2L461.89,227.61L461.21,231.01L460.52,234.42L459.84,237.82L459.16,241.22L458.47,244.63L457.79,248.03L457.11,251.43L456.42,254.84L455.74,258.24L455.06,261.64L454.37,265.04L453.69,268.45L453.01,271.85L452.32,275.25L451.64,278.65L450.96,282.05L450.27,285.46L449.59,288.86L448.91,292.26L448.23,295.66L447.54,299.07L446.86,302.47z"
				},
				{
					"id":"US-NY",
					"title":"New York",
					"d":"M1049.12,104.45l-0.02,-0.01L1049.12,104.45L1049.12,104.45zM1135.37,163.36l-0.04,1.94l-0.04,1.94l-0.04,1.94l-0.05,1.94l-0.05,1.94l-0.05,1.94l-0.05,1.94l-0.05,1.94l0.56,0.42l0.39,2.08l0.39,2.08l0.39,2.08l0.39,2.08l0.39,2.08l0.39,2.08l0.39,2.08l0.39,2.08l0.7,0.71l0.7,0.71l-0.51,0.54l-0.8,0.84l-0.85,0.9l-1.11,1.17l0.94,0.91l1.18,1.15l-0.53,0.73l-1.29,2.33l-0.93,1.31l-0.89,0.57l-0.39,0.99l-0.52,0.71l0.17,-2.04l0.29,-1.76l-0.2,-3.22l-0.79,-2.45l-0.96,-0.85l-0.9,-0.5l1.46,2.25l0.88,2.98l0.01,0.09l-1.81,-0.59l-1.86,-0.59l-1.86,-0.59l-1.86,-0.59l-1.86,-0.6l-1.85,-0.6l-1.85,-0.6l-1.85,-0.6l-0.54,-0.73l-0.74,-0.49l-3.17,-0.4l-0.92,-0.55l-0.9,-0.82l-0.75,-1.09l-0.54,-1.21l-0.25,-1.01l-0.05,-1.17l-0.84,-0.59l-0.18,-0.7l-0.54,-0.37l-2.09,-0.4l-0.84,-1.05l-1.51,-0.83l-2.23,0.51l-2.23,0.51l-2.23,0.5l-2.23,0.5l-2.23,0.5l-2.24,0.5l-2.24,0.49l-2.24,0.49l-2.24,0.48l-2.24,0.48l-2.24,0.48l-2.24,0.48l-2.24,0.47l-2.24,0.47l-2.24,0.46l-2.24,0.46l-2.24,0.46l-2.24,0.45l-2.25,0.45l-2.24,0.45l-2.25,0.44l-2.25,0.44l-2.25,0.44l-2.25,0.43l-2.25,0.43l-2.25,0.43l-2.25,0.42l-2.25,0.42l-2.25,0.42l-2.25,0.41l-2.25,0.41l-2.25,0.41l-0.53,-2.95l-0.53,-2.95l-0.02,-0.12l0.86,-0.71l2.75,-2.56l1.29,-1.73l1.42,-1.5l1.54,-1.28l1.13,-1.48l0.73,-1.69l0.9,-1.32l1.08,-0.96l0.5,-0.89l-0.06,-0.82l-0.43,-1.05l-0.8,-1.27l-0.28,-1.07l0.24,-0.86l-0.01,-0.55l-0.27,-0.23l-2.68,-0.3l-0.6,-3.79l-0.05,-0.1l0.12,-0.07l5.5,-2.78l3.59,-1.29l4.48,-1.04l5.54,-0.26l2.24,0.32l1.52,0.69l1.58,-0.06l1.64,-0.8l2.36,-0.65l3.09,-0.49l1.68,-0.12l0.27,0.25l0.19,-0.13l0.11,-0.52l0.71,-0.7l2.12,-1.28l0.34,0.1l0.38,-0.5l0.42,-1.1l0.94,-1.32l1.44,-1.53l1.4,-0.94l1.36,-0.35l0.85,-0.49l0.35,-0.63l0.04,-0.5l-0.27,-0.36l-0.02,-0.46l0.03,-0.24l-0.11,-0.17l-0.25,-0.34l-0.55,-1.88l-0.46,-0.83l-0.51,-0.58l-0.57,-0.32l-0.04,-0.46l0.7,-0.73l0.05,0.53l0.25,0.11l0.33,-0.32l0.62,-1.34l0,-0.45l0.5,-0.58l0.29,-0.78l-0.51,0.01l-1.11,0.46l-0.31,-0.15l0.4,-1.05l-0.23,-0.5l-0.24,-0.18l-0.4,0l-1.13,1.1l-0.38,0.16l-0.15,-0.41l-0.88,-0.8l1.43,-2.08l5.31,-6.09l0.48,-0.86l0.09,-0.69l-0.29,-0.52l-0.21,-0.1l0.06,-0.16l4.71,-7.39l2.8,-3.57l2.47,-2.2l1.98,-1.24l1.48,-0.24l0.8,-0.3l0.71,-0.17l3.59,-0.87l6.41,-1.58l6.41,-1.61l3.78,-0.96l0.48,1.41l0.11,1.78l0.74,1.78l0.62,3.95l1.73,2.74l0.28,2.05l0.6,2.13l-0.04,0.57l-0.45,1.43l-0.14,1.33l0.05,1.29l0.22,0.79l1.55,3.35l0.52,1.52l0.22,0.91l0.15,3.05l0.17,0.84l0.23,0.19l0.21,-0.05l0.43,-1.07l0.26,-0.21l0.44,0.13l1.28,1.13l0.58,2.46l0.42,1.79l0.47,1.99l0.7,2.99l0.51,2.19l0.47,1.99l0.36,1.53l0.07,1.17L1135.37,163.36zM1082.33,141.06l-0.45,0.29l-0.18,-0.23l0.03,-0.26l0.34,-0.39l0.68,-0.15l-0.03,0.26L1082.33,141.06zM1081.36,147.84l-0.22,0.12l-0.08,-0.47l0.17,-0.36l0.43,-0.23l0.04,0.24L1081.36,147.84zM1043.26,177.7l-0.35,0.84l-0.49,0.02l-0.4,-0.18l-0.21,-0.45l-0.03,-0.61l0.37,-0.34l1.19,0.01l0.08,0.23L1043.26,177.7zM1157.24,198.3l-0.79,1.7l1.09,-0.14l0.79,-0.65l0.63,-1.05l1.68,-1.64l1.56,-0.94l0.5,-0.24l1.01,0.57l1.42,-1.06l1.54,-0.8l-6.13,5.48l-1.35,0.79l-1.8,1.62l-1.77,1.27l-1.35,0.65l-6.38,4.49l-0.55,0.2l-0.67,-0.1l-5.49,2.85l-2.36,0.76l-2.07,1.02l1.34,-1.51l-0.07,-0.42l-0.47,-0.23l-0.84,0.31l-0.6,1.36l-1.32,0.73l-0.59,-1.17l0.24,-1.08l0.41,-1.07l1.04,-1.78l1.78,-1.4l0.82,-1.04l0.88,0.51l-0.08,-0.97l0.4,-0.67l0.52,-0.44l1.41,-0.36l0.72,-0.34l0.47,-0.45l0.55,-0.2l1.65,0.03l1.48,-0.51l1.07,-0.89l1.21,-0.52l3.31,-1l3.21,-1.29l1.13,-1.11l2.22,-2.86l1.44,-1.02l-1.84,3.12L1157.24,198.3zM1132.27,215.28l-0.76,0.28l0.28,-2.26l1.21,-1.3l0.57,0.07l0.2,0.72l-0.05,0.68l-0.73,1.2L1132.27,215.28z"
				},
				{
					"id":"US-OH",
					"title":"Ohio",
					"d":"M1026.65,234.45L1024.84,235.74L1024.63,236.69L1025.42,237.71L1025.99,239.11L1026.33,240.89L1025.88,244.99L1024.63,251.43L1024.11,255.43L1024.34,257L1023.17,259.29L1020.61,262.32L1018.76,264.18L1017.64,264.9L1016.62,265.02L1015.72,264.54L1014.89,265.1L1014.11,266.7L1013.3,267.6L1012.44,267.78L1011.85,268.83L1011.52,270.75L1011.1,271.89L1010.6,272.26L1010.71,273.18L1011.42,274.68L1011.47,275.25L1011.21,275.31L1010.96,275.26L1010.42,275.7L1009.89,276.68L1009.65,276.74L1009.45,276.62L1009.08,275.5L1008.41,274.77L1007.46,274.43L1006.4,275.68L1005.24,278.51L1004.81,280.3L1005.26,281.43L1005.65,283.11L1005.37,283.87L1004.55,284.26L1004.03,285.28L1003.8,286.94L1002.76,288.13L1000.91,288.83L998.81,288.4L998.66,288.37L996,286.73L994.23,285.04L993.34,283.32L991.27,283.53L988,285.68L985.39,286.31L983.44,285.41L982.03,285.15L980.74,285.71L979.57,286.62L978.44,286.33L976.94,285.14L974.74,284.47L971.83,284.32L969.67,283.1L968.27,280.83L966.89,279.32L965.54,278.58L964.15,278.49L962.73,279.05L961.57,279L960.68,278.34L959.67,278.56L958.81,279.4L957.93,272.08L957.1,264.9L956.27,257.71L955.44,250.52L954.61,243.34L953.78,236.15L952.94,228.96L952.11,221.76L957.59,220.86L963.07,219.94L968.55,219L974.02,218.03L974.17,217.88L974.14,217.95L974.42,218.31L975.95,218.34L977.03,218.65L977.92,219.23L980.98,220.17L981.98,220.88L982.92,221.21L983.8,221.17L984.35,220.82L984.58,220.16L984.99,220.06L985.56,220.52L987.26,220.86L987.34,221.03L983,222.69L982.13,223.29L983.3,223.45L984.42,223.21L985.5,222.56L986.81,222.4L988,222.45L988.33,222.21L988.47,222.09L990.62,223.12L991.38,223.2L992.12,222.94L992.83,222.32L994.46,221.41L997,220.21L999.52,219.49L1002,219.26L1003.52,218.79L1004.81,217.74L1007.51,214.53L1010.76,211.77L1016.21,208.09L1021.57,205.01L1021.88,206.85L1022.28,209.15L1022.68,211.45L1023.07,213.75L1023.47,216.04L1023.86,218.34L1024.26,220.64L1024.65,222.94L1025.05,225.24L1025.44,227.54L1025.84,229.84L1026.23,232.13z"
				},
				{
					"id":"US-OK",
					"title":"Oklahoma",
					"d":"M790.51,348.69L790.96,351.78L791.41,354.87L791.86,357.96L792.32,361.05L792.77,364.14L793.23,367.23L793.69,370.32L794.15,373.41L794.14,375.83L794.13,378.25L794.12,380.67L794.11,383.09L794.1,385.51L794.09,387.93L794.08,390.35L794.07,392.77L794.06,395.19L794.04,397.62L794.03,400.04L794.02,402.46L794.01,404.88L794,407.31L793.99,409.73L793.98,412.15L789.76,411.08L788.7,410.38L786.76,409.59L785.01,407.93L781.57,405.89L780.27,405.4L779.86,405.46L779.16,406.49L777.35,407.31L776.36,407.35L774.56,407.06L774.22,406.8L773.96,406.18L773.24,405.76L772.71,406.09L770.11,406.96L769.72,407.57L768.25,407.6L766.79,407.16L763.11,408.52L761.84,409.58L760.52,409.95L759.83,410.98L759.43,410.83L758.05,409.55L756.63,409.16L754.7,407.88L754.64,406.76L754.43,406.62L754.08,406.49L753.65,406.59L752.8,407.54L752.31,407.78L751.82,407.74L749.95,407.08L749.17,405.93L748.78,405.57L748.35,405.5L747.54,405.83L747.07,407.09L746.71,407.42L745.92,407.63L745.96,408.26L745.24,409.99L744.86,410.33L744.37,410.26L743.87,409.83L743.5,409.21L743.35,408.68L743.65,407.3L743.49,406.84L743.12,406.69L742.19,407.33L741.38,407.29L740.34,407.92L739.69,408.11L739.1,407.94L738.16,406.87L736.5,406.17L735.88,404.92L735.59,404.56L735.24,404.46L734.88,404.49L734.28,404.88L732.33,406.47L731.45,406.97L730.69,407.06L729.98,406.88L729.53,406.46L729.47,404.8L729.06,404.29L727.31,403.22L726.96,402.23L726.82,400.87L724.68,401.03L722.05,400.83L720.83,401.99L720.21,402.2L719.47,401.94L717.39,400.26L715.13,400.52L713.86,400.3L710.75,399L708.29,398.81L707.27,398.56L706.74,398.27L706.56,396.42L705.64,394.83L705.33,394.39L703.71,393.24L703.44,393.19L703.25,393.43L702.83,394.64L702.33,394.68L700.42,394.26L698.64,394.55L697.68,393.91L694.45,390.93L693.13,390.14L692.06,389.86L692.17,387.2L692.29,384.53L692.4,381.87L692.51,379.21L692.63,376.55L692.74,373.89L692.85,371.23L692.97,368.57L693.08,365.91L693.19,363.25L693.31,360.59L693.42,357.93L693.54,355.27L693.65,352.62L693.76,349.96L693.88,347.3L690.52,347.15L687.16,346.99L683.8,346.82L680.44,346.65L677.08,346.47L673.72,346.28L670.36,346.09L667,345.89L663.65,345.68L660.29,345.47L656.93,345.25L653.58,345.02L650.22,344.78L646.87,344.54L643.51,344.29L640.16,344.04L640.37,341.27L640.58,338.5L640.79,335.73L641,332.96L645.4,333.29L649.79,333.62L654.18,333.92L658.58,334.22L662.69,334.49L666.8,334.75L670.91,334.99L675.03,335.23L679.14,335.45L683.26,335.67L687.37,335.87L691.49,336.07L695.6,336.25L699.72,336.42L703.84,336.59L707.95,336.74L712.07,336.88L716.19,337.01L720.31,337.13L724.43,337.24L728.55,337.34L732.67,337.43L736.78,337.51L740.9,337.58L745.02,337.63L749.14,337.68L753.26,337.72L757.38,337.75L761.5,337.76L765.62,337.77L769.74,337.76L773.86,337.75L777.98,337.72L782.1,337.68L786.22,337.64L790.34,337.58L790.38,340.36L790.42,343.14L790.46,345.91z"
				},
				{
					"id":"US-OR",
					"title":"Oregon",
					"d":"M347.77,70.79L349.42,70.71L350.46,71.47L351.66,72.89L352.24,76.28L352.21,81.61L352.02,83.34L352.86,84.68L354.19,85.13L359.37,87.47L360.18,87.65L360.18,87.65L361.21,87.75L364.82,86.78L368.31,87.13L372.2,88.4L374.45,89.62L375.07,90.8L377.14,91.5L382.43,91.81L388.15,92.57L391.33,92.58L395.13,91.85L403.32,91.8L407.19,92.56L409.33,92.27L409.89,91.98L410.15,92.04L414.17,93.07L418.19,94.09L422.21,95.09L426.24,96.08L430.27,97.06L434.3,98.03L438.34,98.99L442.1,99.88L442.3,100.93L443.45,103.17L445.34,105.3L446.41,107.33L446.68,109.25L444.65,113.02L440.3,118.62L437.79,122.26L437.14,123.93L435,126.55L431.38,130.1L429.36,132.88L428.95,134.91L429.57,136.28L431.23,137.01L432.26,137.95L432.66,139.09L432.47,140.01L431.67,140.71L431.29,141.53L431.34,142.5L430.75,144.04L429,147.09L428.97,147.2L427.73,152.53L426.59,157.38L425.46,162.22L424.32,167.07L423.19,171.91L422.06,176.75L420.93,181.59L419.79,186.43L413.77,185L407.75,183.54L401.73,182.06L395.72,180.55L389.72,179.02L383.73,177.47L377.74,175.89L371.75,174.28L367.53,173.13L363.31,171.97L359.09,170.8L354.87,169.61L350.66,168.42L346.45,167.21L342.25,165.98L338.05,164.75L333.85,163.5L329.66,162.24L325.47,160.97L321.28,159.69L317.1,158.39L312.92,157.08L308.75,155.76L304.43,154.38L303.26,151.15L303.64,147.03L304,145.35L305.62,141.12L305.62,139.1L305.1,135.59L306.6,133.17L307.8,131.79L311.73,125.35L312.32,124.91L313.01,125.15L314.61,124.35L314.14,123.9L313.11,124.19L314.75,121.67L316.36,119.57L317.18,118.89L319.94,111.24L322.31,105.48L323.72,103.78L324.09,101.68L325.28,99.05L325.93,96.22L331.83,83.47L332.12,81.8L333.31,79.81L334.64,73.97L336.87,67.68L336.71,66.74L336.78,65.8L337.21,65.79L337.68,66.96L341.22,68.07L343.75,67.92L344.48,68.46L345.07,69.92L346.2,70.53z"
				},
				{
					"id":"US-PA",
					"title":"Pennsylvania",
					"d":"M1119.53,199.27L1118.42,200.27L1117.97,200.92L1117.67,201.74L1117.09,204.47L1115.67,207.17L1114.43,208.66L1114.57,209.25L1115.8,210.96L1115.93,211.57L1115.61,212.88L1114.71,213.7L1114.69,214.43L1114.86,215.63L1115.38,217.65L1115.79,217.99L1117.16,218.44L1118.83,220.85L1119.86,220.94L1125.15,225.43L1122.64,227.74L1121.06,229.53L1120.39,230.46L1119.19,232.77L1116.87,233.99L1115.71,235.02L1115.45,235.44L1113.82,235.18L1111.76,235.74L1111.12,236.17L1110.7,236.82L1109.83,238.85L1105.96,239.72L1102.09,240.58L1098.23,241.42L1094.35,242.26L1090.48,243.09L1086.61,243.91L1082.73,244.72L1078.85,245.52L1074.96,246.31L1071.08,247.09L1067.19,247.86L1063.31,248.62L1059.42,249.37L1055.53,250.11L1051.63,250.84L1047.74,251.56L1045.54,251.97L1043.34,252.37L1041.14,252.76L1038.94,253.16L1036.74,253.55L1034.54,253.94L1032.33,254.32L1030.13,254.7L1029.69,252.17L1029.25,249.63L1028.82,247.1L1028.38,244.57L1027.94,242.04L1027.51,239.5L1027.07,236.97L1026.65,234.45L1026.23,232.13L1025.84,229.84L1025.44,227.54L1025.05,225.24L1024.65,222.94L1024.26,220.64L1023.86,218.34L1023.47,216.04L1023.07,213.75L1022.68,211.45L1022.28,209.15L1021.88,206.85L1021.57,205.01L1024.41,203.36L1025.63,202.37L1026.87,201.39L1027.5,200.84L1028.23,200.31L1032.82,196.56L1032.85,196.68L1033.38,199.63L1033.91,202.58L1036.16,202.17L1038.42,201.76L1040.67,201.35L1042.92,200.93L1045.17,200.51L1047.42,200.09L1049.67,199.66L1051.92,199.23L1054.17,198.79L1056.41,198.35L1058.66,197.91L1060.91,197.47L1063.15,197.02L1065.39,196.57L1067.64,196.12L1069.88,195.66L1072.12,195.2L1074.37,194.73L1076.61,194.26L1078.85,193.79L1081.09,193.32L1083.33,192.84L1085.56,192.36L1087.8,191.87L1090.04,191.38L1092.27,190.89L1094.51,190.4L1096.74,189.9L1098.98,189.39L1101.21,188.89L1103.44,188.38L1105.67,187.87L1107.19,188.7L1108.03,189.75L1110.12,190.15L1110.66,190.52L1110.83,191.21L1111.67,191.8L1111.72,192.98L1111.97,193.98L1112.51,195.19L1113.26,196.28L1114.16,197.1L1115.08,197.65L1118.25,198.05L1118.99,198.54z"
				},
				{
					"id":"US-RI",
					"title":"Rhode Island",
					"d":"M1173.67,177.22l-0.45,0.71l-0.87,-0.65l-0.57,-0.82l-0.6,-0.39l-0.55,-0.06l0.98,1.87l-0.6,1.77l0.79,3.93l-0.83,1.96l-3.7,2.12l-1.21,0.22l-0.13,-1.28l0.27,-0.63l-0.28,-1.36l-0.18,-0.89l-0.42,-1.48l-0.47,-1.69l-0.51,-1.83l-0.45,-1.62l-0.33,-1.17l-0.45,-1.61l-0.32,-1.15l1.2,-0.35l1.64,-0.48l1.58,-0.46l0.98,-0.29l1.2,-0.35l0.32,0.95l0.49,1.47l0.73,0.05l0.31,1.22l0.2,0.81l0.72,0.34l0.73,0.35L1173.67,177.22zM1174.84,181.85l-0.63,0.81l-0.92,0.15l0.23,-0.92l-0.15,-1.21l0.08,-1.4l0.14,-0.46l0.42,-0.49L1174.84,181.85zM1172.88,182.55l-0.34,0.52l-0.45,-0.99l-0.02,-1.28l0.31,-0.11l0.33,0.59L1172.88,182.55z"
				},
				{
					"id":"US-SC",
					"title":"South Carolina",
					"d":"M1087.93,376.29L1087.7,376.42L1083.51,380.61L1082.34,382.32L1079.39,388.61L1079.03,392.35L1077.93,391.01L1077.92,389.86L1077.77,388.94L1077.13,391.09L1078.62,393.77L1077.96,395.02L1075.68,397.55L1074.28,398.15L1072.75,399.03L1072.6,401.14L1070.71,403.4L1069.57,404.46L1067.1,404.38L1068.15,406.04L1067.52,407.55L1066.2,408.86L1064.44,409.87L1063.35,409.97L1062.49,410.5L1061.92,411.48L1060.3,412.6L1058.39,412.46L1056.27,412.55L1055.2,413.23L1057.28,413.69L1058.52,414.67L1058.57,416.27L1058.16,416.97L1057.07,417.99L1056.5,417.97L1056.05,417.29L1055.39,415.82L1054.87,416.24L1054.89,416.97L1054.45,417.31L1052.29,415.16L1052.69,417.01L1053.54,418.34L1054.26,418.97L1054.92,419.3L1055.19,419.94L1054.26,421.76L1053.71,422.23L1052.66,422.67L1052.21,423.78L1052.54,424.61L1048.44,423.47L1047.05,422.07L1046.75,420.02L1045.64,417.81L1042.78,414.27L1040.98,413.42L1039.49,410.94L1037.71,406.53L1035.6,403.86L1033.15,402.94L1031.41,401.67L1030.38,400.05L1029.41,399.04L1028.5,398.65L1027.91,397.82L1027.65,396.57L1026.11,395.1L1021.89,392.57L1020.71,390.82L1018.67,389.14L1013.71,385.83L1013.71,385.83L1008.38,378.76L1008.38,378.76L1007.62,377.28L1006.63,376.77L1005.15,376.75L1003.64,376.19L1001.3,374.55L1001.28,374.53L997.5,372.62L997.9,370.37L1000.17,367.19L1000.84,365.57L1000.96,365.54L1001.29,365.48L1004.05,364.13L1006.8,362.78L1007.42,362.74L1008.95,361.53L1012.17,359.92L1013.35,359L1014.04,359.11L1016.93,358.8L1019.81,358.48L1022.69,358.16L1025.58,357.84L1028.46,357.51L1031.34,357.17L1034.23,356.83L1037.11,356.49L1037.7,356.62L1037.93,356.91L1038,357.85L1038.19,358.34L1040.03,356.95L1041.17,358.02L1043.13,359.84L1043.4,361.05L1043.79,362.76L1046.36,362.41L1048.93,362.06L1051.5,361.7L1054.08,361.34L1056.65,360.98L1059.22,360.61L1061.79,360.24L1064.36,359.87L1067.26,361.92L1070.16,363.97L1073.08,366.02L1076,368.06L1078.92,370.09L1081.85,372.12L1084.79,374.15z"
				},
				{
					"id":"US-SD",
					"title":"South Dakota",
					"d":"M757,138.56L756.45,140.78L756.07,141.75L755.31,142.74L752.92,144.88L752.33,145.62L752.41,146.29L752.88,147.16L754.08,149.17L754.73,149.99L757.35,151.35L758.54,153.02L758.51,158.05L758.49,163.07L758.46,168.09L758.44,173.1L758.41,178.12L758.39,183.13L758.36,188.14L758.34,193.15L755.98,193.22L756.26,194.62L756.89,195.99L757,196.78L756.87,197.43L756.42,198L756.52,198.91L756.65,199.15L757.71,199.74L758.07,200.53L758.17,201.43L758.15,202.12L757.5,203.36L757.3,205.01L756.48,207.47L755.59,208.96L755.41,209.73L755.49,210.34L756.85,211.93L756.92,212.56L757.37,213.38L757.78,215.22L756.51,214.91L755.28,213.92L754.59,212.38L752.48,210.94L748.96,209.6L746.6,208.39L745.39,207.32L742.49,206.82L737.87,206.88L734.86,207.38L733.46,208.33L730.56,207.23L725.76,203.79L719.29,203.59L713.63,203.41L707.97,203.2L702.32,202.97L696.66,202.71L691,202.44L685.35,202.15L679.69,201.83L674.04,201.49L668.39,201.13L662.74,200.75L657.09,200.34L651.44,199.92L645.8,199.47L640.16,199.01L634.51,198.52L634.99,192.96L635.46,187.41L635.94,181.85L636.41,176.29L636.89,170.73L637.37,165.17L637.85,159.6L638.32,154.03L638.45,154.04L638.57,154.05L638.7,154.07L638.82,154.08L638.83,154.01L638.84,153.94L638.85,153.87L638.86,153.8L639.29,148.62L639.72,143.43L640.16,138.25L640.59,133.06L644.22,133.37L647.85,133.68L651.48,133.98L655.11,134.27L658.75,134.55L662.38,134.81L666.01,135.08L669.65,135.33L673.28,135.57L676.92,135.8L680.55,136.02L684.19,136.24L687.83,136.44L691.46,136.64L695.1,136.82L698.74,137L702.38,137.17L706.02,137.33L709.66,137.47L713.3,137.61L716.94,137.74L720.58,137.86L724.22,137.97L727.86,138.08L731.51,138.17L735.15,138.25L738.79,138.33L742.43,138.39L746.08,138.45L749.72,138.49L753.36,138.53z"
				},
				{
					"id":"US-TN",
					"title":"Tennessee",
					"d":"M986.1,331.59L990.13,331.05L998.75,329.88L1004.86,329.01L1009.87,328.29L1012.83,327.85L1016.55,327.3L1017.31,326.71L1019.18,326.5L1021.71,326.2L1021.17,328.01L1021.29,329.16L1021.1,330.91L1021.26,332.02L1019.95,332.28L1019.24,332.69L1018.33,333.58L1016.41,338.01L1015.59,338.5L1013.97,337.69L1012.03,338.43L1010.84,339.39L1009.17,341.65L1008.5,342.4L1007.96,342.71L1007.53,342.75L1007.27,342.46L1006.96,341.5L1006.67,341.19L1006.07,341.29L1005.14,341.81L1004.25,342.61L1003.39,343.92L1002.04,344.02L1001.82,344.33L1001.69,345.7L1001.3,346.76L1000.68,347.61L998.43,348.52L995.77,350.97L991.99,353.7L988.26,354.76L986.71,355.41L985.71,356.11L983.62,358.65L982.93,361.62L981.81,362.32L979.93,362.58L979.44,362.89L979.11,364.03L979.04,368.82L973.13,369.5L967.21,370.16L961.3,370.8L955.38,371.42L952.46,371.71L949.53,372.01L946.61,372.3L943.68,372.58L940.76,372.86L937.83,373.13L934.9,373.4L931.98,373.66L929.05,373.92L926.12,374.17L923.19,374.42L920.27,374.66L917.34,374.9L914.41,375.13L911.48,375.36L908.55,375.58L908.32,375.61L908.57,375.87L908.91,376.13L903.96,376.54L899.1,376.93L894.25,377.31L889.4,377.67L884.54,378.02L879.69,378.36L874.83,378.68L870.17,378.97L870.16,378.9L870.8,377.92L872.78,376.28L873.55,374.24L873.12,371.8L873.73,369.53L875.4,367.43L876,365.42L875.57,363.5L876.35,361.85L878.34,360.49L878.6,359.97L878.49,359.6L878.43,359.18L878.44,359L878.51,358.62L878.95,358.37L879.56,358.15L879.81,357.82L879.77,357.32L879.34,356.46L879.39,356.05L879.48,355.4L880.37,353.68L880.41,352.27L879.6,351.15L879.93,350.52L880.38,350.32L880.98,350.19L881.16,349.89L881.13,349.55L880.57,348.82L880.66,348.15L881.5,347.62L881.68,346.41L881.27,344.78L882.52,344.65L882.56,344.75L882.82,344.94L883.16,344.72L883.18,344.67L886.74,344.41L889.83,344.17L892.92,343.94L896.01,343.69L899.1,343.44L902.19,343.19L905.28,342.93L908.08,342.69L908.13,342.65L907.95,340.67L907.04,338.46L907.13,338.46L909.56,338.49L911.14,338.5L911.73,339.14L917.65,338.48L923.58,337.8L929.5,337.09L935.42,336.36L941.63,335.92L947.83,335.45L954.04,334.96L960.24,334.44L966.44,333.9L972.65,333.34L978.84,332.75L985.04,332.14L985.18,332.07L985.31,332L985.44,331.94L985.58,331.87L985.71,331.8L985.84,331.73L985.97,331.66z"
				},
				{
					"id":"US-TX",
					"title":"Texas",
					"d":"M793.98,412.15l0.99,1.07l0.79,0.3l0.23,0.43l0.38,0.11l0.47,-0.1l0.7,-0.51l1.05,0.12l0.87,-0.19l1.73,0.22l0.97,0.49l0.09,3.02l0.09,3.03l0.09,3.03l0.09,3.03l0.06,2.83l0.06,2.83l0.06,2.83l0.06,2.83l0.06,2.83l0.06,2.83l0.06,2.83l0.06,2.83l2.7,2.67l1.18,1.85l0.38,0.95l0.19,3.27l0.28,0.78l1.36,1.2l0.05,0.81l1.45,2.33l-0.01,1.11l1.39,2.49l0.77,0.64l0.17,1.71l0.44,1.29l-0.59,0.94l0.29,1.27l-0.34,1.2l-0.16,1.59l-0.82,2.48l-0.75,1.22l-1.01,2.32l0.14,1.91l-0.56,2.1l-0.05,0.8l0.61,1.37l0.3,3.81l-0.3,0.81l-1.25,2.27l-0.93,-0.03l-1.96,3.75l1.22,2.05l-0.06,0.75l-4.1,0.52l-9.25,4.35l-3.61,2.31l0.18,-0.76l4.36,-2.99l-1.56,-0.42l-2.49,0.77l-0.9,-0.27l1.03,-2.43l-0.37,-2.13l-1.77,-0.03l-1.11,1.71l-0.79,-0.06l-1.04,-0.72l-0.79,0.24l0.63,3.85l1.14,1.57l0.96,2.01l-2.54,2.53l-2.36,2.09l-0.24,2l-2.38,2.62l-2.25,1.49l-5.3,3.49l-1.52,0.75l-2.4,1.62l-3.32,1.21l-3.19,1.91l-1.08,0.29l2.04,-1.62l2.41,-1.6l-2.07,0.22l-3.19,-0.75l-1.95,-0.05l-0.02,0.58l-1.49,0.82l-1.53,-1.22l-0.66,-0.82l-0.31,-0.71l-0.65,-0.17l-0.63,0.32l2.26,4.98l0.98,0.22l1.08,0.5l-1.36,1.15l-1.46,0.87l-2.29,0.57l-1.92,-1.83l-0.44,2.27l-0.27,2.27l-0.66,0.58l-1.05,0.82l-0.56,-0.63l-0.26,-0.88l-0.67,0.78l-0.98,0.58l-1.61,0.1l-1.21,0.3l0.02,0.94l0.27,0.95l2.15,-0.72l-0.8,2.42l-2,2.38l-1.62,0.54l-2.46,-0.39l-0.61,0.23l-0.55,0.49l2.81,3.81l-1.93,5.65l-1.22,2.04l-0.83,0.25l-0.89,0.04l-3.17,-1.89l-1.71,-1.45l1.46,3.88l4.17,1.2l0.19,1.46l-0.04,1.25l-0.85,1.45l-0.81,1.93l0.55,1.36l0.61,3.36l0.54,1.55l0.55,4.68l0.64,2.04l3.75,7.52l1.3,0.08l0.2,0.81l-0.14,1.55l-2.79,0.41l-1.18,0.67l-0.24,0.6l-0.18,0.32l-0.36,-0.04l-1.32,-0.45l-2.99,-2.17l-4.37,-1.4l-5.76,-0.63l-3.92,-1.16l-2.07,-1.67l-2.18,-1.02l-2.29,-0.37l-1.88,-0.93l-1.47,-1.5l-2.18,-1l-2.89,-0.5l-1.85,-1.15l-1.22,-2.7l0,-0.04l-1.02,-4.48l-1.37,-2.83l-2.73,-3.55l-0.25,-0.46v0l0,-0.57l0.43,-1.99l-0.25,-1.45l-0.86,-1.21l-0.16,-1.25l0.54,-1.29l0.09,-1.57l-0.35,-1.85l-1.74,-2.05l-3.11,-2.25l-2.59,-3.21l-2.06,-4.17l-2.08,-2.92l-2.11,-1.67l-1.4,-1.99l-0.69,-2.3l-0.17,-1.32l0.34,-0.35l-1.22,-2.58l-2.76,-4.81l-1.54,-3.49l-0.33,-2.17l-1.76,-2.66l-3.18,-3.15l-1.71,-2.03l-0.37,-1.36l-0.01,0l-4.97,-4.19l-1.36,-2.52l-1.13,-0.84l-1.35,0l-0.68,-0.28v-0.55l-0.44,-0.05l-0.87,0.45l-2.76,-0.07l-4.65,-0.6l-3.32,-0.89l-2,-1.17l-1.46,0.04l-0.92,1.25l-1.83,0.72l-2.74,0.18l-2.51,2.26l-2.29,4.34l-1.08,2.82l0.14,1.3l-0.59,0.89l-1.32,0.49l-1.4,1.21l-1.48,1.92l-1.62,0.86l-1.76,-0.21l-3.13,-1.83l-4.49,-3.45l-3.55,-2.21l-2.63,-0.95l-2.25,-1.62l-1.87,-2.29l-1.77,-1.57l-1.67,-0.86l-1.8,-2.51l-1.94,-4.17l-0.86,-3.16l0.31,-3.21l-2.32,-7.29l-1.29,-3.18l-1.04,-1.51l-2.14,-1.89l-3.23,-2.28l-4.18,-4.34l-5.11,-6.41l-3.66,-3.93l-2.23,-1.45l-1.82,-2.32l-1.4,-3.19l-1.47,-2.09l-0.17,-0.11l-2.16,-1.4h0l-1.46,-4.26l0.12,0.01l4.25,0.49l4.26,0.49l4.26,0.47l4.26,0.46l4.26,0.45l4.26,0.44l4.26,0.43l4.26,0.42l4.26,0.41l4.26,0.4l4.27,0.39l4.27,0.38l4.27,0.37l4.27,0.36l4.27,0.35l4.27,0.33l0.52,-6.26l0.51,-6.26l0.52,-6.26l0.51,-6.25l0.52,-6.25l0.51,-6.25l0.51,-6.25l0.51,-6.24l0.51,-6.24l0.51,-6.24l0.51,-6.24l0.51,-6.24l0.51,-6.23l0.51,-6.23l0.51,-6.23l0.51,-6.23l0.75,0.04l3.35,0.26l3.35,0.25l3.35,0.24l3.36,0.23l3.36,0.23l3.36,0.22l3.36,0.21l3.36,0.21l3.36,0.2l3.36,0.19l3.36,0.19l3.36,0.18l3.36,0.17l3.36,0.17l3.36,0.16l3.36,0.15l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.12,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l-0.11,2.66l1.07,0.28l1.32,0.79l3.23,2.98l0.96,0.65l1.78,-0.29l1.9,0.42l0.51,-0.04l0.42,-1.2l0.19,-0.24l0.27,0.05l1.62,1.15l0.31,0.44l0.92,1.59l0.18,1.85l0.53,0.29l1.01,0.25l2.47,0.19l3.11,1.3l1.27,0.22l2.26,-0.26l2.08,1.67l0.74,0.26l0.62,-0.21l1.23,-1.16l2.63,0.2l2.14,-0.16l0.14,1.36l0.35,0.98l1.75,1.08l0.41,0.51l0.05,1.65l0.45,0.43l0.72,0.18l0.75,-0.09l0.89,-0.5l1.95,-1.59l0.59,-0.39l0.36,-0.03l0.35,0.09l0.29,0.36l0.62,1.25l1.66,0.7l0.94,1.07l0.59,0.17l0.65,-0.19l1.04,-0.63l0.81,0.04l0.93,-0.64l0.37,0.15l0.15,0.46l-0.29,1.38l0.15,0.53l0.37,0.62l0.5,0.43l0.49,0.07l0.38,-0.34l0.72,-1.73l-0.04,-0.63l0.79,-0.21l0.36,-0.33l0.47,-1.25l0.81,-0.34l0.43,0.07l0.39,0.36l0.78,1.15l1.88,0.66l0.49,0.04l0.49,-0.24l0.85,-0.94l0.44,-0.11l0.35,0.13l0.2,0.14l0.06,1.12l1.93,1.28l1.42,0.39l1.38,1.29l0.4,0.15l0.68,-1.04l1.33,-0.36l1.27,-1.06l3.68,-1.36l1.46,0.43l1.47,-0.03l0.38,-0.6l2.61,-0.87l0.53,-0.33l0.72,0.42l0.26,0.62l0.34,0.26l1.79,0.3l0.99,-0.04l1.81,-0.82l0.7,-1.03l0.41,-0.06l1.3,0.49l3.44,2.04l1.75,1.66l1.94,0.79l1.06,0.71L793.98,412.15zM784.68,513.12l-0.99,0.23l4.27,-3.51l0.89,-1.16l1.15,0.04l-1.89,1.96L784.68,513.12zM750.41,535.55l-0.74,0.09l0.92,-1.21l1.48,-0.6l3.26,-2.32l1.32,-0.15l0.69,-0.8l0.3,-0.12l-0.2,0.99l-2.61,1.39L750.41,535.55zM745.35,541.16l-0.44,0.05l0.99,-1.84l0.19,-0.74l1.61,-2.32l0.84,-0.34l0.34,1l-1.65,1.63L745.35,541.16zM738.34,554.67l-0.65,1.29l0.2,-1.94l1.7,-4.38l3.4,-5.74l1.41,-0.95l-3.91,6.3L738.34,554.67zM741.7,580.59l-0.3,1.05l-1.63,-4.95l-2.58,-11.17l-0.01,-6.34l0.46,-2.17l0.57,8.96l2.88,11.42L741.7,580.59z"
				},
				{
					"id":"US-UT",
					"title":"Utah",
					"d":"M516.91,205.96L516.46,208.7L516,211.44L515.54,214.19L515.08,216.93L514.63,219.67L514.17,222.42L513.71,225.16L513.25,227.9L517.41,228.59L521.58,229.27L525.75,229.94L529.92,230.6L534.09,231.24L538.26,231.87L542.43,232.49L546.61,233.1L545.81,238.61L545.02,244.11L544.22,249.61L543.43,255.11L542.63,260.61L541.84,266.11L541.04,271.61L540.25,277.11L539.45,282.6L538.66,288.1L537.86,293.6L537.07,299.1L536.27,304.6L535.48,310.1L534.68,315.6L533.89,321.1L528.38,320.29L522.88,319.46L517.38,318.61L511.88,317.74L506.39,316.86L500.9,315.95L495.41,315.03L489.92,314.09L484.44,313.13L478.97,312.15L473.49,311.15L468.02,310.13L462.55,309.09L457.09,308.04L451.63,306.97L446.17,305.87L446.86,302.47L447.54,299.07L448.23,295.66L448.91,292.26L449.59,288.86L450.27,285.46L450.96,282.05L451.64,278.65L452.32,275.25L453.01,271.85L453.69,268.45L454.37,265.04L455.06,261.64L455.74,258.24L456.42,254.84L457.11,251.43L457.79,248.03L458.47,244.63L459.16,241.22L459.84,237.82L460.52,234.42L461.21,231.01L461.89,227.61L462.57,224.2L463.26,220.8L463.94,217.39L464.63,213.99L465.31,210.58L465.99,207.17L466.68,203.77L467.36,200.36L468.05,196.95L471.09,197.56L474.14,198.17L477.19,198.76L480.24,199.35L483.29,199.94L486.34,200.52L489.39,201.09L492.44,201.65L495.5,202.21L498.55,202.77L501.61,203.31L504.67,203.86L507.73,204.39L510.79,204.92L513.85,205.44z"
				},
				{
					"id":"US-VA",
					"title":"Virginia",
					"d":"M1078.91,254.04l1.14,0.6l2.47,0.49l1.14,0.78l-0.2,1.08l0.09,0.72l0.57,0.56l3.32,0.66l2.27,1.44l1.27,0.31l0.38,0.09l0.92,0.27l0.5,0.49l0.26,2.52l-0.53,1.39l-1.04,1.2l-1.28,2.01l-0.08,1.62l0.09,2.99l0.9,0.83l0.76,0.11l1.95,-1.09l1.14,0.06l3.14,2.96l4.78,0.41l1.82,0.5l1.73,1.52l2.24,0.6l1.89,1.17l0.26,0.98l-0.28,1.29l0.13,1.63l-0.45,1.14l-1.57,0.46l-1.02,-0.05l-6.38,-4.44l-0.73,-0.38l-2.54,-2.5l-2.57,-1.08l-0.69,0.18l3.81,2.21l1.74,1.74l2.91,2.33l1.91,0.84l1.62,1.6l1.32,0.63l3.36,0.57l-0.88,1.13l1.88,0.38l0.55,1.35l0.2,1.63l-2.52,-0.11l0.18,1.19l0.36,0.65l-0.93,0.8l-1.63,-0.46l-4.72,-3.44l0.15,0.56l0.45,0.59l2.8,2.27l2.33,1.22l1.83,0.38l1.59,1.09l0.64,0.73l0.58,1.2l-0.77,1.07l-0.99,0.71l-1.25,-0.62l-0.98,-0.73l-1.99,-1.17l-0.87,-1.61l-1.24,0.36l-5.74,-1.05l-4.29,0.64l0.5,0.35l0.6,0.18l3.49,-0.18l1.55,0.72l2.97,0.29l1.68,-0.11l1.25,2.58l2.66,1.39l0.59,1.33l1.57,-0.18l2.41,-1.96l1.85,0.09l2.61,-0.17l0.82,0.97l0.9,1.99l1.42,2.15l1.1,2.18l-0.55,0.13l-1.36,0.29l-4.36,0.94l-6.35,1.33l-6.36,1.3l-6.36,1.28l-6.37,1.25l-6.37,1.23l-6.38,1.2l-6.38,1.18l-6.39,1.15l-6.39,1.13l-6.4,1.1l-6.4,1.07l-6.4,1.05l-6.41,1.02l-6.41,1l-6.41,0.97l-0.36,-0.29l-2.53,0.3l-1.87,0.22l-0.76,0.58l-3.72,0.56l-2.97,0.44l-5.01,0.73l-6.11,0.86l-8.61,1.18l-4.03,0.53l1.66,-1.29l2.56,-0.99l4.47,-2.46l1.62,-2.1l2.45,-1.72l0.87,-1.76l1.54,-1.77l0.4,-1.81l0.2,-0.3l2.67,-1.99l2.75,-2.39l5.8,-6.35l0.24,0.68l-0.12,0.8l0.7,0.8l0.68,1.33l0.79,0.76l0.92,0.55l1.45,0.4l1.78,0.82l1.31,0.1l0.42,-0.1l1.23,-1.26l1.07,-0.74l1.03,-1.32l2.41,1.19l0.86,-0.14l2.01,-1.02l1.96,-0.51l0.46,-0.29l0.63,-0.76l-0.2,-1.29l0.11,-0.36l0.3,-0.21l0.39,-0.1l0.97,0.32l0.88,-0.14l3.46,-2.12l0.3,0.06l0.59,0.6l1.48,-1.16l0.82,-0.98l0.21,-1.3l0.59,-1.34l-0.26,-0.51l-0.64,-0.6l0.4,-1.74l0.72,-1.78l2.89,-5.52l0.67,-3.16l1.21,-2.17l0.24,-1.6l0.91,-1.7l0.25,-3.21l0.39,-0.71l0.7,-0.23l0.8,0.25l0.63,0.47l0.51,0.86l2.02,0.46l1.59,-0.19l0.99,-0.79l0.44,-1.2l0.48,-2.18l0.6,-1.35l0.25,-1.61l0.35,-1.15l0.72,-0.82l2.11,-0.36l0.9,-1.13l0.63,-1.21l0.44,-0.44l0.6,-0.06l1.57,-2.05l1.8,-4.01l0.1,-2.33l0.33,-1.72l-0.07,-1.69l0.31,-0.99l2.54,1.34l1.47,0.78l3.34,1.75l2.22,1.16l0.39,-1.93L1078.91,254.04zM1127.21,273.28l0.44,-0.17l0,0l-1.07,3.72l-0.7,0.53L1127.21,273.28zM1120.65,276.69l0.45,-1.13l2.5,-0.93l1.55,-0.59l-1.83,9.4l0.52,1.53l-0.65,0.68l-1.07,0.68l-0.96,1.21l-0.55,1.21l-0.1,2.95l-0.69,3.45l-1.16,-1.11l-0.47,-1.07l-0.27,-3.01l0.43,-5.12l0.98,-3.35l0.94,-1.69L1120.65,276.69z"
				},
				{
					"id":"US-VT",
					"title":"Vermont",
					"d":"M1147.99,160.58L1146.42,160.93L1144.84,161.28L1143.26,161.64L1141.68,161.98L1140.1,162.33L1138.53,162.68L1136.95,163.02L1135.37,163.36L1134.61,162.15L1134.54,160.98L1134.18,159.46L1133.71,157.46L1133.2,155.27L1132.5,152.29L1132.04,150.29L1131.62,148.5L1131.04,146.04L1129.77,144.91L1129.33,144.78L1129.07,144.99L1128.63,146.06L1128.42,146.11L1128.19,145.92L1128.02,145.08L1127.87,142.03L1127.65,141.12L1127.13,139.6L1125.58,136.25L1125.36,135.47L1125.31,134.18L1125.45,132.85L1125.9,131.42L1125.94,130.85L1125.33,128.72L1125.06,126.68L1123.33,123.94L1122.71,119.99L1121.98,118.21L1121.87,116.43L1121.39,115.02L1124,114.34L1130.39,112.68L1136.78,110.98L1143.15,109.26L1149.52,107.51L1149.39,108L1150.22,109.62L1149.34,113.02L1149.63,113.96L1151.11,116.34L1151.23,116.97L1151.07,117.34L1151.04,118.53L1150.79,119.35L1150.28,120.22L1148.53,122.46L1147.99,123.05L1146.06,124.16L1145.77,124.91L1146.36,129.01L1146.28,131.42L1146.42,132.49L1145.97,134.49L1145.76,136.7L1145.03,138.65L1144.92,140.82L1144.74,141.69L1144.72,143.02L1145.5,147.36L1145.62,149.81L1146.13,153.97L1146.03,155.07L1145.81,155.71L1145.79,157.56L1145.91,158.22L1146.27,158.74L1147.52,159.88z"
				},
				{
					"id":"US-WA",
					"title":"Washington",
					"d":"M442.1,99.88l-3.77,-0.89l-4.04,-0.96l-4.03,-0.97l-4.03,-0.98l-4.03,-0.99l-4.02,-1l-4.02,-1.02l-4.02,-1.03l-0.26,-0.06l-0.56,0.29l-2.13,0.29l-3.87,-0.76l-8.2,0.05l-3.8,0.73l-3.18,-0.01l-5.72,-0.76l-5.29,-0.3l-2.07,-0.7l-0.62,-1.18l-2.25,-1.22l-3.89,-1.27l-3.49,-0.35l-3.61,0.97l-1.03,-0.1l0,0l-0.81,-0.18l-5.18,-2.34l-1.32,-0.45l-0.84,-1.34l0.19,-1.72l0.03,-5.34l-0.58,-3.38l-1.2,-1.43l-1.05,-0.76l-1.65,0.08l-0.37,-0.43l-0.68,-0.29l-1.24,-1.56l-0.56,-1.35l-2.78,-0.79l-0.35,-0.87l-3.29,-0.28l-0.72,-1.01l-1.82,-0.08l1.05,-1.87l0.73,-2.54l0.87,-2.42l-0.16,1.92l0.44,2.23l1.18,-2l1.2,-2.6l-0.68,-1.36l-1.43,-1.31l0.21,-2.71l4.64,-0.89l-1.95,-1.12l-0.52,-1.23l-0.98,-0.44l-0.31,0.72l-0.64,0.87l0.06,-1.41l0.39,-1.56l0.42,-2.74l-0.26,-4.72l0.79,-5.76l-0.34,-3.08l-1.49,-3.33l-0.12,-1.7l0.69,-3.98l1.25,-2.78l0.23,-2.17l1.07,0.48l2.4,2.54l3.23,2.42l0.81,1.27l1.55,1.24l9.48,4.13l0.67,0.1l1.47,-0.26l0.52,0.25l0.99,1.94l0.67,0.4l0.96,0.21l0.78,-0.07l1.5,-0.66l0.04,0.43l-0.31,0.94l0.01,1.48l0.34,2.02l0,1.19l-2.7,2.54l-0.36,-0.04l0.26,-1.06l-0.17,-0.27l-4.92,4.18l-1.93,2.1l-0.46,1.08l-0.16,0.66l0.42,0.3l1.15,0.08l1.9,-0.54l0.14,-0.2l-1.59,-0.09l-0.72,-0.19l0.45,-1.13l0.34,-0.5l1.49,-1.43l1.33,-0.72l1.77,-0.66l1.1,-0.65l0.97,-1.15l2.07,-1.1l0.43,-0.35l0.32,-1.33l0.18,-0.22l0.71,0.41l-0.36,2.34l-0.49,0.94l-1.74,0.8l-0.3,0.38l-0.26,1.74l-0.26,0.1l-0.47,-0.36l-0.19,0.06l0.76,2.2l-0.01,1.53l-0.32,1.27l-1.08,2.3l-0.5,0.28l-0.61,-0.34l-0.64,-1.01l-0.27,0.18l-1.25,1.66l-0.18,-0.23l0.24,-2.35l-0.18,-0.24l-1.64,0.6l-0.83,0.81l-0.93,1.41l-0.81,0.54l1.62,0.67l1.59,0.14l0.98,1.1l0.4,0.15l1.32,-0.39l0.48,-0.39l1.61,-2.06l0.58,-0.28l0.68,0.19l0.76,-0.15l1.35,-0.99l0.19,-0.5l0.5,-2.98l0.59,-1.6l-0.03,-0.57l-0.27,-0.66l0.21,-0.51l0.59,-0.76l0.25,-0.77l-0.08,-0.78l0.36,-0.74l1.41,-1.41l0.39,-0.69l1.61,-1.35l-0.08,-0.76l-0.57,-1.07l-0.3,-0.88l-0.18,-1.29l-0.28,-0.5l-0.18,0.14l0,2.02l-0.16,0.09l-1.14,-1.43l-0.14,-0.73l0.08,-0.91l0.32,-0.6l0.96,-0.4l0.99,0.04l0.08,-0.56l-0.63,-2.08l-0.53,-1.02l-0.47,-0.56l-0.76,-0.34L371,23.95l0.03,-0.44l0.33,-0.49l0.47,-0.04l1.16,0.58l0.77,-0.18l0.15,-0.71l-0.08,-0.44l0.77,-2.46l0.14,-2.15l-0.14,-0.41l-0.25,-0.11L374,17.29l-0.79,-0.16l-0.27,-0.8l-0.14,-1.43l-0.03,-3.32l1.46,0.44l6.08,1.82l6.09,1.8l6.1,1.76l6.1,1.74l6.11,1.71l6.12,1.68l6.13,1.65l6.14,1.62l6.14,1.59l6.15,1.56l6.16,1.54L447.7,32l6.17,1.48l1.51,0.36l-0.8,3.52l-0.82,3.53l-0.82,3.53l-0.82,3.52l-0.82,3.52l-0.82,3.52l-0.82,3.52l-0.82,3.52l-0.82,3.52l-0.81,3.52l-0.81,3.51l-0.82,3.51l-0.81,3.51l-0.81,3.51l-0.81,3.51l-0.81,3.5l-0.16,0.18l-0.22,0.48l0.09,1.56l0.52,2.37l-0.04,1.57l-0.59,0.77l-0.08,1.56L442.1,99.88zM368.54,10.29l0.53,0.16l-0.3,0.27l-0.18,-0.12L368.54,10.29zM370.77,18.54l0.05,0.53l-0.71,0.28l-0.43,-0.05l-0.43,-0.93l-0.26,-0.17l-0.12,1.2l-0.2,0.36l-1.12,-1.1l-0.08,-0.63l0.55,-0.47l1.02,-0.34l0.31,0.02L370.77,18.54zM366.33,21.25l0.16,0.82l-1.41,-0.93l-0.53,-0.61l-0.07,-0.46l0.17,-1.37l0.24,-0.39l0.73,0.06l0.79,2.01L366.33,21.25zM368.63,23.59l-0.29,0.14l-0.68,-0.52l-0.31,-0.62l0.03,-0.65l0.64,-1.06l0.47,-0.18l0.22,0.14l-0.21,1.04l0.35,1.28L368.63,23.59zM370.41,30.6l-0.14,3.05l0.66,-1.09l1.36,2.63l-0.3,1.01l-0.34,0.27l-0.44,0l-0.29,-0.41l-0.14,-0.81l-0.33,-0.51l-0.87,-0.52l-0.25,-0.95l-0.01,-0.6l0.43,-1.6l-0.09,-0.56l-0.47,-0.26l-0.37,-0.52l-0.4,-1.33l-0.01,-0.33l0.62,-0.8l1.26,-1.27l0.8,-0.54l0.34,0.19l0.31,0.59l0.28,0.99l-0.28,0.56l-2.5,0.49l-0.15,0.25l0.95,0.64l0.3,0.4L370.41,30.6zM367.86,43.06l-0.2,0.39L367,42.71l-0.13,-0.54l0.34,-1.01l0.4,-0.61l0.19,-0.09l0.39,0.43l0.08,0.21L367.86,43.06zM368.08,47.81l-0.21,0.47l-0.68,0.21l-0.26,-0.18l0.15,-0.58l-0.13,-0.13l-0.81,0.51l0.46,-1.36l0.73,-1.36l0.27,0.05l0.11,1.06L368.08,47.81zM360.12,49.89l-0.27,0.38l-0.2,-0.08l-0.2,-1l0.13,-0.62l0.53,-0.32l0.14,1.42L360.12,49.89z"
				},
				{
					"id":"US-WI",
					"title":"Wisconsin",
					"d":"M851.32,111.65l-0.48,0.38l-0.2,-0.16l0.08,-0.7l0.23,-0.42l0.38,-0.14l0.2,0.15l0.02,0.45L851.32,111.65zM847.13,114.11l-0.22,0.17l-0.61,-0.34l-0.1,-0.31l0.14,-0.32l0.27,0.06l0.41,0.44L847.13,114.11zM852.21,121.33l-0.07,0.18l0.36,0.79l0.78,-0.26l0.38,0.47l0.48,0.18l0.91,0.34l0.49,0.91l0.49,0.91l0.49,0.91l0.49,0.91l1.97,0.41l1.97,0.41l1.97,0.41l1.98,0.4l1.98,0.4l1.98,0.4l1.98,0.4l1.98,0.39l1.14,0.55l1.14,0.55l1.14,0.54l1.15,0.54l1.72,-0.01l1.55,0.26l2.13,-0.16l2.19,0.29l3.25,0.78l0.82,0.83l0.17,0.59l-0.18,1.42l3.13,0.98l1.38,0.82l0.55,0.67l-0.02,0.65l0.43,1.33l-0.25,0.76l0.11,1.28l-0.57,1.41l-0.17,0.75l0.04,0.61l0.18,0.38l0.38,0.12l1.14,-0.18l1.1,-0.51l0.53,0.21l0.12,0.2l-0.05,0.38l-0.71,2.37l0.12,0.92l0.47,0.86l0.72,0.82l0.78,0.23l0.02,0.58l-0.2,1.15l-0.81,0.97l-2.23,1.33l-0.3,0.79l0.01,0.63l-1.27,2.73l-0.59,1.65l-0.34,1.7l0.24,1.03l0.83,0.36l0.63,-0.22l0.42,-0.8l0.69,-0.75l0.96,-0.7l0.66,-0.97l0.82,-2.28l1.03,-1.36l0.6,-0.13l0.17,0.02l1.14,-0.68l0.98,0.1l0.66,0.8l0.65,0.53l0.18,0.54l-0.18,1.26l-0.42,1.35l-0.67,1.44l-0.53,2.12l-0.4,2.79l0.05,2.08l0.51,1.36l-0.24,1.28l-1,1.2l-0.75,1.55l-0.5,1.89l-0.24,1.57l0.02,1.26l0.18,0.93l0.53,1.22l0.03,0.64l-0.95,2.88l-0.31,1.39l0.02,1.07l-0.2,1.07l-0.73,2.22l-0.18,1.21l0.04,1.09l0.37,1.77l-0.06,0.61l0.09,0.45l0.26,0.29l0.05,0.56l-0.16,0.84l0.15,0.63l0.46,0.42l0.35,0.84l0.24,1.26l0.41,1.04l0.59,0.81l0.2,1.23l-0.18,1.65l0.11,3.06l0.09,1.02l-2.1,0.17l-7.4,0.58l-7.4,0.55l-7.41,0.51l-7.41,0.47l-7.41,0.44l-7.56,0.4l-0.12,-0.16l-0.62,-1.97l-1.74,-1.38l-2.86,-0.81l-1.88,-1.42l-0.9,-2.03l-0.63,-2.3l-0.35,-2.57l0.11,-2.18l0.57,-1.78l-0.23,-1.17l-1.03,-0.57l-0.7,-0.77l-0.37,-0.99l-0.19,-1.38l-0.88,-6.55l-0.83,-3.06l-1.07,-1.16l-2.2,-1.31l-3.32,-1.46l-2.07,-1.42l-1.24,-2.06l-2.4,-2.38l-1.54,-0.95l-1.48,-0.32l-1.2,-0.75l-0.91,-1.18l-1.22,-0.72l-1.54,-0.26l-1.74,-0.93l-2.08,-1.73l-0.05,-0.14l-0.47,-1.28l0.21,-0.74l0.25,-2.51l-0.06,-0.79l-0.52,-2.26l0.51,-0.9l-0.21,-2.81l0.16,-0.93l0.99,-2.34l0.01,-1.18l-0.43,-1.34l-0.83,-1.08l-2.16,-1.08l-0.11,-1.43l0.31,-1.08l1.31,-2.05l0.7,-1.8l0.66,-0.79l4.11,-2.82l0.89,-0.22l0.62,-0.78l0.5,-0.35l-0.13,-3.23l-0.13,-3.23l-0.13,-3.23l-0.13,-3.23l1.04,-0.27l0.42,-0.83l1.01,-1.3l0.28,0v0.01l0.55,0.55l1.36,0.78l1.03,0.06l1.31,-0.23l5.12,-1.68l2.14,-1.11l2.06,-1.79l0.22,-0.06l0.91,0.26l0.29,0.13l2.68,-2.08l0.9,-0.3l0.72,0.01l0.93,0.71l0.23,0.45l-0.25,0.91l-0.73,1.36l-0.33,1.13l0.07,0.89l-0.29,0.99l-0.81,1.36l0.34,0.34l2.31,-1.08l0.32,-0.39l0.03,-0.22l-0.16,-0.26l0.26,-0.13l1.93,1.18l1.28,0.64l1.06,0.28L852.21,121.33zM849.62,114.15l-0.5,0.16l-1.12,-0.13l0,-0.33l1.12,-0.52l0.5,-0.16l0.13,0.18L849.62,114.15zM847.28,117.35l-0.86,0.36l-0.37,-0.04l0.12,-0.43l0.43,-0.53l1.97,-1.38l0.36,0l0.13,0.29l-0.96,0.68l-0.35,0.35l-0.03,0.34L847.28,117.35zM909.69,144.56l-0.45,0.27l-0.87,0.01l-0.36,-0.47l0.32,-1.32l0.21,0.22l0.75,-0.06l0.27,0.1l0.11,0.31L909.69,144.56zM907.9,147.25l-0.26,0.31l-0.51,-0.14l-0.15,0.44l0.21,1.02l-0.11,0.49l-0.44,-0.03l0,0.19l0.42,0.42l0.09,0.49l-0.25,0.57l-0.26,0.28l-0.28,-0.01l-0.37,0.66l-0.46,1.33l-0.13,0.76l0.21,0.19l-0.09,0.44l-1.27,2.08l-0.54,0.24l-0.64,-0.21l-0.49,-0.53l-0.34,-0.84l-0.14,-0.66l0.06,-0.48l1.12,-1.84l0.46,-1.18l0.2,-1.29l0.51,-0.86l0.83,-0.43l0.62,-0.85l0.41,-1.27l0.56,-0.59l0.71,0.09l0.35,0.43L907.9,147.25z"
				},
				{
					"id":"US-WV",
					"title":"West Virginia",
					"d":"M1047.74,251.56L1048.21,254.37L1048.68,257.17L1049.15,259.98L1049.62,262.79L1051.49,260.76L1052.51,259.97L1055.54,255.69L1056.02,255.58L1057.39,255.85L1059.55,252.8L1059.69,251.81L1059.94,251.45L1060.28,251.42L1060.53,251.63L1060.51,252.18L1060.76,252.39L1061.96,252.8L1063.55,252.84L1063.76,252.83L1065.1,252.56L1065.6,251.95L1065.71,250.9L1066.2,250.21L1067.52,249.69L1069.75,248.19L1071.19,248.08L1072.58,248.86L1073.88,249.11L1075.1,248.82L1075.62,248.97L1075.44,249.55L1075.88,250.08L1076.95,250.57L1077.39,251.13L1077.2,251.78L1077.39,252.19L1077.94,252.36L1078.36,252.94L1078.67,253.91L1078.91,254.04L1078.34,256.88L1077.95,258.8L1075.73,257.64L1072.38,255.88L1070.92,255.11L1068.38,253.76L1068.07,254.75L1068.14,256.44L1067.81,258.16L1067.71,260.49L1065.91,264.5L1064.34,266.55L1063.75,266.62L1063.31,267.06L1062.68,268.27L1061.78,269.39L1059.66,269.75L1058.95,270.57L1058.59,271.72L1058.35,273.32L1057.75,274.67L1057.26,276.85L1056.82,278.05L1055.83,278.83L1054.24,279.03L1052.22,278.57L1051.71,277.71L1051.08,277.24L1050.28,276.98L1049.58,277.22L1049.19,277.92L1048.95,281.13L1048.04,282.83L1047.81,284.43L1046.59,286.6L1045.93,289.76L1043.04,295.28L1042.31,297.06L1041.91,298.8L1042.55,299.4L1042.82,299.91L1042.22,301.25L1042.02,302.55L1041.19,303.53L1039.72,304.69L1039.13,304.09L1038.83,304.02L1035.38,306.15L1034.5,306.28L1033.52,305.96L1033.14,306.06L1032.83,306.27L1032.72,306.63L1032.92,307.92L1032.28,308.69L1031.82,308.98L1029.86,309.49L1027.86,310.51L1027,310.65L1024.59,309.46L1023.56,310.78L1022.49,311.52L1021.26,312.78L1020.84,312.89L1019.54,312.79L1017.76,311.97L1016.31,311.57L1015.39,311.02L1014.6,310.25L1013.92,308.93L1013.22,308.13L1013.35,307.33L1013.1,306.65L1010.58,306.34L1007.1,304.26L1004.65,301.45L1003.8,300.1L1002.93,299.24L1002.6,298.27L1000.36,296L999.7,294.97L999.56,294.27L999.96,292.85L999.98,292.18L999.3,288.95L998.81,288.4L1000.91,288.83L1002.76,288.13L1003.8,286.94L1004.03,285.28L1004.55,284.26L1005.37,283.87L1005.65,283.11L1005.26,281.43L1004.81,280.3L1005.24,278.51L1006.4,275.68L1007.46,274.43L1008.41,274.77L1009.08,275.5L1009.45,276.62L1009.65,276.74L1009.89,276.68L1010.42,275.7L1010.96,275.26L1011.21,275.31L1011.47,275.25L1011.42,274.68L1010.71,273.18L1010.6,272.26L1011.1,271.89L1011.52,270.75L1011.85,268.83L1012.44,267.78L1013.3,267.6L1014.11,266.7L1014.89,265.1L1015.72,264.54L1016.62,265.02L1017.64,264.9L1018.76,264.18L1020.61,262.32L1023.17,259.29L1024.34,257L1024.11,255.43L1024.63,251.43L1025.88,244.99L1026.33,240.89L1025.99,239.11L1025.42,237.71L1024.63,236.69L1024.84,235.74L1026.65,234.45L1027.07,236.97L1027.51,239.5L1027.94,242.04L1028.38,244.57L1028.82,247.1L1029.25,249.63L1029.69,252.17L1030.13,254.7L1032.33,254.32L1034.54,253.94L1036.74,253.55L1038.94,253.16L1041.14,252.76L1043.34,252.37L1045.54,251.97z"
				},
				{
					"id":"US-WY",
					"title":"Wyoming",
					"d":"M634.51,198.52L634.04,204.07L633.56,209.62L633.08,215.17L632.61,220.72L632.13,226.26L631.66,231.81L631.18,237.35L630.7,242.9L625.43,242.42L620.17,241.93L614.9,241.41L609.63,240.88L604.37,240.34L599.11,239.77L593.85,239.18L588.59,238.58L583.33,237.96L578.08,237.32L572.83,236.66L567.58,235.99L562.33,235.29L557.09,234.58L551.85,233.85L546.61,233.1L542.43,232.49L538.26,231.87L534.09,231.24L529.92,230.6L525.75,229.94L521.58,229.27L517.41,228.59L513.25,227.9L513.71,225.16L514.17,222.42L514.63,219.67L515.08,216.93L515.54,214.19L516,211.44L516.46,208.7L516.91,205.96L517.49,202.52L518.06,199.1L518.63,195.67L519.2,192.23L519.77,188.8L520.35,185.37L520.92,181.94L521.49,178.51L522.07,175.07L522.64,171.63L523.21,168.2L523.79,164.76L524.36,161.32L524.93,157.89L525.51,154.45L526.08,151.01L526.54,148.24L527.01,145.47L527.48,142.7L527.94,139.93L531.37,140.5L534.8,141.06L538.24,141.62L541.67,142.16L545.11,142.7L548.55,143.22L551.99,143.74L555.43,144.26L558.87,144.76L562.31,145.25L565.76,145.74L569.2,146.22L572.65,146.69L576.1,147.15L579.54,147.6L582.99,148.05L586.44,148.48L589.9,148.91L593.35,149.33L596.8,149.74L600.26,150.15L603.72,150.54L607.17,150.93L610.63,151.31L614.09,151.67L617.55,152.04L621.01,152.39L624.47,152.73L627.93,153.07L631.39,153.4L634.86,153.72L638.32,154.03L637.85,159.6L637.37,165.17L636.89,170.73L636.41,176.29L635.94,181.85L635.46,187.41L634.99,192.96z"
				}
			]
		}
	}
};

$(document).ready(function() {

  $(".myBox").click(function(event){
      event.preventDefault();
      newLocation = "/home";
      $('body').fadeOut(500, newpage);
  });

  $(".pvwatts").click(function(event){
      event.preventDefault();
      newLocation = "http://www.nrel.gov/rredc/pvwatts/";
      $('body').fadeOut(500, newpage);
  });

  $(".cleantechnica").click(function(event){
      event.preventDefault();
      newLocation = "http://cleantechnica.com/2012/10/08/average-size-of-solar-in-the-united-states-small/";
      $('body').fadeOut(500, newpage);
  });

  $(".welcome").mouseenter(function(){
    $(".welcome").fadeTo("fast",1);
  });

  $(".welcome").mouseleave(function(){
    $(".welcome").fadeTo("fast",.8);
  });

  $(".logo").mouseenter(function(){
    $(".logo").fadeTo("fast",1);
  });

  $(".logo").mouseleave(function(){
    $(".logo").fadeTo("fast",.8);
  });

  $(".data").mouseenter(function(){
    $(".data").fadeTo("fast",1);
  });

  $(".data").mouseleave(function(){
    $(".data").fadeTo("fast",.8);
  });


  // change welcome to body to do for all pages

  // $('body').css('display', 'none');

  $('body').fadeIn(1000);



  $('a').click(function(event) {

  event.preventDefault();

  newLocation = this.href;

  $('body').fadeOut(500, newpage);

  });



  function newpage() {

  window.location = newLocation;

  }



  });
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//



;
