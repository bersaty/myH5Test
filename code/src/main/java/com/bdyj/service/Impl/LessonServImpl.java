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
        System.out.println(" lessonServImpl updateLesson name = "+lesson.getName()+" content = "+lesson.getContent());
        System.out.println(" lessonServImpl updateLesson old lesson "+lessonMapper.getLessonById(lesson.getId()).getContent());
        lessonMapper.update(lesson);
    }

    @Override
    public List<DbLesson> getLessonList(int cid){

        List<DbLesson> dbLessons = lessonMapper.getLessonByCid(cid);
//        DbCourse course = new DbCourse();
//        course.setId(cid);
        DbCourse course = courseMapper.getCourseById(cid);
        int type = course.getType();
        if (type == 2) return dbLessons;
        for (DbLesson lesson : dbLessons){
            if(lesson.getDuration() == null){
                lesson.setDuration_format("0:0");
            }else {
                int min = lesson.getDuration().intValue() / 60;
                int sec = lesson.getDuration().intValue() % 60;
                lesson.setDuration_format(min + ":" + sec);
            }
        }
        return dbLessons;
    }

    @Override
    public DbLesson getLesson(int id){
        return lessonMapper.getLessonById(id);
    }
}
