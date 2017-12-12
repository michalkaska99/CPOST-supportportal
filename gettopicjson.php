<?php
// Script created by Michal Kaska SIMAC Technik CR a.s.
// the script is used as midleware between contact centre IVR script and postgreSQL database
// Cisco UCCX does not have connector for postgres SQL database.
// for that reason, UCCX IVR script cal lthis PHP script to retreave information from Postgres.
// This script returns XML document, containing all rows from databse "Hlasky"

// attempt a connection

$dbh = pg_connect("host=10.164.248.120 dbname=support user=postgres");

if (!$dbh) {

    die("Error in connection: " . pg_last_error());

}

// execute query

$sql = "SELECT * FROM topic order by topicname";

$result = pg_query($dbh, $sql);

if (!$result) {

    die("Error in SQL query: " . pg_last_error());

}

// iterate over result set

// print each row
$arr = array();
$i = 0;
while ($row = pg_fetch_array($result)) {
    $i++;
    $arr[$i] = array('topicid' => $row[0], 'topicname' => $row[1]);

}
echo json_encode($arr);
// free memory

pg_free_result($result);

// close connection

pg_close($dbh);

?>
