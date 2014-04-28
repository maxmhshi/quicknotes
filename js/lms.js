/* --------------------------------------------------------------- */
/**
 * FILE NAME   : lms.js
 * AUTHOR      : Patrick C. K. Wu
 * SYNOPSIS    :
 * DESCRIPTION : LMS Object Javascript library
 * SEE ALSO    :
 * VERSION     : 2.0 ($Revision: 4259 $)
 * CREATED     : 08-DEC-2011
 * LASTUPDATES : $Author: patrickw $ on $Date: 2012-07-17 17:21:11 +0800 (Tue, 17 Jul 2012) $
 * UPDATES     : 
 * NOTES       : 09-JUL-2012    - Add copyright
                 17-JUL-2012    - Support multi-language for copyright
                                  (Bug# 5903)
 */
/* ---------------------------------------------------------------
   @(#)lms.js                   1.0 08-DEC-2011
                                2.0 17-JUL-2012
   by Patrick C. K. Wu


   Copyright by ASTRI, Ltd., (ECE Group)
   All rights reserved.

   This software is the confidential and proprietary information
   of ASTRI, Ltd. ("Confidential Information").  You shall not
   disclose such Confidential Information and shall use it only
   in accordance with the terms of the license agreement you
   entered into with ASTRI.
   --------------------------------------------------------------- */


/* ===============================================================
   Begin of lms.js
   =============================================================== */


/* ---------------------------------------------------------------
   Included header
   --------------------------------------------------------------- */


/* ---------------------------------------------------------------
 * Global Variables
 * --------------------------------------------------------------- */


/* ---------------------------------------------------------------
   Class definition
   --------------------------------------------------------------- */
/**
 * Dependency checking
 *
 * @since       Version 1.0.00
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */


/**
 * Create global variable ORPLMS
 *
 * @since       Version 1.0.00
 * @param       nil
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */
(
    function () {
        var global = this,
            ua = navigator.userAgent;

        if (typeof ORPLMS === 'undefined') {
            global.ORPLMS = {};
        }

        // Define version information
        if ( typeof lms_global === 'object' ) {
            ORPLMS.version = lms_global.attr('version');
            ORPLMS.build = lms_global.attr('build');
            ORPLMS.lmsroot = lms_global.attr('lmsroot');
            ORPLMS.wwwroot = lms_global.attr('wwwroot');
            ORPLMS.support_url = lms_global.attr('supporturl');
        }

        /**
         * This copies all the properties of <code>properties</code> to the
         * specified object <code>obj</code>
         *
         * @since       Version 1.0.00
         * @param       obj             The target to receive the properties
         * @param       properties      The source of the properties
         * @return      returns <code>obj</code>
         * @see
         */
        /*
         * @author      Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        ORPLMS.apply = function (obj, properties) {
            if (obj && properties && (typeof properties === 'object')) {
                var e;
                for (e in properties) {
                    if (properties.hasOwnProperty(e)) {
                        obj[e] = properties[e];
                    }
                }
            }
            return (obj);
        };

        ORPLMS.Browser = {
            init: function () {
                this.platform = 'Unknown';
                this.userAgent = ua;

                if ( typeof Ext !== 'object' ) {
                    return;
                }
                for ( key in Ext.is ) {
                    if ( (typeof Ext.is[key] === 'boolean') && Ext.is[key] ) {
                        strKey = key.toLowerCase();
                        if (
                            (strKey != 'desktop')       &&
                            (strKey != 'phone')         &&
                            (strKey != 'ios')           &&
                            (strKey != 'tablet')
                        ) {
                            if ( this.platform != 'Android' ) {
                                this.platform = key;
                            }
                        }
                    }
                }
                if (this.platform == 'Unknown') {
                    if (/PlayBook/i.test(ua)) {
                        this.platform = 'PlayBook';
                    }
                }
            },
            is: function (browser) {
                if (typeof browser === 'string') {
                    var regex = new RegExp('('+browser+')[ \\/]([\\w.]+)', 'i');
                    var match = regex.exec(ua);
                    if (match) {
                        return (match[2]);
                    }
                }
                else {
                    return;
                }
            }
        };
        ORPLMS.Browser.init();
    }
)();

/**
 * Create class manager for ORPLMS
 *
 * @since       Version 1.0.00
 * @param       nil
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */
(
    function () {
        var Manager = ORPLMS.ClassManager = {
            classes: {},

            /**
             * Add the <code>constructor</code> of the class with
             * <code>name</code> to ORPLMS.ClassManager
             *
             * @since   Version 1.0.00
             * @param   classname       The name of desired class
             * @param   constructor     The class constructor
             * @return  nil
             * @see
             */
            /*
             * @author  Patrick C. K. Wu
             * @testing
             * @warnings
             * @updates
             */
            add: function (classname, constructor) {
                if (this.isCreated(classname)) {
                    // Error
                    return;
                }
                this.classes[classname] = constructor;
            },

            /**
             * Get the class constructor by its <code>classname</code>
             *
             * @since   Version 1.0.00
             * @param   classname       The name of desired class
             * @return  returns class constructor if found; otherwise,
                        <code>null</code> is returned
             * @see
             */
            /*
             * @author  Patrick C. K. Wu
             * @testing
             * @warnings
             * @updates
             */
            get: function (classname) {
                if (this.classes.hasOwnProperty(classname)) {
                    return (this.classes[classname]);
                }
                return (null);
            },

            /**
             * Check if class with <code>name</code> is created or not
             *
             * @since   Version 1.0.00
             * @param   classname       The name of desired class
             * @return  returns <code>true</code> if found; otherwise,
                        <code>false</code> is returned
             * @see
             */
            /*
             * @author  Patrick C. K. Wu
             * @testing
             * @warnings
             * @updates
             */
            isCreated: function (name) {
                if (this.classes.hasOwnProperty(name)) {
                    return (true);
                }
                return (false);
            }
        };
    }
)();

/**
 * Create base class for ORPLMS
 *
 * @since       Version 1.0.00
 * @param       nil
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */
(
    function () {
        ORPLMS.Obj = function (name, properties) {
            this.$instanceName = name;
        };
        ORPLMS.Obj.prototype = {
            $className: 'ORPLMS.Obj',
            constructor: ORPLMS.Obj,
            setProperties: function (properties) {
            },
            toString: function () {
                if (this.$instanceName) {
                    return (this.$instanceName);
                }
                return (this.$className);
            }
        };
        ORPLMS.ClassManager.add('ORPLMS.Obj', ORPLMS.Obj);
    }
)();

/**
 * Define class operations of ORPLMS
 *
 * @since       Version 1.0.00
 * @param       nil
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */
ORPLMS.apply(
    ORPLMS,
    {
        /**
         * Copy the enumerable properties of <code>properties</code> to
         * <code>obj</code> and return <code>obj</code>.  If <code>obj</code>
         * and <code>properties</code> have a property by the same name, the
         * property of <code>obj</code> is overwritten.  This function does not
         * handle getters and setters or copy attributes.
         *
         * @since       Version 1.0.00
         * @param       obj             The target objec to receive properties
         * @param       properties      The properties source
         * @return      returns <code>obj</code>
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        _extend: (
            function () {
                var p, protoprops = [
                    "toString", "valueOf", "constructor", "hasOwnProperty",
                    "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"
                ];
                for (p in {toString: null}) {
                    return function extend(o) {
                        var i, source, prop;
                        for (i = 1; i < arguments.length; i++) {
                            source = arguments[i];
                            for (prop in source) {
                                o[prop] = source[prop];
                            }
                        }
                        return o;
                    };
                }
                return function patched_extend(o) {
                    var i, source, prop;
                    for (i = 1; i < arguments.length; i++) {
                        source = arguments[i];
                        for (prop in source) {
                            o[prop] = source[prop];
                        }
                        for (var j = 0; j < protoprops.length; j++) {
                            prop = protoprops[j];
                            if (source.hasOwnProperty(prop)) {
                                o[prop] = source[prop];
                            }
                        }
                    }
                    return o;
                };
            }()
        ),

        /**
         * This function returns a newly created object that inherits
         * properties from <code>prototype</code>.  It uses the ECMAScript 5
         * function Object.create() if it is defined, and otherwise falls back
         * to an older technique.
         *
         * @since       Version 1.0.00
         * @param       prototype       The prototype object
         * @return      returns the inherited object
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        _inherit: function (prototype) {
            var t;
            if (prototype == null) {
                throw new TypeError();    
            }
            if (Object.create) {
                return Object.create(prototype);
            }

            t = typeof prototype;
            if (t !== "object" && t !== "function") {
                throw new TypeError();
            }

            function F() {}
            F.prototype = prototype;
            return new F();
        },

        /**
         * This function create a new function from <code>fn</code> and apply
         * <code>scope</code> to <code>this</code> when the function is called
         *
         * @since       Version 1.0.00
         * @param       fn              The function to delegate
         * @param       scope           The <code>this</code> reference in
                                        which the function is executed
         * @return      returns new function
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        bind: function (fn, scope) {
            return function() {
                return fn.apply(scope, arguments);
            }
        },

        /**
         * An empty function
         *
         * @since       Version 1.0.00
         * @param       nil
         * @return      nil
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        empty: function () {},

        /**
         * This function returns a newly created object from class with
         * <code>classname</code> and copy the enumerable properties of
         * <code>properties</code> to the newly created object.  If the
         * created object and <code>properties</code> have a property by the
         * same name, the property of <code>obj</code> is overwritten.
         *
         * @since       Version 1.0.00
         * @param       classname       The name of desired class
         * @param       properties      The properties source
         * @return      returns the newly created object
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        create: function (classname, properties) {
            var F = ORPLMS.ClassManager.get(classname),
                name = 'no_name',
                obj;

            if (properties && properties.hasOwnProperty('name')) {
                if (typeof properties.name === 'string') {
                    name = properties.name;
                }
            }
            obj = new F(name);
            ORPLMS._extend(obj, properties);

            return (obj);
        },

        /**
         * This function defines a class with name <code>classname</code> with
         * and define instance properties <code>instprops</code> and class
         * properties <code>classprops</code>.
         *
         * @since       Version 1.0.00
         * @param       classname       The name of desired class
         * @param       instprops       The instance properties
         * @param       classprops      The class properties
         * @return      returns the inherited object
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        define: function (classname, instprops, classprops) {
            return (
                ORPLMS.extend(classname, 'ORPLMS.Obj', instprops, classprops)
            );
        },

        /**
         * This function defines a new class with name <code>classname</code>
         * and extend the class with name <code>superclass</code>.  Then it
         * defines instance properties <code>instprops</code> and class
         * properties <code>classprops</code> to the new class.
         *
         * @since       Version 1.0.00
         * @param       classname       The name of desired class
         * @param       instprops       The instance properties
         * @param       classprops      The class properties
         * @return      returns the inherited object
         * @see
         */
        /*
         * @author  Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        extend: function (classname, superclass, instprops, classprops) {
            var Manager = ORPLMS.ClassManager,
                newClass;

            if (
                Manager.isCreated(classname) || !Manager.isCreated(superclass)
            ) {
                // Error
                return (null);
            }
            superclass = Manager.get(superclass);

            newClass = ORPLMS.Class = function (name) {
                this.$instanceName = name;
                this.$superClass = superclass;
            };

            newClass.prototype = ORPLMS._inherit(superclass.prototype);
            newClass.prototype.constructor = newClass;
            newClass.prototype.$className = classname;
            newClass.$superClass = superclass;

            if (instprops) {
                ORPLMS._extend(newClass.prototype, instprops);
            }
            if (classprops) {
                ORPLMS._extend(newClass, classprops);
            }
            ORPLMS.ClassManager.add(classname, newClass);
            return newClass;
        }
    }
);


/**
 * Define general property query functions of ORPLMS
 *
 * @since       Version 2.0.00
 * @param       nil
 * @return      nil
 * @see
 */
/*
 * @author      Patrick C. K. Wu
 * @testing
 * @warnings
 * @updates
 */
ORPLMS.apply(
    ORPLMS,
    {
        // Variables ---------------------------------------------
        copyright: null,
 
        // Functions ---------------------------------------------
        /**
         * Get the copyright string from ORPLMS
         *
         * @since       Version 2.0.00
         * @param       nil
         * @return      returns the copyright string
         * @see
         */
        /*
         * @author      Patrick C. K. Wu
         * @testing
         * @warnings
         * @updates
         */
        getCopyright: function () {
            if ( ORPLMS.copyright === null ) {
                ORPLMS.copyright = lms_global.attr('copyright') + ' ' +
                                   pjs_getstring('copyright', 'lms');
            }
            return (ORPLMS.copyright);
        }
    }
);


/* ===============================================================
   End of lms.js
   =============================================================== */


