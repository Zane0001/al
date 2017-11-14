var passport = require('passport'),
  WechatStrategy = require('passport-wechat').Strategy;

function findById(id, fn) {
  User.findOne(id).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByWechatId(id, fn) {
  User.findOne({
    wechatId: id
  }).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new WechatStrategy({
    appID: "wxece32445da1a8867",
     name:"wechat",
     appSecret: "8b35181b21c24a746c8ad31b65a5cc53",
     client:"web",
     callbackURL: "http://websub.flashpayment.com/user/wechat/callback",
     scope: "snsapi_login",
    enableProof: false
  }, function (accessToken, refreshToken, profile, expires_in,done) {
    console.log("***********************");
    console.log(profile);
    console.log("accessToken      "+accessToken);
    console.log("outside profile openid ; "+ profile.openid);
    console.log(typeof profile.openid);
    findByWechatId(profile.openid, function (err, user) {
      console.log("XXXXXXXXXXXXXXX");
      console.log("profile openid : "+profile.openid);
      // Create a new User if it doesn't exist yet
      if (!user) {
         console.log("create user");
        User.create({
          username:profile.nickname,
          wechatId: profile.openid,
          uid:profile.unionid
          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        }).exec(function (err, user) {
          
          if (user) {
            console.log("done user");
            return done(null, user, {
              message: 'Logged In Successfully'
            });
            
          } else {
            console.log("null");
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
            
          }
        });

      // If there is already a user, return it
      } else {
         console.log("else user");
          return done(null, user, {
          message: 'Logged In Successfully'
        });
       
      }
    });
  }
));
