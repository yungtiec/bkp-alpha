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

### [data model](https://www.draw.io/#G1K4UsBG8tFE7T-reoDMfVzxbmNmW9Ioj-)

