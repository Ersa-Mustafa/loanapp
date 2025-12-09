
package com.loanapp.loanapp.controller.loan;
import com.loanapp.loanapp.dto.LoanApplicationDTO;
import com.loanapp.loanapp.mapper.LoanMapper;
import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.service.JwtService;
import com.loanapp.loanapp.service.LoanService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
public class BankEmployeeController {

    private final LoanService loanService;
    private final JwtService jwtService;

    public BankEmployeeController(LoanService loanService, JwtService jwtService) {
        this.loanService = loanService;
        this.jwtService = jwtService;
    }

    @GetMapping("/loans")
    public ResponseEntity<?> getAllLoans(HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        return ResponseEntity.ok(
                loanService.getAllLoans().stream()
                        .sorted(Comparator.comparing(LoanApplication::getId).reversed())
                        .map(LoanMapper::toDTO)
                        .collect(Collectors.toList()));
    }

    private String extractUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return jwtService.extractUsername(authHeader.substring(7));
    }

    @GetMapping("/loans/{id}")
    public ResponseEntity<LoanApplicationDTO> getLoanDetails(@PathVariable Long id) {
        LoanApplication loan = loanService.getLoanById(id);
        return ResponseEntity.ok(LoanMapper.toDTO(loan));
    }

    @PostMapping("/loans/{id}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long id) {
        return loanService.approveLoan(id)
                ? ResponseEntity.ok("Loan approved")
                : ResponseEntity.badRequest().body("Action not allowed");
    }

    @PostMapping("/loans/{id}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable Long id) {
        return loanService.rejectLoan(id)
                ? ResponseEntity.ok("Loan rejected")
                : ResponseEntity.badRequest().body("Action not allowed");
    }

    @PostMapping("/loans/{id}/evaluate")
    public ResponseEntity<?> startEvaluation(@PathVariable Long id) {
        return loanService.evaluateLoan(id)
                ? ResponseEntity.ok("Loan set to Evaluation")
                : ResponseEntity.badRequest().body("Action not allowed");
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummaryStats() {
        return ResponseEntity.ok(loanService.getLoanStatistics());
    }
}