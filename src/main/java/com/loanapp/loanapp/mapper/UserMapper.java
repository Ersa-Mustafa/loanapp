package com.loanapp.loanapp.mapper;

import com.loanapp.loanapp.dto.RegisterUserDTO;
import com.loanapp.loanapp.dto.UserDTO;
import com.loanapp.loanapp.model.User;

public class UserMapper {

    public static User toEntity(RegisterUserDTO dto) {
        User user = new User();
        user.setId(null);
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole() != null ? dto.getRole() : "client");
        return user;
    }

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}
