FROM denoland/deno:2.1.3

EXPOSE 8000

WORKDIR /app
RUN mkdir /app/data

COPY . .

RUN deno cache src/bot.ts

CMD ["run","--env","--allow-all", "src/bot.ts"]