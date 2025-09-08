import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

interface LoyaltyContextType {
  points: number;
  transactions: LoyaltyTransaction[];
  awardPoints: (points: number, description: string, orderId?: string) => void;
  redeemPoints: (points: number, description: string) => boolean;
  calculateOrderPoints: (orderTotal: number) => number;
  getTransactionsByOrder: (orderId: string) => LoyaltyTransaction[];
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}

interface LoyaltyProviderProps {
  children: ReactNode;
}

export function LoyaltyProvider({ children }: LoyaltyProviderProps) {
  const [points, setPoints] = useState(740); // Starting points
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([
    {
      id: '1',
      type: 'earned',
      points: 50,
      description: 'Order #TMP-2024-001',
      date: 'Today, 12:30 PM',
      orderId: 'TMP-2024-001'
    },
    {
      id: '2',
      type: 'earned',
      points: 32,
      description: 'Order #TMP-2024-002',
      date: 'Yesterday, 7:15 PM',
      orderId: 'TMP-2024-002'
    },
    {
      id: '3',
      type: 'redeemed',
      points: -100,
      description: 'Free Side Reward',
      date: '2 days ago, 6:45 PM',
    },
  ]);

  const awardPoints = (pointsToAward: number, description: string, orderId?: string) => {
    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      type: 'earned',
      points: pointsToAward,
      description,
      date: new Date().toLocaleString(),
      orderId
    };

    setTransactions(prev => [transaction, ...prev]);
    setPoints(prev => prev + pointsToAward);
  };

  const redeemPoints = (pointsToRedeem: number, description: string): boolean => {
    if (points < pointsToRedeem) {
      return false; // Not enough points
    }

    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      type: 'redeemed',
      points: -pointsToRedeem,
      description,
      date: new Date().toLocaleString(),
    };

    setTransactions(prev => [transaction, ...prev]);
    setPoints(prev => prev - pointsToRedeem);
    return true;
  };

  const calculateOrderPoints = (orderTotal: number): number => {
    // Award 1 point per dollar spent (rounded down)
    return Math.floor(orderTotal);
  };

  const getTransactionsByOrder = (orderId: string): LoyaltyTransaction[] => {
    return transactions.filter(transaction => transaction.orderId === orderId);
  };

  const value: LoyaltyContextType = {
    points,
    transactions,
    awardPoints,
    redeemPoints,
    calculateOrderPoints,
    getTransactionsByOrder,
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
}
