package com.gamebooster.app

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "NotificationManager"
    }

    @ReactMethod
    fun requestNotificationAccess(promise: Promise) {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
        promise.resolve(true)
    }

    @ReactMethod
    fun enableNotificationBlocking(promise: Promise) {
        NotificationService.isBlocking = true
        promise.resolve(true)
    }

    @ReactMethod
    fun disableNotificationBlocking(promise: Promise) {
        NotificationService.isBlocking = false
        promise.resolve(true)
    }
}
