package com.gamebooster.app

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationService : NotificationListenerService() {
    companion object {
        var isBlocking = false
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (isBlocking) {
            cancelNotification(sbn.key)
            Log.d("NotificationService", "Blocked notification from: " + sbn.packageName)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Nothing to do
    }
}
