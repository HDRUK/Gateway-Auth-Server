FROM node:12 
WORKDIR /  
  
# Install app dependencies  
COPY package.json ./  
RUN npm install  
 
# Copy app contents  
COPY . .  
 
# Expose ports needed 
EXPOSE 5001/tcp
 
# Add environment variables 
#ENV NODE_ENV=${authnode}
#ENV PORT=${authport}
#ENV APPLICATION_PATH=${path}
#ENV NODE_ENV=local
#ENV PORT=5003
#ENV APPLICATION_PATH=./build
  
# Start the app  
CMD [ "npm", "run", "start"]  