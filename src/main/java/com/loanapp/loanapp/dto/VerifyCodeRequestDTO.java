package com.loanapp.loanapp.dto;

import lombok.Data;

@Data
public class VerifyCodeRequestDTO {
    private String email;
    private String code;
}