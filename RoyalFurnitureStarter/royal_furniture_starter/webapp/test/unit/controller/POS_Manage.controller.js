/*global QUnit*/

sap.ui.define([
	"com/royal_furniture_starter/controller/POS_Manage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("POS_Manage Controller");

	QUnit.test("I should test the POS_Manage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
