// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Interfaces/IRandomNumber.sol";
import "./Interfaces/IVRFCoordinatorMock.sol";

contract RandomNumberInteract {

    uint internal _lastLotteryResult;
    IRandomNumber internal randomNumber;
    IVRFCoordinator internal vrfCoordinator;

    function _initialize_randomNumberInteract(address _randomNumber, address _vrfCoordinator) internal {
        randomNumber = IRandomNumber(_randomNumber);
        vrfCoordinator = IVRFCoordinator(_vrfCoordinator);
    }

    function _getRandomNumber() internal {
        randomNumber.getRandomNumber();
        vrfCoordinator.callBackWithRandomness(randomNumber.lastRequestId(),777,address(randomNumber));
        _lastLotteryResult = randomNumber.randomResult();
    }
}