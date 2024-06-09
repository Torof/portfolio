// src/utils/subgraphClient.ts
import { Transaction } from './contract';

// Subgraph endpoint from Alchemy
const SUBGRAPH_URL = "https://subgraph.satsuma-prod.com/917e8e8053d8/bobbys-team--199473/retrotoken/api";

// GraphQL query to get user transactions
const GET_USER_TRANSACTIONS = `
  query GetUserTransactions($userAddress: Bytes!) {
    mintEvents: tokensMinteds(where: { to: $userAddress }) {
      amount
      blockTimestamp
      transactionHash
    }
    
    burnEvents: tokensBurneds(where: { from: $userAddress }) {
      amount
      blockTimestamp
      transactionHash
    }
    
    transfersOut: transfers(where: { from: $userAddress }) {
      to
      value
      blockTimestamp
      transactionHash
    }
    
    transfersIn: transfers(where: { to: $userAddress, from_not: "0x0000000000000000000000000000000000000000" }) {
      from
      value
      blockTimestamp
      transactionHash
    }
  }
`;

// Function to fetch user transactions from the subgraph
export async function fetchUserTransactions(userAddress: string): Promise<Transaction[]> {
  try {
    // Format the address to lowercase to match the subgraph
    const formattedAddress = userAddress.toLowerCase();
    
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_USER_TRANSACTIONS,
        variables: {
          userAddress: formattedAddress,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Subgraph request failed: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Check for GraphQL errors
    if (responseData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(responseData.errors)}`);
    }
    
    const { data } = responseData;
    if (!data) {
      return [];
    }
    
    const transactions: Transaction[] = [];
    
    // Process mint events
    if (data.mintEvents && data.mintEvents.length > 0) {
      data.mintEvents.forEach((event: any) => {
        try {
          const txAmount = (BigInt(event.amount) / BigInt(10**18)).toString();
          transactions.push({
            type: 'mint',
            amount: txAmount,
            timestamp: parseInt(event.blockTimestamp) * 1000, // Convert to milliseconds
            hash: event.transactionHash,
          });
        } catch (err) {
          console.error("Error processing mint event:", err);
        }
      });
    }
    
    // Process burn events
    if (data.burnEvents && data.burnEvents.length > 0) {
      data.burnEvents.forEach((event: any) => {
        try {
          const txAmount = (BigInt(event.amount) / BigInt(10**18)).toString();
          transactions.push({
            type: 'burn',
            amount: txAmount,
            timestamp: parseInt(event.blockTimestamp) * 1000,
            hash: event.transactionHash,
          });
        } catch (err) {
          console.error("Error processing burn event:", err);
        }
      });
    }
    
    // Process outgoing transfers
    if (data.transfersOut && data.transfersOut.length > 0) {
      data.transfersOut.forEach((event: any) => {
        try {
          // Skip transfers to the zero address (burns)
          if (event.to === "0x0000000000000000000000000000000000000000") {
            return;
          }
          
          const txAmount = (BigInt(event.value) / BigInt(10**18)).toString();
          transactions.push({
            type: 'transfer',
            amount: txAmount,
            timestamp: parseInt(event.blockTimestamp) * 1000,
            hash: event.transactionHash,
            to: event.to,
          });
        } catch (err) {
          console.error("Error processing transfer:", err);
        }
      });
    }
    
    // Process incoming transfers
    if (data.transfersIn && data.transfersIn.length > 0) {
      data.transfersIn.forEach((event: any) => {
        try {
          const txAmount = (BigInt(event.value) / BigInt(10**18)).toString();
          transactions.push({
            type: 'transfer',
            amount: txAmount,
            timestamp: parseInt(event.blockTimestamp) * 1000,
            hash: event.transactionHash,
            to: formattedAddress, // The receiver is the current user
          });
        } catch (err) {
          console.error("Error processing incoming transfer:", err);
        }
      });
    }
    
    // Sort by timestamp, newest first
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions from subgraph:", error);
    throw error;
  }
}