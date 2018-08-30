package com.bdyj.controller;

import com.bdyj.interceptor.annotation.LoginRequired;
import com.bdyj.model.DbCourse;
import com.bdyj.model.DbCover;
import com.bdyj.service.CourseServ;
import com.bdyj.service.CoverServ;
import com.bdyj.util.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Api("封面api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/v1/cover")
public class CoverCon {
    @Autowired
    CoverServ coverServ;

    @ApiOperation(value = "修改封面")
    @RequestMapping(method = RequestMethod.PUT)
    @LoginRequired
    public @ResponseBody
    Result updateCover(DbCover cover) {
        coverServ.updateCover(cover);
        return Result.success("修改成功", cover);
    }

    @ApiOperation(value = "得到封面们")
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    Result getCovers(){
        return Result.success("成功", coverServ.getAllCover());
    }

}
