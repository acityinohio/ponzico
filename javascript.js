//magic requires web3!
window.addEventListener('load', function() {
	if (typeof web3 !== 'undefined') {
		window.web3 = new Web3(web3.currentProvider);
	} else {
		window.web3 = 'undefined';
		document.getElementById('yep3').style.display = "none";
	}
	init();
});

function init() {
	if (web3 !== 'undefined') {
		document.getElementById('nope3').style.display = "none";
		document.getElementById('rewith').style.display = "none";

		var ponzAddr = '0x1ce7986760ADe2BF0F322f5EF39Ce0DE3bd0C82B';
		var ponzABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"invested","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"invest","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"reinvest","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogInvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogWithdrawal","type":"event"}];
		var teslaAddr = '0x75f97d98eb49989f9af40c49a7a1eb32767214f5';
		var teslaABI = [{"constant":false,"inputs":[],"name":"itsLikeChicago","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"winnovate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"color","type":"uint8"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"votes","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"color","type":"uint8"},{"indexed":false,"name":"num","type":"uint256"}],"name":"LogVotes","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"color","type":"uint8"}],"name":"LogWinner","type":"event"}];

		//update data
		web3.eth.getCode(ponzAddr, function(e, r) { 
			var ponzICO;
			var tesla;
			if (!e && r.length > 3) {
				ponzICO = web3.eth.contract(ponzABI).at(ponzAddr);
				tesla = web3.eth.contract(teslaABI).at(teslaAddr);
			}
			//hey listen
			document.getElementById('invest').addEventListener('click', function() {invest(ponzICO)}, false);
			document.getElementById('reinvest').addEventListener('click', function() {reinvest(ponzICO)}, false);
			document.getElementById('withdraw').addEventListener('click', function() {withdraw(ponzICO)}, false);
			document.getElementById('colorvote').addEventListener('click', function() {vote(ponzICO, tesla)}, false);
			document.getElementById('resetvote').addEventListener('click', function() {resetvote(ponzICO, tesla)}, false);
			//hey keep listening
			web3.eth.filter('latest').watch(function(e, r){
				if(!e) {
					updateBlockchainData(ponzICO);
				}
			}); 
		});

		function updateBlockchainData(ponzICO) {
			ponzICO.total(function(e, r) {
				document.getElementById('totalinvested').textContent = web3.fromWei(r, "ether");
			});
			if (web3.eth.accounts[0] !== 'undefined') {
				ponzICO.balances(web3.eth.accounts[0], function(e, r) {
					document.getElementById('balance').textContent = web3.fromWei(r,"ether");
					if (web3.toBigNumber(r).isZero()) {
						document.getElementById('rewith').style.display = "none";
					} else {
						document.getElementById('rewith').style.display = "unset";
					}
				});
				ponzICO.invested(web3.eth.accounts[0], function(e, r) {
					document.getElementById('invested').textContent = web3.fromWei(r,"ether");
				});
			}
		}

		function invest(ponzICO) {
			ponzICO.invest({value: web3.toWei(document.getElementById('investamount').value, "ether"), from: web3.eth.accounts[0]}, function(e, r) {
				updateBlockchainData(ponzICO);
			});
		}

		function reinvest(ponzICO) {
			ponzICO.reinvest({from: web3.eth.accounts[0]}, function(e, r) {
				updateBlockchainData(ponzICO);
			});
		}

		function withdraw(ponzICO) {
			ponzICO.withdraw({from: web3.eth.accounts[0]}, function(e, r) {
				updateBlockchainData(ponzICO);
			});
		}

		function vote(ponzICO, tesla) {
			var value = 2;
			if (document.getElementById('SolidBlack').checked) {
				value = 0;
			} else if (document.getElementById('MidnightSilverMetallic').checked) {
				value = 1;
			} else if (document.getElementById('DeepBlueMetallic').checked) {
				value = 2;
			} else if (document.getElementById('SilverMetallic').checked) {
				value = 3;
			} else if (document.getElementById('RedMultiCoat').checked) {
				value = 4;
			}
			tesla.vote(value, {from: web3.eth.accounts[0]}, function(e, r) {
				updateBlockchainData(ponzICO);
			});
		}

		function resetvote(ponzICO, tesla) {
			tesla.itsLikeChicago({value: web3.toWei(1, "ether"), from: web3.eth.accounts[0]}, function(e, r) {
				updateBlockchainData(ponzICO);
			});
		}

	}
}
