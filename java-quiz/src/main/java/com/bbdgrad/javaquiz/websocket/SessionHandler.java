package com.bbdgrad.javaquiz.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class SessionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(SessionHandler.class);
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    public SessionHandler() {
        scheduler.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                sessionMap.keySet().forEach(k -> {
                    try {
                        if(!sessionMap.get(k).isOpen()) {
                            sessionMap.remove(k);
                            System.out.println("socket closed");
                        }
                    } catch (Exception e) {
                        LOGGER.error("Error while closing websocket session: {}", e);
                    }
                });
            }
        }, 1, 1, TimeUnit.SECONDS);
    }

    public void register(WebSocketSession session) {
        sessionMap.put(session.getId(), session);
    }

    public void closeSession(List<String> sessions) {
        try {
            for(int i = 0; i < sessions.size(); i++) {
                sessionMap.get(sessions.get(i)).close();
                sessionMap.remove(sessions.get(i));
                System.out.println("socket closed ---");
            }
        }
        catch(IOException e) {
            
        }
    }

}