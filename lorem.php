<?php
$unixdate = $_POST["unixdate"];
if (isset($unixdate)) {
  //Adding more than a day but less than a week to the date
  $unixdate += rand(84600, 592200);
  $date = gmdate("l F \\t\h\e jS, Y, g:i a", $unixdate);
  $lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a leo vulputate, efficitur libero vitae, fringilla odio. In vehicula magna eget ultricies facilisis. Aenean nec dui quis nibh consectetur vulputate in non turpis. Cras id viverra ligula. Mauris posuere sem eu ex condimentum, a imperdiet est convallis. Donec luctus pretium metus, eget placerat quam. Fusce id sem ultricies, efficitur felis nec, luctus diam. Vivamus pellentesque, nunc quis ullamcorper mollis, lorem risus varius magna, eget accumsan odio nibh nec neque. Aliquam nunc nisi, dignissim eu aliquet mattis, pretium viverra enim. Nullam ultrices eros sed tortor feugiat, sed euismod mauris faucibus. Fusce pretium sem ex, et pharetra quam blandit sit amet.';
  $arr = array('unixdate' => $unixdate, 'date' => $date, 'text' => $lorem);
  echo json_encode($arr);
}
?>
