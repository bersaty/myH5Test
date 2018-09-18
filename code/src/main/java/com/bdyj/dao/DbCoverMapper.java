package com.bdyj.dao;

import com.bdyj.model.DbCover;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

public interface DbCoverMapper {
    int insert(DbCover record);

    void update(DbCover record);

    List<DbCover> selectAll();

    DbCover getCoverById(int id);
}