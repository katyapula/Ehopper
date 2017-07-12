var SalesSDK = function (responseTimeoutMilliseconds) {
    var salesSdkVersion = '0.0.3'

    // timeout to wait response from eHopper
    var timeout = responseTimeoutMilliseconds;

    // array of deferred objects
    var sendsMessageDic = {};
    // array of timeout objects
    var timeoutObjs = {}

    // Type of product
    var ProductType = {
        Regular: 0,
        Variant: 1
    };

    var InventoryType = {
        Standard: 'Standard',
        Serialized: 'Serialized',
        NonInventory: 'NonInventory'
    };

    var ProductLineItem = function () {
        var self = this;
        // string Example: '038e1c2de69f4b34'
        self.sku = null;
        // string Example: 'EN'
        self.languageId = 'EN';
        // string Example: 'Lee Cooper'
        self.vendorName = null;
        // string Example: '038e1c2de69f4b34'
        self.externalProductId = null;
        // string Example: '042100005264'
        self.upc = null;
        // string Example: null
        self.pictureContent = null;
        // string Example: name of product
        self.searchTags = null;
        // string Example: '042100005264'
        self.productCode = 0;
        // string Example: 'red'
        self.color = null;
        // array Example: [{ languageId: 'EN', name: 'Item' , shortName: 'item'}]
        self.unitOfMeasureLocalized = [{ languageId: self.languageId, name: 'Item', shortName: 'item' }];
        // array Example: [{ languageId: 'EN', name: 'Jack Daniels' }]
        self.namesLocalized = [{ languageId: self.languageId }];
        // byte Example: 0
        self.quantityDecimalPlaces = 0;
        // string Example: '2'
        self.categoryId = null;
        // string Example: '_item'
        self.unitOfMeasureId = '_item';
        // array Example: null
        self.itemModifiers = null;
        // array Example: null
        self.jsonVariants = null;
        // array Example: [{serialNo: '123312'}]
        self.serialNumbers = null;
        // double Example: 33207.00
        self.unitPrice = null;
        // double Example: 33207.00
        self.cost = null;
        // bit Example: 1
        self.isTaxable = null;
        // string Example: '038e1c2de69f4b34b68330b1ed473138'
        self.taxId = null;
        // bit Example: 0
        self.isManualPrice = false;
        // bit Example: 0
        self.isDiscountable = false;
        // int Example: 0
        self.sortOrder = '0';
        // int Example: null
        self.bundleId = null;
        // ProductType Example: productSDK.ProductType.Regular
        self.productType = null;
        // InventoryType Example: productSDK.InventoryType.Serialized
        self.inventoryType = null
        // int Example: 0
        self.minPrice = 0;
        // bit Example: 1
        self.isReturnable = null;
        // bit Example: 1
        self.isVoidable = null;
        // bit Example: 0
        self.isQuantityReadonly = 0;
        // bit Example: 0
        self.isDiscountReadonly = 0;
        // bit Example: 0
        self.isSalePriceReadonly = 0;
        // string Example: '038e1c2d'
        self.externalTaxId = null;
        // object Example: { taxCalcMethod: 'Calculate', taxCostBased: 0 }
        self.taxCalculationInfo = null;
        // string Example: '68330b1ed47313'
        self.appId = null;
        // string Example: null
        self.externalServiceInfo = null;
        // Total Quantity from cart
        self.totalQuantity = null;

        this.__defineSetter__("serialNumbersProduct", function (val) {
            var serials = new Array();
            val.split(',').forEach(function (item) {
                serials.push({ serialNo: item })
            });

            self.serialNumbers = serials;
        });
        this.__defineGetter__("serialNumbersProduct", function () {
            var serials = self.serialNumbers.map(function (item) {
                return item['serialNo'];
            });

            return serials;
        });
        this.__defineSetter__("name", function (val) {
            self.namesLocalized[0].name = val
        });
        this.__defineGetter__("name", function () {
            return self.namesLocalized[0].name;
        });
        this.__defineSetter__("description", function (val) {
            self.namesLocalized[0].description = val
        });
        this.__defineGetter__("description", function () {
            return self.namesLocalized[0].description;
        });
        this.__defineSetter__("shortName", function (val) {
            self.namesLocalized[0].shortName = val
        });
        this.__defineGetter__("shortName", function () {
            return self.namesLocalized[0].shortName;
        });
    };

    var Customer = function () {
        var self = this;
        // string Example: 'John'
        self.firstName = null;
        // string Example: 'Doe'
        self.lastName = null;
        // string Example: 'WestGuestCafe'
        self.storeName = null;
        // string Example: '??'
        self.lifecycleType = null;
        // string Example: '??'
        self.annualIncomeAmount = null;
        // int Example: maritalStatusCode: Unknown = 0, Single = 1, Married = 2, Divorced = 3, Widows = 4
        self.maritalStatusCode = null;
        // int Example: genderTypeCode: Unknown = 0, Male = 1, Female = 2
        self.genderTypeCode = null;
        // string Example: '??'
        self.religiousAffiliationName = null;
        // string Example: '??'
        self.highestEducationLevelName = null;
        // string Example: 'PE'
        self.middleNames = null;
        // string Example: '??'
        self.salutation = null;
        // string Example: '??'
        self.suffix = null;
        // string Example: '??'
        self.officialName = null;
        // string Example: '??'
        self.sortingName = null;
        // string Example: '??'
        self.mailingName = null;
        // string Example: date
        self.birthDate = null;
        // string Example: date
        self.registered = null;
        // string Example: 'EN'
        self.isoLanguageId = null;
        // CustomerAddress
        self.address = {};
        // string Example: 'ncustomer,dcustoe,1111211112'
        self.searchTags = null;
        // int Example: marketing: true - 1, false - 0
        self.marketing = null;
        // int Example: customerType: Personal = 0, Business = 1
        self.customerType = null;
        // int Example: documentType: DriverLicence = 0
        self.documentType = null;
        // string Example: 'jnjk4j423j4l2j424b2o4j'
        self.documentNumber = null;
        // string Example: 'New York City'
        self.documentIssue = null;
        // string Example: 'Ikea'
        self.companyName = null;
        // string Example: 'Viktor'
        self.contactFirstName = null;
        // string Example: 'Balykhin'
        self.contactLastName = null;
        // string Example: 'PE'
        self.contactMiddleName = null;
        // string Example: '0123456' (max 10 length)
        self.taxId = null;
        // int Example: isTaxExempt: true - 1, false - 0
        self.isTaxExempt = null;
        // string Example: 'notes'
        self.notes = null;
        // int Example: acceptChecksCode: Default = 0, AcceptChecks = 1, DoNotAcceptChecks = 2
        self.acceptChecksCode = null;
        // int Example: 1000000
        self.creditLimit = null;
        // int Example: 1
        self.homeStore = null;
        // string Example: 'test'
        self.salesRep = null;
    }

    var CustomerAddress = function () {
        var self = this;

        // string Example: 'New York'
        self.city = null;
        // string Example: '29 eHopper Street'
        self.addressLine1 = null;
        self.addressLine2 = null;
        self.addressLine3 = null;
        self.addressLine4 = null;
        // string Example: 'NY'
        self.territory = null;
        // string Example: '10008'
        self.postalCode = null;
        // string Example: '9323'
        self.postalCodeExtension = null;
        // string Example: 'US'
        self.isoCountryId = null;
        // string Example: '+12314762343'
        self.phone = null;
        // string Example: '+12314762343'
        self.mobilePhone = null;
        // string Example: '2144244212'
        self.fax = null;
        // string Example: 'johndoe@doe.org'
        self.eMail = null;
        // string Example: 'http://ehopper.com'
        self.website = null;
        //string Example: 'Viktor Balykhin'
        self.contactName = null;
    }
    // Send postmessage for get current customer and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var getCurrentCustomer = function (funcPostTimout) {
        return sendRequest('GetCurrentCustomer', null, funcPostTimout);
    }

    // Send postmessage for get new access_token and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var requestToNewToken = function (funcPostTimout) {
        return sendRequest('RequestToNewToken', null, funcPostTimout);
    }

    // Send postmessage for set customer and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var setCustomer = function (customer, funcPostTimout) {
        return sendRequest('SetCustomer', customer, funcPostTimout);
    }

    // Send postmessage for add products to cart and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var addProductLineItemsToCart = function (productLineItems, funcPostTimout) {
        return sendRequest('AddProductLineItemsToCart', productLineItems, funcPostTimout);
    }

    // Send postmessage for find products by Sku and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var findProductsBySku = function (sku, funcPostTimout) {
        return sendRequest('FindProductsBySku', sku, funcPostTimout);
    }

    // Send postmessage for close current App view and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var closeIFrame = function (funcPostTimout) {
        return sendRequest('CloseIFrame', null, funcPostTimout);
    }

    // Send postmessage for get products from cart and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var getProductLineItemsFromCart = function (funcPostTimout) {
        return sendRequest('GetProductLineItemsFromCart', null, funcPostTimout);
    }

    // Send postmessage for get version of SakesSdk listener and wait for the response
    // If response not send from eHopper we are run method funcPostTimout
    var getSalesSdkListenerVersion = function (funcPostTimout) {
        return sendRequest('GetSalesSdkListenerVersion', null, funcPostTimout);
    }

    var sendRequest = function (eventName, eventData, timoutCallback) {
        addListenerToPostMessage(checkResponse);
        var postId = eventName + ':' + Date.now();
        var deferred = $.Deferred();
        sendsMessageDic[postId] = deferred;
        window.parent.postMessage({ postId: postId, postData: eventData }, "*");//window.location.href

        timeoutObjs[postId] = setTimeout(timoutCallback, timeout);
        return deferred.promise();
    }

    // listener of response from eHopper
    var checkResponse = function (event) {
        //if (event.origin != 'http://javascript.ru') {
        //    // check domain
        //    return;
        //}

        var awaiter = timeoutObjs[event.data.postId];
        if (awaiter) {
            clearTimeout(awaiter);

            if (event.data.response.isError) {
                sendsMessageDic[event.data.postId].reject(event.data.response);
            }
            else {
                sendsMessageDic[event.data.postId].resolve(event.data.response);
            }
        }
    }

    // Add listener to eHopper
    var addListenerToPostMessage = function (func) {
        if (window.addEventListener) {
            window.addEventListener("message", func);
        } else {
            // IE8
            window.attachEvent("onmessage", func);
        }
    }

    return {
        addProductLineItemsToCart: addProductLineItemsToCart,
        productLineItem: ProductLineItem,
        getProductLineItemsFromCart: getProductLineItemsFromCart,
        findProductsBySku: findProductsBySku,
        ProductType: ProductType,
        customer: Customer,
        customerAddress: CustomerAddress,
        InventoryType: InventoryType,
        closeIFrame: closeIFrame,
        getCurrentCustomer: getCurrentCustomer,
        setCustomer: setCustomer,
        getSalesSdkListenerVersion: getSalesSdkListenerVersion,
        salesSdkVersion: salesSdkVersion,
        requestToNewToken: requestToNewToken
    }
}
