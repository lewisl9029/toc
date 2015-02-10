/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package org.crosswalk.engine;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Hashtable;
import org.apache.cordova.AuthenticationToken;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewClient;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaResourceApi.OpenForReadResult;
import org.apache.cordova.LOG;
import org.apache.cordova.NativeToJsMessageQueue;
import org.json.JSONException;
import org.json.JSONObject;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebResourceResponse;
import org.chromium.net.NetError;
import org.xwalk.core.XWalkResourceClient;
import org.xwalk.core.XWalkView;
import org.xwalk.core.XWalkClient;
import org.xwalk.core.XWalkHttpAuthHandler;

/**
 * This class is the WebViewClient that implements callbacks for our web view.
 * The kind of callbacks that happen here are regarding the rendering of the
 * document instead of the chrome surrounding it, such as onPageStarted(), 
 * shouldOverrideUrlLoading(), etc. Related to but different than
 * CordovaChromeClient.
 *
 * @see <a href="http://developer.android.com/reference/android/webkit/WebViewClient.html">WebViewClient</a>
 * @see <a href="http://developer.android.com/guide/webapps/webview.html">WebView guide</a>
 * @see XwalkCordovaChromeClient
 * @see XWalkCordovaWebView
 */
@TargetApi(Build.VERSION_CODES.HONEYCOMB)
public class XWalkCordovaWebViewClient extends XWalkResourceClient implements CordovaWebViewClient {

	private static final String TAG = "XWalkCordovaWebViewClient";
	private static final String CORDOVA_EXEC_URL_PREFIX = "http://cdv_exec/";
    CordovaInterface cordova;
    XWalkCordovaWebView appView;
    XWalkView webView;

    // Success
    public static final int ERROR_OK = 0;
    // Generic error
    public static final int ERROR_UNKNOWN = -1;
    // Server or proxy hostname lookup failed
    public static final int ERROR_HOST_LOOKUP = -2;
    // Unsupported authentication scheme (not basic or digest)
    public static final int ERROR_UNSUPPORTED_AUTH_SCHEME = -3;
    // User authentication failed on server
    public static final int ERROR_AUTHENTICATION = -4;
    // User authentication failed on proxy
    public static final int ERROR_PROXY_AUTHENTICATION = -5;
    // Failed to connect to the server
    public static final int ERROR_CONNECT = -6;
    // Failed to read or write to the server
    public static final int ERROR_IO = -7;
    // Connection timed out
    public static final int ERROR_TIMEOUT = -8;
    // Too many redirects
    public static final int ERROR_REDIRECT_LOOP = -9;
    // Unsupported URI scheme
    public static final int ERROR_UNSUPPORTED_SCHEME = -10;
    // Failed to perform SSL handshake
    public static final int ERROR_FAILED_SSL_HANDSHAKE = -11;
    // Malformed URL
    public static final int ERROR_BAD_URL = -12;
    // Generic file error
    public static final int ERROR_FILE = -13;
    // File not found
    public static final int ERROR_FILE_NOT_FOUND = -14;
    // Too many requests during this load
    public static final int ERROR_TOO_MANY_REQUESTS = -15;

    /** The authorization tokens. */
    private Hashtable<String, AuthenticationToken> authenticationTokens = new Hashtable<String, AuthenticationToken>();

    /**
     * Constructor.
     *
     * @param cordova
     */
    public XWalkCordovaWebViewClient(CordovaInterface cordova) {
    	super(null);
        this.cordova = cordova;
    }

    /**
     * Constructor.
     *
     * @param cordova
     * @param view
     */
    public XWalkCordovaWebViewClient(CordovaInterface cordova, XWalkCordovaWebView view) {
        super(((XWalkCordovaWebView) view).getView());
        this.cordova = cordova;
        appView = view;
        webView = view.getView();
        webView.setXWalkClient(new CordovaInternalViewClient(view, cordova));
    }

    /**
     * Constructor.
     *
     * @param view
     */
    public void setWebView(XWalkCordovaWebView view) {
        this.appView = view;
    }


    // Parses commands sent by setting the webView's URL to:
    // cdvbrg:service/action/callbackId#jsonArgs
	private void handleExecUrl(String url) {
		int idx1 = CORDOVA_EXEC_URL_PREFIX.length();
		int idx2 = url.indexOf('#', idx1 + 1);
		int idx3 = url.indexOf('#', idx2 + 1);
		int idx4 = url.indexOf('#', idx3 + 1);
		if (idx1 == -1 || idx2 == -1 || idx3 == -1 || idx4 == -1) {
			Log.e(TAG, "Could not decode URL command: " + url);
			return;
		}
		String service    = url.substring(idx1, idx2);
		String action     = url.substring(idx2 + 1, idx3);
		String callbackId = url.substring(idx3 + 1, idx4);
		String jsonArgs   = url.substring(idx4 + 1);
        appView.pluginManager.exec(service, action, callbackId, jsonArgs);
	}

    // Map XWalk error code about loading a page to Android specific ones.
    // XWalk shares the error code with chromium currently.
    private int convertErrorCode(int netError) {
        // Note: many NetError.Error constants don't have an obvious mapping.
        // These will be handled by the default case, ERROR_UNKNOWN.
        switch (netError) {
            case NetError.ERR_UNSUPPORTED_AUTH_SCHEME:
                return ERROR_UNSUPPORTED_AUTH_SCHEME;

            case NetError.ERR_INVALID_AUTH_CREDENTIALS:
            case NetError.ERR_MISSING_AUTH_CREDENTIALS:
            case NetError.ERR_MISCONFIGURED_AUTH_ENVIRONMENT:
                return ERROR_AUTHENTICATION;

            case NetError.ERR_TOO_MANY_REDIRECTS:
                return ERROR_REDIRECT_LOOP;

            case NetError.ERR_UPLOAD_FILE_CHANGED:
                return ERROR_FILE_NOT_FOUND;

            case NetError.ERR_INVALID_URL:
                return ERROR_BAD_URL;

            case NetError.ERR_DISALLOWED_URL_SCHEME:
            case NetError.ERR_UNKNOWN_URL_SCHEME:
                return ERROR_UNSUPPORTED_SCHEME;

            case NetError.ERR_IO_PENDING:
            case NetError.ERR_NETWORK_IO_SUSPENDED:
                return ERROR_IO;

            case NetError.ERR_CONNECTION_TIMED_OUT:
            case NetError.ERR_TIMED_OUT:
                return ERROR_TIMEOUT;

            case NetError.ERR_FILE_TOO_BIG:
                return ERROR_FILE;

            case NetError.ERR_HOST_RESOLVER_QUEUE_TOO_LARGE:
            case NetError.ERR_INSUFFICIENT_RESOURCES:
            case NetError.ERR_OUT_OF_MEMORY:
                return ERROR_TOO_MANY_REQUESTS;

            case NetError.ERR_CONNECTION_CLOSED:
            case NetError.ERR_CONNECTION_RESET:
            case NetError.ERR_CONNECTION_REFUSED:
            case NetError.ERR_CONNECTION_ABORTED:
            case NetError.ERR_CONNECTION_FAILED:
            case NetError.ERR_SOCKET_NOT_CONNECTED:
                return ERROR_CONNECT;

            case NetError.ERR_INTERNET_DISCONNECTED:
            case NetError.ERR_ADDRESS_INVALID:
            case NetError.ERR_ADDRESS_UNREACHABLE:
            case NetError.ERR_NAME_NOT_RESOLVED:
            case NetError.ERR_NAME_RESOLUTION_FAILED:
                return ERROR_HOST_LOOKUP;

            case NetError.ERR_SSL_PROTOCOL_ERROR:
            case NetError.ERR_SSL_CLIENT_AUTH_CERT_NEEDED:
            case NetError.ERR_TUNNEL_CONNECTION_FAILED:
            case NetError.ERR_NO_SSL_VERSIONS_ENABLED:
            case NetError.ERR_SSL_VERSION_OR_CIPHER_MISMATCH:
            case NetError.ERR_SSL_RENEGOTIATION_REQUESTED:
            case NetError.ERR_CERT_ERROR_IN_SSL_RENEGOTIATION:
            case NetError.ERR_BAD_SSL_CLIENT_AUTH_CERT:
            case NetError.ERR_SSL_NO_RENEGOTIATION:
            case NetError.ERR_SSL_DECOMPRESSION_FAILURE_ALERT:
            case NetError.ERR_SSL_BAD_RECORD_MAC_ALERT:
            case NetError.ERR_SSL_UNSAFE_NEGOTIATION:
            case NetError.ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY:
            case NetError.ERR_SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED:
            case NetError.ERR_SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY:
                return ERROR_FAILED_SSL_HANDSHAKE;

            case NetError.ERR_PROXY_AUTH_UNSUPPORTED:
            case NetError.ERR_PROXY_AUTH_REQUESTED:
            case NetError.ERR_PROXY_CONNECTION_FAILED:
            case NetError.ERR_UNEXPECTED_PROXY_AUTH:
                return ERROR_PROXY_AUTHENTICATION;

            // The certificate errors are handled by onReceivedSslError
            // and don't need to be reported here.
            case NetError.ERR_CERT_COMMON_NAME_INVALID:
            case NetError.ERR_CERT_DATE_INVALID:
            case NetError.ERR_CERT_AUTHORITY_INVALID:
            case NetError.ERR_CERT_CONTAINS_ERRORS:
            case NetError.ERR_CERT_NO_REVOCATION_MECHANISM:
            case NetError.ERR_CERT_UNABLE_TO_CHECK_REVOCATION:
            case NetError.ERR_CERT_REVOKED:
            case NetError.ERR_CERT_INVALID:
            case NetError.ERR_CERT_WEAK_SIGNATURE_ALGORITHM:
            case NetError.ERR_CERT_NON_UNIQUE_NAME:
                return ERROR_OK;

            default:
                return ERROR_UNKNOWN;
        }
    }

    /**
    * Report an error to the host application. These errors are unrecoverable (i.e. the main resource is unavailable).
    * The errorCode parameter corresponds to one of the ERROR_* constants.
    *
    * @param view          The WebView that is initiating the callback.
    * @param errorCode     The error code corresponding to an ERROR_* value.
    * @param description   A String describing the error.
    * @param failingUrl    The url that failed to load.
    */
   @Override
   public void onReceivedLoadError(XWalkView view, int errorCode, String description,
           String failingUrl) {
       LOG.d(TAG, "CordovaWebViewClient.onReceivedError: Error code=%s Description=%s URL=%s", errorCode, description, failingUrl);

       // Clear timeout flag
       this.appView.loadUrlTimeout++;

       // Convert the XWalk error code to Cordova error code, which follows the Android spec,
       // http://developer.android.com/reference/android/webkit/WebViewClient.html.
       errorCode = convertErrorCode(errorCode);

       // Handle error
       JSONObject data = new JSONObject();
       try {
           data.put("errorCode", errorCode);
           data.put("description", description);
           data.put("url", failingUrl);
       } catch (JSONException e) {
           e.printStackTrace();
       }
       this.appView.postMessage("onReceivedError", data);
   }

   // TODO(yongsheng): remove the dependency of Crosswalk internal class?
   class CordovaInternalViewClient extends XWalkClient {
   // Don't add extra indents for keeping them with upstream to avoid
   // merge conflicts.
   CordovaInterface cordova;
   XWalkCordovaWebView appView;

   CordovaInternalViewClient(XWalkCordovaWebView view, CordovaInterface ci) {
       super((XWalkView) view.getView());
       cordova = ci;
       appView = view;
   }
 
	@Override
    public boolean shouldOverrideUrlLoading(XWalkView view, String url) {
    	// Check if it's an exec() bridge command message.
    	if (NativeToJsMessageQueue.ENABLE_LOCATION_CHANGE_EXEC_MODE && url.startsWith(CORDOVA_EXEC_URL_PREFIX)) {
    		handleExecUrl(url);
    	}

        // Give plugins the chance to handle the url
    	else if ((this.appView.getPluginManager() != null) && this.appView.getPluginManager().onOverrideUrlLoading(url)) {
        }

        // If dialing phone (tel:5551212)
        else if (url.startsWith("tel:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_DIAL);
                intent.setData(Uri.parse(url));
                this.cordova.getActivity().startActivity(intent);
            } catch (android.content.ActivityNotFoundException e) {
                LOG.e(TAG, "Error dialing " + url + ": " + e.toString());
            }
        }

        // If displaying map (geo:0,0?q=address)
        else if (url.startsWith("geo:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                this.cordova.getActivity().startActivity(intent);
            } catch (android.content.ActivityNotFoundException e) {
                LOG.e(TAG, "Error showing map " + url + ": " + e.toString());
            }
        }

        // If sending email (mailto:abc@corp.com)
        else if (url.startsWith("mailto:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                this.cordova.getActivity().startActivity(intent);
            } catch (android.content.ActivityNotFoundException e) {
                LOG.e(TAG, "Error sending email " + url + ": " + e.toString());
            }
        }

        // If sms:5551212?body=This is the message
        else if (url.startsWith("sms:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);

                // Get address
                String address = null;
                int parmIndex = url.indexOf('?');
                if (parmIndex == -1) {
                    address = url.substring(4);
                }
                else {
                    address = url.substring(4, parmIndex);

                    // If body, then set sms body
                    Uri uri = Uri.parse(url);
                    String query = uri.getQuery();
                    if (query != null) {
                        if (query.startsWith("body=")) {
                            intent.putExtra("sms_body", query.substring(5));
                        }
                    }
                }
                intent.setData(Uri.parse("sms:" + address));
                intent.putExtra("address", address);
                intent.setType("vnd.android-dir/mms-sms");
                this.cordova.getActivity().startActivity(intent);
            } catch (android.content.ActivityNotFoundException e) {
                LOG.e(TAG, "Error sending sms " + url + ":" + e.toString());
            }
        }
        
        //Android Market
        else if(url.startsWith("market:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                this.cordova.getActivity().startActivity(intent);
            } catch (android.content.ActivityNotFoundException e) {
                LOG.e(TAG, "Error loading Google Play Store: " + url, e);
            }
        }

        // All else
        else {

            // If our app or file:, then load into a new Cordova webview container by starting a new instance of our activity.
            // Our app continues to run.  When BACK is pressed, our app is redisplayed.
            if (url.startsWith("file://") || url.startsWith("data:")  || Config.isUrlWhiteListed(url)) {
                return false;
            }

            // If not our application, let default viewer handle
            else {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(Uri.parse(url));
                    this.cordova.getActivity().startActivity(intent);
                } catch (android.content.ActivityNotFoundException e) {
                    LOG.e(TAG, "Error loading url " + url, e);
                }
            }
        }
        return true;
    }
    
    /**
     * On received http auth request.
     * The method reacts on all registered authentication tokens. There is one and only one authentication token for any host + realm combination
     *
     * @param view
     * @param handler
     * @param host
     * @param realm
     */
    @Override
    public void onReceivedHttpAuthRequest(XWalkView view, XWalkHttpAuthHandler handler, String host, String realm) {

        // Get the authentication token
        AuthenticationToken token = getAuthenticationToken(host, realm);
        if (token != null) {
            handler.proceed(token.getUserName(), token.getPassword());
        }
        else {
            // Handle 401 like we'd normally do!
            super.onReceivedHttpAuthRequest(view, handler, host, realm);
        }
    }

    /**
     * Notify the host application that a page has started loading.
     * This method is called once for each main frame load so a page with iframes or framesets will call onPageStarted
     * one time for the main frame.
     *
     * In Crosswalk, this method is called for iframe navigations where the scheme is something other than http or https,
     * which includes assets with the Cordova project, so we have to test for that, and not reset plugins in that case.
     *
     * @param view          The webview initiating the callback.
     * @param url           The url of the page.
     */
    @Override
    public void onPageStarted(XWalkView view, String url) {

        // Only proceed if this is a top-level navigation
        if (view.getUrl() != null && view.getUrl().equals(url)) {
            // Flush stale messages.
            this.appView.onPageReset();
            // Broadcast message that page has loaded
            this.appView.postMessage("onPageStarted", url);
        }
    }

    /**
     * Notify the host application that a page has finished loading.
     * This method is called only for main frame. When onPageFinished() is called, the rendering picture may not be updated yet.
     *
     *
     * @param view          The webview initiating the callback.
     * @param url           The url of the page.
     */
    @Override
    public void onPageFinished(XWalkView view, String url) {
        super.onPageFinished(view, url);
        LOG.d(TAG, "onPageFinished(" + url + ")");
        // Clear timeout flag
        ((XWalkCordovaWebView) this.appView).loadUrlTimeout++;

        // Broadcast message that page has loaded
        this.appView.postMessage("onPageFinished", url);

        // Make app visible after 2 sec in case there was a JS error and Cordova JS never initialized correctly
        if (this.appView.getVisibility() == View.INVISIBLE) {
            Thread t = new Thread(new Runnable() {
                public void run() {
                    try {
                        Thread.sleep(2000);
                        cordova.getActivity().runOnUiThread(new Runnable() {
                            public void run() {
                                appView.postMessage("spinner", "stop");
                            }
                        });
                    } catch (InterruptedException e) {
                    }
                }
            });
            t.start();
        }

        // Shutdown if blank loaded
        if (url.equals("about:blank")) {
            appView.postMessage("exit", null);
        }
    }

    /**
     * Notify the host application that an SSL error occurred while loading a resource.
     * The host application must call either handler.cancel() or handler.proceed().
     * Note that the decision may be retained for use in response to future SSL errors.
     * The default behavior is to cancel the load.
     *
     * @param view          The WebView that is initiating the callback.
     * @param handler       An SslErrorHandler object that will handle the user's response.
     * @param error         The SSL error object.
     */
    @TargetApi(8)
    @Override
    public void onReceivedSslError(XWalkView view, ValueCallback<Boolean> callback, SslError error) {

        final String packageName = this.cordova.getActivity().getPackageName();
        final PackageManager pm = this.cordova.getActivity().getPackageManager();

        ApplicationInfo appInfo;
        try {
            appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
            if ((appInfo.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
                // debug = true
                callback.onReceiveValue(true);
                return;
            } else {
                // debug = false
                super.onReceivedSslError(view, callback, error);
            }
        } catch (NameNotFoundException e) {
            // When it doubt, lock it out!
            super.onReceivedSslError(view, callback, error);
        }
    }

    }  // CordovaInternalViewClient

    /**
     * Sets the authentication token.
     *
     * @param authenticationToken
     * @param host
     * @param realm
     */
    public void setAuthenticationToken(AuthenticationToken authenticationToken, String host, String realm) {
        if (host == null) {
            host = "";
        }
        if (realm == null) {
            realm = "";
        }
        this.authenticationTokens.put(host.concat(realm), authenticationToken);
    }

    /**
     * Removes the authentication token.
     *
     * @param host
     * @param realm
     *
     * @return the authentication token or null if did not exist
     */
    public AuthenticationToken removeAuthenticationToken(String host, String realm) {
        return this.authenticationTokens.remove(host.concat(realm));
    }

    /**
     * Gets the authentication token.
     *
     * In order it tries:
     * 1- host + realm
     * 2- host
     * 3- realm
     * 4- no host, no realm
     *
     * @param host
     * @param realm
     *
     * @return the authentication token
     */
    public AuthenticationToken getAuthenticationToken(String host, String realm) {
        AuthenticationToken token = null;
        token = this.authenticationTokens.get(host.concat(realm));

        if (token == null) {
            // try with just the host
            token = this.authenticationTokens.get(host);

            // Try the realm
            if (token == null) {
                token = this.authenticationTokens.get(realm);
            }

            // if no host found, just query for default
            if (token == null) {
                token = this.authenticationTokens.get("");
            }
        }

        return token;
    }

    /**
     * Clear all authentication tokens.
     */
    public void clearAuthenticationTokens() {
        this.authenticationTokens.clear();
    }

    @Override
    public void onReceivedError(int errorCode, String description, String url) {
        this.onReceivedLoadError(webView, errorCode, description, url);
    }


    @Override
    public WebResourceResponse shouldInterceptLoadRequest(XWalkView view, String url) {
        try {
            // Check the against the white-list.
            if ((url.startsWith("http:") || url.startsWith("https:")) && !Config.isUrlWhiteListed(url)) {
                LOG.w(TAG, "URL blocked by whitelist: " + url);
                // Results in a 404.
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }

            CordovaResourceApi resourceApi = appView.getResourceApi();
            Uri origUri = Uri.parse(url);
            // Allow plugins to intercept WebView requests.
            Uri remappedUri = resourceApi.remapUri(origUri);

            if (!origUri.equals(remappedUri) || needsSpecialsInAssetUrlFix(origUri) || needsKitKatContentUrlFix(origUri)) {
                OpenForReadResult result = resourceApi.openForRead(remappedUri, true);
                return new WebResourceResponse(result.mimeType, "UTF-8", result.inputStream);
            }
            // If we don't need to special-case the request, let the browser load it.
            return null;
        } catch (IOException e) {
            if (!(e instanceof FileNotFoundException)) {
                LOG.e("IceCreamCordovaWebViewClient", "Error occurred while loading a file (returning a 404).", e);
            }
            // Results in a 404.
            return new WebResourceResponse("text/plain", "UTF-8", null);
        }
    }

    private static boolean needsKitKatContentUrlFix(Uri uri) {
        return android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT && "content".equals(uri.getScheme());
    }

    private static boolean needsSpecialsInAssetUrlFix(Uri uri) {
        if (CordovaResourceApi.getUriType(uri) != CordovaResourceApi.URI_TYPE_ASSET) {
            return false;
        }
        if (uri.getQuery() != null || uri.getFragment() != null) {
            return true;
        }

        if (!uri.toString().contains("%")) {
            return false;
        }

        switch(android.os.Build.VERSION.SDK_INT){
            case android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH:
            case android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1:
                return true;
        }
        return false;
    }

}
