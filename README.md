# Config

Now that you've got the code, follow these steps to get acclimated:

* Update project name and description in `package.json` and `.travis.yml` files
* `npm install`, or `yarn install` - whatever you're into
* Create two postgres databases: `bkp-dev` and `bkp-test`
  * By default, running `npm test` will use `bkp-test`, while regular development uses `bkp-dev`
* Config file`secrets.js` in the project root
  * This file is `.gitignore`'d, and will *only* be required in your *development* environment
  * Its purpose is to attach the secret env variables that you'll use while developing

  ```
    process.env.GOOGLE_CLIENT_ID = 'hush hush'
    process.env.GOOGLE_CLIENT_SECRET = 'pretty secret'
    process.env.GOOGLE_CALLBACK = '/auth/google/callback'
  ```

## Linting

We use a very opionated formatter called [JSPrettier](https://prettier.io/).

## Start

`npm run start-dev` will make great things happen!

If you want to run the server and/or webpack separately, you can also `npm run start-server` and `npm run build-client`.

From there, just follow your bliss.

## Deployment

Ready to go world wide? Here's a guide to deployment! There are two (compatible) ways to deploy:

* automatically, via continuous integration
* manually, from your local machine (current method)

Either way, you'll need to set up your deployment server to start:

### Prep
1. Set up the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli)
2. `heroku login`
3. Add a git remote for heroku:
  - `git remote add production https://git.heroku.com/bkp-alpha.git` This is for production.
  - `git remote add staging https://git.heroku.com/bkp-alpha-test.git` This is for staging.
4. Getting data for local development
  - `heroku pg:pull DATABASE_URL bkp-dev --app bkp-alpha`
  - create a database named `bkp-test` for testing

### When you're ready to deploy

#### Manual Deployment from your Local Machine

Some developers may prefer to control deployment rather than rely on automation. Your local copy of the application can be pushed up to Heroku at will, using Boilermaker's handy deployment script:

1. Make sure that all your work is fully committed and pushed to your master branch on Github.
2. If you currently have an existing branch called "deploy", delete it now (`git branch -d deploy`). We're going to use a dummy branch with the name "deploy" (see below), so if you have one lying around, the script below will error
3. `npm run deploy` or `npm run deploy-staging` - this will cause the following commands to happen in order:
  - `git checkout -b deploy`: checks out a new branch called "deploy". Note that the name "deploy" here isn't magical, but it needs to match the name of the branch we specify when we push to our heroku remote.
  - `webpack -p`: webpack will run in "production mode"
  - `git add -f public/bundle.js public/bundle.js.map`: "force" add the otherwise gitignored build files
  - `git commit --allow-empty -m 'Deploying'`: create a commit, even if nothing changed
  - `git push --force REMOTE_NAME deploy:master`: push your local "deploy" branch to the "master" branch on heroku
  - `git checkout master`: return to your master branch
  - `git branch -D deploy`: remove the deploy branch

#### TODO: Automatic Deployment via Continuous Integration

(_**NOTE**: This step assumes that you already have Travis-CI testing your code._)

CI is not about testing per se – it's about _continuously integrating_ your changes into the live application, instead of periodically _releasing_ new versions. CI tools can not only test your code, but then automatically deploy your app. Boilermaker comes with a `.travis.yml` configuration almost ready for deployment; follow these steps to complete the job.

1. Run `git checkout master && git pull && git checkout -b f/travis-deploy` (or use some other new branch name).
2. Un-comment the bottom part of `.travis.yml` (the `before_deploy` and `deploy` sections)
3. Add your Heroku app name to `deploy.app`, where it says "YOUR HEROKU APP NAME HERE". For example, if your domain is `cool-salty-conifer.herokuapp.com`, your app name is `cool-salty-conifer`.
4. Install the Travis CLI tools by following [the instructions here](https://github.com/travis-ci/travis.rb#installation).
5. Run `travis encrypt $(heroku auth:token)` to encrypt your Heroku API key. _**Warning:** do not run the `--add` command suggested by Travis, that will rewrite part of our existing config!_
6. Copy-paste your encrypted API key into the `.travis.yml` file under `deploy.api_key.secure`, where it says "YOUR ENCRYPTED API KEY HERE".
7. `git add -A && git commit -m 'travis: activate deployment' && git push -u origin f/travis-deploy`
8. Make a PR for the new branch, get it approved, and merge it into master.

That's it! From now on, whenever `master` is updated on GitHub, Travis will automatically push the app to Heroku for you.

Now, you should be deployed!

Why do all of these steps? The big reason is because we don't want our production server to be cluttered up with dev dependencies like webpack, but at the same time we don't want our development git-tracking to be cluttered with production build files like bundle.js! By doing these steps, we make sure our development and production environments both stay nice and clean!

# Frontend

### Folder structure

The code is structured following the fractal project structure. Here's a couple articles on using such strucutre.
- [How to use Redux on highly scalable javascript applications?](https://medium.com/@alexmngn/how-to-use-redux-on-highly-scalable-javascript-applications-4e4b8cb5ef38)
- [Fractal Project Structure](https://github.com/davezuko/react-redux-starter-kit/wiki/Fractal-Project-Structure)

> Large, mature apps tend to naturally organize themselves in this way—analogous to large, mature trees (as in actual trees :evergreen_tree:). The trunk is the router, branches are route bundles, and leaves are views composed of common/shared components/containers. Global application and UI state should be placed on or close to the trunk (or perhaps at the base of a huge branch, eg. /app route).

A few benefits include:
- Routes can be bundled into chunks and loaded on demand
- Ideally, logic is self-contained so that each route can be broken down into its own repo if needed.
- It fits nicely with react-router v4 new way of nesting routes. In react-router-v4 you don't nest ``<Routes />``. Instead, you put them inside another ``<Component />``.

Drawbacks I can speak of:
- ``../../../../../`` in import statement.
  - plan on using webpack or babel plugin for aliasing modules

### Data component

Read the data component part of [this article](https://github.com/Automattic/wp-calypso/blob/master/docs/our-approach-to-data.md):

### Dependencies

##### [Annotator.js](http://annotatorjs.org/)

It's part of the JQuery ecosystem, not React so the data flow of annotations is not managed by redux. We have to do some DOM manipulation when ``<QnaContainer />`` is mounted and updated.

#### [Reapop](https://github.com/LouisBarranqueiro/reapop)

A React and Redux toast

#### [React Modal](https://github.com/reactjs/react-modal)

We use a reducer to manage modal state. Check out [this article](
https://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions) for details implementation

#### [React Pundit](https://github.com/jcgertig/react-pundit)

Check out the [access control chart](https://drive.google.com/file/d/1p4ss0x2ps65ej-VKh72zQzalKb6Ic1P-/view?usp=sharing) for the app.

In our app, we have different user roles, and each has permission to perform a certain set of actions. For example, in a document, both editors and project admins can verify comments and edit content, but project admin can also appoint editors. The button for appointing editors is only visible to project admins. In this case, We use React Pundit to manage access control down to component level.

Check out ``policy.js`` in the client directory and ``access-control.js`` in the server directory for permission settings.

# Backend

### Express.js

### [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started.html)

The official documentation is a great resource to learn.

[This article](http://www.duringthedrive.com/2017/05/06/models-migrations-sequelize-node/) is about sequelize migration. Ideally, we make changes to the database through migration, then we run this command for staging/production environment:

`heroku run sequelize db:migrate --env staging_or_production -m --app app-name. `

`server/db/migration/20180918083848-add-version-pdf-column.js` is an example of adding a new column and updating data

TODO: we can incoprate the command in 'npm start':

`
"scripts": {
  "start": "sequelize db:migrate && node server"
},
`

Every deployment will trigger db:migrate to ensure database update.

### [data model](https://www.draw.io/#G1K4UsBG8tFE7T-reoDMfVzxbmNmW9Ioj-)

### Syncing database

We have a scheduler that run the following command everyday to make sure the staging and producation databases are in sync.

`heroku pg:copy bkp-alpha::DATABASE_URL DATABASE_URL --app bkp-alpha-test
`

Read [here](https://github.com/IcaliaLabs/guides/wiki/Sync-staging-&-production-databases-with-heroku) about the setup

We can also do it manually with a simple tool named `parity`

https://robots.thoughtbot.com/how-to-back-up-a-heroku-production-database-to-staging

# Markdown parser

Definitely need to improve the scrip `script/markdown-parser`

Known bug: sections can't have the same title.

## Disclosure markdown format

If you have no experience writing markdown files

- checkout two markdown files in the data folder
- checkout [github markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for how to write a markdown file that gets rendered with links, image, quotes...etc.

### strict rules

These are the rules specific to our application. Please follow them when writing disclosures so that our server can parse and store your works!

- H1 (#  disclosure title) is reserved for disclosure title
- H3 (### section title) is reserved for section title
