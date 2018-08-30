package com.bdyj.service.Impl;

import com.bdyj.dao.DbUserMapper;
import com.bdyj.model.DbUser;
import com.bdyj.service.UserServ;
import com.bdyj.util.Md5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("UserServ")
public class UserServImpl implements UserServ {
    @Autowired
    private DbUserMapper userMapper;

    @Override
    public DbUser login(DbUser user){
        DbUser target = userMapper.getUserByUsername(user);
        if (target == null)
            return null;
        if (!Md5.verifiMd5(user.getPasswd(), target.getPasswd())){
            return null;}
        return target;
    }

    @Override
    public DbUser signin(DbUser user){
        DbUser target = userMapper.getUserByUsername(user);
        try{
            target.getId();
        }catch (Exception e){
            user.setPasswd(Md5.md5(user.getPasswd()));
            userMapper.insert(user);
            return user;
        }
        return null;
    }

}
