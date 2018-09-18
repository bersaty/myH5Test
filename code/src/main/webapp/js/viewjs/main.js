$(function () {
    var tabNum = sessionStorage.getItem('tabNum') || 0;
    tabChange(tabNum)
    coverByType(tabNum)
});

/**
 * 获取所有课程列表
 */
function courseList(tabNum) {
    weuiLoading();
    $.ajax({
        url: Common.URL + "course/type/" + tabNum,
        type: "GET",
        success: function (res) {
            var courseList = res.data;
            var newCentent = "";
            if(courseList.length==0){
                $(".no-tip").show();
            }else{
                $(".no-tip").hide();
                for (var i = 0; i < courseList.length; i++) {
                    var newItem = '<a style="border: solid 2px #ebebeb;" href="javascript:goList(' + courseList[i].id + ');" class="weui-media-box weui-media-box_appmsg">\n' +
                        '<div class="weui-media-box__hd">\n' +
                        '<img class="weui-media-box__thumb" src="' + courseList[i].cover + '" alt="加载中...">\n' +
                        '</div>\n' +
                        '<div class="weui-media-box__bd">\n' +
                        '<h4 class="weui-media-box__title ">'+courseList[i].name+'</h4>\n' +
                        '<p class="weui-media-box__desc ">共' + courseList[i].count + '讲</p>\n' +
                        '</div>\n' +
                        '</a>'
                    newCentent += newItem;
                }
            }
            if(tabNum==0){
                $('#tab_1').html(newCentent)
            }else if(tabNum==1){
                $('#tab_2').html(newCentent)
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
 * 获取顶部封面
 * @param tabNum
 */
function coverByType(tabNum) {
    $.ajax({
        url: Common.URL + "cover",
        type: "GET",
        success: function (res) {
            var covers = res.data;
            var cover0="",cover1="",cover2="";
            for (var i = 0; i < covers.length; i++) {
                switch (covers[i].type){
                    case 0:
                        cover0 = covers[i].img
                        break;
                    case 1:
                        cover1 = covers[i].img
                        break;
                }
            }
            sessionStorage.setItem("cover0",cover0)
            sessionStorage.setItem("cover1",cover1)
            if(tabNum==0){
                $('.top-img').attr('src', cover0);
            }else if(tabNum==1){
                $('.top-img').attr('src', cover1);
            }
        },
        error: function (res) {
            weuiAlert(res.code, res.data)
        }
    })
}

/**
 * 控制点击底部导航栏变换
 * @param tabNum
 */
function tabChange(tabNum) {
    sessionStorage.setItem('tabNum', tabNum)
    //让内容框的第 tabNum 个显示出来，其他的被隐藏
    $(".weui-tab__bd-item").eq(tabNum).show().siblings().hide();
    var newSrc1 = tabNum == 0 ? "../images/tap1_2.png" : "../images/tap1.png";
    var newSrc2 = tabNum == 1 ? "../images/tap2_2.png" : "../images/tap2.png";
    $(".tab-img").eq(0).attr("src", newSrc1);
    $(".tab-img").eq(1).attr("src", newSrc2);
    courseList(tabNum);
    if(tabNum==0){
        $('.top-img').attr('src', sessionStorage.getItem("cover0"));
    }else if(tabNum==1){
        $('.top-img').attr('src', sessionStorage.getItem("cover1"));
    }
}

/**
 * 点击进入列表页面
 * @param tabNum
 */
function goList(index) {
    var tabNum = sessionStorage.getItem('tabNum')
    window.location.href = "/views/list.html?tabNum=" + tabNum+"&index="+index;
}
