// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
    @title Random Number Contract
    @author ljrr3045
    @notice This contract has the function of communicating with the VRF Coordinator of 
    ChainLink in order to obtain a random number safely.
*/

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 
contract RandomNumber is VRFConsumerBase, AccessControl{

    using SafeMath for uint;

    bytes32 internal keyHash;
    bytes32 public lastRequestId;
    uint256 internal fee;
    uint256 public randomResult;
    uint public until;
    ///@dev These are the global variables used for contract management.

//Events

    event newRandomNumber(uint indexed _newResult);
    event newNumberLimit (uint indexed _until);
    event withdrawContractFunds (uint indexed _time, bool _success);

    /**
        @notice The address of the VRF Coordinator contract must be supplied, depending on the blocksChain in which we are.
        @dev For both the keyHash and Fee variables, their value will be variable as long as different strings are used.
    */
    constructor(
        address _vrfCoordinator, 
        address _linkAddress,
        address _adminContract
        ) 
        VRFConsumerBase(
            _vrfCoordinator,
            _linkAddress 
        )
    {
        keyHash = 0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c;
        fee = 2 * (10 ** 17);
        until = 999999;

        _grantRole("Admin", msg.sender);
        _grantRole("Contract", _adminContract);
        _setRoleAdmin("", "Admin");
    }

//Functions

    /**
        @notice This function allows you to request a random number 
        @dev For this function to work, you must previously supply this contract with Link Token, to cover 
        the corresponding fees. This function can only be called by the owner of the contract.
    */
    function getRandomNumber() public onlyRole("Contract") returns(bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        lastRequestId = requestRandomness(keyHash, fee);
        return lastRequestId;
    }

    ///@dev Internal function overridden to set the variable randomResult.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness.mod(until).add(1);

        emit newRandomNumber(randomResult);
    }

//Utility Functions

    /**
        @notice This function allows you to set the variable until, this variable will be used to delimit the range of 
        numbers in which you want to obtain the random number, ex: 1 to 50.
        @dev This function can only be called by the owner of the contract.
    */
    function setUntil(uint _until) public onlyRole("Admin"){
        until = _until;

        emit newNumberLimit(until);
    }

    /**
        @notice Function designed to be able to withdraw all the funds from the contract in case of 
        receiving any token or ETH,
        @dev If you want the function to retrieve tokens as well, you must provide the address of the token 
        and set _withdrawToken to true.
    */
    function withdrawFunds(bool _withdrawToken, address _targetToken) public onlyRole("Admin") returns(bool _success){

        if(_withdrawToken){
            require(_targetToken != address(0), "Error: Invalid token address");
            uint _contractBalanceInToken = IERC20(_targetToken).balanceOf(address(this));

            if(_contractBalanceInToken > 0){
                _success = IERC20(_targetToken).transfer(msg.sender, _contractBalanceInToken);
            }
        }

        if(address(this).balance > 0){
            (_success,) = payable(msg.sender).call{ value: address(this).balance }("");
        }

        emit withdrawContractFunds(block.timestamp, _success);
    }
}