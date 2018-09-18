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
        System.out.println(" insertCourseimpl course = "+course);
        if(course != null){
            System.out.println(" insertCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover());
        }
//        if (courseMapper.getCourseById(course.getId()) != null)
//            return false;
        courseMapper.insert(course);
        return true;
    }

    @Override
    public Boolean updateCourse(DbCourse course){
        System.out.println(" updateCourseimpl course = "+course);
        if(course != null){
            System.out.println(" updateCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover());
        }
        if (courseMapper.getCourseById(course.getId()) == null)
            return false;
        courseMapper.update(course);
        return true;
    }

    @Override
    public void delCourse(DbCourse course){
        System.out.println(" deleteCourseimpl course = "+course);
        if(course != null){
            System.out.println(" deleteCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover());
        }
        courseMapper.delete(course);
    }

    @Override
    public List<DbCourse> getAllCourse(){
        return courseMapper.selectAll();
    }

    @Override
    public DbCourse getCourseById(int id) {
        return courseMapper.getCourseById(id);
    }
}
