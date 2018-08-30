var tabNum;
$(function () {
    tabNum = sessionStorage.getItem('tabNum') || 0;
    courseObjectList(tabNum,getUrlParam("index"));
    // tabChange(tabNum)
    // coverByType(tabNum)
    coverImage(tabNum);

    $("#video").bind('ended', function () {
        $("#video").hide();
        $(".top-img").show();
        exitFullscreen();
        // $("#video").attr("src",null);
        // window.location.reload();
    })

    $("#video").bind('timeupdate',function(){
        // console.log("current time = "+this.currentTime+" totalTime = "+this.duration);

        if(this.duration - this.currentTime < 1){
            this.currentTime = 2;
            this.pause();
        }

    });
    $("#video").bind('play',function(){
        console.log("play ～～～");
        var videoHeight = $(".videobox").outerHeight();
        var bannerHeight = $(".top-img").outerHeight();

        console.log("play ～～～videoHeight = "+videoHeight);
        $(".weui-panel__bd").css("marginTop",20 + (bannerHeight>videoHeight?bannerHeight:videoHeight));

    });
    // $("#video").bind('loadeddata',captureImage);
    // $("#video").attr("crossOrigin","Anonymous");

});

/**
 * 播放视频
 * @param {视频地址} url 
 * @param {封面地址} img_url 
 */
var playVideo = function(url,img_url){
    img_url == undefined ? default_img:img_url;
    $("#video").show();
    $(".video-info").show();
    // $("#audio").hide();
    // $(".top-img").hide();
    $("#video").attr("src",url)
    // $("#video").attr("poster",img_url)
    $("#video").load()
};

var captureImage = function() {
    var output = document.getElementById("output");
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * 0.5;
    canvas.height = video.videoHeight * 0.5;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    output.appendChild(img);
};


function goList(prefix) {
    // prefix = prefix.replace(/[//]/g,'');
    var tabNum = sessionStorage.getItem('tabNum')
    window.location.href = "video.html?tabNum=" + tabNum+"&index="+prefix;
}

/**
 * 播放视频
 * @param tabNum
 */
function itemCilck(symbol) {

    // $(".videobox").outerHeight();

    // $('.video').attr('src', url);
    // $("#video").attr('src', url);
    var dot_index = symbol.lastIndexOf(".");
    //为文件夹
    if(dot_index == -1 && symbol.length !== 0){
        goList(symbol);
        return;
    }
    suffix  = symbol.substring(dot_index + 1);
    // console.log("itemclick index / = "+symbol.lastIndexOf("/"));
    // console.log("itemclick leng = "+symbol.length);

    // console.log("itemclick symbol = "+symbol.replace(/[//]/g,"$'"));
    // console.log("itemclick leng = "+symbol.substring(symbol.lastIndexOf("/")+1,symbol.length));

    if(suffix !== null || suffix !== ''){
        var url = client.getObjectUrl(symbol,Common.DOMAIN);
        console.log("url = "+url);
        // 开始播放视频
        if(tabNum==0){
            playVideo(url)
            $(".video-info").html(symbol.substring(symbol.lastIndexOf("/")+1,symbol.length));
        }else if(tabNum==1){
            $(".top-img").hide();
            $(".audio-box").show();
            $(".video-info").hide();
            $("#video").hide();
            $("#audio").attr("src",url)
        }
    }else{
        // $(".top-img").show();
        // $(".audio-box").hide();
        // $("#video").hide();
    }
    // if(symbol.e)

    // var videoHeight = $(".videobox").outerHeight();
    // var bannerHeight = $(".top-img").outerHeight();

    // $(".weui-panel__bd").attr("margin-top",bannerHeight>videoHeight?bannerHeight:videoHeight);

    // console.log("video height = "+$(".videobox").outerHeight());
    // console.log("banner height = "+$(".top-img").outerHeight());
}

/** ======================================风格线=================================== **/

/**
 * 获取文件列表
 * @param {int} tabNum 
 * @param {string} prefix 
 */
function courseObjectList(tabNum,prefix) {
    weuiLoading();

    client.list({
        'max-keys': 1000,
        'prefix': prefix,
        'delimiter':'/'
      }).then(function (result) {
            var courseList = result.prefixes;
            var dataList = result.objects;
            var newCentent = "";

            if(dataList !== null && dataList.length > 1){
                // var videoHeight = $(".videobox").outerHeight();
                // var bannerHeight = $(".top-img").outerHeight();
                // console.log("courseObjectList ～～～videoHeight = "+videoHeight);

                //  $("#gab").height(bannerHeight>videoHeight?bannerHeight:videoHeight);
                //  $("#gab").attr("position","relative");
                // $(".weui-panel__bd").css("marginTop",20 + (bannerHeight>videoHeight?bannerHeight:videoHeight));
                //  $(".weui-tab_video_bd").css("marginTop",bannerHeight>videoHeight?bannerHeight:videoHeight);
    
                $(".video-info").html(dataList[1].name.substring(dataList[1].name.lastIndexOf("/")+1,dataList[1].name.length));
                playVideo(client.getObjectUrl(dataList[1].name,Common.DOMAIN))
                // $(".top-img").hide();
                // $(".audio-box").hide();
                // $("#video").show();
                // $("#video").attr("src",client.getObjectUrl(dataList[1].name,Common.DOMAIN))
            }

            if(courseList==null && dataList ==null){
                $(".no-tip").show();
            }else{
                $(".no-tip").hide();
                if(courseList !== null && courseList.length >0){
                    newCentent += createListItem(courseList,true,prefix);
                }
                if(dataList !== null && dataList.length >0){
                    newCentent += createListItem(dataList,false,prefix);
                }
            }
            if(tabNum==0){
                $('#tab_1').html(newCentent)
            }else if(tabNum==1){
                $('#tab_2').html(newCentent)
            }else if(tabNum==2){
                $('#tab_3').html(newCentent)
            }
            weuiHideLoading();

            // console.log("video height = "+$(".videobox").outerHeight());
            // console.log("banner height = "+$(".top-img").outerHeight());
            var videoHeight = $(".videobox").outerHeight();
            var bannerHeight = $(".top-img").outerHeight();
            console.log("courseObjectList ～～～videoHeight = "+videoHeight);
            $(".weui-panel__bd").css("marginTop",20 + (bannerHeight>videoHeight?bannerHeight:videoHeight));

      })
    //   .catch(function (err) {
    //     weuiAlert(err);
    //   });
    // setTimeout(function () {
    //     weuiHideLoading()
    // },500)

}

/**
 * 动态添加列表项
 * @param {Object} list 数据列表
 * @param {Boolean} isFolder 是否文件
 */
function createListItem(list,isFolder,prefix){
    var newCentent = '';
    for (var i = 0; i < list.length; i++) {
        var name;
        if(isFolder){
            // name = list[i].replace(/[//]/g,'');
            name = list[i];
            if(name.replace(prefix,'') !== ''){
                var newItem = '<a style="border-bottom: 6px solid #EEEEEE;;" href="javascript:itemCilck(&quot;' + name + '&quot;);" class="weui-media-box weui-media-box_appmsg">\n' +
                    // '<div class="weui-media-box__hd">\n' +
                    // '<img class="weui-media-box__thumb" src="' + default_img + '" alt="正在加载...">\n' +
                    // '</div>\n' +
                    '<div class="weui-media-box__bd">\n' +
                    '<p style="word-break:break-all">' + name.replace(prefix,'')+'</p>\n' +
                    // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
                    '</div>\n' +
                    '</a>'
                newCentent += newItem;
            }
        }else{
            name = list[i].name;
            if(name.replace(prefix,'') !== ''){
                var newItem = '<a style="border-bottom: 6px solid #EEEEEE;;" href="javascript:itemCilck(&quot;' + name + '&quot;);" class="weui-media-box weui-media-box_appmsg">\n' +
                    '<div class="weui-media-box__hd">\n' +
                    '<img class="weui-media-box__thumb" src="' + default_img + '" alt="正在加载...">\n' +
                    '</div>\n' +
                    '<div class="weui-media-box__bd">\n' +
                    '<p style="word-break:break-all">' + name.replace(prefix,'')+'</p>\n' +
                    // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
                    '</div>\n' +
                    '</a>'
                newCentent += newItem;
            }
        }
        // console.log(" prefix "+i +" = "+name);
        
    }
    return newCentent;
}

function exitFullscreen() {
    var de = document;
    de.webkitExitFullscreen();
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    } else if (de.webkitExitFullscreen) {
        de.webkitExitFullscreen();
    }
}
