var count = 0;
var activeNote = false;
function newNote(x, y, color, text, noteid){
    var me = this;

    me.boxDivSel = '#box'+count;
    me.editDivSel = '#edit'+count;

    var left_p = x!=undefined ? (x + 'px') : (Math.round(Math.random() * 400) + 'px');
    var top_p = y!=undefined ? (y + 'px') : (Math.round(Math.random() * 500) + 'px');
    $('body').append('<div class="dragbox" id="box'+count+'" style="left:'+left_p+';top:'+top_p+'"></div>');
            
    if (0 == (count%3)){
        $('#box'+count).css('background-color', '#FFFF33');
    }else if (1 == (count%3)){
        $('#box'+count).css('background-color', '#FFCCFF');
    }else{
        $('#box'+count).css('background-color', '#99FFFF');
    }

    if (color != undefined){
        $('#box'+count).css('background-color', color);
    }


    $('#box'+count).append('<div class="edit" id="edit'+count+'" noteid=0 contenteditable=true></div>');
    
    if (text != undefined){
        $('#edit'+count).html(text);
    }
    if (noteid != undefined){
        $('#edit'+count).attr('noteid', noteid);
    }

    $('#edit'+count).bind('click touchstart', function(event){
        event.stopPropagation();
        $(this).focus();

        activeNote = $(this);
    });

    var drag_option = {
        multiSelect: false,
        drag_end: moveNote
    };
    DragDrop.enableDrag('#box'+count, drag_option);

    var containers = [{
        id: 'recycle_bin'
    }];

    DragDrop.enableDrop('#box'+count, {
        drop_in: false,
        containers: containers,
        success: function(data){
            if (data.container.attr('id') == 'recycle_bin'){
                if (confirm('Delete?')){
                    for (var i=0; i<data.items.length; i++){
                        var editObj = data.items[i].children();
                        deleteNote(editObj);
                    }
                }
            }
        }
    });

    $('#edit'+count).focus();

    activeNote = $('#edit'+count);

    count++;

    return me;
}

function saveNote(){
    var para = {
        noteid: activeNote.attr('noteid'),
        content: activeNote.html(),
        px: activeNote.parent().offset().left,
        py: activeNote.parent().offset().top,
        color: activeNote.parent().css('background-color')
    };

    var id = activeNote.attr('id');

    var async_flag = id==0?false:true;

    $.ajax({
        type: 'POST',
        url: 'lib/quicknotes.php?SAVE',
        data: para,
        async: async_flag,
        success: function(results){
            var temp = $.parseJSON(results);
            //console.log(temp.id.$id);
            $('#'+id).attr('noteid', temp.id.$id); 
        },
        error: function(){
        }
    });
}

function loadNote(){
    var results = $.ajax({
        type: 'GET',
        url: 'lib/quicknotes.php?LOAD',
        async: false
    }).responseText;

    return $.parseJSON(results);
}

function deleteNote(editObj){
    var para = {
        noteid: editObj.attr('noteid')
    };
    
    $.ajax({
        type: 'POST',
        url: 'lib/quicknotes.php?DELETE',
        data: para,
        async: true,
        success: function(results){
            editObj.parent().remove();
        },
        error: function(){
        }
    });
}

function updateNotePosition(editObj){
    var para = {
        noteid: editObj.attr('noteid'),
        px: editObj.parent().offset().left,
        py: editObj.parent().offset().top,
    };

    $.ajax({
        type: 'POST',
        url: 'lib/quicknotes.php?UPDATEPOS',
        data: para,
        async: true,
        success: function(results){
        },
        error: function(){
        }
    });
}

function moveNote(data){
    for (var i=0; i<data.length; i++){
        var divObj = data[i];
        var editObj = divObj.children();
        if (divObj.offset().top<-50){
            if(confirm('Delete?')){
                deleteNote(editObj);
            }else{
                divObj.css('top', '10px');
                updateNotePosition(editObj);
            }
        }else{
            updateNotePosition(editObj);
        }
    }
}
