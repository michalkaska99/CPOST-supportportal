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
$kdo = $data->{"kdo"};
$popis = $data->{"popis"};
$vlakno = $data->{"vlakno"};

$dbh = pg_connect("host=10.164.248.120 dbname=support user=postgres");

if (!$dbh) {

    die("Error in connection: " . pg_last_error());

}

// execute query

#$sql_1 = "select topicid from topic where topicname = $data.topis";
#INSERT iNTO vlakno (result,topicid,vlaknoname) values (false,(select topicid from topic where topicname = 'jabber'),'Zrusit sdileni obrazvky');

$sql = "INSERT INTO notes (vlaknoid,kdo,kdy,popis) values('$vlakno','$kdo',now(),'$popis')";

$result = pg_query($dbh, $sql);

if (!$result) {

    die("Error in SQL query: " . pg_last_error());

} else {
 	$arr = array('success' => 'success');
	echo json_encode($arr);

}



// free memory

pg_free_result($result);

// close connection

pg_close($dbh);

?>
