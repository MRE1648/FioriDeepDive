sap.ui.define([
	"de/cloudna/training05/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"de/cloudna/training05/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, MessageBox, Fragment, formatter, History) {
	"use strict";

	return BaseController.extend("de.cloudna.training05.FioriDeepDive.controller.Customer", {

		formatter: formatter,

		_fragmentList: {},
		_sMode: "",
		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let oEditModel = new JSONModel({
					editmode: false
				}),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.setModel(oEditModel, "editModel");
			if (sCustomerId !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement("/CustomerSet(guid'" + sCustomerId + "')");
				this.logInfo("Display Customer");
			} else {
				this._sMode = "create";
				let createModel = new JSONModel({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "M",
					Email: "",
					Phone: "",
					Website: ""
				});
				this.setModel(createModel, "createModel");
				oEditModel.setProperty("/editmode", true);
				this._showCustomerFragment("CreateCustomer");
				this.logInfo("Create Customer");
			}

		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			if (this._sMode === "create") {
				let oModel = this.getView().getModel(),
					oCreateData = this.getView().getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, respose) {
						MessageBox.information(this.geti18nText("dialog.create.success"), {
							onClose: function (sAction) {
								this.onNavBack();
							}.bind(this)

						});
					}.bind(this),
					error: function (oError) {
						MessageBox.error(oError.message, {
							onClose: function (sAction) {
								this.onNavBack();
								this.logError("Customer creation failed");
							}.bind(this)
						});
					}

				});
			} else {
				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges();
					MessageBox.information(this.geti18nText("dialog.update.success"));
					this.logError("Customer saved");

				}
				this._toggleEdit(false);

			}
		},

		onCancelPress: function (oEvent) {
			MessageBox.confirm(this.geti18nText("dialog.cancel"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.onNavBack();
						} else {
							if (this.getModel().hasPendingChanges()) {
								this.getModel().resetChanges();
							}
							this._toggleEdit(false);
						}
					}
				}.bind(this)
			});

		},

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getModel("editModel");

			oEditModel.setProperty("/editmode", bEditMode);

			this._showCustomerFragment(bEditMode ? "EditCustomer" : "DisplayCustomer");
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("customer_page");
			oPage.removeAllContent();
			if (this._fragmentList[sFragmentName]) {
				oPage.insertContent(this._fragmentList[sFragmentName]);
			} else {
				Fragment.load({
					id: this.getView().createId(sFragmentName),
					name: "de.cloudna.training05.FioriDeepDive.view." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(this._fragmentList[sFragmentName]);
					this.logInfo("Fragment " + sFragmentName + " loaded");
				}.bind(this));
			}

		}
	});
});