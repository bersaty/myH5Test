var $ = mdui.JQ

function main() {
  var log = console.log
  var baseUrl = "/v1/"
  typeList = ["视频", "音频", "文字"]

    var loadingDialog = new mdui.Dialog('#upload-loading-dialog',{
        closeOnEsc: false,
        modal: true
    })

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
    var html = "<div style=\"margin-bottom: 20px\" class=\"mdui-collapse-item course-item mdui-shadow-2\"" +
      "course-type=\"" + course.type + "\" course-count=\"" + course.count + "\" course-cover=\"" + course.cover + "\" " +
      "course-name=\"" + course.name + "\" course-id=\"" + course.id + "\">\n" +
      "<div class=\"mdui-collapse-item-header\">\n" +
      "<div class=\"mdui-list-item mdui-ripple\" mdui-tooltip=\"{content: '点击展开章节', delay: 500}\"> \n" +
      "<div class=\"mdui-list-item-avatar\"><img class=\"mdui-img-fluid course-cover\" style=\"height: 40px width: 40px\" src=\"" + course.cover + "\" /></div>\n" +
      "<div class=\"mdui-list-item-content\">\n" +
      "<div class=\"mdui-list-item-title course-name\">" + course.name + "</div>\n" +
      "<div class=\"mdui-list-item-text mdui-list-item-one-line course-info\">课程类型: " + course.typeCN + "&nbsp;&nbsp;&nbsp;&nbsp;课时长度: " + course.count +
        // " 课时id: " + course.id +
        "</div>\n" +
      "</div>\n" +
      "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme mdui-m-r-1 mdui-text-color-white lesson-add\" mdui-dialog=\"{target: '#lesson-dialog',closeOnConfirm:false}\">添加课时</button>\n" +
      "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme  mdui-m-r-1 mdui-text-color-white course-edit\" mdui-dialog=\"{target: '#course-dialog',closeOnConfirm:false}\">编辑</button>\n" +
      "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-red course-del\" mdui-dialog=\"{target: '#delete-courses-dialog'}\">删除</button>\n" +
      "</div></div><div class=\"mdui-collapse-item-body\">" +
      "<div class=\"mdui-list lesson-list mdui-list-dense\">\n" +
      "</div></div></div>"
    return html
  }

  function lessonGenerator(lesson) {
    if (lesson == null)
      return null
    var html = "<div class=\"mdui-list-item mdui-ripple lesson-item\" " +
      "lesson-id=\"" + lesson.id + "\" lesson-cid=\"" + lesson.cid + "\" lesson-cname=\"" + lesson.cname +
      "\" lesson-name=\"" + lesson.name + "\" lesson-content=\"" + lesson.content +
      "\" lesson-duration=\"" + lesson.duration + "\" lesson-type=\"" + lesson.type + "\">\n" +
      "<div class=\"mdui-list-item-content\">" + lesson.name + "</div>\n" +
        // "<div class=\"mdui-list-item-content\">lesson id = " + lesson.id + "</div>\n" +
      "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme mdui-m-r-1 mdui-text-color-white lesson-edit\" mdui-dialog=\"{target: '#lesson-dialog'}\">编辑</button>\n" +
      "<button class=\"mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-red  lesson-del\" mdui-dialog=\"{target: '#delete-lesson-dialog'}\">删除</button>\n" +
      "</div>"+"<div class=\"mdui-divider\"></div>"
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
      console.log("所有课程："+sessionStorage.courses);
      showCourseByType()
        var inst = new mdui.Tab('#top_tab');
        if(sessionStorage.currentTab != 1) {
            inst.show("#top_tab2")
        }else if(sessionStorage.currentTab != 0) {
            inst.show("#top_tab1")
        }
        bindEvent()

    }
  })

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

  $(".type-btn").on("click", function() {
    var type = parseInt($(this).attr("type"))
      // console.log("click type = "+type)
      sessionStorage.currentTab = type;
    // showCourseByType(type)
  })

    function bindEvent() {
        //添加课程
        $(".course-add").on('click', function () {
            sessionStorage.removeItem("course")
            // var inst = new mdui.Dialog("#course-dialog")
            // inst.open()
        })
        //编辑课程
        $(".course-edit").on("click", function (argument) {
            var course = $(this).parents(".course-item")

            console.log("course-edit : id = " + course.attr("course-id") + " name = " + course.attr("course-name"))
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
            }
            sessionStorage.course = JSON.stringify(course)
            // var inst = new mdui.Dialog("#course-dialog")
            // inst.open()
        })
        //点击编辑后，将原有信息填充进表单中
        $("#course-dialog").on("open.mdui.dialog", function (argument) {
            $(".confirm").removeAttr("disabled")
            console.log("open course-dialog "+typeList[parseInt(sessionStorage.currentTab-1)]);
            sessionStorage.uploadType = 2;
            // $(".mdui-select").html(typeList[parseInt(sessionStorage.currentTab-1)])

            //新增
            var course = sessionStorage.course
            if (typeof(course) == "undefined") return
            console.log("open course name =  " + $("#course-name").val() + " course type = " + $("#course-type").val() + " course id= " + $("#course-id").val())

            //编辑
            var course = JSON.parse(course)
            $("#course-name").val(course.name)
            $("#course-type").val(course.type)
            sessionStorage.url = course.cover
            // $(".edit-info").show()
        })

        $("#course-dialog").on("confirm.mdui.dialog", function () {

            console.log("confirm course dialog ~~ ");
            console.log("confirm course name =  " + $("#course-name").val() + " course type = " + $("#course-type").val() + " course id= " + $("#course-id").val())

            //当前dialog
            var $dialog = $("#course-dialog").eq(0);
            var inst = $dialog.data('mdui.dialog');

            var course = {
                name: $("#course-name").val(),
                type: $("#course-type").val(),
                cover: sessionStorage.url,
            }
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
            if (course.type == "" || course.type == null) {
                mdui.snackbar("类型不能为空")
                return
            }

            uploadFile(function () {

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
            course = {
                id: course.attr("course-id"),
                name: course.attr("course-name"),
                type: course.attr("course-type"),
                cover: course.attr("course-cover"),
            }
            sessionStorage.course = JSON.stringify(course)
            sessionStorage.removeItem("lesson")

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
                    $("#lesson-upload").hide()
                    $("#lesson-input").show()
                } else {
                    $("#lesson-upload").show()
                    $("#lesson-input").hide()
                }
                sessionStorage.uploadType = course.type
                console.log("open lesson dialog course id = " + course.id);
            }
            //修改
            var lesson = sessionStorage.lesson

            if (typeof(lesson) != "undefined") {
                lesson = JSON.parse(lesson)
                $("#lesson-name").val(lesson.name)
                $("#lesson-parent").val(lesson.cname)
                sessionStorage.uploadType = lesson.type
                if (parseInt(lesson.type) == 2) {
                    $("#lesson-upload").hide()
                    $("#lesson-content").val(lesson.content)
                } else {
                    $("#lesson-upload").show()
                    $("#lesson-input").hide()
                }
                console.log("open lesson dialog lesson name = "+lesson.name);
            }

        })
        //提交课时表单
        $("#lesson-dialog").on("confirm.mdui.dialog", function() {
            console.log("confirm lesson dialog ~");

            //当前dialog
            var $dialog = $("#lesson-dialog").eq(0);
            var inst = $dialog.data('mdui.dialog');
            var lesson = {
                name: $("#lesson-name").val(),
            }

            //新建课时
            var course = sessionStorage.course
            if (typeof(course) != "undefined") {
                course = JSON.parse(course)
                lesson.cid = course.id
                lesson.content = $("#lesson-content").val()
                if (course.type != 2) {
                    lesson.duration = sessionStorage.duration
                    lesson.content = sessionStorage.url
                }
                console.log("lesson confirm lesson cid = "+lesson.cid+"lesson.content = "+lesson.content+" lesson name = "+lesson.name);

            }
            //如果是在编辑的话
            var lesssonData = sessionStorage.lesson
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
            }

            if (lesson.name == "" || lesson.name == null) {
                mdui.snackbar("名称不能为空")
                return
            }

            if(typeof(lesson.duration) == "undefined"){
                lesson.duration = 0
            }

            uploadFile(function () {

                if (course.type != 2) {
                    lesson.duration = sessionStorage.duration
                    lesson.content = sessionStorage.url
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
            },"#lesson-upload-file")


        })

        //点击课程，加载课时列表
        $(".course-item").on("open.mdui.collapse", function() {
            log("open collapse ")
            // var courseButton;
            // if (courseButton != null) {
            //   courseButton.abort()
            // }
            _this = $(this)
            var cid = _this.attr("course-id");

            console.log("collapse cid = "+cid);
            loadingDialog.open()

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
                    loadingDialog.close()
                    // courseButton = null
                },
                error:function () {
                    loadingDialog.close()
                }
            })
        })

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

    }

    function lessonBind(){

        //编辑按钮
        $(".lesson-edit").on('click', function (argument) {
            var _this = $(this)
            var lesson = {
                id: _this.parent().attr("lesson-id"),
                name: _this.parent().attr("lesson-name"),
                cname: _this.parent().attr("lesson-cname"),
                type: _this.parent().attr("lesson-type"),
                content: _this.parent().attr("lesson-content")
            }
            sessionStorage.lesson = JSON.stringify(lesson)
            // var inst = new mdui.Dialog("#lesson-dialog")
            // inst.open()
        })
        //删除课时
        $(".lesson-del").on("click", function (argument) {
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
    var inst = new mdui.Dialog("#img-dialog")
    inst.open()
    sessionStorage.cover = $(this).attr("cover-type")
  })
  $("#img-dialog").on("open.mdui.dialog", function(argument) {
    console.log("cover dialog ~");
    sessionStorage.uploadType = 3
  })
  $("#img-dialog").on("confirm.mdui.dialog", function(argument) {
      console.log("confimr  img dialog ~");

      var cover = {
      id: sessionStorage.cover,
      img: sessionStorage.url,
      "_method": "put",
    }
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
      mdui.snackbar("用户名或密码不能未空")
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

    function uploadFile(callback,id_str){
        log("uploadfile id_str = " + id_str);
        var file = $(id_str).get(0).files[0]
        var uploadType = sessionStorage.uploadType
        log("file  = " + file);
        if(typeof(file) != "undefined") {
            log("file path = " + file.path)
            log("file name  = " + file.name);
            log("file value  = " + file.value);
            var fd = new FormData()
            fd.append("upload", file)
            fd.append("type", uploadType)
            $(".loading-panel").show()
            $(".confirm").attr("disabled",null)
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

                    sessionStorage.url = data.data
                  $(".confirm").removeAttr("disabled")
                    if(typeof callback == "function") {
                        callback();
                        $(".loading-panel").hide()
                    }
                }
              },
              error: function(argument) {
                mdui.snackbar("上传失败")
                  // loadingDialog.close()
                  $(".loading-panel").hide()
                $(".confirm").removeAttr("disabled")
              }
            })


        }
    }
  //上传部分
  $(".image-zone").on("change", function() {
    var file = $(this).get(0).files[0]
      log("file on change = "+file)
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
        $(".confirm").attr("disabled",null)
      return
    } else if (uploadType == "0" || uploadType == "1") {
      //得到多媒体文件时长
      var video = file;
      var url = URL.createObjectURL(video);
      document.getElementById("video").src = url
        $(".confirm").removeAttr("disabled")
    }
    // snackbar = mdui.snackbar("上传中,请勿关闭页面，刷新页面，关闭编辑窗口", {
    //   timeout: 0
    // })
    //   loadingDialog.open()

      // var fd = new FormData()
    // fd.append("upload", file)
    // fd.append("type", uploadType)
    // $.ajax({
    //   url: baseUrl + 'upload',
    //   method: "POST",
    //   processData: false,
    //   contentType: false,
    //   data: fd,
    //   success: function(data) {
    //     data = JSON.parse(data)
    //     snackbar.close()
    //     loginCheck(data)
    //     if (data.code == 200) {
    //       mdui.snackbar("上传成功")
    //         // loadingDialog.close()
    //
    //         sessionStorage.url = data.data
    //       $(".confirm").removeAttr("disabled")
    //     }
    //   },
    //   error: function(argument) {
    //     mdui.snackbar("上传失败")
    //       // loadingDialog.close()
    //     $(".confirm").removeAttr("disabled")
    //   }
    // })
  })
    //拖拽上传
  var boxes = document.getElementsByClassName("image-zone")
  for (box in boxes) {
    boxes[box].ondragenter = function(e) {
      e.preventDefault()
      mdui.snackbar("释放以上传", {
        timeout: 200
      })
      $(".confirm").attr("disabled", null)
    }
    boxes[box].ondragover = function(e) {
      e.preventDefault()
    }
    boxes[box].ondragleave = function(e) {
      e.preventDefault()
    }
    boxes[box].ondrop = function(e) {
      e.preventDefault()
      var files = e.dataTransfer.files
      var file = files[0]
      //得到上传文件类型，0代表视频，1代表音频，2代表图片,3代表封面
      var uploadType = sessionStorage.uploadType
      var fileType = file.type
      var typeList = ["视频", "音频", "图片"]
      if (fileType.length < 5 ||
        !(fileType.match("video") != null && uploadType == "0" ||
          fileType.match("audio") != null && uploadType == "1" ||
          fileType.match("image") != null && (uploadType == "2" || uploadType == "3"))) {
        log("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
        mdui.snackbar("格式不匹配，请上传" + typeList[parseInt(uploadType)] + "文件")
        $(".confirm").attr("disabled",null)
        return
      } else if (uploadType == "0" || uploadType == "1") {
        //得到多媒体文件时长
        var video = file;
        var url = URL.createObjectURL(video);
        document.getElementById("video").src = url
      }
      // snackbar = mdui.snackbar("上传中,请勿关闭页面，刷新页面，关闭编辑窗口", {
      //   timeout: 0
      // })

      var fd = new FormData()
      fd.append("upload", file)
      fd.append("type", uploadType)
      // $.ajax({
      //   url: baseUrl + 'upload',
      //   method: "POST",
      //   processData: false,
      //   contentType: false,
      //   data: fd,
      //   success: function(data) {
      //     data = JSON.parse(data)
      //     snackbar.close()
      //     loginCheck(data)
      //     if (data.code == 200) {
      //       mdui.snackbar("上传成功")
      //       sessionStorage.url = data.data
      //       $(".confirm").removeAttr("disabled")
      //     }
      //   },
      //   error: function(argument) {
      //     mdui.snackbar("上传失败")
      //     $(".confirm").removeAttr("disabled")
      //   }
      // })
    }
  }
//  log("////////////////////////////////////////////////////////////////////\n" + "//\t\t\t\t\t\t\t_ooOoo_\t\t\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t\t   o8888888o\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   88\" . \"88\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   (| ^_^ |)\t\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t\t\t   O\\  =  /O\t\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t\t____/`---'\\____\t\t\t\t\t\t\t  //\t\t\t\t\t\t\n" + "//\t\t\t\t\t  .'  \\\\|     |//  `.\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t /  \\\\|||  :  |||//  \\\t\t\t\t\t\t  //\t\n" + "//\t\t\t\t    /  _||||| -:- |||||-  \\\t\t\t\t\t\t  //\n" + "//\t\t\t\t    |   | \\\\\\  -  /// |   |\t\t\t\t\t\t  //\n" + "//\t\t\t\t\t| \\_|  ''\\---/''  |   |\t\t\t\t\t\t  //\t\t\n" + "//\t\t\t\t\t\\  .-\\__  `-`  ___/-. /\t\t\t\t\t\t  //\t\t\n" + "//\t\t\t\t  ___`. .'  /--.--\\  `. . ___\t\t\t\t\t  //\t\n" + "//\t\t\t\t.\"\" '<  `.___\\_<|>_/___.'  >'\"\".\t\t\t\t  //\n" + "//\t\t\t  | | :  `- \\`.`\\ _ /`.`/ - ` : | |\t\t\t\t  //\t\n" + "//\t\t\t  \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /                 //\n" + "//\t\t========`-.____`-.___\\_____/___.-`____.-'========\t\t  //\t\n" + "//\t\t\t\t             `=---='                              //\n" + "//\t\t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //\n" + "//         佛祖保佑       永无BUG\t\t永不修改\t\t\t\t\t  //")

}

function saveDuration(e) {
  sessionStorage.duration = Math.floor(e.duration);
}
mdui.mutation()
main()

