package com.bdyj.dao;

import com.bdyj.model.DbUser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

public interface DbUserMapper {
    int insert(DbUser record);

    void update(DbUser record);

    void delete(DbUser record);

    List<DbUser> selectAll();

    DbUser getUserByUsername(DbUser user);
}