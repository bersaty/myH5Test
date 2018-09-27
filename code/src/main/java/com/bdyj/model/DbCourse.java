package com.bdyj.model;

public class DbCourse {
    private Integer id;

    private String name;

    private Integer type;

    private String cover;

    private int count;

    private int orderid;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover == null ? null : cover.trim();
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public Integer getOrderid() {
        return orderid;
    }

    public void setOrderid(Integer id) {
        this.orderid = id;
    }
}