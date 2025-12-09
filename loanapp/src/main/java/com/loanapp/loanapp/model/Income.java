package com.loanapp.loanapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "incomes")
@Data
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String incomeType; // Paga, Qeraja, Biznesi
    private Double amount;
    private String currency;
    private LocalDate since;

    @ManyToOne(optional = false)
    @JoinColumn(name = "loan_id")
    @JsonIgnore
    private LoanApplication loanApplication;

}
