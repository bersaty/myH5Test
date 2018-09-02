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
import com.bdyj.util.OssClientHelper;
import com.aliyun.oss.OSSClient;
import java.io.IOException;

@Api("课程api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/v1/lesson")
public class LessonCon {
    @Autowired
    LessonServ lessonServ;
    @ApiOperation(value="获取课程",notes="")
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
        System.out.println(" insert lesson filename = "+lesson.getName());
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

    @CrossOrigin(origins = "*")
    @ApiOperation(value = "删除文件", notes = "有登录验证")
    @RequestMapping(method = RequestMethod.DELETE)
    @LoginRequired
    public @ResponseBody
    Result delete(DbLesson lesson) {

        //获取文件原始名称
        DbLesson lessonServLesson = lessonServ.getLesson(lesson.getId());
        String objectName = lessonServLesson.getContent().substring(lessonServLesson.getContent().lastIndexOf('/')+1,lessonServLesson.getContent().length());
        OSSClient ossClient = null;
        try {
            ossClient = OssClientHelper.getOssClient();
            System.out.println(" delete file originalFilename = "+lessonServLesson.getName()+" objectName = "+objectName);
            // 删除文件。
            ossClient.deleteObject("fentuoli-3", objectName);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if(ossClient != null){
                ossClient.shutdown();
            }
        }

        lessonServ.delLesson(lesson);
        return Result.success("成功", lesson);
    }
}
