package com.loanapp.loanapp.mapper;


import com.loanapp.loanapp.dto.CreateLoanApplicationDTO;
import com.loanapp.loanapp.dto.IncomeDTO;
import com.loanapp.loanapp.dto.LoanApplicationDTO;
import com.loanapp.loanapp.model.Income;
import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class LoanMapper {

    public static LoanApplicationDTO toDTO(LoanApplication loan) {
        LoanApplicationDTO dto = new LoanApplicationDTO();

        dto.setId(loan.getId());
        dto.setFirstName(loan.getUser().getFirstName());
        dto.setLastName(loan.getUser().getLastName());
        dto.setRole(loan.getUser().getRole());
        dto.setFatherName(loan.getFatherName());
        dto.setEmail(loan.getUser().getEmail());
        dto.setPhoneNumber(loan.getPhoneNumber());

        dto.setBirthDate(loan.getBirthDate());
        dto.setBirthPlace(loan.getBirthPlace());
        dto.setEducationLevel(loan.getEducationLevel());
        dto.setMaritalStatus(loan.getMaritalStatus());

        dto.setRequestedAmount(loan.getRequestedAmount());
        dto.setCurrency(loan.getCurrency());
        dto.setDurationMonths(loan.getDurationMonths());
        dto.setLoanType(loan.getLoanType());
        dto.setStatus(loan.getStatus());
        dto.setCreatedAt(loan.getCreatedAt());

        if (loan.getIncomes() != null) {
            dto.setIncomes(loan.getIncomes().stream()
                    .map(LoanMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static IncomeDTO toDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setIncomeType(income.getIncomeType());
        dto.setAmount(income.getAmount());
        dto.setCurrency(income.getCurrency());
        dto.setSince(income.getSince());
        return dto;
    }

    public static Income toEntity(IncomeDTO dto) {
        Income income = new Income();
        income.setIncomeType(dto.getIncomeType());
        income.setAmount(dto.getAmount());
        income.setCurrency(dto.getCurrency());
        income.setSince(dto.getSince());
        return income;
    }

    public static LoanApplication toEntity(CreateLoanApplicationDTO dto, User user) {
        LoanApplication loan = new LoanApplication();
        loan.setUser(user);
        loan.setFatherName(dto.getFatherName());
        loan.setBirthDate(dto.getBirthDate());
        loan.setBirthPlace(dto.getBirthPlace());
        loan.setPhoneNumber(dto.getPhoneNumber());
        loan.setEducationLevel(dto.getEducationLevel());
        loan.setMaritalStatus(dto.getMaritalStatus());
        loan.setRequestedAmount(dto.getRequestedAmount());
        loan.setCurrency(dto.getCurrency());
        loan.setDurationMonths(dto.getDurationMonths());
        loan.setLoanType(dto.getLoanType());
        loan.setStatus("Applied");
        loan.setCreatedAt(java.time.LocalDateTime.now());

        if (dto.getIncomes() != null) {
            List<Income> incomes = dto.getIncomes().stream()
                    .map(LoanMapper::toEntity)
                    .collect(Collectors.toList());
            incomes.forEach(i -> i.setLoanApplication(loan)); // set parent
            loan.setIncomes(incomes);
        }

        return loan;
    }
}