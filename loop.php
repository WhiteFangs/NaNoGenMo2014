<?php

include('./functions.php');

$unixdate = $_POST["unixdate"];
$googlelinks = $_POST["googlelinks"];
$urlArray = $_POST["urls"];
$domainArray = $_POST['domains'];
$visited = $_POST["visited"];
$numLink = $_POST["numLink"];
if (isset($unixdate)) {
  //Adding more than a day but less than a week to the date
  $unixdate += rand(84600, 592200);
  $date = gmdate("l F \\t\h\e jS, Y, g:i a", $unixdate);

  $urlArray = array_diff($urlArray, $visited);
  $searchAgain = false;
  $haveContent = false;
  $start = time();
  while(!$haveContent){
    $max = sizeof($urlArray);
    if($max > 1 && time()-$start < 60){
      // $linknb = rand(0, $max);
      // $currentUrl = $urlArray[$linknb];
      $currentUrl = array_reduce($urlArray, function ($a, $b) { return strlen($a) > strlen($b) ? $a : $b; });
      $linknb = array_search($currentUrl, $urlArray);
    }else{
      if($numLink < 8){
        $linknb = $max;
        array_push($googlelinks[$numLink], $urlArray);
      }else{
        $searchAgain = true;
      }
    }
    if(!$searchAgain){
      $pageHTML = getCURLOutput($currentUrl);
      $dom = new DOMDocument;
      $pageHTML = mb_convert_encoding($pageHTML, 'HTML-ENTITIES', "UTF-8");
      @$dom->loadHTML($pageHTML);
      $xpath = new DOMXPath($dom);
      $paragraphs = $xpath->query("//p");
      $urls = $xpath->query("//a/@href");
      $paragraphArray = getContent($paragraphs);
      // Urls in the page
      $urlDomain = getDomain($currentUrl);
      if ($urls->length > 0) {
        for ($i = 0; $i < $urls->length; $i++) {
          $tempurl = $urls->item($i)->value;
            if (strpos($tempurl, $urlDomain) == false && substr($tempurl, 0, 4) == 'http'){
              $tempdomain = getDomain($tempurl);
              if(!in_array($tempurl, $urlArray) && !in_array($tempdomain, $domainArray)){
                array_push($urlArray, $tempurl);
                array_push($domainArray, $tempdomain);
              }
            }
        }
      }
      if(sizeof($paragraphArray) > 0){
        $haveContent = true;
      }else{
        unset($urlArray[$linknb]);
        $urlArray = array_values($urlArray);
      }
    }else{
      $haveContent = true;
      $paragraphArray = array();
    }
  }
  $arr = array('unixdate' => $unixdate, 'date' => $date, 'googlelinks' => $googlelinks, 'paragraphs' => $paragraphArray, 'url' => $currentUrl, 'urls' => $urlArray, 'domains' => $domainArray,'visited' => $visited, 'searchAgain' => $searchAgain);
  echo json_encode($arr);
}
?>
