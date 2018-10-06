var $ = mdui.JQ

function main() {
    var log = console.log
    var baseUrl = "/v1/"
    typeList = ["视频", "音频", "文字"]

    //加载弹框
    var loadingDialog = new mdui.Dialog('#upload-loading-dialog',{
        closeOnEsc: false,
        modal: true
    })

    //清理缓存
    var clearCache = function () {
        var removeList = ["url", "cover", "course", "lesson", "duration", "uploadType", "duration", "type"]
        for (x in removeList) {
            sessionStorage.removeItem(removeList[x])
        }
        // window.location.reload()
    }

    //未登录就返回登录页面
    if (typeof(sessionStorage.uid) == "undefined") {
        self.location = "./auth.html"
    }
    //登录验证触发后返回登录页
    function loginCheck(data) {
        if (parseInt(data.code) == 401) {
            mdui.snackbar("未登录")
            setTimeout('self.location = "./auth.html"', 1000)
        }
    }

    //course 的html生成器，没有组件化的开发就将就下吧
    function courseGenerator(course) {
        if (course == null)
            return null
        course.typeCN = typeList[parseInt(course.type)]
        var html = "<div style=\"margin-bottom: 20px\" class=\"mdui-collapse-item course-item mdui-shadow-2\" id=\"course-item-"+course.id+"\" "+
            "course-type=\"" + course.type + "\" course-count=\"" + course.count + "\" course-cover=\"" + course.cover + "\" " +
            "course-name=\"" + course.name +"\" course-orderid=\"" + course.orderid + "\" course-id=\"" + course.id + "\">\n" +
            "<div class=\"mdui-collapse-item-header\">\n" +
            "<div class=\"mdui-list-item mdui-ripple\" mdui-tooltip=\"{content: '点击展开章节', delay: 500}\"> \n" +
            "<div class=\"mdui-list-item-avatar\" style=\" max-width: 100px;border-radius: 0%\"><img class=\"mdui-img-fluid course-cover\"  src=\"" + course.cover + "\" /></div>\n" +
            "<div class=\"mdui-list-item-content\">\n" +
            "<div class=\"mdui-list-item-title course-name\">" + course.name + "</div>\n" +
            "<div class=\"mdui-list-item-text mdui-list-item-one-line course-info\">课程类型: " + course.typeCN + "&nbsp;&nbsp;&nbsp;&nbsp;课时长度: " + course.count +
            "&nbsp;&nbsp;&nbsp;课程排序: " + course.orderid +
            "</div>\n" +
            "</div>\n" +
            "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme mdui-m-r-1 mdui-text-color-white lesson-add\" mdui-dialog=\"{target: '#lesson-dialog',closeOnConfirm:false,modal:true}\">添加课时</button>\n" +
            "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme  mdui-m-r-1 mdui-text-color-white course-edit\" mdui-dialog=\"{target: '#course-dialog',closeOnConfirm:false}\">编辑</button>\n" +
            "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-red course-del\" mdui-dialog=\"{target: '#delete-courses-dialog'}\">删除</button>\n" +
            "</div></div><div class=\"mdui-collapse-item-body\">" +
            "<div class=\"mdui-list lesson-list mdui-list-dense\">\n" +
            "</div></div></div>"
        return html
    }

    //课时生成
    function lessonGenerator(lesson) {
        if (lesson == null)
            return null
        var html = "<div class=\"mdui-list-item mdui-ripple lesson-item\" style=\"border-top: 1px solid #ebebeb\" " +
            "lesson-id=\"" + lesson.id + "\" lesson-cid=\"" + lesson.cid + "\" lesson-cname=\"" + lesson.cname +
            "\" lesson-name=\"" + lesson.name + "\" lesson-content=\"" + lesson.content +
            "\" lesson-duration=\"" + lesson.duration + "\" lesson-type=\"" + lesson.type + "\">\n" +
            "<div class=\"mdui-list-item-content\">" + lesson.name + "</div>\n" +
            "<div class=\"mdui-list-item-content\"> 时长 = " + parseInt(lesson.duration/60) +":"+(lesson.duration%60)+ "</div>\n" +
            "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme mdui-m-r-1 mdui-text-color-white lesson-edit\" mdui-dialog=\"{target: '#lesson-dialog',closeOnConfirm:false}\">编辑</button>\n" +
            "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-red  lesson-del\" mdui-dialog=\"{target: '#delete-lesson-dialog'}\">删除</button>\n" +
            "</div>"

        return html
    }

    //得到所有的课程
    $.ajax({
        method: "get",
        url: baseUrl + "course",
        success: function(data) {
            data = JSON.parse(data)
            loginCheck(data)
            var courses = data.data
            sessionStorage.courses = JSON.stringify(courses)
            // console.log("所有课程："+sessionStorage.courses);
            showCourseByType()
            var inst = new mdui.Tab('#top_tab');
            var currentTab = sessionStorage.currentTab
            console.log("current tab = "+currentTab)
            if(typeof currentTab =="undefined" || currentTab == 1) {
                inst.show('top_tab1')
            }else {
                inst.show('top_tab2')
            }
            bindEvent()
            bindSrcEvent(".image-zone",-1)
            bindSrcEvent("#lesson-upload-file-1",1)
        }
    })

    //显示课程
    function showCourseByType(type) {
        var courses = JSON.parse(sessionStorage.courses)
        // var courses = sessionStorage.courses;
        if (typeof(type) == "undefined") type = 0

        $("#course-list-video").html("")
        $("#course-list-audio").html("")
        for (x in courses) {
            var course = courses[x]

            if (course.type == 0) {//视频
                $("#course-list-video").append(courseGenerator(course))
            }else if(course.type == 1) {//音频
                $("#course-list-audio").append(courseGenerator(course))
            }
        }

        // courseBind()
        // lessonBind()
    }

    //记录当前点击的tab
    $(".type-btn").on("click", function() {
        var type = parseInt($(this).attr("type"))
        // console.log("click type = "+type)
        sessionStorage.currentTab = type;
        // showCourseByType(type)
    })

    //绑定课程点击事件和弹框事件，只能绑定一次，绑多次会有问题
    function bindEvent() {

        //点击课程，加载课时列表
        $(".course-item").on("open.mdui.collapse", function() {
            console.log(" collapse change ~")
        })
        $(".mdui-collapse-item-header").on("click", function() {

            _this = $(this).parents(".course-item")
            var cid = _this.attr("course-id");
            var collapse = new mdui.Collapse(".course-item", "{accordion: false}");
            // collapse.closeAll()
            var openCourseId = sessionStorage.openCourseId;

            var id = _this.attr("id")
            console.log("collapse cid = "+cid+" item id = "+id+"  ");
            if(typeof openCourseId !="undefined" && openCourseId!= id){
                collapse.close("#"+openCourseId)
            }

            sessionStorage.openCourseId = id
            collapse.toggle("#"+id)

            // loadingDialog.open()

            courseButton = $.ajax({
                method: "GET",
                url: baseUrl + "course/" + cid,
                success: function(data) {
                    $(".lesson-item").remove()
                    data = JSON.parse(data)
                    loginCheck(data)
                    lessons = data.data
                    for (x in lessons) {
                        lesson = lessons[x]
                        lesson.type = _this.attr("course-type")
                        lesson.cname = _this.attr("course-name")
                        _this.children(".mdui-collapse-item-body").append(lessonGenerator(lesson))
                    }
                    lessonBind()
                    // loadingDialog.close()
                    // courseButton = null
                },
                error:function () {
                    // loadingDialog.close()
                }
            })
            // setTimeout(loadingDialog.close(),2000)
        })

        //添加课程
        $(".course-add").on('click', function () {
            sessionStorage.removeItem("course")
            sessionStorage.url = "/img/default.jpg"
            // sessionStorage.removeItem("url")
            // var inst = new mdui.Dialog("#course-dialog")
            // inst.open()
        })
        //编辑课程
        $(".course-edit").on("click", function (argument) {
            var course = $(this).parents(".course-item")

            console.log("course-edit : id = " + course.attr("course-id") + " name = " + course.attr("course-name") +
                " type = "+course.attr("course-type")+" orderid = "+course.attr("course-orderid"))
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
                orderid: course.attr("course-orderid"),
            }
            sessionStorage.course = JSON.stringify(course)
            sessionStorage.url = course.cover
            // var inst = new mdui.Dialog("#course-dialog")
            // inst.open()
        })
        //打开课程弹框，分添加和编辑
        $("#course-dialog").on("open.mdui.dialog", function (argument) {
            console.log(" confirm remove disable")
            $(".confirm").removeAttr("disabled")
            var currentTab = sessionStorage.currentTab;
            if(typeof currentTab =="undefined") {
                currentTab = 0
            }else {
                currentTab = currentTab-1;
            }

            var course_type = typeList[parseInt(currentTab)]
            console.log("open course-dialog "+typeList[parseInt(currentTab)]);
            sessionStorage.uploadType = 2;
            // $(".mdui-select").html(typeList[parseInt(currentTab)])

            //新增
            var course = sessionStorage.course
            $("#course-type").val(course_type)
            $("#course-order").val(1)
            if (typeof(course) == "undefined") return
            console.log("open course name =  " + $("#course-name").val() + " course type = " + (currentTab) + " course id= " + $("#course-id").val())

            //编辑
            var course = JSON.parse(course)
            $("#course-name").val(course.name)
            $("#course-order").val(course.orderid)
            // sessionStorage.url = course.cover
            // $(".edit-info").show()
            console.log("open course content = "+course.cover)
            $("#cover-preview").attr("src",course.cover)
            // document.getElementById("cover-preview").src = JSON.parse(course).content;
        })
        //课程弹框提交按钮
        $("#course-dialog").on("confirm.mdui.dialog", function () {

            var currentTab = sessionStorage.currentTab;
            if(typeof currentTab =="undefined") {
                currentTab = 0
            }else {
                currentTab = currentTab-1;
            }
            console.log("confirm course dialog ~~ ");
            console.log("confirm course name =  " + $("#course-name").val() + " course type = " + (currentTab) + " course id= " + $("#course-id").val())

            //当前dialog
            var $dialog = $("#course-dialog").eq(0);
            var inst = $dialog.data('mdui.dialog');

            var course = {
                name: $("#course-name").val(),
                orderid: $("#course-order").val(),
                type: currentTab,
                cover: sessionStorage.url,
            }

            console.log("confirm course name =  " + course.name + " course-type = " + course.type + " course-tab-type = " + (currentTab))

            //如果是在编辑的话
            var courseData = sessionStorage.course
            if (typeof(courseData) != "undefined") {
                courseData = JSON.parse(courseData)
                course.id = courseData.id
                course._method = "PUT"
            }
            if (course.name == "" || course.name == null) {
                mdui.snackbar("名称不能为空")
                return
            }
            console.log("confirm course aaaaname =  " + course.name + " course-type =" + course.type+ "course-tab-type = " + (currentTab))

            //以下这个如果在视频界面新建会报错，不知为何
            // if (course.type == "" || course.type == null) {
            if (typeof course.type == "undefined") {
                console.log("confirm course bbaaaname =  " + course.name + " course-type =" + course.type+ "course-tab-type = " + (currentTab))

                mdui.snackbar("类型不能为空")
                return
            }

            //先上传文件再增加数据库数据
            uploadFile(function (status) {
                if(status == "fail"){
                    log("upload fail")
                    return
                }
                course.cover = sessionStorage.url
                if (typeof(course.cover) == "undefined") {
                    course.cover = "/img/default.jpg"
                }
                $.ajax({
                    method: "POST",
                    data: course,
                    url: baseUrl + "course",
                    success: function (data) {
                        data = JSON.parse(data)
                        loginCheck(data)
                        mdui.snackbar(data.msg)
                        inst.close()
                        setTimeout("location.reload()", 500)
                    }
                })
            },"#course-upload-file")
        })

        //删除课程
        $(".course-del").on("click", function(argument) {
            var course = $(this).parents(".course-item")

            console.log("course-edit : id = " + course.attr("course-id") + " name = " + course.attr("course-name"))
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
            }
            sessionStorage.course = JSON.stringify(course)
//                var dialog = new mdui.Dialog("#delete-courses-dialog")
//                dialog.open()
        })
        //删除课程弹框，需要遍历课时逐个删除
        $("#delete-courses-dialog").on("confirm.mdui.dialog", function(argument) {

            var course = JSON.parse(sessionStorage.course);
            console.log("confirm delete-courses id =  "+course.id);
            //遍历cid一样的所有文件
            $.ajax({
                method: "GET",
                data: {
                    cid: course.id,
                    _method: "GET"
                },
                url: baseUrl + "course/"+course.id,
                success: function(data) {
                    data = JSON.parse(data)
                    loginCheck(data)
                    mdui.snackbar(data.msg)
                    if (data.code == 200){
                        // course.remove()
                        datalist = data.data;
                        //循环删除对应的文件
                        for(var x in datalist){
                            var lesson = datalist[x];
                            $.ajax({
                                method: "POST",
                                data: {
                                    id: lesson.id,
                                    _method: "DELETE"
                                },
                                url: baseUrl + "lesson",
                                success: function(data) {
                                    data = JSON.parse(data)
                                    loginCheck(data)
                                    if (data.code == 200){
                                        console.log(" delete child lesson id = "+lesson.id);
                                        mdui.snackbar(lesson.name+"删除成功!")
                                    }
                                    // _this.parent().remove()
                                }
                            })
                        }

                        //再删除文件夹
                        $.ajax({
                            method: "POST",
                            data: {
                                id: course.id,
                                _method: "DELETE"
                            },
                            url: baseUrl + "course",
                            success: function(data) {
                                data = JSON.parse(data)
                                loginCheck(data)
                                mdui.snackbar(data.msg)
                                // if (data.code == 200)
                                //     course.remove()
                            }
                        })

                    }
                },
                error:function(err){
                    log(err);
                }
            })
        })

        //添加课时
        $(".lesson-add").on("click", function(argument) {
            var course = $(this).parents(".course-item")
            $(".confirm").removeAttr("disabled")
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
            }
            log("lesson add course type = "+course.type+" name = "+course.name+" id = "+course.id)
            sessionStorage.lesson_count = 1;
            sessionStorage.course = JSON.stringify(course)
            sessionStorage.removeItem("lesson")
            sessionStorage.removeItem("url")
            $("#add-lesson-btn").show()

            // inst = new mdui.Dialog("#lesson-dialog")
            // inst.open()
        })
        $("#lesson-dialog").on("open.mdui.dialog", function(argument) {
            console.log("open lesson dialog ~");
            //新增
            var course = sessionStorage.course
            if (typeof(course) != "undefined") {
                var course = JSON.parse(course)
                $("#lesson-parent").val(course.name)
                if (parseInt(course.type) == 2) {
                    // $("#lesson-upload").hide()
                    // $("#lesson-input").show()
                } else {
                    $("#lesson-upload").show()
                    $("#lesson-input").hide()
                }
                sessionStorage.uploadType = course.type
                log("open lesson dialog type = "+course.type+" name = "+course.name+" id = "+course.id)
            }
            //修改
            var lesson = sessionStorage.lesson

            if (typeof(lesson) != "undefined") {
                lesson = JSON.parse(lesson)
                $("#lesson-name-1").val(lesson.name)
                $("#lesson-parent").val(lesson.cname)
                sessionStorage.uploadType = lesson.type
                if (parseInt(lesson.type) == 2) {
                    // $("#lesson-upload").hide()
                    // $("#lesson-content").val(lesson.content)
                } else {
                    $("#lesson-upload").show()
                    $("#lesson-input").hide()
                }

                //修改的时候先读取时长
                console.log(" disable confirm ")
                $(".confirm").attr("disabled",null)
                if(course.type == 0 || course.type == 1) {
                    console.log(" open lesson dialog url = "+lesson.content)
                    document.getElementById("video").src = lesson.content
                    document.getElementById("video2").src = lesson.content

                }
                console.log("open lesson dialog lesson name = "+lesson.name+" type = "+course.type);
            }

        })
        //提交课时表单
        $("#lesson-dialog").on("confirm.mdui.dialog", function() {
            console.log("confirm lesson dialog ~");

            console.log(" disable confirm ")
            $(".confirm").attr("disabled",null)
            //当前dialog
            var $dialog = $("#lesson-dialog").eq(0);
            var inst = $dialog.data('mdui.dialog');
            var lesson = {
                name: $("#lesson-name-1").val(),
            }
            var course = sessionStorage.course
            var lesssonData = sessionStorage.lesson

            //修改课时信息
            if (typeof(lesssonData) != "undefined") {
                lesssonData = JSON.parse(lesssonData)
                lesson.id = lesssonData.id
                lesson._method = "PUT"
                if ($("#lesson-content").val() != "") {
                    lesson.content = $("#lesson-content").val()
                }
                if (typeof(sessionStorage.url) != "undefined") {
                    lesson.duration = sessionStorage.duration
                    lesson.content = sessionStorage.url
                }
                if (lesson.name == "" || lesson.name == null) {
                    mdui.snackbar("名称不能为空")
                    return
                }
                if(typeof(lesson.duration) == "undefined"){
                    lesson.duration = 0
                }
                uploadFile(function (status) {
                    if(status == "fail"){
                        log("upload fail")
                        return
                    }
                    //上传成功后会有时长和url返回
                    if (lesson.type != 2) {
                        lesson.duration = sessionStorage.duration
                        lesson.content = sessionStorage.url
                    }
                    if(typeof(lesson.duration) == "undefined"){
                        lesson.duration = 0
                    }
                    $.ajax({
                        method: "POST",
                        data: lesson,
                        url: baseUrl + "lesson",
                        success: function(data) {
                            data = JSON.parse(data)
                            loginCheck(data)
                            mdui.snackbar(data.msg)
                            inst.close()
                            setTimeout("location.reload()", 500)
                        }
                    })
                },"#lesson-upload-file-1")
                return
            }
            //新建课时
            var lesson_count = parseInt(sessionStorage.lesson_count);
            if (typeof(course) != "undefined") {
                course = JSON.parse(course)
                lesson.cid = course.id
                lesson.type = parseInt(course.type)
            }else {
                log("course 没定义 ")
                return
            }
            var i = 1;
            log("lesson name "+lesson.name)

                if (lesson.name == "" || lesson.name == null) {
                    mdui.snackbar(i+" 项，名称不能为空 ")
                    return
                }
                // i++;

            var callback = function (status) {

                i++;
                if(status == "fail"){
                    log("upload fail")
                    if(i<=lesson_count) {
                        log("正在上传 "+i+" 项")
                        lesson.name= $("#lesson-name-"+i).val()
                        uploadFile(callback,"#lesson-upload-file-"+i,"#upload-status-"+i)
                    }else {
                        setTimeout("location.reload()", 500)
                        inst.close()
                    }
                    return
                }
                if (course.type != 2) {
                    lesson.duration = sessionStorage.duration
                    lesson.content = sessionStorage.url
                }
                if(typeof(lesson.duration) == "undefined"){
                    lesson.duration = 0
                }

                if (lesson.name == "" || lesson.name == null) {
                    mdui.snackbar((i-1)+" 项，名称不能为空 ")
                    if(i<=lesson_count) {
                        log("正在上传 "+i+" 项")
                        lesson.name= $("#lesson-name-"+i).val()
                        uploadFile(callback,"#lesson-upload-file-"+i,"#upload-status-"+i)
                    }else {
                        setTimeout("location.reload()", 500)
                        inst.close()
                    }
                    return
                }

                $.ajax({
                    method: "POST",
                    data: lesson,
                    url: baseUrl + "lesson",
                    success: function(data) {
                        data = JSON.parse(data)
                        loginCheck(data)
                        mdui.snackbar(data.msg)
                        log("lesson name "+lesson.name)
                        log("lesson content "+lesson.content)
                        log("lesson cid "+lesson.cid)
                        log("lesson duration "+lesson.duration)
                        if(i<=lesson_count) {
                            log("正在上传 "+i+" 项")
                            lesson.name= $("#lesson-name-"+i).val()
                            uploadFile(callback,"#lesson-upload-file-"+i,"#upload-status-"+i)
                        }else {
                            setTimeout("location.reload()", 500)
                            inst.close()
                        }
                        // setTimeout("location.reload()", 500)
                    },
                    error: function () {
                        log("lesson upload error  "+lesson.name)
                        if(i<=lesson_count) {
                            log("正在上传 "+i+" 项")
                            lesson.name= $("#lesson-name-"+i).val()
                            uploadFile(callback,"#lesson-upload-file-"+i,"#upload-status-"+i)
                        }else {
                            setTimeout("location.reload()", 500)
                            inst.close()
                        }
                    }
                })
            }

            log("正在上传 "+i+" 项")
            uploadFile(callback,"#lesson-upload-file-"+i,"#upload-status-"+i)


        })
        //删除课时弹框
        $("#delete-lesson-dialog").on("confirm.mdui.dialog", function (argument) {
            var lesson = sessionStorage.lesson;
            lesson = JSON.parse(lesson);
            console.log("confirm delete lesson-course dialog ~ id = " + lesson.id);

            $.ajax({
                method: "POST",
                data: {
                    id: lesson.id,
                    _method: "DELETE"
                },
                url: baseUrl + "lesson",
                success: function (data) {
                    data = JSON.parse(data)
                    loginCheck(data)
                    mdui.snackbar(data.msg)
                    // if (data.code == 200)
                    //     _this.parent().remove()
                }
            })
        })

        //lesson添加条目
        $("#add-lesson-btn").on('click',function () {
            var lesson_count = parseInt(sessionStorage.lesson_count);
            var lesson_item =
                "<tr>" +
                "<td>"+(lesson_count+1)+"</td>\n" +
                "<td><input type=\"text\" style=\"border-color: #3d5afe;\" id=\"lesson-name-"+(lesson_count+1)+"\" name=\"name\"></td>\n" +
                "<td>\n" +
                "<input type=\"file\" class=\"image-zone\" id=\"lesson-upload-file-"+(lesson_count+1)+"\">\n" +
                "</td>\n" +
                "<td id=\"upload-status-"+(lesson_count+1)+"\">未上传</td>"
                "</tr>"

            sessionStorage.lesson_count = lesson_count+1;

            log("添加条目 count = "+lesson_count)
            $("#lesson-table-body").append($(lesson_item))

            bindSrcEvent("#lesson-upload-file-"+(lesson_count+1),(lesson_count+1))

        })
    }

    //子列表事件绑定，需要加载完后再绑定
    function lessonBind(){
        //编辑课时
        $(".lesson-edit").on('click', function (argument) {
            sessionStorage.lesson_count = 1
            var _this = $(this)
            var lesson = {
                id: _this.parent().attr("lesson-id"),
                name: _this.parent().attr("lesson-name"),
                cname: _this.parent().attr("lesson-cname"),
                type: _this.parent().attr("lesson-type"),
                content: _this.parent().attr("lesson-content"),
                duration:_this.parent().attr("lesson-duration")
            }

            var course = $(this).parents(".course-item")
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
            }
            log("lesson-edit btn type = "+course.type+" name = "+course.name+" id = "+course.id)

            sessionStorage.course = JSON.stringify(course)
            $("#add-lesson-btn").hide()
            sessionStorage.lesson = JSON.stringify(lesson)
            sessionStorage.url = lesson.content
            // var inst = new mdui.Dialog("#lesson-dialog")
            // inst.open()
        })
        //删除课时
        $(".lesson-del").on("click", function (argument) {
            $(".confirm").removeAttr("disabled")
            var _this = $(this)
            var lesson = {
                id: _this.parent().attr("lesson-id"),
                name: _this.parent().attr("lesson-name"),
                cname: _this.parent().attr("lesson-cname"),
                type: _this.parent().attr("lesson-type"),
                content: _this.parent().attr("lesson-content")
            }
            sessionStorage.lesson = JSON.stringify(lesson)
            // var dialog = new mdui.Dialog("#delete-lesson-dialog")
            // dialog.open()
        })

    }

    //得到全部封面
    $.ajax({
        method: "GET",
        url: baseUrl + "cover",
        success: function(data) {
            data = JSON.parse(data)
            loginCheck(data)
            if (data.code == 200) {
                var covers = data.data
                for (x in covers) {
                    var cover = covers[x]
                    var selector = ".cover-" + cover.id + "-img"
                    $(selector).attr("src", cover.img)
                }
            }
        }
    })

    // 修改封面
    $(".cover-edit").on("click", function(argument) {
        // var inst = new mdui.Dialog("#img-dialog")
        // inst.open()
        sessionStorage.cover = $(this).attr("cover-type")


    })
    $("#img-dialog").on("open.mdui.dialog", function(argument) {
        console.log("cover dialog ~");
        sessionStorage.uploadType = 3
    })
    $("#img-dialog").on("confirm.mdui.dialog", function(argument) {
        console.log("confimr img dialog ~");

        var cover = {
            id: sessionStorage.cover,
            img: sessionStorage.url,
            "_method": "put",
        }

        console.log("confimr  img dialog ~ id = "+cover.id+" img = "+cover.img);

        uploadFile(function (status) {
            if(status == "fail"){
                log("upload fail")
                return
            }
            //上传成功后会有时长和url返回
            cover.img = sessionStorage.url
            if (typeof(cover.id) == "undefined" || typeof(cover.img) == "undefined") {
                mdui.snackbar("修改失败")
                return
            }
            $.ajax({
                method: "POST",
                url: baseUrl + "cover",
                data: cover,
                success: function(data) {
                    data = JSON.parse(data)
                    loginCheck(data)
                    mdui.snackbar(data.msg)
                    location.reload()
                }
            })
        },"#cover-img")

    })

    //退出登录
    $("#logout").on("click", function(argument) {
        $.ajax({
            method: "GET",
            url: baseUrl + "user/logout",
            success: function(argument) {
                sessionStorage.removeItem("uid")
                self.location = "./auth.html"
            }
        })
    })

    //添加管理员
    $("#user-dialog").on("confirm.mdui.dialog", function(argument) {
        console.log("confirm user dialog ~");

        var user = {
            username: $("#user-name").val(),
            passwd: $("#user-password").val(),
        }
        if (user.username == "" || user.passwd == "") {
            mdui.snackbar("用户名或密码不能为空")
            return
        }
        $.ajax({
            method: "POST",
            url: baseUrl + "user/signin",
            data: user,
            success: function(data) {
                data = JSON.parse(data)
                mdui.snackbar(data.msg)
            },
        })

    })

    function resizeImg(file) {
        var reader = new FileReader();//新建获取file的读取文件
        var imgsrc = null;
        reader.readAsDataURL(file);//输出base64图片
        reader.onload = function(e) {//字面理解是加载图片，得到结果吧，不是很理解
            imgsrc = this.result;//输出结果
            // 压缩
            var image=new Image();//新建图片
            image.src=imgsrc;
            image.onload=function(){
                var cvs=document.createElement('canvas');//画布
                var cvx =cvs.getContext('2d');//
                // draw image params
                var ratio = this.width/ 324;
                cvs.width=this.width / ratio;
                cvs.height=this.height / ratio;
                // cvx.drawImage(this, 0, 0,this.width,this.height);//画图
                cvx.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width / ratio, this.height / ratio);

                var newImageData = cvs.toDataURL("image/jpeg",0.5);//这是压缩，具体的看.toDataURL api 输出base64
                // console.log(newImageData);
                // $('.upP_img1').html('<img id="newimg" src="' + newImageData + '">');
                $("#cover-preview").attr("src",newImageData)

                return dataURLtoFile(newImageData,"compress_file")
                // return convertBase64UrlToBlob(newImageData)
                // console.log(this.width+'--'+this.height);
                // 上传图片后的以宽高充满判断    
                // var imgscale2 = this.width / this.height;
                // var photoscale2 = $("#cover-preview").width() /$("#cover-preview").height();
                // if (imgscale2 > photoscale2) {
                //     $('#newimg').css({ "width": "100%", "height": "auto" });
                // } else {
                //     $('#newimg').css({ "width": "auto", "height": "100%" });
                // }
            }
        }

    }

    function getBlobBydataURI(dataURI,type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type:type });
    }

    function dataURLtoFile(dataurl, filename) {//将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        var file = new File([u8arr], filename, {type:mime});

        // sessionStorage.resize_file = file
        log(" dataURLtoFile name  = "+file.name)

        return file
    }

    //上传文件
    function uploadFile(callback,upload_id,lesson_status_id){
        log("uploadfile upload_id = " + upload_id+" lesson_id = "+lesson_status_id);

        var file = $(upload_id).get(0).files[0]
        if(typeof file == "undefined"){
            log("uploadfile undefined")
            if(typeof sessionStorage.url != "undefined"){
                //修改
                callback("success")
            }else {
                callback("fail")
            }
            return
        }
        log("file  = " + file);
        var uploadType = sessionStorage.uploadType
        var fileType = file.type
        var typeList = ["视频", "音频", "图片"]
        if (fileType.length < 5 ||
            !(fileType.match("video") != null && uploadType == "0" ||
                fileType.match("audio") != null && uploadType == "1" ||
                fileType.match("image") != null && (uploadType == "2" || uploadType == "3"))) {
            log("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
            mdui.snackbar("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
            if(typeof lesson_status_id != "undefined")
            {
                $(lesson_status_id).html("格式错误")
            }
            console.log(" disable confirm ")
            $(".confirm").attr("disabled", null)
            callback("fail")
            return
        }
        // $(".confirm").removeAttr("disabled")
        if(typeof(file) != "undefined") {
            log("file path = " + file.path)
            log("file name  = " + file.name);
            log("file value  = " + file.value);

            //上传时计算文件时长
            if (uploadType == "0" || uploadType == "1") {
                //得到多媒体文件时长
                var video = file;
                var url = URL.createObjectURL(video);
                console.log(" upload file url = "+url)
                document.getElementById("video").src = url
                document.getElementById("video2").src = url
                // $(".confirm").removeAttr("disabled")
            }else if(uploadType == "2" && sessionStorage.resize_file != "undefined"){
                // file = sessionStorage.resize_file
                // log("session file = "+ file)
                // sessionStorage.removeItem("resize_file")
            }

            var fd = new FormData()
            fd.append("upload", file)
            fd.append("type", uploadType)
            $(".loading-panel").show()
            console.log(" disable confirm ")
            $(".confirm").attr("disabled",null)
            $(".image-zone").attr("disabled",null)
            //测试用
            // callback("fail")
            $.ajax({
                url: baseUrl + 'upload',
                method: "POST",
                processData: false,
                contentType: false,
                data: fd,
                success: function(data) {
                    data = JSON.parse(data)
                    // snackbar.close()
                    loginCheck(data)
                    if (data.code == 200) {
                        mdui.snackbar("上传成功")
                        // loadingDialog.close()
                        //上传成功获得对应url
                        sessionStorage.url = data.data
                        if(typeof sessionStorage.lesson_count == "undefined" || sessionStorage.lesson_count == 1) {
                            $(".confirm").removeAttr("disabled")
                            console.log(" confirm remove disable")
                        }
                        $(".image-zone").removeAttr("disabled")
                        if(typeof lesson_status_id != "undefined")
                        {
                            $(lesson_status_id).html("成功")
                        }

                        if(typeof callback == "function") {
                            callback("success");
                            $(".loading-panel").hide()
                        }else {
                            callback("fail")
                        }
                    }else{
                        callback("fail")
                    }
                },
                error: function(argument) {
                    mdui.snackbar("上传失败")
                    // loadingDialog.close()
                    $(".loading-panel").hide()
                    console.log(" confirm remove disable")
                    $(".confirm").removeAttr("disabled")
                    $(".image-zone").removeAttr("disabled")
                    if(typeof lesson_status_id != "undefined")
                    {
                        $(lesson_status_id).html("上传失败了。。")
                    }
                    callback("fail");
                }
            })

        }
    }
    //选择文件时判断格式，获取时长
    function bindSrcEvent(src_id_class,id)
    {

        $(src_id_class).on("change", function () {
            var file = $(this).get(0).files[0]
            log("file on change = " + file)
            if(typeof file == "undefined"){
                return
            }
            if(parseInt(id) > 0) {
                var lastIndex = file.name.lastIndexOf('.') > 20 ? 20 : file.name.lastIndexOf('.')
                $("#lesson-name-" + id).val(file.name.substr(0,lastIndex))
            }
            //得到上传文件类型，0代表视频，1代表音频，2代表图片,3代表封面
            var uploadType = sessionStorage.uploadType
            var fileType = file.type
            var fileName = file.name
            var typeList = ["视频", "音频", "图片"]
            if (fileType.length < 5 ||
                !(fileType.match("video") != null && uploadType == "0" ||
                    fileType.match("audio") != null && uploadType == "1" ||
                    fileType.match("image") != null && (uploadType == "2" || uploadType == "3"))) {
                log("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
                mdui.snackbar("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
                // $(".confirm").attr("disabled", null)
                return
            } else if (uploadType == "0" || uploadType == "1") {
                //得到多媒体文件时长
                // var video = file;
                // var url = URL.createObjectURL(video);
                // document.getElementById("video").src = url
                console.log(" confirm remove disable")
                $(".confirm").removeAttr("disabled")
            }else if(uploadType == "2"){
                resizeImg(file)
            }
        })
    }
    //拖拽上传
    // var boxes = document.getElementsByClassName("image-zone")
    // for (box in boxes) {
    //     boxes[box].ondragenter = function(e) {
    //         e.preventDefault()
    //         mdui.snackbar("释放以上传", {
    //             timeout: 200
    //         })
    //         $(".confirm").attr("disabled", null)
    //     }
    //     boxes[box].ondragover = function(e) {
    //         e.preventDefault()
    //     }
    //     boxes[box].ondragleave = function(e) {
    //         e.preventDefault()
    //     }
    //     boxes[box].ondrop = function(e) {
    //         e.preventDefault()
    //         var files = e.dataTransfer.files
    //         var file = files[0]
    //         //得到上传文件类型，0代表视频，1代表音频，2代表图片,3代表封面
    //         var uploadType = sessionStorage.uploadType
    //         var fileType = file.type
    //         var typeList = ["视频", "音频", "图片"]
    //         if (fileType.length < 5 ||
    //             !(fileType.match("video") != null && uploadType == "0" ||
    //                 fileType.match("audio") != null && uploadType == "1" ||
    //                 fileType.match("image") != null && (uploadType == "2" || uploadType == "3"))) {
    //             log("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
    //             mdui.snackbar("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
    //             $(".confirm").attr("disabled",null)
    //             return
    //         } else if (uploadType == "0" || uploadType == "1") {
    //             //得到多媒体文件时长
    //             var video = file;
    //             var url = URL.createObjectURL(video);
    //             document.getElementById("video").src = url
    //         }
    //         // snackbar = mdui.snackbar("上传中,请勿关闭页面，刷新页面，关闭编辑窗口", {
    //         //   timeout: 0
    //         // })
    //
    //         var fd = new FormData()
    //         fd.append("upload", file)
    //         fd.append("type", uploadType)
    //         // $.ajax({
    //         //   url: baseUrl + 'upload',
    //         //   method: "POST",
    //         //   processData: false,
    //         //   contentType: false,
    //         //   data: fd,
    //         //   success: function(data) {
    //         //     data = JSON.parse(data)
    //         //     snackbar.close()
    //         //     loginCheck(data)
    //         //     if (data.code == 200) {
    //         //       mdui.snackbar("上传成功")
    //         //       sessionStorage.url = data.data
    //         //       $(".confirm").removeAttr("disabled")
    //         //     }
    //         //   },
    //         //   error: function(argument) {
    //         //     mdui.snackbar("上传失败")
    //         //     $(".confirm").removeAttr("disabled")
    //         //   }
    //         // })
    //     }
    // }
//  log("////////////////////////////////////////////////////////////////////\n" + "//\t\t\t\t\t\t\t_ooOoo_\t\t\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t\t   o8888888o\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   88\" . \"88\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   (| ^_^ |)\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   O\\  =  /O\t\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t\t____/`---'\\____\t\t\t\t\t\t\t  //\t\t\t\t\t\t\n" + "//\t\t\t\t\t  .'  \\\\|     |//  `.\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t /  \\\\|||  :  |||//  \\\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t    /  _||||| -:- |||||-  \\\t\t\t\t\t\t  //\n" + "//\t\t\t\t    |   | \\\\\\  -  /// |   |\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t| \\_|  ''\\---/''  |   |\t\t\t\t\t\t  //\t\t\n" + "//\t\t\t\t\t\\  .-\\__  `-`  ___/-. /\t\t\t\t\t\t  //\t\t\n" + "//\t\t\t\t  ___`. .'  /--.--\\  `. . ___\t\t\t\t\t  //\t\n" + "//\t\t\t\t.\"\" '<  `.___\\_<|>_/___.'  >'\"\".\t\t\t\t  //\n" + "//\t\t\t  | | :  `- \\`.`\\ _ /`.`/ - ` : | |\t\t\t\t  //\t\n" + "//\t\t\t  \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /                 //\n" + "//\t\t========`-.____`-.___\\_____/___.-`____.-'========\t\t  //\t\n" + "//\t\t\t\t             `=---='                              //\n" + "//\t\t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //\n" + "//         佛祖保佑       永无BUG\t\t永不修改\t\t\t\t\t  //")

}

function saveDuration(e) {
    sessionStorage.duration = Math.floor(e.duration);
    //获取时长后可点击
    if(typeof sessionStorage.lesson_count == "undefined" || sessionStorage.lesson_count == 1) {
        console.log(" confirm remove disable")
        $(".confirm").removeAttr("disabled")
    }
    console.log("save duration = "+Math.floor(e.duration))
}
mdui.mutation()
main()

