var api = require('instagram-node').instagram();

//ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });

api.use({
  client_id: '4ce47d4142ee42138e46390f3830075c',
  client_secret: '5b0e3230050c48678dc889f376f6a70e'
})

let redirect_uri = 'http://192.168.99.100:3000/api/instagram/handleauth'

export function authorize_user(req, res) {
console.log('got here')
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
}

export function getAll(req, res) {
console.log('got here1')

    api.use({
     access_token : '12103251818.1677ed0.aee12f1f329d4021a4ad6d166e800ec4'
    })

    api.user_media_recent('12103251818', function(err, result, pagination, remaining, limit) {
      if(err) {
        res.json(err)
      }
      else {
       res.status(200).json({ message: 'Found models', response: 200, data: { instagram : result } })
      }

    })
}
