# run `bash script/database_copy.sh` in heroku scheduler to backup production db to staging db everyday
heroku pg:copy bkp-alpha::DATABASE_URL DATABASE_URL --app bkp-alpha-test  --confirm bkp-alpha-test
