package com.bdyj.service.Impl;

import com.bdyj.dao.DbCourseMapper;
import com.bdyj.dao.DbLessonMapper;
import com.bdyj.model.DbCourse;
import com.bdyj.model.DbLesson;
import com.bdyj.service.LessonServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("LessonServ")
public class LessonServImpl implements LessonServ {
    @Autowired
    private DbLessonMapper lessonMapper;
    @Autowired
    private DbCourseMapper courseMapper;

    @Override
    public void insertLesson(DbLesson lesson){
        lessonMapper.insert(lesson);
    }

    @Override
    public void delLesson(DbLesson lesson){
        lessonMapper.delete(lesson);
    }

    @Override
    public void updateLesson(DbLesson lesson){
        lessonMapper.update(lesson);
    }

    @Override
    public List<DbLesson> getLessonList(int cid){
        List<DbLesson> dbLessons = lessonMapper.getLessonByCid(cid);
        DbCourse course = new DbCourse();
        course.setId(cid);
        course = courseMapper.getCourseById(course);
        int type = course.getType();
        if (type == 2) return dbLessons;
        for (DbLesson lesson : dbLessons){
            int min = lesson.getDuration().intValue()/60;
            int sec = lesson.getDuration().intValue()%60;
            lesson.setDuration_format(min + ":" + sec);
        }
        return dbLessons;
    }

    @Override
    public DbLesson getLesson(int id){
        return lessonMapper.getLessonById(id);
    }
}
