package com.gamebooster.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.lang.reflect.Method

class CacheCleanerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "CacheCleaner"
    }

    @ReactMethod
    fun clearAppCache(packageName: String) {
        try {
            val pm = reactApplicationContext.packageManager
            // Menggunakan refleksi untuk memanggil metode tersembunyi deleteApplicationCacheFiles
            val methods = pm.javaClass.methods
            var deleteMethod: Method? = null
            for (m in methods) {
                if (m.name == "deleteApplicationCacheFiles") {
                    deleteMethod = m
                    break
                }
            }
            
            deleteMethod?.invoke(pm, packageName, null)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
