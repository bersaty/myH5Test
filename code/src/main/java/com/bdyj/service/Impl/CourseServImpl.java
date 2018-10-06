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
            System.out.println(" insertCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover()+" orderid = "+course.getOrderid());
        }
//        if (courseMapper.getCourseById(course.getId()) != null)
//            return false;
        updateOtherOrderId(course.getOrderid(),9999,course.getType());
        courseMapper.insert(course);
        return true;
    }

    @Override
    public Boolean updateCourse(DbCourse course){
        System.out.println(" updateCourseimpl course = "+course);
        if(course != null){
            System.out.println(" updateCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover()+" orderid = "+course.getOrderid());
        }
        DbCourse oldCourse = courseMapper.getCourseById(course.getId());
        if (oldCourse == null)
            return false;
        updateOtherOrderId(course.getOrderid(),oldCourse.getOrderid(),course.getType());

        courseMapper.update(course);
        return true;
    }

    @Override
    public void delCourse(DbCourse course){
        System.out.println(" deleteCourseimpl course = "+course);
        if(course != null){
            System.out.println(" deleteCourseimpl name = "+course.getName()+" id = "+course.getId()+" cover = "+course.getCover()+" orderid = "+course.getOrderid());
        }

        DbCourse oldCourse = courseMapper.getCourseById(course.getId());

        updateOtherOrderId(9999,oldCourse.getOrderid(),oldCourse.getType());

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

//    @Override
//    public Boolean updateOrderIdBigger(int newId,int oldId){
//        courseMapper.updateOrderIdBigger(newId,oldId);
//    }
//
//    @Override
//    public Boolean updateOrderIdLess(int newId,int oldId){
//        courseMapper.updateOrderIdLess(newId,oldId);
//    }

    private void updateOtherOrderId(int newId,int oldId,int type){
        System.out.println(" updateOtherOrderId newId = " + newId+" oldId = "+oldId+" type = "+type);
        if(newId == oldId){
            return;
        }else if(newId < oldId){
            //[new,old)  +1 , 更新位置变小
            courseMapper.updateOrderIdLess(newId,oldId,type);
        }else if (newId > oldId){
            //(old,new] -1 , 更新位置变大
            courseMapper.updateOrderIdBigger(newId,oldId,type);
        }

    }
}
