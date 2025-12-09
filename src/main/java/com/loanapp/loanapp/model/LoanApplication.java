package com.loanapp.loanapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loan_applications")
@Data
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    private String fatherName;

    private LocalDate birthDate;
    private String birthPlace;

    private String educationLevel; // Pa Arsim, Arsim Fillor, etc.
    private String maritalStatus;  // Beqar, I Martuar

    private String phoneNumber;

    private Double requestedAmount;
    private String currency;
    private Integer durationMonths;
    private String loanType; // Kredi per shtepi, etc.

    private String status; // Applied, Evaluation, Approved, Rejected

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private List<com.loanapp.loanapp.model.Income> incomes;

}
