package com.loanapp.loanapp.service;

import com.loanapp.loanapp.dto.CreateLoanApplicationDTO;
import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.model.User;

import java.util.List;
import java.util.Map;

public interface LoanService {
    LoanApplication save(LoanApplication loanApplication);
    LoanApplication getLoanById(Long id);
    List<LoanApplication> getLoansByUser(User user);
    void delete(Long id);
    void updateLoan(Long id, CreateLoanApplicationDTO dto);
    List<LoanApplication> getAllLoans();
    boolean approveLoan(Long id);
    boolean rejectLoan(Long id);
    boolean evaluateLoan(Long id);
    Map<String, Long> getLoanStatistics();
}