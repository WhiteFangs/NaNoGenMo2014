
function initDiary (novelTitle){
  var i = countWords();
  getLorem(i);
}

function getLorem(i){
  if (i<500){
    $.get("./lorem.php", function(data){
      $("#novel").append("<br>" + i + " : <br>" + data);
      i = countWords();
      getLorem(i);
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
