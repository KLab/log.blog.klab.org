var searchStrArray = document.location.search.substring(1).split('&');
var queryArray = {};
for(i = 0; i < searchStrArray.length; i++)
    queryArray[searchStrArray[i].substring(0, searchStrArray[i].indexOf('='))] = searchStrArray[i].substring(searchStrArray[i].indexOf('=') + 1);

if(queryArray["qenc"]){
    queryArray["q"] = unescape(queryArray["qenc"]);
    var b = "";
    for(i in queryArray){
        if(i == "qenc") continue;
        b = b + "&" + i + "=" + queryArray[i];
    }
    b.replace("^&", "?");
    document.location.search = b;
}

function encodequery(e){
    var f;
    if(e.srcElement)
        eval("f = e.srcElement;");
    else
        eval("f = e.currentTarget;");

    if(f.q && f.qenc)
        f.qenc.value = encodeURIComponent(f.q.value);
}
function bodyload(){
    var fs = document.getElementsByTagName("form");
    for(i = 0; i < fs.length; i++){
        if(fs[i].id.indexOf("hwhy4wacmbm") < 0)
            continue;

		fs[i].action = "http://dsas.blog.klab.org/archives/50784706.html";
		if(fs[i].cof) fs[i].cof.value = "FORID:9";
		if(fs[i].ie)  fs[i].ie.value  = "utf8";

        if(fs[i].attachEvent){
            fs[i].attachEvent("onsubmit", encodequery);
        }else{
            fs[i].addEventListener("submit", encodequery, false);
        }
    }
}
if(window.attachEvent){
    window.attachEvent("onload", bodyload)
}else{
    window.addEventListener("load", bodyload, false)
}
