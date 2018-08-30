package com.bdyj.util;

public class Result {
    private int code;
    private String msg;
    private Object data;

    public Result() {
    }

    public Result(int code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public Result(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static Result success(String msg, Object data){
        Result result = new Result();
        result.code = 200;
        result.msg = msg;
        result.data = data;
        return result;
    }

    public static Result error(int code, String msg){
        Result result = new Result();
        result.code = code;
        result.msg = msg;
        result.data = "";
        return result;
    }

    @Override
    public String toString(){
        return "{\"code\":" + this.code + ",\"msg\":\"" + this.msg + "\",\"data\":\"" + this.data.toString() + "\"}";
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

