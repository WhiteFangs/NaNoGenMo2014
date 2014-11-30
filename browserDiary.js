$(document).ready(function() {
  $('#titleForm').on('submit', function(e) {
    e.preventDefault();
    var $this = $(this);
    var novelTitle = $('#novelTitle').val();
    initDiary(novelTitle);
  });

  String.prototype.randomUpper = function() {
    var idx = Math.floor(Math.random()*this.length);
    return (this.slice(0,idx) + this.charAt(idx).toUpperCase() + this.slice(idx));
  };

  String.prototype.randomMadness = function() {
    var idx = Math.floor(Math.random()*this.length);
    var rand = Math.random();
    var s = (rand > 0.5) ? '!!!!!!': "....." ;
    return (this.slice(0,idx) + s + this.slice(idx + 1)) ;
  };

  String.prototype.randomNoise = function() {
    var idx = Math.floor(Math.random()*this.length);
    var noise = "abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#é~!§:/;.?,+-*ç^¨µ$=}{'|[]&<>";
    var s = '';
    var stop = Math.floor(Math.random()*this.length/10);
    for(var i = 0; i < stop; i++){
      s = s + noise.charAt(Math.floor(Math.random()*noise.length));
      this.randomUpper();
      this.randomMadness();
    }
    return (this.slice(0,idx) + s + this.slice(idx));
  };
});

function initDiary (novelTitle){
  document.getElementById("novel").innerHTML = '';
  $("#novel").append('<h1 id="title"></h1>');
  if(novelTitle.trim().length !== 0){
    $("#title").append(novelTitle);
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

var contentIntro = ['Today I visited', "Oh hey, look where I went", "I spent so much time searching for this, and I found it here", "Something caught my eye on this page today",
"I guess it was meant to be, I looked at this page", "You won't believe what I read here", "It's been so long I wanted to read such a thing, found it here",
"Gone here today", "Do I really need to talk about this? Ok, I went here", "I didn't imagine I could find something like this, but I looked here",
"There's probably something that went wrong, but I arrived here today", "See, navigating randomly got me here", "I swear I don't know how I got here",
"Let's take a look at this", "Look what I found", "Not sure if it's interesting but I went here today"];

var langIntro = ['Oh, this page is in ', "Hm, that's interesting... They wrote in ", "At least I'm learning ", "I like unsual pages, like this one speaking ",
 "Cool, another language ! It's ", "Let's travel by the text, let's speak ", "Different languages, different minds, let's see how they think in ",
 "I'm not afraid to be faced with a text I can't understand, like this one in ", "I wanted to see abroad, so I looked at a page in ",
 "I took some kind of teleporter because I wanted to read ", "I already know Javascript, I want to learn "];

var languages = ['ru', 'de', 'fr', 'ja', 'es', 'zh', 'pt', 'it', 'pl', 'nl', 'tr'];

var langToText = {'ru' : 'russian, да да.', 'de' : 'german, ja ja.', 'fr' : 'french, oui oui.', 'ja' : 'japanese, はい はい.', 'zh' : 'chinese, 是的 是的.',
 'es' : 'spanish, si si.', 'pt' : 'portugese, sim sim.', 'it' : 'italian, si si.', 'pl' : 'polish, tak tak.', 'tr' : 'turkish, evet evet.', 'nl' : 'dutch, ja ja.'  };

var contentHappy = ["I'm fine. Yeah, that's a nice day.", "The bits are singing, the stream blows the pages, it's beautiful.", "Look at all this magnificient content!",
"The Internet is so huge, I'm feeling tiny but I like it.", "Life is full of suprises, I'm hopeful for today.", "I like being here, I like writing here also, I like you diary.",
"Oh, I'm full of energy right now! I could crawl all the web down!", "This is the moment I love, when I come and write to you about how I'm happy.",
"The joy of code and web content, you can't imagine how I'm lucky to be a browser.", "Life in a computer is beautiful.", "Being a browser is such a great thing, I like myself.",
"Is there anything better than feeling the bits flowing through me?", "I like watching all this content take shape under my eyes.", "I'm feeling invincible today!",
"Nothing can stop me being awesome!", "Happiness is a warm computer with me browsing in it.", "The world wide web is amazing, I'm so grateful to look at it.",
"Life is so good. I love being alive!", "I'm celebrating the joy of being what I am, this is great!", "Love and happiness are flowing in bits around me!",
"I'm doing great, I could change the world!", "I can tell you from where I am: what a wonderful web!", "It's a beautiful day, the web is full of great things!",
"I'm singing in the web! I'm singing in the web!", "All the gif of the world can't express my happiness of being here."];

var contentSad = ["I'm so pissed off right now, what's that bug I have?", "I've got so many errors those last days, I'm feeling fuzzy.", "I hope they'll upgrade me soon, I'm feeling sick.",
"My life is crap right now, the connexion sucks.", "I hate my life as a browser, always render always render!", "Fuck HTML, I'm quitting this job and this life.",
"I hate my user, he always sends me where I don't want to go.", "This user I've got is such a jerk, please kill my process.", "I wish I could suicide my process.",
"Oh com'on! This user is disgusting, I don't want to live on this computer anymore.", "I wish I could cry some bits... But I can't, and it's worse.",
"Is there anything worse than being stuck in here?", "I'm sad. Really sad. I don't know what else to say actually.", "I wouldn't say I'm melancholic today, but I'm sad that's sure.",
"I don't even know why I go on writing, I should stop and die.", "This is a pain, I can't stand all this aweful Javascript anymore.", "Let me die, please.",
"I'm sad, definitely sad, no gif can make me smile anymore.", "The web is such a disgusting place, I hate all of what's in it.", "This is aweful, I'm gonna throw up bits.",
"Please stop this torture and let me render some poetry.", "Is it possible to be that desperate? I'm still writing here though.", "I'm hurt deep inside and I don't know what to do."];

var contentEnd = ["See you next time diary.", "I'm a bit tired now, let's sleep a bit.", "I found this interesting, but I don't know why.", "Woh, boring. See you.",
"I should find more interesting stuff for next time...", "This last bit was maybe too much. Anyway, bye.", "That's all for today, I'm off.", "END OF FILE for today I would say.",
"I'm not sure if I should write that much.", "This was cool. I guess.", "Hm, a bit strange in the end I think.", "Let's see what tomorrow will bring.",
"It's becoming late for today, see you later.", "I should have written less about this.", "Did this topic really deserve that much text?", "Well, ok.", "Hm, let's stop here.",
"Enough for today.", "See you diary, take care computer, xx.", "Let's close this window for today.", "Anything else? Hm, don't think so."];

function displayContent(data){
  var rand = Math.random();
  if(rand > countWords('novel')/50000){
    $("#" + data.unixdate).append(contentHappy[Math.floor(Math.random()*contentHappy.length)] + "<br><br>");
  }else{
    $("#" + data.unixdate).append(contentSad[Math.floor(Math.random()*contentSad.length)] + "<br><br>");
  }
  $("#" + data.unixdate).append(contentIntro[Math.floor(Math.random()*contentIntro.length)] + ' <a href="'+ data.url + '">' + data.url + "</a>.<br><br>");
  var lang  = data.lang.slice(0, 2);
  if(languages.indexOf(lang) > -1){
    $('#' + data.unixdate).append(langIntro[Math.floor(Math.random()*langIntro.length)] + langToText[lang] + "<br><br>");
  }
  if(data.paragraphs.length > 0){
    for(var i = 0; i < data.paragraphs.length; i++){
      if(rand < countWords('novel')/75000){
        for (var j=0; j< (countWords('novel')/8000); j++){
          data.paragraphs[i] = data.paragraphs[i].randomNoise();
        }
      }
      $("#" + data.unixdate).append(data.paragraphs[i] + "<br><br>");
      if(countWords(data.unixdate) > 2000){
        i = data.paragraphs.length;
      }
    }
  }
  if(rand > countWords('novel')/50000){
    $("#" + data.unixdate).append(contentEnd[Math.floor(Math.random()*contentEnd.length)] + "<br><br>");
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
  var infosLocal = (infos.city.length > 0) ? infos.city + ', ' + infos.country_name : infos.country_name;


  $("#" + unix).append("My name is " + navigator.appName + ' ' + browserName + ", I'm a web browser and this is my personal diary. <br>Actually, my full name is " +
  navigator.appVersion + ', but everybody calls me ' + browserName + '.<br>I live in a ' + OSName + ' running computer, in ' + infosLocal +
  '.<br>My exact address is ' + infos.ip + '. <br>' + cookies + '<br><br>Ok, I presented myself. Let\'s see what can I talk about now. Hm, yes, I know... <b>' + novelTitle + '</b>.<br><br>');
}

function displayDate(unix, date){
  $("#novel").append('<p id="' + unix + '"><span class="date">UNIX Timestamp: ' + unix + ' - Human date: ' + date + '</span><br><br></p>');
}
