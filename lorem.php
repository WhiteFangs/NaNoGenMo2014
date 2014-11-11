<?php

$novelTitle = $_POST["novelTitle"];
if (isset($novelTitle)) {
  $numPage = rand(10, 100);
  $googleSearch = file_get_contents('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&start='.$numPage.'&q='.$novelTitle);
  $json = json_decode($googleSearch);
  foreach ($json->responseData->results as $result){
    echo "<b>Result</b>";
    echo "<br>URL: ";
    echo $result->url;
    echo "<br>VisibleURL: ";
    echo $result->visibleUrl;
    echo "<br>Title: ";
    echo $result->title;
    echo "<br>Content: ";
    echo $result->content;
    echo "<br><br>";
  }
}else{
  print('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a leo vulputate, efficitur libero vitae, fringilla odio. In vehicula magna eget ultricies facilisis. Aenean nec dui quis nibh consectetur vulputate in non turpis. Cras id viverra ligula. Mauris posuere sem eu ex condimentum, a imperdiet est convallis. Donec luctus pretium metus, eget placerat quam. Fusce id sem ultricies, efficitur felis nec, luctus diam. Vivamus pellentesque, nunc quis ullamcorper mollis, lorem risus varius magna, eget accumsan odio nibh nec neque. Aliquam nunc nisi, dignissim eu aliquet mattis, pretium viverra enim. Nullam ultrices eros sed tortor feugiat, sed euismod mauris faucibus. Fusce pretium sem ex, et pharetra quam blandit sit amet.');
}
?>
