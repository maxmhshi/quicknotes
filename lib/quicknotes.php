<?php
if ( isset($_SERVER['QUERY_STRING']) ) {
    switch($_SERVER['QUERY_STRING']){
        case 'SAVE':
            $note['noteid'] = $_REQUEST['noteid'];
            $note['content'] = $_REQUEST['content'];
            $note['px'] = $_REQUEST['px'];
            $note['py'] = $_REQUEST['py'];
            $note['color'] = $_REQUEST['color'];
            $note['lastmodify'] = time();

            $u_msg['id'] = save($note);
            print json_encode($u_msg);
            break;
        case 'LOAD':
            $notes = load();
            foreach($notes as $note){
                $data[] = $note;
            }
            $u_msg['success'] = true;
            $u_msg['data'] = isset($data)?$data:array();
            print json_encode($u_msg);
            break;
        case 'UPDATEPOS':
            $note['noteid'] = $_REQUEST['noteid'];
            $note['px'] = $_REQUEST['px'];
            $note['py'] = $_REQUEST['py'];

            $u_msg['success'] = true;
            $u_msg['data'] = update_position($note);
            print json_encode($u_msg);
            break;
        case 'DELETE':
            if (isset($_REQUEST['noteid']) && $_REQUEST['noteid'] !=0) {
                $note['noteid'] = $_REQUEST['noteid'];

                $u_msg['success'] = del_note($note);
            }
        default:
            break;
    }
}

function del_note($data){
    $col = get_collection('notes_mhshi');

    $mongoId = new MongoID(''.$data['noteid']);
    return $col->remove(array('_id' => $mongoId));
}

function save($data){
    $col = get_collection('notes_mhshi');

    if ($data['noteid'] != 0){
        $mongoId = new MongoID(''.$data['noteid']);
        $col->update(
            array('_id' => $mongoId),
            array('$set' => array(
                                'noteid' => $data['noteid'],
                                'content' => $data['content'],
                                'px' => $data['px'],
                                'py' => $data['py'],
                                'lastmodify' => $data['lastmodify']
                            )
            )
        );
        return $mongoId;
    }else{
        $col->insert($data);
        return $data['_id'];
    }

}

function update_position($data){
    $col = get_collection('notes_mhshi');

    $mongoId = new MongoID(''.$data['noteid']);
    $col->update(
        array('_id' => $mongoId),
        array('$set' => array(
                            'px' => $data['px'],
                            'py' => $data['py']
                        )
        )
    );

    return $mongoId;
}

function load(){
    $col = get_collection('notes_mhshi');
    return $col->find(); 
}

function get_collection($col_name){
    //$m = new Mongo("mongodb://root:lmsdemo@localhost");
    $m = new Mongo();
    $db = $m->selectDB('quicknotes');
    return $db->selectCollection($col_name);
}


?>
