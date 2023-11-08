FROM node:20.9.0-bookworm-slim

RUN mkdir -p /home/app 

COPY . /home/app

RUN corepack enable && \
  apt-get update && \
  apt-get install -y openssl && \
  rm -rf /var/lib/apt/lists/* && \
  cd /home/app/history && \
  pnpm install && \
  pnpm prisma generate && \
  cd /home/app/users && \
  pnpm install && \
  pnpm prisma generate

EXPOSE 3000
EXPOSE 3001

CMD ["/bin/bash", "-c", "cd /home/app/users ; pnpm prisma db push ; pnpm start &  cd /home/app/history ; pnpm start"]