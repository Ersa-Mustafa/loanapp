package com.loanapp.loanapp.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Data
public class LoanApplicationDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String role;
    private String fatherName;
    private String email;
    private String phoneNumber;

    private LocalDate birthDate;
    private String birthPlace;
    private String educationLevel;
    private String maritalStatus;

    private Double requestedAmount;
    private String currency;
    private Integer durationMonths;
    private String loanType;
    private String status;
    private LocalDateTime createdAt;

    private List<com.loanapp.loanapp.dto.IncomeDTO> incomes;
}