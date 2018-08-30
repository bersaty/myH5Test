package com.bdyj.controller;

import com.bdyj.interceptor.annotation.LoginRequired;
import com.bdyj.model.DbCourse;
import com.bdyj.service.CourseServ;
import com.bdyj.service.CoverServ;
import com.bdyj.service.LessonServ;
import com.bdyj.util.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api("课程方向类api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/v1/course")
public class CourseCon {
    @Autowired
    CourseServ courseServ;
    @Autowired
    LessonServ lessonServ;
    @Autowired
    CoverServ coverServ;

    @ApiOperation(value="按照类型查找课程",notes="0代表视频类型，1代表音频类型，2代表文字类型")
    @RequestMapping(value = "/type/{type}", method = RequestMethod.GET)
    public @ResponseBody
    Result getCourseByType(@PathVariable("type") int type) {
        return Result.success("成功", courseServ.getCourseByType(type));
    }

    @ApiOperation(value="得到全部课程")
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    Result getAllCourse() {
        return Result.success("成功", courseServ.getAllCourse());
    }

    @ApiOperation(value="根据course的id来获取lesson列表",notes="获得所有属于这个课程方向的子课程")
    @RequestMapping(value = "{cid}", method = RequestMethod.GET)
    public @ResponseBody
    Result getLessions(@PathVariable("cid") int cid) {
        return Result.success("成功", lessonServ.getLessonList(cid));
    }

    @ApiOperation(value="增加课程")
    @RequestMapping(method = RequestMethod.POST)
    @LoginRequired
    public @ResponseBody
    Result insert(DbCourse course) {
        if (courseServ.insertCourse(course)) {
            return Result.success("新建成功", course);
        }
        return Result.error(400, "创建失败");
    }

    @ApiOperation(value="删除课程",notes="")
    @RequestMapping(method = RequestMethod.DELETE)
    @LoginRequired
    public @ResponseBody
    Result delCourse(DbCourse course) {
        courseServ.delCourse(course);
        return Result.success("删除成功", course);
    }

    @ApiOperation(value="修改课程")
    @RequestMapping(method = RequestMethod.PUT)
    @LoginRequired
    public @ResponseBody
    Result updateCourse(DbCourse course) {
        if (courseServ.updateCourse(course)) {
            return Result.success("更新成功", course);
        }
        return Result.error(400, "更新失败");
    }
}
