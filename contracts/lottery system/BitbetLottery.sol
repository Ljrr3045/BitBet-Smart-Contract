// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "../invest money/InvestMoney.sol";
import "../random number/RandomNumberInteract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
    @title BitBet Lottery Contract
    @author ljrr3045
    @notice This is the main contract, it contains everything related to the logic and the lottery system.
*/

contract BitbetLottery is InvestMoney, RandomNumberInteract, AccessControl{

    bool private _contract_is_initialize;

    IERC20 internal _busd;

    uint public _lotteryRound;
    uint public _ticketPrice;
    uint public _loterryTime;
    uint public _lotteryReward;

    mapping(uint => mapping(uint => address)) internal _userTicket;

//Modifier

    modifier isInitialized() {
        require(!_contract_is_initialize, "Contract already initialized");
        _;
    }

    modifier IsUpdateLotteryRaund() {
        _updateLotteryRaund();
        _;
    }

//Events

    event _userBuyATicket(address _user, uint _ticketNumber, uint _lotteryRound);
    event _sendMoneyToWinner(address _winner, uint _ticketNumber, uint _lotteryRound, uint _amount);

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
        _loterryTime = block.timestamp;
        _lotteryRound = 1;

        _grantRole("Admin", msg.sender);
        _setRoleAdmin("", "Admin");

        _contract_is_initialize = true;
    }

//Public & External Functions

    function buyATicket(uint _ticketNumber) public IsUpdateLotteryRaund{
        require(_transferTokenToContrat(), "Error: Insufficient funds for purchase");
        require(_ticketNumber <= 999999, "Error: Invalid number");
        require(_userTicket[_lotteryRound][_ticketNumber] == address(0), "Error: Ticket sold");

        _mintCrtoken(address(_busd), _ticketPrice);
        _lotteryReward += _ticketPrice;

        _userTicket[_lotteryRound][_ticketNumber] = msg.sender;

        emit _userBuyATicket(msg.sender, _ticketNumber, _lotteryRound);
    }

    function updateLotteryRaund() external{
        _updateLotteryRaund();
    }

//View Functions

    function isTimeToUpdateLotteryRaund() public view returns(bool){
        return block.timestamp >= (_loterryTime + 7 days);
    }

//Only With Role

    function withdrawContractBUSD() external onlyRole("Admin"){

        uint _contracBalance = _busd.balanceOf(address(this));
        
        if(_contracBalance > 0){
            _busd.transfer(msg.sender, _contracBalance);
        }
    }

    function cleanMoneyOfContract(address _token) external onlyRole("Admin") returns (bool _succesBNB, bool _succesToken) {

        uint _contracBalanceInToken = IERC20(_token).balanceOf(address(this));

        if(_contracBalanceInToken > 0){
            _succesToken = IERC20(_token).transfer(msg.sender, _contracBalanceInToken);
        }

        if(address(this).balance > 0){
            (_succesBNB,) = payable(msg.sender).call{ value: address(this).balance }("");
        }
    }

    function changeTicketPrice(uint _newPrice) external onlyRole("Admin") {
        require(_newPrice > 0, "Error: Price is invalid");
        _ticketPrice = _newPrice * 10**18;
    }

//Utility Functions

    function _updateLotteryRaund() internal {
        if(isTimeToUpdateLotteryRaund()){
            _getRandomNumber();
            _checkWinner();
            _lotteryRound++;
            _loterryTime = block.timestamp;
        }
    }

    function _checkWinner() internal {
        if(_userTicket[_lotteryRound][_lastLotteryResult] != address(0)){
            _redeemCrtoken(_getCrtokenBalance());

            require(
                _busd.transfer(_userTicket[_lotteryRound][_lastLotteryResult], _lotteryReward), 
                "Error: Something happen when send the reward"
            );

            emit _sendMoneyToWinner(
                _userTicket[_lotteryRound][_lastLotteryResult], 
                _lastLotteryResult, 
                _lotteryRound, 
                _lotteryReward
            );
            
            _lotteryReward = 0;
        }
    }

    function _transferTokenToContrat() internal returns(bool){
        return _busd.transferFrom(msg.sender, address(this), _ticketPrice);
    }
}