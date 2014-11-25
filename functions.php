<?php

function getContent($tags){
  $tagArray = array();
  if ($tags->length > 0) {
    for ($i = 0; $i < $tags->length; $i++) {
      $content = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i",'<$1$2>', $tags->item($i)->nodeValue);
      $content = strip_tags($content);
      $content = preg_replace('/\s+/', ' ',$content);
      $content = trim($content);
      if(strlen($content) > 140 && strpos($content, '{') == false && strpos($content, ',') !== false && strpos($content, '.') !== false && strpos($content, '©') == false){
        if(!in_array($content, $tagArray)){
          array_push($tagArray, $content);
        }
      }
    }
  }
  return $tagArray;
}

function getCURLOutput($url){
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
  $output = curl_exec($ch);
  curl_close($ch);
  return $output;
}

function getDomain($url){
  $urlInfos = parse_url($url);
  $host = $urlInfos['host'];
  preg_match('/[^.]+\.[^.]+$/', $host, $output);
  $urlDomain = $output[0];
  return $urlDomain;
}

?>
