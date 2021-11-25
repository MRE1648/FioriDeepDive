/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/cloudna/training05/FioriDeepDive/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});