package com.bdyj.model;

public class DbLesson {
    private Integer id;

    private Integer cid;

    private String name;

    private Float duration;

    private String duration_format;

    private String content;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCid() {
        return cid;
    }

    public void setCid(Integer cid) {
        this.cid = cid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Float getDuration() {
        return duration;
    }

    public void setDuration(Float duration) {
        this.duration = duration;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }

    public String getDuration_format() {
        return duration_format;
    }

    public void setDuration_format(String duration_format) {
        this.duration_format = duration_format;
    }
}