<?php

include('./functions.php');

$unixdate = $_POST["unixdate"];
if (isset($unixdate)) {
  //Adding more than a day but less than a week to the date
  $unixdate += rand(84600, 592200);
  $date = gmdate("l F \\t\h\e jS, Y, g:i a", $unixdate);
  $novelTitle = $_POST["novelTitle"];
  if (isset($novelTitle)) {
    //Google search
    $links = array();
    while(sizeof($links) < 20){
      $numPage = rand(2, 50);
      $googleSearch = getCURLOutput('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&start='.$numPage.'&q='.urlencode($novelTitle));
      $json = json_decode($googleSearch);
      if(is_array($json->responseData->results)){
        // Array of links from Google
        foreach ($json->responseData->results as $result){
            array_push($links, $result->url);
        }
      }
      $links = array_unique($links);
    }
    usort($links, function ($a, $b) {return strlen($b)-strlen($a);});
    $haveContent = false;
    $searchAgain = false;
    $linknb = 0;
    while(!$haveContent){
      $pageHTML = getCURLOutput($links[$linknb]);
      // Take the content of the first one
      $dom = new DOMDocument;
      $pageHTML = mb_convert_encoding($pageHTML, 'HTML-ENTITIES', "UTF-8");
      @$dom->loadHTML($pageHTML);
      $xpath = new DOMXPath($dom);
      $paragraphs = $xpath->query("//p");
      $urls = $xpath->query("//a/@href");
      $lang = $xpath->query("//html/@lang");
      if ($lang->length > 0) {
        $lang = $lang->item(0)->value;
      }else{
        $lang = "undefined";
      }
      $paragraphArray = getContent($paragraphs);
      // Urls in the page
      $urlArray = array();
      $domainArray = array();
      $urlDomain = getDomain($links[$linknb]);
      if ($urls->length > 0) {
        for ($i = 0; $i < $urls->length; $i++) {
          $tempurl = $urls->item($i)->value;
            if (!strpos($tempurl, $urlDomain) && substr($tempurl, 0, 4) == 'http' && !strpos($tempurl, '.jpg') && !strpos($tempurl, '.png') && !strpos($tempurl, '.pdf') && !strpos($tempurl, '.gif')){
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
        if($linknb < 20){
          $linknb++;
        }else{
          $haveContent = true;
          $searchAgain = true;
        }
      }
    }
    $arr = array('unixdate' => $unixdate, 'date' => $date, 'googlelinks' => $links, 'paragraphs' => $paragraphArray, 'url' => $links[$linknb], 'urls' => $urlArray, 'domains' => $domainArray, 'numLink' => $linknb, 'searchAgain' => $searchAgain, 'lang' => $lang, 'counter' => 0);
    echo json_encode($arr);
  }
}

?>
