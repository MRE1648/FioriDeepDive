sap.ui.define([
	"de/cloudna/training05/FioriDeepDive/controller/BaseController",
	"sap/m/MessageBox",
	"de/cloudna/training05/FioriDeepDive/formatter/formatter"
], function (BaseController, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("de.cloudna.training05.FioriDeepDive.controller.Main", {

		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Main").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function () {

		},

		onCustomerPress: function (oEvent) {
			let oRouter = this.getRouter(),
				sCustomerId = oEvent.getSource().getBindingContextPath().split("'")[1];

			oRouter.navTo("Customer", {
				customerid: sCustomerId
			}, false);
		},

		onNewCustomerPress: function (oEvent) {
			let oRouter = this.getRouter();
			oRouter.navTo("Customer", {
				customerid: "create"
			}, false);

		},

		onDeleteCustomerPress: function (oEvent) {
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.getModel();
			MessageBox.confirm(this.geti18nText("dialog.delete"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						this.getView().setBusy(true);
						oModel.remove(sCustomerPath, {
							success: function (oData, response) {
								MessageBox.success(this.geti18nText("dialog.delete.success"));
								this.logInfo("Delete successful for " + sCustomerPath);
								this.getView().setBusy(false);
							}.bind(this),
							error: function (oError) {
								MessageBox.error(oError.message);
								this.logError("Delete not successful for " + sCustomerPath);
								this.getView().setBusy(false);
							}.bind(this)
						});
					}
				}.bind(this)
			});

		}
	});

});