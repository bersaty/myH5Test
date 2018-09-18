package com.bdyj.dao;

import com.bdyj.model.DbCourse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

public interface DbCourseMapper {
    int insert(DbCourse record);

    void update(DbCourse record);

    void delete(DbCourse record);

    List<DbCourse> selectAll();

    List<DbCourse> getCourseByType(int type);

    DbCourse getCourseById(int id);
}