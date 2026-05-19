package com.stockflow.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void publishAlert(Object payload) {
        messagingTemplate.convertAndSend("/topic/alerts", payload);
    }
}

