// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Interfaces/IRandomNumber.sol";
import "./Interfaces/IVRFCoordinatorMock.sol";

/**
    @title Random Number Interact Contract
    @author ljrr3045
    @notice Contract created to interact and make calls to the Random Number contract.
*/

contract RandomNumberInteract {

    uint internal _lastLotteryResult;
    IRandomNumber internal randomNumber;
    IVRFCoordinator internal vrfCoordinator;

//Events

    event lastLotteryResult (uint _result, uint _time);

//Initializer

    ///@notice Contract variable initialization function
    function _initialize_randomNumberInteract(address _randomNumber, address _vrfCoordinator) internal {
        randomNumber = IRandomNumber(_randomNumber);
        vrfCoordinator = IVRFCoordinator(_vrfCoordinator);
    }

//Get Functions

    ///@notice Function to get a random number between 1 - 999999 using ChainLink VRF.
    function _getRandomNumber() internal {
        randomNumber.getRandomNumber();
        vrfCoordinator.callBackWithRandomness(randomNumber.lastRequestId(),777,address(randomNumber));
        _lastLotteryResult = randomNumber.randomResult();

        emit lastLotteryResult (_lastLotteryResult, block.timestamp);
    }
}