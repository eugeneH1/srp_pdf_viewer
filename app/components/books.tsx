"use client"

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type CardType = {
  id: number;
  name: string;
  image: string;
  price: number;
};

const BooksComponent = () => {
  const [cards, setCards] = useState<CardType[]>([
    {
      id: 1,
      name: "Digital Business Volume 1 Ed 3",
      image: "/db1.jpg",
      price: 250,
    },
    {
      id: 2,
      name: "Digital Business Volume 2 Ed 3",
      image: "/db2.jpg",
      price: 255,
    },
    {
      id: 3,
      name: "Digital Business Volume 3 Ed 3",
      image: "/db3.jpg",
      price: 275,
    },
    {
      id: 4,
      name: "Digital Business Primer Ed 3",
      image: "/primer.jpg",
      price: 399,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([]);

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const readBook = (card: CardType) => {
    // Implement read book functionality
  };

  const buyBook = (card: CardType) => {
    // Implement buy book functionality
  };

  return (
    <div>
      <header>
        <div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background shadow-none appearance-none pl-8 pr-4 py-2 rounded-md"
          />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
        {filteredCards.map((card) => {
          const isPurchased = purchasedBooks.includes(card.name);
          console.log(isPurchased);
          return (
            <Card key={card.id} className="flex flex-col">
              <div className="relative group">
                <img src={card.image} alt={card.name} className="w-full h-auto mb-2 rounded-lg" />
                <div className="absolute top-2 right-2 bg-gray-200 text-gray-800 text-sm font-semibold px-2 py-1 rounded-full">
                  R{card.price}
                </div>
              </div>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
                {isPurchased ? (
                  <Button onClick={() => readBook(card)} className="mr-2 bg-slate-500 text-white p-2 rounded">Read</Button>
                ) : (
                  <Button className="mr-2 bg-slate-200 text-white p-2 rounded cursor-not-allowed" disabled>Read</Button>
                )}
                {isPurchased ? (
                  <Button onClick={() => buyBook(card)} className="bg-slate-500 text-white p-2 rounded">Buy</Button>
                ) : (
                  <Button className="bg-slate-200 text-white p-2 rounded cursor-not-allowed" disabled>Buy</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BooksComponent;