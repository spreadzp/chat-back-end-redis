# which node version we want to use
FROM node:18.18.2-alpine3.18 AS dependencies

# set the work directory
WORKDIR /app

# copy the package jason and install dependencies
COPY package*.json ./

# this work in buid time
RUN npm install

FROM node:18.18.2-alpine3.18 AS runner
# copy rest of the file 
COPY . ./
COPY --from=dependencies /app/node_modules ./node_modules 

# this port are using to run expess application
EXPOSE 3000

# this run time
CMD [ "npm","start" ]

