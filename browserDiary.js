
function initDiary (novelTitle){
  document.getElementById("novel").innerHTML = '';
  $("#novel").append('<h1>' + novelTitle + '</h1>');
  $.post("./init.php", function(data){
    data = JSON.parse(data);
    displayDate(data.unixdate, data.date);
    displayBrowserInfo(data.infos, data.unixdate);
    var i = countWords();
    initSearch(novelTitle, data.unixdate);
  });
}

function initSearch(novelTitle, unix){
  $.post("./search.php", {novelTitle : novelTitle, unixdate : unix}, function(data){
    data = JSON.parse(data);
    displayDate(data.unixdate, data.date);
    $("#" + data.unixdate).append("<br>Page on Google Search: " + data.numPage + "<br><br>" + data.text);
    var i = countWords();
    getLorem(i, data.unixdate);
  });
}

function getLorem(i, unix){
  if (i<1000){
    $.post("./lorem.php", {unixdate : unix}, function(data){
      data = JSON.parse(data);
      displayDate(data.unixdate, data.date);
      $("#" + data.unixdate).append(i + " : <br>" + data.text);
      i = countWords();
      getLorem(i, data.unixdate);
    });
  }
}

function countWords(){
  var s = document.getElementById("novel").innerHTML, count;
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");
  count = s.split(' ').length;
  return (count);
}

function displayBrowserInfo(infos, unix){
  var OSName="Unknown OS";
  if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
  if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
  if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
  if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

  var nAgt = navigator.userAgent;
  var browserName  = navigator.appName;
  var nameOffset,verOffset,ix;

  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    browserName = "Opera";
  }
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    browserName = "Microsoft Internet Explorer";
  }
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    browserName = "Chrome";
  }
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    browserName = "Safari";
  }
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    browserName = "Firefox";
  }
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
    (verOffset=nAgt.lastIndexOf('/')) ){
    browserName = nAgt.substring(nameOffset,verOffset);
    if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  if(navigator.cookieEnabled){
    var cookies = "Oh, and I like cookies.";
  }else{
    var cookies = "Oh, and I don't like cookies.";
  }

  $("#" + unix).append("My name is " + navigator.appName + ' ' + browserName + ", I'm a web browser and this is my personal diary. <br>Actually, my full name is " +
  navigator.appVersion + ', but everybody calls me ' + browserName + '.<br>I live in a ' + OSName + ' running computer, in ' + infos.city + ', ' + infos.country_name +
  '.<br>My exact address is ' + infos.ip + '. <br>' + cookies + '<br><br>');
}

function displayDate(unix, date){
  $("#novel").append('<p id="' + unix + '"><span class="date">UNIX Timestamp: ' + unix + ' - Human date: ' + date + '</span><br><br></p>');
}
