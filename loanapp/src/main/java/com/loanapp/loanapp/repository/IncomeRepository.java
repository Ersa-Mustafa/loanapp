package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.model.Income;
import com.loanapp.loanapp.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByLoanApplication(LoanApplication loanApplication);
}
