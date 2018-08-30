$(function () {
    var tabNum = getUrlParam('tabNum');    //鍙栧緱閫夋嫨鐨勯€夐」鍗″簭鍙�
    var CourseId = getUrlParam('index');    //鍙栧緱閫夋嫨鐨勮绋嬪簭鍙�
    sessionStorage.setItem("tabNum", tabNum);
    sessionStorage.setItem("CourseId", CourseId);
    lessonList(CourseId)
    coverByType(tabNum)
    $("#video").bind('ended', function () {
        $("#video").hide();
        $(".top-img").show();
        exitFullscreen();
        window.location.reload();
    })
});

/**
 * 鑾峰彇褰撳墠璇剧▼鐨勫垎闆嗗垪琛�
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
                console.log(lessionList[i])
                var newItem = '<a href="javascript:goDetail(' + lessionList[i].id + ');" class="list-item-a">\n' +
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
 * 鑾峰彇椤堕儴灏侀潰
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
 * 璺宠浆鑷宠鎯呴〉闈�(褰撳墠閫夋嫨鐨勮绋媔d)
 * @param lessonId
 */
function goDetail(lessonId) {
    stateCombination(lessonId);
}

/**
 * 鎺у埗瑙嗛鍜岄煶棰戠殑鏄鹃殣锛屽苟鍔犺浇瀵瑰簲鐨勫獟浣撴枃浠�
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
            }else if(tabNum==1){
                $(".top-img").hide();
                $(".audio-box").show();
                $("#video").hide();
                $("#audio").attr("src",lesson.content)
            }
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
 *  閫€鍑哄叏灞�
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