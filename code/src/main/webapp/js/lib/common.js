/**
 * 获取页面地址参数
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
 * weui组件的弹窗功能
 */
function weuiAlert(showTitle,showText) {
    var showTitle = showTitle || '温馨提示~';
    var showText = showText || '系统出错';
    weui.alert(showText, function() {
        console.log('ok');
    }, {
        title: showTitle
    });
}
/**
 * weui组件的Loading功能
 */
function weuiLoading() {
    var loading = weui.loading('loading');
}
/**
 * weui组件的HideLoading功能
 */
function weuiHideLoading() {
    var loading = weui.loading('loading');
    loading.hide();
}
var Common = {
    URL:"http://47.92.101.209/v1/"
}