package com.bdyj.interceptor.annotation;

import java.lang.annotation.*;

//登录拦截器注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface LoginRequired {
    boolean check() default false;
}
