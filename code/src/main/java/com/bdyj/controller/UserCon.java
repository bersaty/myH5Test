package com.bdyj.controller;

import com.bdyj.interceptor.annotation.LoginRequired;
import com.bdyj.model.DbUser;
import com.bdyj.service.UserServ;
import com.bdyj.util.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Api("用户身份api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/v1/user")
public class UserCon {
    @Autowired
    UserServ userServ;
    @Autowired
    HttpServletRequest request;

    @ApiOperation(value = "登录")
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public @ResponseBody Result login(DbUser user){
        user = userServ.login(user);
        if (user == null)
            return Result.error(401,"登录失败，请检查用户名或者密码");
        request.getSession().setAttribute("uid", user.getId());
        return Result.success("登录成功", user.getId());
    }

    @ApiOperation(value="创建新用户",notes="有登录验证")
    @RequestMapping(value = "signin", method = RequestMethod.POST)
    @LoginRequired
    public @ResponseBody Result signin(DbUser user){
        if (user.getUsername() == "" || user.getUsername().equals(""))
            return Result.error(400,"添加失败，用户名不能为空");
        user = userServ.signin(user);
        if (user == null)
            return Result.error(400,"添加失败，存在重复用户名");
        return Result.success("添加用户成功", user.getId());
    }

    @ApiOperation(value = "注销")
    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public @ResponseBody Result logout(){
        request.getSession().removeAttribute("uid");
        return Result.success("注销", "");
    }
}
