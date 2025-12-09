package com.loanapp.loanapp.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String role;

    public UserDTO(String firstName, String lastName, String username, String email, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}