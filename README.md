
<div align="center">
  <br/>
  <img src="./support/logo.png"/>
  <br/>
  <br/>
  <p>
  A collection of tools for Expressjs making api development
  easier and fun.
  </p>
</div>

---

### Features

- Overwrites the original `res.send` function in order to give a standarized form to your messages
- Adds new sender methods (.i.e. `res.error`, `res.exception`)
- Uses async-hooks in order to provide each request with its own context

Coming up:
- Monkey Patch middleware functions based on conditions
- Before and after handlers for api requests
- Try-Catch handler for requests

### Install

```bash
npm install asap-express --save
```

---

### Quick Guide

#### Basic Usage
We initialise an AsapExpress instance by doing the following:
```js
const asapExpress = require('asap-express');
const PORT = 2000;
// the namespace set here 'a$ap' can be used to get the same AsapExpress instance
// from other files.
const app = asapExpress('a$ap', PORT);
// use default configuration
app.default();
```
The `app` object is a normal `expressjs` instance (with some added functionality).
The `express()` returned object is explained [here](https://expressjs.com/en/5x/api.html#express).
Afterwards we can start defining or overwritting the existing sender methods
```js
// overwrites the original res.send function
app.asapSend(data => ({
  meta: {
    date: new Date()
  },
  data: {
    msg: data
  }
}));
```
In the following step we provide a new `res.error` function which will be used for
error reporting:
```js
// sets the res.error return message
app.asapMethod(
  'error',
  error => {
    if (error instanceof Error) {
      return {
        error: {
          message: error.message
        },
        meta: {
          stack: error.stack
        }
      };
    }
    return {
      error: {
        message: error
      },
      meta: {
        undefinedError: true
      }
    };
  },
  // default status code to be sent when this function is used
  400
);
```
After we define our sender methods we can normally use them in our api calls.
```js
/**
*  {
*    meta: {
*      date: '2021-03-04T22:45:32.859Z'
*    },
*    data: {
*      msg: { hello: 'world' }
*    }
*  }
*/
app.get('/', (req, res, next) => {
  return res.send({ hello: 'world' );
});


/**
*  {
*    meta: {
*      date: '2021-03-04T22:45:32.859Z'
*    },
*    data: {
*      msg: 'HelloWorld'
*    }
*  }
*/
app.get('/string', (req, res, next) => {
  return res.send('HelloWorld');
});

/**
*  {
*    meta: {
*      stack: '.....'
*    },
*    error: {
*      message: 'OMG'
*    }
*  }
*/
app.get('/error', (req, res, next) => {
  return res.error(new Error('OMG!'));
});
```

#### Request Context

Via the use of async hooks we are now able to create a unique context for
each request and then store data there (by using the [cls-hooks](https://www.npmjs.com/package/cls-hooked) libary).

Using the functions `AsapExpress.contextGet(key)` and `AsapExpress.contextSet(key, data)`
we are able to access the request context storage from any place in the app. The context is deleted
when the HTTP request has been handled.
```js
function getFromStore() {
  return asapExpress('a$ap').contextGet('mykey');
}

function storeSth() {
  asapExpress('a$ap').contextSet('mykey', 'thisonewasstoredinthestore');
  return getFromStore();
}

/**
*  {
*    id: 'mytestuserid',
*    data: 'thisonewasstoredinthestore'
*  }
*/
app.get('/', (req, res, next) => {
  const storeData = storeSth();
  return res.send({ id: 'mytestuserid', data: storeData });
});
```

---

## Contributing

Any contribition is welcome. Please let me know of your ideas of new features, fixes, bugs, etc.
I am using a combination of [prettier](https://prettier.io/) and [eslint](https://eslint.org) for
code formatting. Please before pushing execute `npm run lint:fix .` in order to be sure that the code
is formatted based on the above.
