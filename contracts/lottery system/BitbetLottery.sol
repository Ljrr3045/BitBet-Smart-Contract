// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "../invest money/InvestMoney.sol";
import "../random number/RandomNumberInteract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
    @title BitBet Lottery Contract
    @author ljrr3045
    @notice This is the main contract, it contains everything related to the logic and the lottery system.
*/

contract BitbetLottery is InvestMoney, RandomNumberInteract{

    bool private _contract_is_initialize;
    uint public lotteryRaund;
    uint internal _ticketPrice;
    IERC20 internal _busd;

    mapping(uint => mapping(uint => address)) internal _userTicket;

//Modifier and Events

    modifier isInitialized() {
        require(!_contract_is_initialize, "Contract already initialized");
        _;
    }

//Initializer

    ///@notice Contract variable initialization function
    function _initialize_contract(
        address _crToken, 
        address _randomNumber, 
        address _vrfCoordinator
    ) external isInitialized{

        _initialize_InvestMoney(_crToken);
        _initialize_randomNumberInteract(_randomNumber, _vrfCoordinator);

        _busd = IERC20(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56);
        _ticketPrice = 5 ether;

        _contract_is_initialize = true;
    }

//Public Functions

    function buyATicket(uint _ticketNumber) public{
        require(_transferTokenToContrat(), "Error: Insufficient funds for purchase");
    }

//Utility Functions

    function _transferTokenToContrat() internal returns(bool){
        return _busd.transferFrom(msg.sender, address(this), _ticketPrice);
    }
}