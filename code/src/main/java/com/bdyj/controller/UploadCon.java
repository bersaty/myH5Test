package com.bdyj.controller;

import com.aliyun.oss.OSSClient;
import com.bdyj.interceptor.annotation.LoginRequired;
import com.bdyj.util.OssClientHelper;
import com.bdyj.util.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Api("图片上传api")
@CrossOrigin(origins = "*")
@Controller
@RequestMapping(value = "/v1/upload", method = RequestMethod.POST)
public class UploadCon {
    @Autowired
    HttpServletRequest request;

    @ApiOperation(value = "上传图片", notes = "有登录验证")
    @RequestMapping(method = RequestMethod.POST)
    @LoginRequired
    public @ResponseBody
    Result upload(MultipartFile upload) throws IOException {
        //获取文件原始名称
        String originalFilename = upload.getOriginalFilename();
        String newFileName = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
        System.out.println(" upload file originalFilename = "+originalFilename+" newFileName = "+newFileName);

        OSSClient ossClient = OssClientHelper.getOssClient();
        InputStream in = upload.getInputStream();
        ossClient.putObject("fentuoli-3", newFileName, in);
        ossClient.shutdown();
        return Result.success("成功", "http://fentuoli-3.oss-cn-zhangjiakou.aliyuncs.com/" + newFileName);
    }

}
