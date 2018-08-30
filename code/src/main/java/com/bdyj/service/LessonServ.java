package com.bdyj.service;

import com.bdyj.model.DbLesson;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LessonServ {
    void insertLesson(DbLesson lesson);
    void delLesson(DbLesson lesson);
    void updateLesson(DbLesson lesson);
    List<DbLesson> getLessonList(int cid);
    DbLesson getLesson(int id);
}
