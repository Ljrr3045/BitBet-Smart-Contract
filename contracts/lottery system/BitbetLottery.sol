// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "../invest money/InvestMoney.sol";
import "../random number/RandomNumberInteract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BitbetLottery is InvestMoney, RandomNumberInteract{

    bool private _contract_is_initialize;

//Modifier and Events

    modifier isInitialized() {
        require(!_contract_is_initialize, "Contract already initialized");
        _;
    }

//Initializer

    function _initialize_contract(
        address _crToken, 
        address _randomNumber, 
        address _vrfCoordinator
    ) external isInitialized{

        _initialize_InvestMoney(_crToken);
        _initialize_randomNumberInteract(_randomNumber, _vrfCoordinator);

        _contract_is_initialize = true;
    }

//Public Functions

}