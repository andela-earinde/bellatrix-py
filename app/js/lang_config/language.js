/**
* Note: this module contains infor about the currently speciied language.
* The current implementation hard codes the version of the language been used,
* this will change in later implemetations.
*/

exports.languageSpec = function(language) {

  switch(language) {
      case 'javascript':
        return handleJavascript();
        break;

      case 'coffeescript':
        return handleCoffeeScript()
        break;
  }

  function handleJavascript() {
    return "Native Chrome JavaScript.\n" +
            "Copyright (c) 2015 Google Inc"
  }

  function handleCoffeeScript() {
    return "CoffeeScript v1.3.1\n" +
           "Copyright (c) 2011, Jeremy Ashkenas"
  }
}