package com.bdyj.util;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.Bucket;
import com.aliyun.oss.model.BucketList;
import com.aliyun.oss.model.ListBucketsRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class OssClientHelper {
    public static OSSClient getOssClient() throws IOException {
        //得到配置文件
        InputStream in = OssClientHelper.class.getResourceAsStream("/aliKey.properties");
        Properties properties = new Properties();
        properties.load(in);

        // Endpoint以杭州为例，其它Region请按实际情况填写。
        String endpoint = properties.getProperty("endpoint");
        // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
        String accessKeyId = properties.getProperty("AccessKeyId");
        String accessKeySecret = properties.getProperty("AccessKeySecret");
        // 创建OSSClient实例。
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        return ossClient;
    }

    public static void main(String[] args) {
        OSSClient ossClient = null;
        try {
            ossClient = getOssClient();
            ListBucketsRequest listBucketsRequest = new ListBucketsRequest();
// 列举指定前缀的存储空间。
            listBucketsRequest.setPrefix("");
            BucketList bucketList = ossClient.listBuckets(listBucketsRequest);
            for (Bucket bucket : bucketList.getBucketList()) {
                System.out.println(" - " + bucket.getName());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
