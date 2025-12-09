package com.loanapp.loanapp.service;

import com.loanapp.loanapp.model.User;

public interface UserService {
    User register(User user);
    User authenticateClient(String username, String password);
    User authenticateEmployee(String username, String password);
    boolean usernameExists(String username);
    boolean emailExists(String email);
    User findByUsername(String username);
    User findByEmail(String email);
    User saveAndEncode(User user);
    User save(User user);
    User updateProfile(User user, User updatedUser);
}