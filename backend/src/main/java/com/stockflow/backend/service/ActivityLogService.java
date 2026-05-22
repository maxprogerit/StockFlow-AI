package com.stockflow.backend.service;

import com.stockflow.backend.domain.activity.ActivityLog;
import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.repository.ActivityLogRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    public void log(User owner, String module, String action, String metadata) {
        ActivityLog log = new ActivityLog();
        log.setOwner(owner);
        log.setModule(module);
        log.setAction(action);
        log.setMetadata(metadata);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> recent(UUID ownerId) {
        return activityLogRepository.findTop20ByOwnerIdOrderByCreatedAtDesc(ownerId);
    }
}
