import config from "../../config"

export default function (Vue) {
  Vue.auth = {
    
    setToken(token, expiration){
      localStorage.setItem(config.cookiePrefix + '_token', token);
      localStorage.setItem(config.cookiePrefix + '_expiration', expiration);
    },

    getToken(){
      var token = localStorage.getItem(config.cookiePrefix + '_token');
      var expiration = localStorage.getItem(config.cookiePrefix + '_expiration');

      if(!token || !expiration){
        return null;
      }

      if(Date.now() > parseInt(expiration)){
        this.destroyToken();
        return null;
      }else{
        return token;
      }
    },

    destroyToken(){
      localStorage.removeItem(config.cookiePrefix + '_token');
      localStorage.removeItem(config.cookiePrefix + '_expiration');
      localStorage.removeItem('vuex');
    },

    isAuth(){
      if (this.getToken())
        return true;
    }
  }

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get: () => {
        return Vue.auth
      }
    }
  });
}