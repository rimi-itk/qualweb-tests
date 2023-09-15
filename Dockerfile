FROM itkdev/ubuntu-base

ENV TERM linux
ENV DEBIAN_FRONTEND noninteractive

RUN <<EOF
    apt-get update
    apt-get install --yes ca-certificates curl gnupg
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install nodejs --yes
    npm install --global @qualweb/cli
    # QualWeb uses puppeteer
    # https://ploi.io/documentation/server/how-to-install-puppeteer-on-ubuntu
    apt-get install --yes libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
    # We also need libnss3
    apt-get install --yes libnss3
EOF

# earl2txt depends on commander. Install it globally (a hack!).
RUN npm install --global commander
# https://nodejs.org/api/modules.html#loading-from-the-global-folders
# npm root --global
ENV NODE_PATH /usr/lib/node_modules

COPY bin/earl2txt.js /usr/local/bin/earl2txt

CMD ["/usr/bin/qw"]
