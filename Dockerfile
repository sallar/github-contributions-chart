FROM node:alpine

ADD . /data/github-contributions-chart

WORKDIR /data/github-contributions-chart

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
