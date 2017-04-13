define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SelectMode =
  {
    canExecute: function (context, parent) {
      if (!context.button) {
        return context.app.canExecute("ExperienceEditor.Mode.CanSelectMode", context.currentContext);
      }

      if (!ExperienceEditor.isInMode("edit")) {
        context.button.set({ isPressed : true });
      }

      return true;
    },

    execute: function (context) {
      context.currentContext.value = encodeURIComponent(context.currentContext.argument + "|" + window.parent.location);
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Mode.SelectModeRequest", function (response) {
          // Sitecore Support FIX 102657
          preprocessDebugMode(response);
          // Sitecore Support FIX 102657
        window.parent.location = response.responseValue.value;
      }).execute(context);
    },
	
	
  };
});

// Sitecore Support FIX 102657
function preprocessDebugMode(response) {
  var location = response.responseValue.value;
  while (location.indexOf("&&") > 0) {
	  location = location.replace("&&", "&");
  }
  if (location.indexOf("sc_debug=1") > 0) {
	  var questionParts = location.split("?");
	  if (questionParts.length == 2) {
		  var queryParts = questionParts[1].split("&");
		  var newQueryParts = [];
		  for (var i=0; i<queryParts.length; i++) {
			  if (!queryParts[i].startsWith("sc_mode=")) {
				  newQueryParts.push(queryParts[i]);
			  }
		  }
		  location = newQueryParts.join("&");
	  }
	  response.responseValue.value = questionParts[0] + "?" + location;
  }
}
// Sitecore Support FIX 102657