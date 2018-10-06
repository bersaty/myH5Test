package com.bdyj.service;

import com.bdyj.model.DbCourse;

import java.util.List;

public interface CourseServ {
    List<DbCourse> getCourseByType(int type);
    Boolean insertCourse(DbCourse course);
    Boolean updateCourse(DbCourse course);
    void delCourse(DbCourse course);
    List<DbCourse> getAllCourse();
    DbCourse getCourseById(int id);
//    Boolean updateOrderIdBigger(int newId,int oldId);//更新位置变大
//    Boolean updateOrderIdLess(int newId,int oldId);//更新位置变小

}
