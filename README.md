###Bitwise MEAN Boilerplate

Starting a mean project?  Just clone this repo and run gulp.  This will get you a running express app, complete with
a gulp build system.  Some things it'll do for you out of the box:

* ENV Parsing
* Notifications as tasks complete
* Javascript Stuff
    * ES6 - Write server and client code in ES6 using Babel
    * Linting
    * iife wrapping
    * Sourcemaps
    * Concatenation
    * Uglification
* Scripts Installed Out of the Box
    * Angular ^1.4.9
    * UI Router ^0.2.17
    * Bootstrap
    * Font Awesome
* LESS Compilation
* Angular Template Cache
* File Watchers with Live Reload
* Nodemon for server restarts
* Automate publishing to AWS

**Getting Started**

```
$ git clone git@github.com:Shift3/mean
$ cd mean && npm install
$ cp .env.sample .env
$ gulp
```

Now open [localhost:3000](http://localhost:3000) in your favorite web browser.  Out of the box you get a build system,
live reload, and an angular app started.  All you need to do is drop in your js files and any additional express routes
your app may need.  Some things to note:

* Be mindful about how you name files.  You should name your modules files like:
    * Modules -> thing.module.js
    * Controllers -> thing.controller.js
    * Services -> thing.service.js
    * Filter -> thing.filter.js
* The build system will scan the `app` folder first for any files named `*module.js`, then it looks for any `**/*module.js`
and finally `**/*.js`.  This will ensure that your angular modules are put first when concatenated into `build/app.js`.
* The `/build` folder is the basis for what is served up in the browser.  All of our "built" resources are stuck in this
folder.  
* Changes to less, ejs, html templates should trigger a live reload.
* ES6 is enabled by default, so go crazy wit' all dat new fangled js.
* Use the [John Papa Style Guide](https://github.com/johnpapa/angular-styleguide) when structuring your angular app.  Don't
pile all your states in your main module file, spread them out through out individual modules see the [Welcome Module](https://github.com/Shift3/mean/blob/master/app/welcome/module.js)
for an example.

####How to automate AWS publish
```
$ nano ~/.aws/credentials
```
Add the following info:
```
[default]
aws_access_key_id = <your access key id>
aws_secret_access_key = <your secret access key>
```
Save the file. AWS will authenticate using this file when publishing to your bucket.

In the gulp file, fill in the missing region and bucket:
```
var publisher = awspublish.create({
  region: '', //example: 'us-west-2'
  params: {
    Bucket: '' //example: 'epicapp.s3sandbox.com'
  }
});
```
If you don't want gulp to delete files in the bucket that aren't in your local build folder, comment out the following line:
```
    .pipe(publisher.sync())
```
To publish to your bucket, just use:
```
$ gulp publish
```
