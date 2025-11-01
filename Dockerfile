FROM node:20-alpine

WORKDIR /my-app

RUN npm install -g inngest-cli@latest

#ENV INNGEST_EVENT_KEY=S9NPx5lacpZJlSUFa_kuIjwz9-7Uv4W5pFv1mZoJGR_1wDwA2AAEmkHg7nqWAoaXfe_Noc0SVx2n4nFE3Rp-uQ

CMD [ "npx", "inngest-cli", "dev", "-u", "http://host.docker.internal:3000/api/inngest" ]

#npx inngest-cli@latest dev
# You can specify the URL of your development `serve` API endpoint
#npx inngest-cli@latest dev -u http://localhost:3000/api/inngest