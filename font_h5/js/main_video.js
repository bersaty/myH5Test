var tabNum;
var itemList = null;
$(function () {
    tabNum = sessionStorage.getItem('tabNum') || 0;

    if(tabNum ==0){
        $("#tab2").hide()
    }else if(tabNum == 1){
        $("#tab1").hide()
    }
    courseObjectList(tabNum,getUrlParam("category_index"),getUrlParam("menu_index"));
    // tabChange(tabNum)
    // coverByType(tabNum)
    coverImage(tabNum);

    //播放结束监听
    $("#video").bind('ended', function () {
        $("#video").hide();
        $(".top-img").show();
        // exitFullscreen();
        // $("#video").attr("src",null);
        // window.location.reload();
    })

    //播放监听
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

var playAudio = function (url ) {
    // $(".top-img").hide();
    // $(".audio-box").show();
    // $(".video-info").hide();
    // $("#video").hide();
    // $("#audio").attr("src",url)
}

/**
 * 播放视频
 * @param {string} url
 * @param {string} img_url
 * @param {int} playNow
 */
var playVideo = function(url, img_url, playNow){
    img_url == undefined ? default_img:img_url;
    sessionStorage.autoplay = 0
    if(typeof playNow != "undefined" && playNow == 1){
        sessionStorage.autoplay = 1
    }

        $("#video").show();
        $(".video-info").show();
        // $("#audio").hide();
        // $(".top-img").hide();
        $("#video").attr("src",url)
        // $("#video").attr("poster",img_url)
        $("#video").load()
        $("#video").attr("oncanplay","setCurrentPlayTime(this)")

    // location.reload()
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


function goList(category_index,menu_index) {
    // prefix = prefix.replace(/[//]/g,'');
    tabNum = sessionStorage.getItem('tabNum')
    window.location.href = "media.html?tabNum=" + tabNum+"&category_index="+category_index+"&menu_index="+menu_index;
}
/**
 * 播放视频
 * @param tabNum
 */
var normalColor = "#F2F0E3";
var selectColor = "#96988D";
var oldi=0;
function itemCilck(index,symbol,isMedia) {

    console.log( " itemclick index = "+index+" symbol = "+symbol+" isMedia = "+isMedia);
    // $(".videobox").outerHeight();

    // for(var i = 0 ;i<menuList.length;i++){
    //     console.log( " menulist i = "+i+" name = "+getName(menuList[i]));
    // }
    // for(var i = 0 ;i<itemList.length;i++){
    //     console.log( " itemlist i = "+i+" name = "+getName(itemList[i])+" url = "+getUrl(itemList[i]));
    // }

    // $('.video').attr('src', url);
    // $("#video").attr('src', url);
    // var dot_index = symbol.lastIndexOf(".");
    //为文件夹
    if(parseInt(isMedia) == 0){
        console.log( " itemclick isMedia = "+isMedia);

        goList(getUrlParam("category_index"),index);
        return;
    }
    // suffix  = symbol.substring(dot_index + 1);
    // console.log("itemclick index / = "+symbol.lastIndexOf("/"));
    // console.log("itemclick leng = "+symbol.length);

    // console.log("itemclick symbol = "+symbol.replace(/[//]/g,"$'"));
    // console.log("itemclick leng = "+symbol.substring(symbol.lastIndexOf("/")+1,symbol.length));

    if(itemList == null || itemList == undefined){
        itemList = getItemListInMenu(menuList[getUrlParam("menu_index")])
    }
    // if(suffix !== null || suffix !== ''){
        itemList = getItemListInMenu(menuList[getUrlParam("menu_index")])
        var url = getUrl(itemList[index]);
        console.log("url = "+url);
        // 开始播放视频
        if(tabNum==0){
            playVideo(url,null,1)
            $(".video-info").html(getName(itemList[index]));
        }else if(tabNum==1){
            playAudio(url)
            $(".video-info").html(getName(itemList[index]));
        }
    // }else{
        // $(".top-img").show();
        // $(".audio-box").hide();
        // $("#video").hide();
    // }
	$("#i"+oldi).css("background", normalColor);
	$("#i"+index).css("background", selectColor);
	oldi=index;
}

/** ======================================风格线=================================== **/

/**
 * 获取文件列表
 * @param {int} tabNum 
 * @param {string} index
 */
function courseObjectList(tabNum,category_index,menu_index) {
    weuiLoading();
    console.log(" category_index = "+ category_index+" menu_index = "+menu_index)

    var url = tabNum == 0? 'http://daanfashi.oss-cn-hangzhou.aliyuncs.com/video/contents.xml':'http://daanfashi.oss-cn-hangzhou.aliyuncs.com/audio/contents.xml'

    var newCentent = '';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'xml',
        success: function(xml) {
            categoryList = xml.getElementsByTagName("category");
            menuList = getMenuListInCategory(categoryList[category_index]);
            if(menu_index !=null){
                itemList = getItemListInMenu(menuList[menu_index])
            }
            console.log("categoryList = "+categoryList.length)
            console.log("menuList = "+menuList.length)

            if(menu_index != null && itemList != null && itemList.length > 0){
                if(tabNum == 0) {
                    $(".video-info").html(getName(itemList[0]));

                    playVideo(getUrl(itemList[0]))
                }else if(tabNum == 1){
                    // var bannerHeight = $(".top-img").outerHeight();
                    $(".weui-panel__bd").css("marginTop",50);

                    playAudio(getUrl(itemList[0]))
                }
            }

            var videoHeight = $(".videobox").outerHeight();
            var bannerHeight = $(".top-img").outerHeight();
            console.log("courseObjectList videoHeight = "+videoHeight);

            if(menuList==null && itemList ==null){
                $(".no-tip").show();
            }else{
                $(".no-tip").hide();
                if(menu_index == null && menuList !== null && menuList.length >0){
                    console.log("menuList = "+menuList.length)
                    newCentent += createListItem(menuList,true);
                    $(".weui-panel__bd").css("marginTop",bannerHeight);

                }else if(itemList !== null && itemList.length >0){
                    console.log("itemList = "+itemList.length)
                    newCentent += createListItem(itemList,false);
                    $(".weui-panel__bd").css("marginTop",20 + (bannerHeight>videoHeight?bannerHeight:videoHeight));

                }else {
                    newCentent += '<br><br><br><br>暂无课程，敬请期待..'
                }
            }

            if(tabNum==0){
                $('#tab_1').html(newCentent)
            }else if(tabNum==1){
                $('#tab_2').html(newCentent)
            }else if(tabNum==2){
                // $('#tab_3').html(newCentent)
            }

            if(itemList !== null && itemList.length > 0){
                $("#i"+0).css("background", selectColor);
                oldi=0;
            }

            weuiHideLoading();
        },
        error: function () {
            console.log("error")
            weuiHideLoading();
        }

    });
}

/**
 * 动态添加列表项
 * @param {Object} list 数据列表
 * @param {Boolean} isFolder 是否文件
 */
function createListItem(list,isFolder){
    var newCentent = '';
    for (var i = 0; i < list.length; i++) {
        var name;
        var img_url = getImg(list[i]) == ""? 'images/default.png':getImg(list[i])
		var clr = normalColor;//i==0?selectColor:normalColor;
        if(isFolder){
            // name = list[i].replace(/[//]/g,'');
            name = getName(list[i]);
            var newItem = '<a id="i'+i+'" style="padding: 5px 6px;border-bottom: 3px solid #E0E0C8;background:'+clr+';" href="javascript:itemCilck('+i+',&quot;' + name + '&quot;,0);" class="weui-media-box weui-media-box_appmsg">\n' +
                '<div class="weui-media-box__hd">\n' +
                '<img class="weui-media-box__thumb" src="' + img_url + '" alt="正在加载...">\n' +
                '</div>\n' +
                '<div class="weui-media-box__bd">\n' +
                '<p style="word-break:break-all;text-align:left;color: #463222;">' + name +'</p>\n' +
                // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
                '</div>\n' +
                '</a>'
            newCentent += newItem;
        }else{
            name = getName(list[i]);
            var newItem = '<a id="i'+i+'" style="border-bottom: 6px solid #E0E0C8;background:'+clr+';" href="javascript:itemCilck('+i+',&quot;' + name + '&quot;,1);" class="weui-media-box weui-media-box_appmsg">\n' +
                // '<div class="weui-media-box__hd">\n' +
                // '<img class="weui-media-box__thumb" src="' + default_img + '" alt="正在加载...">\n' +
                // '</div>\n' +
                '<div class="weui-media-box__bd">\n' +
                '<p style="word-break:break-all;text-align:left;color: #463222;">' + name +'</p>\n' +
                // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
                '</div>\n' +
                '</a>'
            newCentent += newItem;
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

function setCurrentPlayTime(e) {
    console.log("can play ,autoplay = "+sessionStorage.autoplay)
    e.currentTime = 2
    if(sessionStorage.autoplay == 1) {
        e.play()
    }
    $("#video").removeAttr("oncanplay")

    var videoHeight = $(".videobox").outerHeight();
    var bannerHeight = $(".top-img").outerHeight();
    console.log("courseObjectList ～～～videoHeight = "+videoHeight);
    $(".weui-panel__bd").css("marginTop",20 + (bannerHeight>videoHeight?bannerHeight:videoHeight));
}
