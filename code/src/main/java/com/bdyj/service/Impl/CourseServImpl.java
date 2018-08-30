package com.bdyj.service.Impl;

import com.bdyj.dao.DbCourseMapper;
import com.bdyj.model.DbCourse;
import com.bdyj.service.CourseServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("CourseServ")
public class CourseServImpl implements CourseServ {
    @Autowired
    private DbCourseMapper courseMapper;

    @Override
    public List<DbCourse> getCourseByType(int type){
        return courseMapper.getCourseByType(type);
    }

    @Override
    public Boolean insertCourse(DbCourse course){
        if (courseMapper.getCourseById(course) != null)
            return false;
        courseMapper.insert(course);
        return true;
    }

    @Override
    public Boolean updateCourse(DbCourse course){
        if (courseMapper.getCourseById(course) == null)
            return false;
        courseMapper.update(course);
        return true;
    }

    @Override
    public void delCourse(DbCourse course){
        courseMapper.delete(course);
    }

    @Override
    public List<DbCourse> getAllCourse(){
        return courseMapper.selectAll();
    }
}
