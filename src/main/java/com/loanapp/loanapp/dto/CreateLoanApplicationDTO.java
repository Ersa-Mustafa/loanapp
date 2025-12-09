package com.loanapp.loanapp.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.*;

@AllArgsConstructor
@Data
public class CreateLoanApplicationDTO {
    private String fatherName;
    private LocalDate birthDate;
    private String birthPlace;
    private String email;
    private String phoneNumber;
    private String educationLevel;
    private String maritalStatus;

    private Double requestedAmount;
    private String currency;
    private Integer durationMonths;
    private String loanType;

    private List<IncomeDTO> incomes;
}