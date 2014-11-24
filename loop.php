<?php

include('./functions.php');

$unixdate = $_POST["unixdate"];
$googlelinks = $_POST["googlelinks"];
$urlArray = $_POST["urls"];
$visited = $_POST["visited"];
if (isset($unixdate)) {
  //Adding more than a day but less than a week to the date
  $unixdate += rand(84600, 592200);
  $date = gmdate("l F \\t\h\e jS, Y, g:i a", $unixdate);

  $haveContent = false;
  while(!$haveContent){
    $linknb = rand(0, sizeof($urlArray));
    while(in_array($urlArray[$linknb], $visited)){
      $linknb = rand(0, sizeof($urlArray));
    }
    $pageHTML = getCURLOutput($urlArray[$linknb]);
    $dom = new DOMDocument;
    $pageHTML = mb_convert_encoding($pageHTML, 'HTML-ENTITIES', "UTF-8");
    @$dom->loadHTML($pageHTML);
    $xpath = new DOMXPath($dom);
    $divs = $xpath->query("//div");
    $paragraphs = $xpath->query("//p");
    $urls = $xpath->query("//a/@href");
    $divArray = getContent($divs);
    $paragraphArray = getContent($paragraphs);
    // Urls in the page
    $urlDomain = parse_url($urlArray[$linknb]);
    $urlDomain = $urlDomain['host'];
    if ($urls->length > 0) {
      for ($i = 0; $i < $urls->length; $i++) {
        $tempurl = $urls->item($i)->value;
          if (strpos($tempurl, $urlDomain) == false && substr($tempurl, 0, 4) == 'http'){
            if(!in_array($tempurl, $urlArray)){
              array_push($urlArray, $tempurl);
            }
          }
      }
    }
    if(sizeof($divArray) > 0 || sizeof($paragraphArray) > 0){
      $haveContent = true;
    }
  }
  $arr = array('unixdate' => $unixdate, 'date' => $date, 'googlelinks' => $googlelinks, 'divs' => $divArray, 'paragraphs' => $paragraphArray, 'url' => $urlArray[$linknb], 'urls' => $urlArray, 'visited' => $visited);
  echo json_encode($arr);
}
?>
