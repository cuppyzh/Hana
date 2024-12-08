FROM denoland/deno:2.1.3

EXPOSE 8000

WORKDIR /app
RUN mkdir /data
RUN mkdir /data/onlymonk

COPY . .

RUN deno cache src/bot.ts

CMD ["run","--env-file=.env.prod","--allow-all", "src/bot.ts"]