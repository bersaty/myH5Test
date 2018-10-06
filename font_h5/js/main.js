$(function () {
    var tabNum = sessionStorage.getItem('tabNum') || 0;
    tabChange(tabNum)
    coverImage(tabNum)
});

/**
 * @param tabNum
 */
function goList(category_index) {
    // prefix = prefix.replace(/[//]/g,'');
    var tabNum = sessionStorage.getItem('tabNum')
    window.location.href = encodeURI("media.html?tabNum=" + tabNum+"&category_index="+category_index);
}

/** ======================================风格线=================================== **/

/**
 * 打印oss的文件
 */
function generateContentXML(tabNum) {
    weuiLoading();

    // var prefix = 'video/'
    var prefix = 'audio/'


    client.list({
        'max-keys': 1000,
        'prefix': prefix,
        // 'delimiter':'/'
    }).then(function (result) {
        var courseList = result.prefixes;
        var dataList = result.objects;
        // console.log("data length = "+dataList.length+" course length = "+courseList.length)

        var newCentent = "&lt;?xml version=\"1.0\"?><br>" +
            "&lt;resource> <br>";
        var lastMenuName = ""
        var lastCategoryName = ""
        var itemName = ""
        var menuName = ""
        var categoryName = ""

        for(var i = 1;i<dataList.length;i++){

            if(dataList[i].name.indexOf(".jpg") > -1) continue

            var str = dataList[i].name.substr(dataList[i].name.indexOf("/")+1,dataList[i].name.length)
            categoryName = str.substr(0,str.indexOf("/"))
            categoryName = categoryName.substr(2,categoryName.length)
            // if(categoryName == "") continue
            str = str.substr(str.indexOf("/")+1,str.length)
            menuName = str.substr(0,str.indexOf("/"))
            menuName = menuName.substr(2,menuName.length)

            // if(menuName == "") continue
            itemName = str.substr(0,str.indexOf("."))
            itemName = itemName.substr(str.indexOf("/")+1,itemName.length)

            // console.log("categoryName = "+ categoryName+" menuName = "+menuName+" itemName = "+itemName)
            console.log("data name = "+dataList[i].name + " length = "+dataList.length)

            if(categoryName != lastCategoryName && lastCategoryName != ""){
                newCentent+= '&lt;/category><br>'
            }

            if(categoryName != lastCategoryName){
                newCentent+= '&lt;category'+
                    ' name = "【' + categoryName +'】"'+
                    ' img = ""' + ' ><br>'
                lastCategoryName = categoryName
            }

            if(menuName != lastMenuName && menuName != ""){
                newCentent+= '&lt;/menu><br>'

            }

            if(menuName != lastMenuName && menuName != ""){
                newCentent+= '&lt;menu'+
                    ' name = "【' + menuName +'】"'+
                    ' img = ""' + ' ><br>'
                lastMenuName = menuName
            }

            if(dataList[i].name.indexOf(".") > -1) {
                newCentent += '&lt;item'+
                    ' name = "【' + itemName +'】"'+
                    ' img = ""' +
                    ' url = "' +
                    ' http://daanfashi.oss-cn-hangzhou.aliyuncs.com/' + dataList[i].name + '" /><br>'
            }
        }
        // newCentent+= '&lt;/menu><br>'
        newCentent+= '&lt;/category><br>'
        //newCentent += '&lt;/category><br>'
        newCentent+= '&lt;/resource> <br>'

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
 * 加载课程列表文件
 */
function courseFolderList(tabNum) {
    weuiLoading();

    var url = tabNum == 0? 'http://daanfashi.oss-cn-hangzhou.aliyuncs.com/video/contents.xml':'http://daanfashi.oss-cn-hangzhou.aliyuncs.com/audio/contents.xml'

    var newCentent = '';

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'xml',
        success: function(xml) {
            contentXML = xml;
            var categoryList = xml.getElementsByTagName("category");

            if(categoryList==null){
                $(".no-tip").show();
            }else{
                $(".no-tip").hide();
                if(categoryList !== null && categoryList.length >0){
                    newCentent += createListItem(categoryList);
                }
                // if(dataList !== null && dataList.length >0){
                //     newCentent += createListItem(dataList,false,prefix);
                // }
            }
            if(tabNum==0){
                $('#tab_1').html(newCentent)
            }else if(tabNum==1){
                $('#tab_2').html(newCentent)
            }else if(tabNum==2){
                $('#tab_3').html(newCentent)
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
 */
function createListItem(list){
    var newCentent = '';
    for (var i = 0; i < list.length; i++) {
        var img_url = getImg(list[i]) == ""? 'images/default.png':getImg(list[i])

        // console.log(" category name  "+i +" = "+name);
        var newItem = '<a style="padding: 5px 6px;border-bottom: 3px solid #E0E0C8;background: #F2F0E3" href="javascript:goList(&quot;' + i + '&quot;);" class="weui-media-box weui-media-box_appmsg" style="background: rgb(242,240,227);">\n' +
            '<div class="weui-media-box__hd">\n' +
            '<img class="weui-media-box__thumb" src="' + img_url + '" alt="正在加载...">\n' +
            '</div>\n' +
            '<div class="weui-media-box__bd">\n' +
            '<h4 class="weui-media-box__title" style="color: #463222;">' + getName(list[i])+'</h4>\n' +
            // '<p class="weui-media-box__desc">共 ' + list[i].count + ' 讲</p>\n' +
            '</div>\n' +
            '</a>'
        newCentent += newItem;
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
    // courseFolderList(tabNum);//正常显示
    generateContentXML(tabNum)//用来快速生成xml目录文件，需要注意部分错误的语法
    if(tabNum==0){
        $('.top-img').attr('src', sessionStorage.getItem("cover0"));
    }else if(tabNum==1){
        $('.top-img').attr('src', sessionStorage.getItem("cover1"));
    }else if(tabNum==2){
        $('.top-img').attr('src', sessionStorage.getItem("cover2"));
    }
}

