const asapExpress = require('../');
const rp = require('request-promise');
const PORT = 2000;
const app = asapExpress('a$ap', PORT);
// use default configuration
app.default();

// sets a new res.send function
app.asapSend(data => ({
  meta: {
    date: new Date(),
    traceId: asapExpress('a$ap').getContextTraceId()
  },
  data: {
    msg: data
  }
}));

function getFromStore() {
  return asapExpress('a$ap').contextGet('mykey');
}

function storeSth() {
  asapExpress('a$ap').contextSet('mykey', 'thisonewasstoredinthestore');
  return getFromStore();
}

app.get('/', (req, res, next) => {
  const storeData = storeSth();
  return res.send({ id: 'mytestuserid', storeData });
});

app.listen(2000, () => {
  console.log('SERVER START');
});

(async function main() {
  console.log('SENDING REQUEST');
  const response = await rp.get(`http://localhost:${PORT}/`);
  console.log('Response:', response);
})();
