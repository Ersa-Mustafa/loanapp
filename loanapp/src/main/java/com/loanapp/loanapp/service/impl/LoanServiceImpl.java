package com.loanapp.loanapp.service.impl;

import com.loanapp.loanapp.dto.CreateLoanApplicationDTO;
import com.loanapp.loanapp.mapper.LoanMapper;
import com.loanapp.loanapp.model.Income;
import com.loanapp.loanapp.model.User;
import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.repository.LoanApplicationRepository;
import com.loanapp.loanapp.repository.IncomeRepository;
import com.loanapp.loanapp.service.LoanService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanApplicationRepository loanRepo;
    private final IncomeRepository incomeRepo;

    LoanServiceImpl(LoanApplicationRepository loanRepo, IncomeRepository incomeRepo){
        this.loanRepo = loanRepo;
        this.incomeRepo = incomeRepo;
    }

    @Override
    public LoanApplication save(LoanApplication loanApplication) {
        return loanRepo.save(loanApplication);
    }

    @Override
    public LoanApplication getLoanById(Long id) {
        return loanRepo.findById(id).orElse(null);
    }

    @Override
    public List<LoanApplication> getLoansByUser(User user) {
        return loanRepo.findByUser(user);
    }

    @Override
    public void delete(Long id) {
        loanRepo.deleteById(id);
    }

    @Override
    public void updateLoan(Long id, CreateLoanApplicationDTO dto) {
        LoanApplication loan = getLoanById(id);
        if (loan == null || !loan.getStatus().equals("Applied")) return;

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

        // Clear existing incomes and save new ones
        List<Income> existingIncomes = incomeRepo.findByLoanApplication(loan);
        incomeRepo.deleteAll(existingIncomes);

        List<Income> newIncomes = dto.getIncomes().stream()
                .map(i -> {
                    Income income = LoanMapper.toEntity(i);
                    income.setLoanApplication(loan);
                    return income;
                })
                .collect(Collectors.toList());

        loan.setIncomes(newIncomes);
        loanRepo.save(loan);
    }

    @Override
    public List<LoanApplication> getAllLoans() {
        return loanRepo.findAll();
    }

    @Override
    public boolean approveLoan(Long id) {
        LoanApplication loan = getLoanById(id);
        if (loan != null && (loan.getStatus().equals("Evaluation") || loan.getStatus().equals("Applied"))) {
            loan.setStatus("Approved");
            loanRepo.save(loan);
            return true;
        }
        return false;
    }

    @Override
    public boolean rejectLoan(Long id) {
        LoanApplication loan = getLoanById(id);
        if (loan != null && (loan.getStatus().equals("Evaluation") || loan.getStatus().equals("Applied"))) {
            loan.setStatus("Rejected");
            loanRepo.save(loan);
            return true;
        }
        return false;
    }

    @Override
    public boolean evaluateLoan(Long id) {
        LoanApplication loan = getLoanById(id);
        if (loan != null && loan.getStatus().equals("Applied")) {
            loan.setStatus("Evaluation");
            loanRepo.save(loan);
            return true;
        }
        return false;
    }

    @Override
    public Map<String, Long> getLoanStatistics() {
        List<LoanApplication> all = loanRepo.findAll();
        Map<String, Long> summary = new HashMap<>();

        summary.put("Applied", all.stream().filter(l -> l.getStatus().equals("Applied")).count());
        summary.put("Evaluation", all.stream().filter(l -> l.getStatus().equals("Evaluation")).count());
        summary.put("Approved", all.stream().filter(l -> l.getStatus().equals("Approved")).count());
        summary.put("Rejected", all.stream().filter(l -> l.getStatus().equals("Rejected")).count());

        return summary;
    }
}