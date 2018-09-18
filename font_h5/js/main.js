$(function () {
    var tabNum = sessionStorage.getItem('tabNum') || 0;
    tabChange(tabNum)
    coverImage(tabNum)
});

/**
 * @param tabNum
 */
function goList(prefix) {
    // prefix = prefix.replace(/[//]/g,'');
    var tabNum = sessionStorage.getItem('tabNum')
    window.location.href = "media.html?tabNum=" + tabNum+"&index="+prefix;
}

/** ======================================风格线=================================== **/

/**
 * 加载课程列表文件
 */
function courseFolderList(tabNum) {
    weuiLoading();

    var prefix = tabNum == 0? 'video/':'audio/'

    client.list({
        'max-keys': 1000,
        'prefix': prefix,
        'delimiter':'/'
      }).then(function (result) {
            var courseList = result.prefixes;
            var dataList = result.objects;
            var newCentent = "";
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
      }).catch(function (err) {
        weuiHideLoading();
    });
    // setTimeout(function () {
    //     weuiHideLoading();
    // },500)

}

/**
 * 动态添加列表项
 * @param {Object} list 数据列表
 * @param {Boolean} isFolder 是否文件
 * @param {string} prefix 文件前缀
 */
function createListItem(list,isFolder,prefix){
    var newCentent = '';
    for (var i = 0; i < list.length; i++) {
        var name;
        if(isFolder){
            // name = list[i].replace(/[//]/g,'');
            name = list[i];
        }else{
            name = list[i].name;
        }
        console.log(" prefix "+i +" = "+name);
        if(name.replace(prefix,'') !== ''){
            var newItem = '<a href="javascript:goList(&quot;' + name + '&quot;);" class="weui-media-box weui-media-box_appmsg">\n' +
                // '<div class="weui-media-box__hd">\n' +
                // '<img class="weui-media-box__thumb" src="' + default_img + '" alt="正在加载...">\n' +
                // '</div>\n' +
                '<div class="weui-media-box__bd">\n' +
                '<h4 class="weui-media-box__title">' + name.replace(prefix,'')+'</h4>\n' +
                // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
                '</div>\n' +
                '</a>'
            newCentent += newItem;
        }
    }
    return newCentent;
}

/**
 * 底部栏点击tab响应事件
 * @param tabNum
 */
function tabChange(tabNum) {
    sessionStorage.setItem('tabNum', tabNum)
    $(".weui-tab__bd-item").eq(tabNum).show().siblings().hide();
    var newSrc1 = tabNum == 0 ? "images/tap1_2.png" : "images/tap1.png";
    var newSrc2 = tabNum == 1 ? "images/tap2_2.png" : "images/tap2.png";
    var newSrc3 = tabNum == 2 ? "images/tap3_2.png" : "images/tap3.png";
    $(".tab-img").eq(0).attr("src", newSrc1);
    $(".tab-img").eq(1).attr("src", newSrc2);
    $(".tab-img").eq(2).attr("src", newSrc3);
    courseFolderList(tabNum);
    if(tabNum==0){
        $('.top-img').attr('src', sessionStorage.getItem("cover0"));
    }else if(tabNum==1){
        $('.top-img').attr('src', sessionStorage.getItem("cover1"));
    }else if(tabNum==2){
        $('.top-img').attr('src', sessionStorage.getItem("cover2"));
    }
}

