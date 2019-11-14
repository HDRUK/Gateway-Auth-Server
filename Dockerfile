FROM node:8  
WORKDIR /src/index.js  
  
# Install app dependencies  
COPY package*.json ./  
RUN npm install  
 
# Copy app contents  
COPY . .  
 
# Expose ports needed 
EXPOSE 8080  
EXPOSE 5003
 
# Add environment variables 
ENV NODE_ENV=local 
ENV PORT=5003
ENV APPLICATION_PATH=148375436316.dkr.ecr.eu-west-2.amazonaws.com/hdr-gateway-webapp:latest 
  
# Start the app  
CMD [ "npm", "start"]  