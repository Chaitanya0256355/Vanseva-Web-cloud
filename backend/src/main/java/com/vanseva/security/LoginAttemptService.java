package com.vanseva.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPT = 5;
    private final long LOCK_TIME_DURATION = 15 * 60 * 1000; // 15 minutes

    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final Map<String, Long> lockTimeCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        lockTimeCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0) + 1;
        attemptsCache.put(key, attempts);
        if (attempts >= MAX_ATTEMPT) {
            lockTimeCache.put(key, System.currentTimeMillis() + LOCK_TIME_DURATION);
        }
    }

    public boolean isBlocked(String key) {
        Long lockExpiry = lockTimeCache.get(key);
        if (lockExpiry != null) {
            if (System.currentTimeMillis() < lockExpiry) {
                return true;
            } else {
                lockTimeCache.remove(key);
                attemptsCache.remove(key);
            }
        }
        return false;
    }
}
