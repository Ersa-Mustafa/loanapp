package com.loanapp.loanapp.dto;

import lombok.*;

@AllArgsConstructor
@Data
public class LoginDTO {
    private String username;
    private String password;
}