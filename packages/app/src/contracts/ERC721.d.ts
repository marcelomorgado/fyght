/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface ERC721Interface extends Interface {
  functions: {
    supportsInterface: TypedFunctionDescription<{
      encode([interfaceId]: [Arrayish]): string;
    }>;

    balanceOf: TypedFunctionDescription<{ encode([owner]: [string]): string }>;

    ownerOf: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    approve: TypedFunctionDescription<{
      encode([to, tokenId]: [string, BigNumberish]): string;
    }>;

    getApproved: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    setApprovalForAll: TypedFunctionDescription<{
      encode([operator, approved]: [string, boolean]): string;
    }>;

    isApprovedForAll: TypedFunctionDescription<{
      encode([owner, operator]: [string, string]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;

    safeTransferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, approved, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    ApprovalForAll: TypedEventDescription<{
      encodeTopics([owner, operator, approved]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;
  };
}

export class ERC721 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ERC721;
  attach(addressOrName: string): ERC721;
  deployed(): Promise<ERC721>;

  on(event: EventFilter | string, listener: Listener): ERC721;
  once(event: EventFilter | string, listener: Listener): ERC721;
  addListener(eventName: EventFilter | string, listener: Listener): ERC721;
  removeAllListeners(eventName: EventFilter | string): ERC721;
  removeListener(eventName: any, listener: Listener): ERC721;

  interface: ERC721Interface;

  functions: {
    supportsInterface(interfaceId: Arrayish): Promise<boolean>;

    balanceOf(owner: string): Promise<BigNumber>;

    ownerOf(tokenId: BigNumberish): Promise<string>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getApproved(tokenId: BigNumberish): Promise<string>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    isApprovedForAll(owner: string, operator: string): Promise<boolean>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  supportsInterface(interfaceId: Arrayish): Promise<boolean>;

  balanceOf(owner: string): Promise<BigNumber>;

  ownerOf(tokenId: BigNumberish): Promise<string>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getApproved(tokenId: BigNumberish): Promise<string>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  isApprovedForAll(owner: string, operator: string): Promise<boolean>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    Approval(
      owner: string | null,
      approved: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;

    ApprovalForAll(
      owner: string | null,
      operator: string | null,
      approved: null
    ): EventFilter;

    Transfer(
      from: string | null,
      to: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;
  };

  estimate: {
    supportsInterface(interfaceId: Arrayish): Promise<BigNumber>;

    balanceOf(owner: string): Promise<BigNumber>;

    ownerOf(tokenId: BigNumberish): Promise<BigNumber>;

    approve(to: string, tokenId: BigNumberish): Promise<BigNumber>;

    getApproved(tokenId: BigNumberish): Promise<BigNumber>;

    setApprovalForAll(operator: string, approved: boolean): Promise<BigNumber>;

    isApprovedForAll(owner: string, operator: string): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish
    ): Promise<BigNumber>;

    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish
    ): Promise<BigNumber>;
  };
}