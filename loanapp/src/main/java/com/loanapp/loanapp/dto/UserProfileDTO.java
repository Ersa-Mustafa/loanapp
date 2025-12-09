package com.loanapp.loanapp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserProfileDTO {
    private String username;
    private LocalDateTime lastLoginTime;

    public UserProfileDTO(String username, LocalDateTime lastLoginTime) {
        this.username = username;
        this.lastLoginTime = lastLoginTime;
    }
}