FROM denoland/deno:2.1.3

EXPOSE 8000

WORKDIR /app

COPY . .

# RUN "deno cache --allow-net src/main.ts"

CMD ["run","--env-file=.env.prod","--allow-all", "src/main.ts"]