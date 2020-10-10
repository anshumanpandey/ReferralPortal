# Referal Portal FrontEnd

##### ENV vars to set up

- `PUBLIC_URL=`[PUBLIC URL TO BE ACCESS FROM INTERNET]
- `REACT_APP_API_URL=`[FULL URL OF BACKEND API]

##### How to run with pm2
1. Run on server `npm install pm2 -g`
2. Run `git clone https://github.com/anshumanpandey/ReferralPortal.git`
3. Run `cd ReferralPortal`
5. Create and set the ENV vars defined above
6. run `yarn install`
7. run `npm run build`
8. run `pm2 start npm --name "[APP_NAME]" -- start` 
9. App will be running on PORT 5000, can be checked with `pm2 status`
 
##### Install NodeJS 

1. Run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash`
2. Run `source ~/.profile`
3. Run `nvm install node`