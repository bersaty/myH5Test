$(function () {
    var tabNum = getUrlParam('tabNum');    //取得选择的选项卡序号
    var CourseId = getUrlParam('index');    //取得选择的课程序号
    sessionStorage.setItem("tabNum", tabNum);
    sessionStorage.setItem("CourseId", CourseId);
    lessonList(CourseId)
    coverByType(tabNum)
    $("#video").bind('ended', function () {
        $("#video").hide();
        $(".video-info").hide();
        $(".top-img").show();
        exitFullscreen();
        window.location.reload();
    })
});

/**
 * 获取当前课程的分集列表
 */
function lessonList(CourseId) {
    weuiLoading();
    $.ajax({
        url: Common.URL + "course/" + CourseId,
        type: "GET",
        success: function (res) {
            console.log(res)
            var lessionList = res.data;
            var newCentent = "";
            var tabNum = sessionStorage.getItem("tabNum")
            for (var i = 0; i < lessionList.length; i++) {
                // console.log(lessionList[i])
                var newItem = '<a href="javascript:goDetail(' + lessionList[i].id + ');" ' +
                    ' class="list-item-a" style="padding-left: 5px;padding-right: 5px">\n' +
                    '            <h4 class="item-title">' + lessionList[i].name + '</h4>\n' +
                    '            <p class="item-text">' + lessionList[i].duration_format + '</p>\n' +
                    '        </a>'
                newCentent += newItem;
            }
            $('.list-bd').html(newCentent)
        },
        error: function (res) {
            weuiAlert(res.code, res.data)
        }
    })
    setTimeout(function () {
        weuiHideLoading()
    },300)
}

/**
 * 获取顶部封面
 * @param tabNum
 */
function coverByType(tabNum) {
    $.ajax({
        url: Common.URL + "cover",
        type: "GET",
        success: function (res) {
            var covers = res.data;
            var cover0 = "", cover1 = "", cover2 = "";
            for (var i = 0; i < covers.length; i++) {
                switch (covers[i].type) {
                    case 0:
                        cover0 = covers[i].img
                        break;
                    case 1:
                        cover1 = covers[i].img
                        break;
                }
            }
            if (tabNum == 0) {
                $('.top-img').attr('src', cover0);
            } else if (tabNum == 1) {
                $('.top-img').attr('src', cover1);
            }
        },
        error: function (res) {
            weuiAlert(res.code, res.data)
        }
    })
}

/**
 * 跳转至详情页面(当前选择的课程id)
 * @param lessonId
 */
function goDetail(lessonId) {
    stateCombination(lessonId);
}

/**
 * 控制视频和音频的显隐，并加载对应的媒体文件
 */
function stateCombination(lessonId) {
    weuiLoading()
    var tabNum = sessionStorage.getItem("tabNum");
    $.ajax({
        url: Common.URL + "lesson/" + lessonId,
        type: "GET",
        success: function (res) {
            var lesson = res.data;
            if(tabNum==0){
                $(".top-img").hide();
                $(".audio-box").hide();
                $("#video").show();
                $("#video").attr("src",lesson.content)
                $(".list-bd").css("marginTop","68%");
            }else if(tabNum==1){
                $(".top-img").hide();
                $(".audio-box").show();
                $("#video").hide();
                $("#audio").attr("src",lesson.content)
                $(".list-bd").css("marginTop","26%");
            }
            $(".video-info").html(lesson.name)
            $(".video-info").show()
        },
        error: function (res) {
            weuiAlert(res.code, res.data)
        }
    })
    setTimeout(function () {
        weuiHideLoading()
    },300)
}
/**
 *  退出全屏
 */
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}

function setCurrentPlayTime(e) {
    e.currentTime = 2
    $("#video").removeAttr("oncanplay")
}