<?php

$unixdate = $_POST["unixdate"];
if (isset($unixdate)) {
  //Adding more than a day but less than a week to the date
  $unixdate += rand(84600, 592200);
  $date = gmdate("l F \\t\h\e jS, Y, g:i a", $unixdate);
  $novelTitle = $_POST["novelTitle"];
  if (isset($novelTitle)) {
    //Google search
    $numPage = rand(10, 50);
    $googleSearch = file_get_contents('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&start='.$numPage.'&q='.$novelTitle);
    $json = json_decode($googleSearch);
    if(is_array($json->responseData->results)){
      foreach ($json->responseData->results as $result){
          $text = $text . "<b>Result</b><br>URL:". $result->url."<br>VisibleURL: ". $result->visibleUrl. "<br>Title: ". $result->title. "<br>Content: ". $result->content. "<br><br>";
      }
      $arr = array('unixdate' => $unixdate, 'date' => $date, 'text' => $text, 'numPage' => $numPage);
      echo json_encode($arr);
    }
  }
}
?>
