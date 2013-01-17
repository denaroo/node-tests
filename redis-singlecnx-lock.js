var redis = require('redis').createClient()
var express = require('express')
var app = express.createServer()

redis.on('connect',function() {
  console.log('redis connected')
})
redis.on('end',function() {
  console.log('redis disconnect')
})
redis.on('idle',function() {
  console.log('redis idle')
})
redis.on('error',function() {
  console.log('redis error:')
})

app.get('/', function (req, res) {
  res.send('<a href="/inc">Increment</a><br /><a href="/wait">Wait</a>')
})

app.get('/inc',function(req, res) {
  redis.incr('redis-singlecnx',function(err,value) {
    redis.expire('redis-singlecnx',3600,function(err,reply) {
      res.send(""+value)
    })
  })
})

app.get('/wait',function(req, res) {
  redis.send_command('DEBUG',['SLEEP','10'],function(ret) {
    console.log('sleep finished')
    res.send('OK')
  })
})

app.listen(3000)
