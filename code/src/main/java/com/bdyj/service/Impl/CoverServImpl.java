package com.bdyj.service.Impl;

import com.bdyj.dao.DbCoverMapper;
import com.bdyj.model.DbCover;
import com.bdyj.service.CoverServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("CoverServ")
public class CoverServImpl implements CoverServ {
    @Autowired
    private DbCoverMapper coverMapper;

    public List<DbCover> getAllCover(){
        return coverMapper.selectAll();
    }

    @Override
    public DbCover getCoverById(int id) {
        return coverMapper.getCoverById(id);
    }

    @Override
    public void updateCover(DbCover cover){
        coverMapper.update(cover);
    }
}
