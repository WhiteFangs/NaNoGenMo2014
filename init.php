<?php

//Browser Infos
$infos = file_get_contents('http://freegeoip.net/json/'.$_SERVER['REMOTE_ADDR']);
$infos = json_decode($infos);
//Initial date between 2011 and 2012
$unixdate = rand(1300000000, 1350000000);
$date = gmdate("l F jS, Y, g:i a", $unixdate);
$arr = array('infos' => $infos, 'unixdate' => $unixdate, 'date' => $date);
echo json_encode($arr);

?>
