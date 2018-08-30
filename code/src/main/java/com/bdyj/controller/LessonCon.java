package com.bdyj.controller;

import com.bdyj.interceptor.annotation.LoginRequired;
import com.bdyj.model.DbLesson;
import com.bdyj.service.LessonServ;
import com.bdyj.util.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Api("课程api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/v1/lesson")
public class LessonCon {
    @Autowired
    LessonServ lessonServ;

    @ApiOperation(value="删除课程",notes="")
    @RequestMapping(value = "{id}", method = RequestMethod.GET)
    @LoginRequired
    public @ResponseBody
    Result getLession(@PathVariable("id") int id) {
        return Result.success("成功", lessonServ.getLesson(id));

    }

    @RequestMapping(method = RequestMethod.POST)
    @LoginRequired
    public @ResponseBody
    Result insert(DbLesson lesson) {
        lessonServ.insertLesson(lesson);
        return Result.success("成功", lesson);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @LoginRequired
    public @ResponseBody
    Result update(DbLesson lesson) {
        lessonServ.updateLesson(lesson);
        return Result.success("成功", lesson);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    @LoginRequired
    public @ResponseBody
    Result delete(DbLesson lesson) {
        lessonServ.delLesson(lesson);
        return Result.success("成功", lesson);
    }
}
