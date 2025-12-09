package com.loanapp.loanapp.dto;

import java.time.LocalDate;
import lombok.*;


@Data
public class IncomeDTO {
    private String incomeType;
    private Double amount;
    private String currency;
    private LocalDate since;
}