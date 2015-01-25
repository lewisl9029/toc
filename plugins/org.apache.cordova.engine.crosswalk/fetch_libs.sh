ARM_DOWNLOAD="https://download.01.org/crosswalk/releases/crosswalk/android/canary/8.37.189.0/arm/crosswalk-webview-8.37.189.0-arm.zip";
X86_DOWNLOAD="https://download.01.org/crosswalk/releases/crosswalk/android/canary/8.37.189.0/x86/crosswalk-webview-8.37.189.0-x86.zip";

download() {
    TMPDIR=cordova-crosswalk-engine-$$
    mkdir $TMPDIR
    pushd $TMPDIR > /dev/null
    echo "Fetching $1..."
    curl -# $1 -o library.zip
    unzip -q library.zip
    rm library.zip
    PACKAGENAME=$(ls|head -n 1)
    echo "Installing $PACKAGENAME into xwalk_core_library..."
    cp -a $PACKAGENAME/* ../libs/xwalk_core_library
    popd > /dev/null
    rm -r $TMPDIR
}

download $ARM_DOWNLOAD
download $X86_DOWNLOAD
