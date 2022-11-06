FROM alpine:3.13 AS base-build
COPY . /root/
RUN apk add nodejs-current npm \
    && cd \
    && npm i --production

FROM alpine:3.13
COPY --from=base-build  /usr/lib/node_modules/ /usr/lib/node_modules
RUN apk add nodejs-current dumb-init --no-cache\
    && ln -s /usr/lib/node_modules/npm/bin/npm-cli.js /usr/bin/npm \
    && adduser -D -H reelyactive \
    && chown reelyactive /home/
WORKDIR /home/
USER reelyactive
COPY --chown=reelyactive --from=base-build   /root/ .
RUN mkdir -p data/associations data/images data/stories data/features && \
    touch data/associations/LOCK data/images/LOCK data/stories/LOCK data/features/LOCK
EXPOSE 3001/tcp 50000/udp 50001/udp

CMD ["dumb-init","npm","run", "start"]
