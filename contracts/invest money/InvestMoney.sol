// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Interfaces/IcrErc20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvestMoney {

    IcrErc20 internal crToken;

//Initializer

    function _initialize_InvestMoney(address _crToken) internal virtual{
        crToken = IcrErc20(_crToken);
    }

//Invest Functions

    function _mintCrtoken(address _token, uint _amount) internal virtual{
        IERC20(_token).approve(address(crToken), _amount);
        require(crToken.mint(_amount) == 0, "mint failed");
    }

    function _redeemCrtoken(uint _amount) internal virtual{
        require(crToken.redeem(_amount) == 0, "redeem failed");
    }

//Get Functions

    function _getCrtokenBalance() internal view virtual returns(uint) {
        return crToken.balanceOf(address(this));
    }

    function _getCrtokenBalanceOfUnderlying() internal virtual returns(uint){
        return crToken.balanceOfUnderlying(address(this));
    }
}