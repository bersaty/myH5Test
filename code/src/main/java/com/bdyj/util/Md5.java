package com.bdyj.util;


import org.springframework.lang.NonNull;
import org.springframework.util.DigestUtils;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Md5 {
    private static String key = "md56789";
    public static String md5(String s){
        return DigestUtils.md5DigestAsHex((s + key).getBytes());
    }

    public static Boolean verifiMd5(String s, String m){
        if (m.equals(md5(s)))
            return true;
        return false;
    }

    public static void main(String[] args) {
        System.out.println(Md5.md5("admin"));
        System.out.println(Md5.verifiMd5("admin", "be6d5e6404bcaf614eb7841ac6d1ea86"));
    }
}

