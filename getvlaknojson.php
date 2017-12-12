<?php
// Script created by Michal Kaska SIMAC Technik CR a.s.
// the script is used as midleware between contact centre IVR script and postgreSQL database
// Cisco UCCX does not have connector for postgres SQL database.
// for that reason, UCCX IVR script cal lthis PHP script to retreave information from Postgres.
// This script returns XML document, containing all rows from databse "Hlasky"

// attempt a connection


if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
  $data = json_decode(file_get_contents("php://input"));
}
$topic = $data->{"topic"};

$dbh = pg_connect("host=10.164.248.120 dbname=support user=postgres");

if (!$dbh) {

    die("Error in connection: " . pg_last_error());

}

// execute query

#$sql_1 = "select topicid from topic where topicname = $data.topis";
#INSERT iNTO vlakno (result,topicid,vlaknoname) values (false,(select topicid from topic where topicname = 'jabber'),'Zrusit sdileni obrazvky');

if ($topic == 'ShowAll') {
	//$sql = "SELECT * from vlakno order by vlaknoid";
        $sql = "select vlakno.vlaknoid,vlakno.result,vlakno.topicid,notes.popisid,notes.kdo,notes.kdy,vlakno.vlaknoname from vlakno join notes on vlakno.vlaknoid = notes.vlaknoid order by vlakno.vlaknoid";
} else {	
	//$sql = "SELECT * from vlakno where topicid = (select topicid from topic where topicname = '$topic') order by vlaknoid";
	$sql = "select vlakno.vlaknoid,vlakno.result,vlakno.topicid,notes.popisid,notes.kdo,notes.kdy,vlakno.vlaknoname from vlakno join notes on vlakno.vlaknoid = notes.vlaknoid  where topicid = (select topicid from topic where topicname = '$topic') order by vlakno.vlaknoid";
}

$result = pg_query($dbh, $sql);

if (!$result) {

    die("Error in SQL query: " . pg_last_error());

} 
$arr = array();
$i = 0;
while ($row = pg_fetch_array($result)) {
    $i++;
    $arr[$i] = array('vlaknoid' => $row[0], 'result' => $row[1], 'topicid' => $row[2], 'vlaknoname' => $row[6],'kdo' => $row[4], 'kdy' => $row[5], 'popisid' => $row[3]);

}
echo json_encode($arr);



// free memory

pg_free_result($result);

// close connection

pg_close($dbh);

?>
