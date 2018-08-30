package com.bdyj.dao;

import com.bdyj.model.DbLesson;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

public interface DbLessonMapper {
    int insert(DbLesson record);

    void delete(DbLesson record);

    void update(DbLesson record);

    List<DbLesson> selectAll();

    DbLesson getLessonById(int id);

    List<DbLesson> getLessonByCid(int cid);
}