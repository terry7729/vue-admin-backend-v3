#！/bin/sh
if [ ${1}x == "local"x ]; then
    rm -Rf ../env/config.js
    cp ../env/local/config.js ../env/config.js
fi

if [ ${1}x == "dev"x ]; then
    rm -Rf ../env/config.js
    cp ../env/dev/config.js ../env/config.js
fi

if [ ${1}x == "dev2"x ]; then
    rm -Rf ../env/config.js
    cp ../env/dev2/config.js ../env/config.js
fi

if [ ${1}x == "pre"x ]; then
    rm -Rf ../env/config.js
    cp ../env/pre/config.js ../env/config.js
fi

if [ ${1}x == "pro"x ]; then
    rm -Rf ../env/config.js
    cp ../env/pro/config.js ../env/config.js
fi

cd ..
if [ ${2}x == "run"x ]; then
    npm run dev
fi
if [ ${2}x == "build"x ]; then
    npm run build
fi
