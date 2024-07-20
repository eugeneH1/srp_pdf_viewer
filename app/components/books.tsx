"use client"

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BooksComponent = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Digital Business Volume 1 Ed 3",
      image: "/db1.jpg",
      price: 250,
      type: "Spellcaster",
    },
    {
      id: 2,
      name: "Digital Business Volume 2 Ed 3",
      image: "/db2.jpg",
      price: 255,
      type: "Dragon",
    },
    {
      id: 3,
      name: "Digital Business Volume 3 Ed 3",
      image: "/db3.jpg",
      price: 275,
      type: "Warrior",
    },
    {
      id: 4,
      name: "Digital Business Primer Ed 3",
      image: "/primer.jpg",
      price: 275,
      type: "Warrior",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredCards = cards.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const readBook = (card) => {
    // Implement readBook functionality
  };

  const buyBook = (card) => {
    // Implement buyBook functionality
  };

  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      const session = await getSession();
      if (session) {
        try {
          const response = await fetch('/api/purchasedBooks');
          const data = await response.json();
          setPurchasedBooks(data.purchasedBooks);
          console.log("Purchased books:", data.purchasedBooks);
        } catch (error) {
          console.error("Error fetching purchased books:", error);
        }
      }
    };
    fetchPurchasedBooks();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <header className="bg-muted/40 border-b px-4 md:px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Browse the collection</h1>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background shadow-none appearance-none pl-8 pr-4 py-2 rounded-md"
          />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
        {filteredCards.map((card) => (
          <Card key={card.id} className="flex flex-col">
            <div className="relative group">
              <img src={card.image} alt={card.name} className="w-full h-auto mb-2 rounded-lg" />
              <div className="absolute top-2 right-2 bg-gray-200 text-gray-800 text-sm font-semibold px-2 py-1 rounded-full">
                ${card.price}
              </div>
            </div>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
              {/* <p className="text-lg mb-2">Type: {card.type}</p> */}
              <Button onClick={() => readBook(card)} className="mr-2 bg-blue-500 text-white p-2 rounded">Read</Button>
              <Button onClick={() => buyBook(card)} className="bg-green-500 text-white p-2 rounded">Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BooksComponent;

interface SearchIconProps {
  className?: string;
}

function SearchIcon(props: SearchIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}