/**
 * 获取html分隔标签
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(window.location);
    var items = null;
    if (matcher != null) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
}
/**
 * weui错误弹框
 */
function weuiAlert(showTitle,showText) {
    var showTitle = showTitle || '网页的一些错误~';
    var showText = showText || '应该是代码出问题了';
    weui.alert(showText, function() {
        console.log('ok');
    }, {
        title: showTitle
    });
}
/**
 * weui加载弹框
 */
function weuiLoading() {
    var loading = weui.loading('loading');
}

/**
 * 点击列表触发的事件
 * @param {Object} symbol 点击列表跳转的内容
 */
function itemClick(symbol){

}
/**
 * weui隐藏加载弹框
 */
function weuiHideLoading() {
    var loading = weui.loading('loading');
    loading.hide();
}
var Common = {
    URL:"http://47.92.101.209/v1/",
    DOMAIN:"https://daanfs.donglin.org/",
    region:'oss-cn-hangzhou',
    accessKeyId:'LTAIiuhWCwxva6fj',
    accessKeySecret:'K4RvAODulR31QkBaexN256brxccXX2',
    bucket:'daanfashi'
}

// var Common = {
//     URL:"http://47.92.101.209/v1/",
//     DOMAIN:"http://wch-test.oss-cn-hangzhou.aliyuncs.com/",
//     region:'oss-cn-hangzhou',
//     accessKeyId:'LTAI7pUFVOiOJbcx',
//     accessKeySecret:'VyQZ0YszQhqqgkQKkBZQw1bEdkeD1A',
//     bucket:'wch-test'
// }

var client = new OSS.Wrapper({
    region: Common.region,
    accessKeyId: Common.accessKeyId,
    accessKeySecret: Common.accessKeySecret,
    bucket: Common.bucket
  });

  var objectList;
  var folderList;
  var coverList = [];

  var default_img = 'images/default.png';

/**
 * 获取 banner图片
 * @param tabNum
 */
function coverImage(tabNum) {
    return client.list({
        'max-keys': 1000,
        'prefix': 'banner/'
      }).then(function (result) {
          var dataList = result.objects;
          var i = 1;
          console.log("datalist length = "+dataList.length);
          console.log("datalist name = "+dataList[1].name);
          for(;i < dataList.length; i++){
            coverList.push(client.getObjectUrl(dataList[i].name,Common.DOMAIN));
          }
          for(;i < 4; i++){
            coverList.push(client.getObjectUrl(dataList[1].name,Common.DOMAIN));
          }
          //   url = client.generateObjectUrl('foo/bar.jpg');

          sessionStorage.setItem("cover0",coverList[1])
          sessionStorage.setItem("cover1",coverList[2])
          sessionStorage.setItem("cover2",coverList[3])
          if(tabNum==0){
              $('.top-img').attr('src', coverList[1]);
            }else if(tabNum==1){
              $('.top-img').attr('src', coverList[2]);
            }else if(tabNum==2){
              $('.top-img').attr('src', coverList[3]);
        }
      })
    //   .catch(function (err) {
        // weuiAlert("coverImage"+err);
    //   });
}