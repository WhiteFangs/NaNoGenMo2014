$(document).ready(function() {
  $('#titleForm').on('submit', function(e) {
    e.preventDefault();
    var $this = $(this);
    var novelTitle = $('#novelTitle').val();
    initDiary(novelTitle);
  });
});

function initDiary (novelTitle){
  document.getElementById("novel").innerHTML = '';
  if(novelTitle.trim().length !== 0){
    $("#novel").append('<h1 id="title">' + novelTitle + '</h1>');
    $.post("./init.php", function(data){
      data = JSON.parse(data);
      displayDate(data.unixdate, data.date);
      data.novelTitle = novelTitle;
      displayBrowserInfo(data.infos, data.unixdate, data.novelTitle);
      var count = countWords('novel');
      initSearch(novelTitle, data.unixdate);
    });
  }
}

function initSearch(novelTitle, unix){
  $.post("./search.php", {novelTitle : novelTitle, unixdate : unix}, function(data){
    data = JSON.parse(data);
    console.log(data);
    if(data.searchAgain === true){
      initSearch($('#title').text(), data.unixdate);
    }else{
      displayDate(data.unixdate, data.date);
      displayContent(data);
      var count = countWords('novel');
      data.visited = [];
      novelLoop(count, data);
    }
  });
}

function novelLoop(count, data){
  if (count < 50000){
    delete data.paragraphs;
    data.visited.push(data.url);
    $.post("./loop.php", {unixdate : data.unixdate, googlelinks : data.googlelinks, urls : data.urls, domains : data.domains, visited: data.visited, numLink: data.numLink}, function(data){
      try{
        data = JSON.parse(data);
        if(data.searchAgain === true){
          console.log("search again");
          initSearch($('#title').text(), data.unixdate);
        }else{
          displayDate(data.unixdate, data.date);
          displayContent(data);
          count = countWords('novel');
          console.log(count);
          novelLoop(count, data);
        }
      }catch(e){
        console.log(data);
      }
    });
  }else{
    console.log("finished");
  }
}

function displayContent(data){
  $("#" + data.unixdate).append('Today, I visited <a href="'+ data.url + '">' + data.url + "</a>.<br><br>");
  if(data.paragraphs.length > 0){
    for(var i = 0; i < data.paragraphs.length; i++){
        $("#" + data.unixdate).append(data.paragraphs[i] + "<br><br>");
        if(countWords(data.unixdate) > 2000){
          i = data.paragraphs.length;
        }
    }
  }
}

function countWords(id){
  var s = document.getElementById(id).innerHTML, count;
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");
  count = s.split(' ').length;
  return count;
}

function displayBrowserInfo(infos, unix, novelTitle){
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
  var cookies = (navigator.cookieEnabled) ? "Oh, and I like cookies." : "Oh, and I don't like cookies.";

  $("#" + unix).append("My name is " + navigator.appName + ' ' + browserName + ", I'm a web browser and this is my personal diary. <br>Actually, my full name is " +
  navigator.appVersion + ', but everybody calls me ' + browserName + '.<br>I live in a ' + OSName + ' running computer, in ' + infos.city + ', ' + infos.country_name +
  '.<br>My exact address is ' + infos.ip + '. <br>' + cookies + '<br><br>Ok, I presented myself. Let\'s see what can I talk about now. Hm, yes, I know... <b>' + novelTitle + '</b>.<br><br>');
}

function displayDate(unix, date){
  $("#novel").append('<p id="' + unix + '"><span class="date">UNIX Timestamp: ' + unix + ' - Human date: ' + date + '</span><br><br></p>');
}
