package com.abminvestama.ilead;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ClipboardModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ClipboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ClipboardModule";
    }

    @ReactMethod
    public void copyToClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Copied Text", text);
        clipboard.setPrimaryClip(clip);
    }
}
