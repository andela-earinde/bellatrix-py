var AppDispatcher = require('../dispatcher/AppDispatcher');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var AppStore = assign({}, EventEmitter.prototype, {

  emitLoadSavedState: function(data) {
    this.emit('load_saved_state', data);
  },

  addLoadSavedStateListener: function(callback) {
    this.on('load_saved_state', callback);
  },

  emitLoadSavedText: function(data) {
    this.emit('load_saved_text', data);
  },

  addLoadSavedTextListener: function(callback) {
    this.on('load_saved_text', callback);
  },

});

// Register store with dispatcher
AppDispatcher.register(function(action) {

  switch(action.actionType) {

      case "LOAD_SAVED_STATE":
        AppStore.emitLoadSavedState(action.data);
        break;

      case "LOAD_SAVED_TEXT":
        AppStore.emitLoadSavedText(action.data);
        break;

      default:
        console.log("error");
  }
});

module.exports = AppStore;
