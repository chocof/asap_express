const asapExpress = require('../');
const rp = require('request-promise');
const PORT = 2000;
const app = asapExpress('a$ap', PORT);
// use default configuration
app.default();

// sets a new res.send function
app.asapSend(data => ({
  meta: {
    date: new Date()
  },
  data: {
    msg: data
  }
}));

// sets the res.error return message
app.asapMethod(
  'error',
  error => {
    if (error instanceof Error) {
      return {
        data: {
          message: error.message
        },
        meta: {
          stack: error.stack
        }
      };
    }
    return {
      data: {
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

app.get('/', (req, res, next) => {
  return res.send({ id: 'mytestuserid' });
});

app.get('/string', (req, res, next) => {
  return res.send('HelloWorld');
});

app.get('/error', (req, res, next) => {
  return res.error(new Error('OMG!'));
});
app.get('/error-message', (req, res, next) => {
  return res.error('This is a mistake');
});

app.listen(2000, () => {
  console.log('SERVER START');
});

(async function main() {
  console.log('SENDING REQUEST');
  const response = await rp.get(`http://localhost:${PORT}/`);
  console.log('Response:', response);
  const response2 = await rp.get(`http://localhost:${PORT}/string`);
  console.log('Response:', response2);
  const response3 = await rp.get(`http://localhost:${PORT}/error`);
  console.log('Response:', response3);
})();
