import axios from 'axios';
import User from './User';

export default class Api {

  constructor(configuration) {
    this.url = configuration.url;
    this.client = axios.create({
    	baseURL: this.url,
      	headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
  }

  getCards (callback, error) {

    if (User.isConnected())
      this.addAuthorizationHeader();
  	this.client.get("/vault/cardmodels")
  	.then(response => callback(response.data))
  	.catch(this.error(error));
  }

  saveCustomCards (params, callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.post("/user/cardmodels", params)
    .then(response => callback())
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  deleteCustomCards (id, callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.delete("/user/cardmodels?id=" + id)
    .then(response => callback())
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  getCollection (callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.get("/user/collection")
    .then(response => callback(response.data))
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  getCustomCards (callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.get("/user/cardmodels")
    .then(response => callback(response.data))
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  getMyDecks (callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.get("/user/decks")
    .then(response => callback(response.data))
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  saveDeck (params, callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.post("/user/decks", params)
    .then(response => callback())
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  deleteDeck (id, callback, error) {

    if (!User.isConnected()) {
      this.error(error)("Not connected");
      return;
    }
    this.addAuthorizationHeader();
    this.client.delete("/user/decks?id=" + id)
    .then(response => callback())
    .catch(err => {
      this.error(error)(err);
      User.disconnect();
    });
  }

  saveReplay (params, callback, error) {

    this.client.post("/tmp/replay", params)
    .then(response => callback(response))
    .catch(err => {
      this.error(error)(err);
    });
  }

  editProfile (profile, callback, error) {

    this.addAuthorizationHeader();
    this.client.post("/user/profile", profile)
    .then(response => callback(response))
    .catch(err => {
      this.error(error)(err);
    });
  }

  shop (props, callback, error) {

    if (User.isConnected())
      this.addAuthorizationHeader();
  	this.client.post("/user/shop", props)
  	.then(response => callback(response.data))
  	.catch(this.error(error));
  }

  login (username, password, callback, error) {

  	this.client.post("/auth", {username, password})
  	.then(response => {
  		console.log("logged in !");
      User.connect(response.data);
      callback(response.data);
  	})
  	.catch(this.error(error));
  	console.log("logging in...");
  }

  signup (username, password, callback, error) {

  	this.client.post("/auth/new", {username, password})
  	.then(response => {
  		if (response.data.errorMessage !== undefined) {
  			console.log("sign up failed.");
  			this.error(error)(response.data.errorMessage);
  			return;
  		}
  		console.log("Signed up !");
  		User.connect(response.data);
  		callback(response.data);
  	})
  	.catch(this.error(error));
  	console.log("Signing up...");
  }

  error = (f) => (err) => {

  	if (f !== undefined)
  		f(err);
  }

  /*loadMissions (callback, error) {

  	this.client.get("/data/missions").then(function(response) {

  		callback(response.data);
  	})
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  uploadFile(file, callback, error) {

    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    this.client.post('/assets', formData, config)
    .then(function(response) {

    	callback(response.data);
    })
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  getAssetData (id, callback, error) {

  	this.client.get(`/assets/${id}/metadata`)
  	.then(function(response) {

  		callback(response.data)
  	})
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  submitProfile (profile, callback, error) {

  	this.client.post(`/data/profiles/submitted`, profile)
  	.then(function(response) {

  		callback(response.data);
  	})
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  editProfile (id, profile, callback, error) {

  	this.client.put(`/data/profiles/${id}/submitted`, profile)
  	.then(function(response) {

  		callback(response.data);
  	})
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  eraseProfile (id, callback, error) {

  	this.client.delete(`/data/profiles/${id}`, )
  	.then(function(response) {

  		if (callback !== undefined)
  			callback(response.data);
  	})
  	.catch(err => {

      if (error !== undefined)
      	error(err);
  	});
  }

  auth(params, mode, callback, error) {

  	this.client
    .post('/auth/local/' + mode, params)
    .then(response => {

      this.token = response.data.token;
      localStorage.setItem(Api.AUTH_USER, params.username);
      this.saveToken();
      this.addAuthorizationHeader();
      if (callback !== undefined)
      	callback(response.data);
    })
    .catch(err => {
      localStorage.removeItem(Api.AUTH_TOKEN);
      if (error !== undefined)
      	error(err);
    });
  }*/

  getApiUser() {

  	return localStorage.getItem(Api.AUTH_USER);
  }

  addAuthorizationHeader() {

    this.client.defaults.headers.common['Authorization'] = 'Bearer ' + User.getData().token;
  }
}