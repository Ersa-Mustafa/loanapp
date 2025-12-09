package com.loanapp.loanapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterUserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String role; // ✅ tani role vjen nga request
}
