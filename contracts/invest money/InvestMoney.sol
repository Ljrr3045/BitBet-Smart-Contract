// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Interfaces/IcrErc20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
    @title Invest Money Contract
    @author ljrr3045
    @notice Contract created to interact with the CREAM Finance protocol to invest and withdraw token, 
    from the investment stake.
*/

contract InvestMoney {

    IcrErc20 internal crToken;

//Events

    event addTokenToCREAM (uint _amount, uint _time);
    event withdrawTokenFromCREAM (uint _amount, uint _time);

//Initializer

    ///@notice Contract variable initialization function
    function _initialize_InvestMoney(address _crToken) internal virtual{
        crToken = IcrErc20(_crToken);
    }

//Invest Functions

    ///@notice Function to add money to the stake fund of CREAM finance
    function _mintCrtoken(address _token, uint _amount) internal virtual{
        IERC20(_token).approve(address(crToken), _amount);
        require(crToken.mint(_amount) == 0, "mint failed");

        emit addTokenToCREAM (_amount, block.timestamp);
    }

    ///@notice Function to withdraw money from the stake fund of CREAM finance
    function _redeemCrtoken(uint _amount) internal virtual{
        require(crToken.redeem(_amount) == 0, "redeem failed");

        emit withdrawTokenFromCREAM (_amount, block.timestamp);
    }

//Get Functions

    ///@dev Returns the amount of token in crToken that the contract has.
    function _getCrtokenBalance() internal view virtual returns(uint) {
        return crToken.balanceOf(address(this));
    }
}