package com.loanapp.loanapp.model;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiter {

    private final Map<String, LocalDateTime> lastRequestMap = new ConcurrentHashMap<>();

    private static final int LIMIT_SECONDS = 15;

    public boolean isAllowed(String email) {
        LocalDateTime lastTime = lastRequestMap.get(email);

        if (lastTime == null || lastTime.plusSeconds(LIMIT_SECONDS).isBefore(LocalDateTime.now())) {
            lastRequestMap.put(email, LocalDateTime.now());
            return true;
        }
        return false;
    }
}