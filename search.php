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
    $numPage = rand(10, 35);
    $googleSearch = getCURLOutput('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&start='.$numPage.'&q='.urlencode($novelTitle));
    $json = json_decode($googleSearch);
    if(is_array($json->responseData->results)){
      // Array of links from Google
      $links = array();
      foreach ($json->responseData->results as $result){
          array_push($links, $result->url);
      }
      $haveContent = false;
      $linknb = 0;
      while(!$haveContent){
        $pageHTML = getCURLOutput($links[$linknb]);
        // Take the content of the first one
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
        $urlArray = array();
        $urlDomain = parse_url($links[$linknb]);
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
        }else{
          if($linknb < 8){
            $linknb++;
          }else{
            $haveContent = true;
          }
        }
      }
      $arr = array('unixdate' => $unixdate, 'date' => $date, 'googlelinks' => $links, 'divs' => $divArray, 'paragraphs' => $paragraphArray, 'url' => $links[$linknb], 'urls' => $urlArray, 'numPage' => $numPage);
      echo json_encode($arr);
    }
  }
}
?>
