package com.bdyj.service;

import com.bdyj.model.DbCover;
import org.springframework.stereotype.Service;

import java.util.List;

public interface CoverServ {
    String getCover(int type);
    void updateCover(DbCover cover);
    List<DbCover> getAllCover();
}
