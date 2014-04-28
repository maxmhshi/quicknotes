/*global Ext */
/*global ORPLMS */
/* --------------------------------------------------------------- */
/**
 * FILE NAME   : lms_dragdrop.js
 * AUTHOR      : Shi Ming Hua
 * SYNOPSIS    :
 * DESCRIPTION : LMS Draggable/Droppable Object Javascript library
 * SEE ALSO    :
 * VERSION     : 1.0 ($Revision$)
 * CREATED     : 07-AUG-2012
 * LASTUPDATES : $Author$ on $Date$
 * UPDATES     : 
 * NOTES       :
 */
/* ---------------------------------------------------------------
   @(#)lms_dragdrop.js          1.0 07-AUG-2012
   by Shi Ming Hua


   Copyright by ASTRI, Ltd., (ECE Group)
   All rights reserved.

   This software is the confidential and proprietary information
   of ASTRI, Ltd. ("Confidential Information").  You shall not
   disclose such Confidential Information and shall use it only
   in accordance with the terms of the license agreement you
   entered into with ASTRI.
   --------------------------------------------------------------- */


/* ===============================================================
   Begin of lms_dragdrop.js
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
 * @author      Shi Ming Hua
 * @testing
 * @warnings
 * @updates
 */


/**
 * Define activity manager of ORPLMS
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
    function() {
        ORPLMS.DragDrop = ORPLMS.define(
            'ORPLMS.DragDrop',
            {
                //array of moveable div objects
                //when div is selected to be moved,
                //the div object will be put into this array.
                activeDiv: [],
                multiSelect: true,
                //the last selected div when movement begins
                //is temperarily saved in this variable
                //if the movement is really started, it will be
                //put into the activeDiv array.
                lastActiveDiv: null,
                //delegate div position when starting movement
                startX: null,
                startY: null,
                //the mouse position of move start
                moveStartX: null,
                moveStartY: null,
                //flag to indicate if movement is enabled
                moveable: false,
                dragEndHandler: false,
                //flag to indicate if the movement is started
                movestart: false,
                dropBoxes: [],
                dropIn: true,
                dropSuccessHandler: false,
                dropFailHandler: false,
                //div object to perform movement, delegate other divs 
                dlgObj: null,
                dlgSize: {height:0, width:0},
                longTouchTimeOut: null,

                init: function(dragdropArea){
                    var me = this;

                    var ddArea = dragdropArea != undefined ? $(dragdropArea) : $(document);
                    //bind movement to document
                    ddArea.bind('touchmove mousemove', function(e){
                        e.preventDefault();

                        if (me.moveable == false){
                            return;
                        }

                        //if moveable is true,
                        //the lastActiveDiv is put into activeDiv array
                        //and opacity of all moveable div is set to 0.5.
                        if (!me.movestart){
                            if (!me._is_exist_in_activeDiv(me.lastActiveDiv)){
                                me._add_to_activeDiv(me.lastActiveDiv);
                            }
                            
                            for (var i=0; i<me.activeDiv.length; i++){
                                me.activeDiv[i].css('opacity', 0.5);
                            }
                        
                            me._show_delegate();
                        }

                        me.movestart = true;
                        var x, y;
                        if ('ontouchstart' in document.documentElement){
                            if (me.activeDiv.length > 0){
                                var divObj = me._get_delegate();
                                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                                x = touch.pageX - me.startX;
                                y = touch.pageY - me.startY;
                                divObj.offset({top:y, left:x});
                            }
                        }else{
                            if (me.activeDiv.length > 0){
                                var divObj = me._get_delegate();
                                x = e.clientX - me.startX;
                                y = e.clientY - me.startY;
                                divObj.offset({top:y, left:x});
                            }
                        }
                    });

                    //bind mouseup and touchend to document
                    $(document).bind('touchend mouseup', function(e){
                        e.preventDefault();
                        //reset moveable flag and remove delegate div
                        me.moveable = false;

                        me._del_delegate();
                        //if movement is not started, do nothing
                        if (!me.movestart){
                            return;
                        }
                        //reset movestart flag
                        me.movestart = false;

                        //drop process first, then process drag
                        if (me.dropBoxes.length > 0){
                            me._drop_process(e);
                        }

                        me._drag_process(e);

                    });
                },

                enableDrag: function(divSelector, options){
                    var me = this;
                    var divObj = $(divSelector);
                    me.multiSelect = options != undefined ?
                        (options.multiSelect != undefined ? options.multiSelect : true)
                        : true;

                    divObj.bind('touchstart mousedown', function(e){
                        e.preventDefault();
                        //set moveable flag
                        me.moveable = true;
                        //select/unselect div for movement
                        if (me._is_exist_in_activeDiv($(this))){
                            me._remove_from_activeDiv($(this));
                        }else{
                            me._add_to_activeDiv($(this));
                        }
                        
                        me.lastActiveDiv = $(this);

                        me.dragEndHandler = options != undefined ?
                            (options.drag_end != undefined ? options.drag_end : false)
                            : false;

                        //generate delegate div
                        me._gen_delegate($(this));
                        //save the position of mouse and div when movement starting
                        if ('ontouchstart' in document.documentElement){
                            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                            me.moveStartX = touch.pageX;
                            me.moveStartY = touch.pageY;
                            me.startX = touch.pageX - $(this).offset().left;
                            me.startY = touch.pageY - $(this).offset().top;
                        }else{
                            me.moveStartX = e.clientX;
                            me.moveStartY = e.clientY;
                            me.startX = e.clientX - $(this).offset().left;
                            me.startY = e.clientY - $(this).offset().top;
                        }
                    });
                },

                _drag_process: function(e){
                    var me = this;
                    for(var i=0; i<me.activeDiv.length; i++){
                        var x, y, startX, startY;
                        var divObj = me.activeDiv[i];

                        //calculate div position at the time when movement start
                        startX = me.moveStartX - divObj.offset().left;
                        startY = me.moveStartY - divObj.offset().top;
                        //set new position for div
                        if ('ontouchstart' in document.documentElement){
                            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                            x = touch.pageX - startX;
                            y = touch.pageY - startY;
                            divObj.offset({top:y, left:x});
                        }else{
                            x = e.clientX - startX;
                            y = e.clientY - startY;
                            divObj.offset({top:y, left:x});
                        }
                    }

                    if (me.dragEndHandler){
                        me.dragEndHandler(me.activeDiv.slice());
                    }

                    //clear all moveable divs
                    me._clear_activeDiv();
                },

                _gen_delegate: function(divObj){
                     var me = this;
                     //when multiSelect is false,
                     //delegate div is not used, selected div will
                     //be used as delegate.
                     if (me.multiSelect){
                         me.dlgObj = $('<div></div>');
                         me.dlgObj.addClass('orplms_dgdp_item_delegate_small');
                         me.dlgObj.attr('id', 'orplms_dgdp_item_delegate');
                     }else{
                         me.dlgObj = divObj.clone();
                         me.dlgObj.css('z-index', -1);
                     }
                     //z-index should be set to -1 or div should be hide first
                     //otherwise the click of the overlapped div will not trigger
                     $('body').append(me.dlgObj);

                     //calculate position
                     var x = divObj.offset().left;
                     var y = divObj.offset().top;
                     //the postion should be set after append to document
                     me.dlgObj.offset({top:y, left:x});

                     //set delegate size for later use
                     me.dlgSize.height = me.dlgObj.height();
                     me.dlgSize.width = me.dlgObj.width();

                     return me.dlgObj;
                },

                _show_delegate: function(){
                    var me = this;
                    if (me.multiSelect){
                        me.dlgObj.html(me.activeDiv.length);
                        me.dlgObj.show();
                    }else{
                        me.dlgObj.css('z-index', 999);
                    }
                },

                _get_delegate: function(){
                    var me = this;
                    return me.dlgObj;
                },

                _del_delegate: function(){
                    var me = this;
                    if (me.dlgObj){
                        me.dlgObj.remove();
                    }
                },

                _add_to_activeDiv: function(divObj){
                    var me = this;

                    //when multiSelect is false,
                    //activeDiv will only has 1 select div
                    //and check icon will not be used.
                    if (!me.multiSelect){
                        me._clear_activeDiv();
                        me.activeDiv.push(divObj);
                        return;
                    }

                    me.activeDiv.push(divObj);
                    //add check icon to active div
                    var check_top = divObj.offset().top - 12;
                    var check_left = divObj.offset().left + divObj.width() - 12;
                    var check = $('<div></div>');
                    check.attr('id', divObj.attr('id')+'_check');
                    check.addClass('orplms_dgdp_item_check_icon');
                    check.offset({top:check_top, left:check_left});
                    $('body').append(check);
                },

                _remove_from_activeDiv: function(divObj){
                    var me = this;
                    for(var i=0; i<me.activeDiv.length; i++){
                        if (me.activeDiv[i].attr('id') == divObj.attr('id')){
                            me.activeDiv.splice(i, 1);
                            $('#'+divObj.attr('id')+'_check').remove();
                        }
                    }
                },

                _clear_activeDiv: function(){
                    var me = this;
                    for(var i=0; i<me.activeDiv.length; i++){
                        $('.orplms_dgdp_item_check_icon').remove();
                        me.activeDiv[i].css('opacity', '');
                    }

                    me.activeDiv.length = 0;
                },

                _is_exist_in_activeDiv: function(divObj){
                    var me = this;
                    for(var i=0; i<me.activeDiv.length; i++){
                        if (me.activeDiv[i].attr('id') == divObj.attr('id')){
                            return true;
                        }
                    }

                    return false;
                },

                enableDrop: function(divSelector, options){
                    var me = this;

                    //this flag decide the behavior of the item dropped into
                    //the container, if the flag is true, the item will append to
                    //the container, otherwise, the item will not append to
                    //the container and only fire the dropend event.
                    me.dropIn = options.drop_in!=undefined?options.drop_in:true;

                    var cts = new Array();
                    //Get all containers properties
                    var containers = options.containers;
                    for (var i=0; i<containers.length; i++){
                        var ct = new Object();
                        ct.divObj = $('#'+containers[i].id);
                        ct.offsetX = $('#'+containers[i].id).offset().left;
                        ct.offsetY = $('#'+containers[i].id).offset().top;
                        ct.height = $('#'+containers[i].id).height();
                        ct.width = $('#'+containers[i].id).width();
                        ct.col_mode = containers[i].col_mode!=undefined?containers[i].col_mode:'mcol';
                        cts.push(ct);
                    }

                    var drop_success_handler = options.success != undefined ? options.success : false;
                    var drop_fail_handler = options.fail != undefined ? options.fail : false;

                    //if drop enabled div object is start to move
                    //put containers to dropBoxes
                    var divObj = $(divSelector);
                    divObj.bind('touchstart mousedown', function(e){
                        e.preventDefault();
                        //copy array
                        me.dropBoxes = cts.slice();
                        me.dropSuccessHandler = drop_success_handler;
                        me.dropFailHandler = drop_fail_handler;
                    });

                    //clear dropBoxes when mouse is up but div object is not after
                    //movement 
                    divObj.bind('touchend mouseup', function(e){
                        e.preventDefault();
                        if (!me.movestart){
                            me.dropBoxes.length = 0;
                            me.dropSuccessHandler = false;
                            me.dropFailHandler = false;
                        }

                    });
                },

                _drop_process: function(e){
                    var me = this;
                    var cts = me.dropBoxes;

                    //get current position of dropped object
                    var x, y, cx, cy;
                    if ('ontouchstart' in document.documentElement){
                        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        x = touch.pageX - me.startX;
                        y = touch.pageY - me.startY;
                    }else{
                        x = e.clientX - me.startX;
                        y = e.clientY - me.startY;
                    }

                    //get center position of dropped object
                    cx = x + me.dlgSize.width/2;
                    cy = y + me.dlgSize.height/2;

                    //Find the container in which the object is dropped
                    var dropped = false;
                    for (var i=0; i<cts.length; i++){
                        var ct = cts[i];
                        ct.width = ct.divObj.width();
                        ct.height = ct.divObj.height();
                        ct.offsetX = ct.divObj.offset().left;
                        ct.offsetY = ct.divObj.offset().top;

                        //Check if this container is the one in which the object is dropped
                        if ((cx>ct.offsetX && cx<(ct.offsetX+ct.width))
                            && (cy>ct.offsetY && cy<(ct.offsetY+ct.height))){

                            //if dropping in is not required,
                            //just call drop end callback function.
                            if (!me.dropIn){
                                dropped = cts[i].divObj;
                                break;
                            }

                            //Get all elements in the container
                            var ct_elements = cts[i].divObj.children();
                            var min_dist;
                            var nidx = -1;
                            //if elements are arranged in signle column,
                            //find the nearest element to insert before it.
                            //if elements are arragned in multiple column,
                            //find the nearest element first.
                            for (var j=0; j<ct_elements.length; j++){
                                var el = ct_elements[j];
                                //get center postion of each element
                                var cny = $('#'+el.id).offset().top + $('#'+el.id).height()/2;
                                          //el.offsetTop + el.offsetHeight/2;
                                var cnx = $('#'+el.id).offset().left + $('#'+el.id).width()/2;
                                          //el.offsetLeft + el.offsetWidth/2;

                                //find nearest neight and insert before it
                                if (ct.col_mode == 'scol'){
                                    if (cy<=cny){
                                        for (var k=me.activeDiv.length-1; k>=0; k--){
                                            if (me.activeDiv[k].attr('id') != el.id){
                                                me.activeDiv[k].insertBefore(el);
                                            }
                                        }
                                        dropped = cts[i].divObj;
                                        break;
                                    }
                                    //find nearest neigbor
                                }else if (ct.col_mode == 'mcol'){
                                    var dist = (cnx - cx)*(cnx - cx)
                                               + (cny - cy)*(cny - cy);
                                    if (nidx == -1){
                                        min_dist = dist;
                                        nidx = j;
                                    }else{
                                        if (dist < min_dist){
                                            min_dist = dist;
                                            nidx = j;
                                        }
                                    }
                                }

                            }

                            //if the object is not dropped yet
                            if (!dropped){
                                //drop the object at the end of container
                                //if elements is arranged as single column
                                if (ct.col_mode == 'scol'){
                                    for (var k=0; k<me.activeDiv.length; k++){
                                        cts[i].divObj.append(me.activeDiv[k]);
                                    }
                                //if the nearest neighbor is found,
                                //check whether the object should be dropped
                                //at left side or right side of neighbor.
                                }else if (ct.col_mode == 'mcol' && nidx != -1){
                                    var el = ct_elements[nidx];
                                    var cny = $('#'+el.id).offset().top + $('#'+el.id).height()/2;
                                              //el.offsetTop + el.offsetHeight/2;
                                    var cnx = $('#'+el.id).offset().left + $('#'+el.id).width()/2;
                                              //el.offsetLeft + el.offsetWidth/2;
                                    for (var k=me.activeDiv.length-1; k>=0; k--){
                                        if (me.activeDiv[k].attr('id') != el.id){
                                            //drop at left of neighbor
                                            if (cx<cnx){
                                                me.activeDiv[k].insertBefore(el);
                                            //drop at right of neighbor
                                            }else{
                                                me.activeDiv[k].insertAfter(el);
                                            }
                                        }
                                    }
                                    //if the elements are arranged as multiple column
                                    //and the nearest heighbor is not found(empty container)
                                    //drop at the end of container.
                                }else{
                                    for (var k=0; k<me.activeDiv.length; k++){
                                        cts[i].divObj.append(me.activeDiv[k]);
                                    }
                                }
                            }

                            dropped = cts[i].divObj;

                            break;

                        }
                    }

                    //if the container in which the div is dropped
                    //is found, drop success callback will be called
                    //and the activeDiv will be cleared
                    if (dropped){
                        if (me.dropSuccessHandler){
                            var data = {
                                items: me.activeDiv.slice(),
                                container: dropped
                            };
                            me.dropSuccessHandler(data);
                        }
                        me._clear_activeDiv();
                    //otherwise, the drop fail callback will be called.
                    //if drop in is true, the activeDiv will be cleared
                    //to recover the moving div to original position
                    //(_drag_process will have no active div to process).
                    }else{
                        if (me.dropIn){
                            me._clear_activeDiv();
                        }
                        if (me.dropFailHandler){
                            me.dropFailHandler();
                        }
                    }

                    //clear all drop boxes.
                    me.dropBoxes.length = 0;
                }
            },
            {
                className: 'ORPLMS.DragDrop'
            }
        );
    }
)();


/* ===============================================================
   End of lms_dragdrop.js
   =============================================================== */


