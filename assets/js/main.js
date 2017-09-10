var current_page;
var offset_page;
var st_total;
document.getElementById('progessBar').style.display = 'none';

var HttpClient = function() {
    document.getElementById('progessBar').style.display = 'block';
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200){
                aCallback(anHttpRequest.responseText);
                document.getElementById('progessBar').style.display = 'none';
                document.getElementById('welcomeDiv').style.display = 'none';
            }
        }

        anHttpRequest.open( "GET", aUrl, true );      
        anHttpRequest.setRequestHeader("content-type", "application/vnd.twitchtv.v5+json");
        anHttpRequest.setRequestHeader("client-id", "uo6dggojyb8d6soh92zknwmi5ej1q2");
        anHttpRequest.send( null );
    }
}

function searchwithzero(){
    current_page = 1;
    offset_page=current_page*5-5;
    st_total = 0;
    search_text = document.getElementById("searchForm").elements["searchItem"].value;
    if(search_text==""){
        alert("please enter search text");
    }else{
    search();
    }
    
}

function search() {
    var client = new HttpClient();
    client.get('https://api.twitch.tv/kraken/search/streams?limit=5&offset='+offset_page+'&query='+search_text, function(response) {
    
        obj = JSON.parse(response);
        if(obj){
            var len = obj.streams.length;
            st_total = obj._total;
            var txt = "";
            if(current_page<=1){
                document.getElementById('btn_prev').style.display = 'none';
            }else{
                document.getElementById('btn_prev').style.display = 'initial';
            }
            if(current_page>=(st_total/5)){
                document.getElementById('btn_next').style.display = 'none';
            }else{
                document.getElementById('btn_next').style.display = 'initial';
            }
            document.getElementById('paginationTab').style.display = 'block';
            document.getElementById("page").innerHTML=current_page+"<span> of </span>"+Math.ceil(st_total/5);
            txt+="<h5>Total results:"+st_total+"</h5>";
            if(len > 0){
                for(var i=0;i<len;i++){
                    txt+="<ul class='twitchList'>"+
                        "<li><img src='"+obj.streams[i].preview.medium+"' alt='PlayStation'></li>"+
                        "<li><h5>"+obj.streams[i].channel.display_name+"</h5></li>"+
                        "<li>"+obj.streams[i].game+" - "+obj.streams[i].channel.views+" viewers</li>"+
                        "<li>Channel name:"+obj.streams[i].channel.name+"</li>"+
                        "<li>URL:<a href='"+obj.streams[i].channel.url+"'>"+obj.streams[i].channel.url+"</a></li>"+
                        "<li>Created at:"+obj.streams[i].channel.created_at+"</li>"+
                        "<li>Last updated at:"+obj.streams[i].channel.updated_at+"</li>"+
                        "</ul>";
                }
                if(txt != ""){
                    document.getElementById("table").innerHTML = txt;
                }
            }else{
                var err_txt = "";
                document.getElementById('paginationTab').style.display = 'none';
                err_txt+="<span>Search not found please try again</span>";
                document.getElementById("table").innerHTML = err_txt;
            }
        }
    });
}


function prevPage()
{
    if (offset_page > 1) {
        current_page--;
        offset_page=current_page*5-5;
        search();
    }
    
}

function nextPage()
{
    if (offset_page < st_total) {
        current_page++;
        offset_page=current_page*5-5;
        search();
    }
}
