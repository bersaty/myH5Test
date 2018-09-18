package com.bdyj.service;

import com.bdyj.model.DbUser;
import org.springframework.stereotype.Service;

public interface UserServ {
    DbUser login(DbUser user);
    DbUser signin(DbUser user);
    DbUser getUserByUsername(String username);
}
