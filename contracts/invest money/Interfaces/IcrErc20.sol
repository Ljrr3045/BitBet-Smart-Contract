// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IcrErc20{
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function balanceOfUnderlying(address account) external returns (uint);
}