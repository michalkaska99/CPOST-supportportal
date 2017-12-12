<?php
// Script created by Michal Kaska SIMAC Technik CR a.s.
// the script is used as midleware between contact centre IVR script and postgreSQL database
// Cisco UCCX does not have connector for postgres SQL database.
// for that reason, UCCX IVR script cal lthis PHP script to retreave information from Postgres.
// This script returns XML document, containing all rows from databse "Hlasky"

// attempt a connection

$dbh = pg_connect("host=10.164.248.120 dbname=hlasky user=postgres");

if (!$dbh) {

    die("Error in connection: " . pg_last_error());

}

// execute query

$sql = "SELECT * FROM Hlasky";

$result = pg_query($dbh, $sql);

if (!$result) {

    die("Error in SQL query: " . pg_last_error());

}

// iterate over result set

// print each row
/*
while ($row = pg_fetch_array($result)) {

    
    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    echo "<hlasky>\n";
    echo "<h_akt_apost>$row[0]</h_akt_apost>\n";
    echo "<h_overovani>$row[1]</h_overovani>\n";
    echo "<h_vypisy_czp>$row[2]</h_vypisy_czp>\n";
    echo "<h_zakazy>$row[3]</h_zakazy>\n";
    echo "<pol_aplikace>$row[4]</pol_aplikace>\n";
    echo "<pol_zona>$row[5]</pol_zona>\n";
    echo "<cvz_aplikace>$row[6]</cvz_aplikace>\n";
    echo "<cvz_prihlaseni>$row[7]</cvz_prihlaseni>\n";
    echo "<h_abc>$row[8]</h_abc>\n";
    echo "</hlasky>";
} */

while ($row = pg_fetch_array($result)) {
    $arr = array('h_akt_apost' => $row[0], 'h_overovani' => $row[1], 'h_vypisy_czp' => $row[2], 'h_zakazy' => $row[3], 'pol_aplikace' => $row[4],
    'pol_zona' => $row[5], 'cvz_aplikace' => $row[6], 'cvz_prihlaseni' => $row[7], 'h_abc' => $row[8]);

    echo json_encode($arr);


}

// free memory

pg_free_result($result);

// close connection

pg_close($dbh);

?>
