FROM node:11
# Create app directory
WORKDIR /app
# Copy app source code
COPY ./build/ .
#Expose port and start application
EXPOSE 80
EXPOSE 5000
CMD [ "node", "./bundle.js" ]
