FROM node:8  
WORKDIR /src/index.js  
  
# Install app dependencies  
COPY package*.json ./  
RUN npm install  
 
# Copy app contents  
COPY . .  
 
# Expose ports needed 
EXPOSE 5001/tcp
 
# Add environment variables 
ENV NODE_ENV=${authnode}
ENV PORT=${authport}
ENV APPLICATION_PATH=${path}
  
# Start the app  
CMD [ "npm", "run", "start"]  