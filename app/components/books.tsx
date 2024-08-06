"use client"

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContex';

type CardType = {
  id: number;
  name: string;
  image: string;
  price: number;
  fp: string;
};

const BooksComponent = () => {
  const cards: CardType[] = [
    {
      id: 1,
      name: "Digital Business Volume 1 Ed 3",
      image: "/db1.jpg",
      price: 250,
      fp: "vol1.pdf",
    },
    {
      id: 2,
      name: "Digital Business Volume 2 Ed 3",
      image: "/db2.jpg",
      price: 255,
      fp: "vol2.pdf",
    },
    {
      id: 3,
      name: "Digital Business Volume 3 Ed 2",
      image: "/db3.jpg",
      price: 275,
      fp: "vol3.pdf",
    },
    {
      id: 4,
      name: "Digital Business Primer Ed 3",
      image: "/primer.jpg",
      price: 399,
      fp: "primer.pdf",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedBooks, setPurchasedBooks] = useState<number[]>([]);
  const { isLoggedIn } = useAuth();
  // Filter the cards based on the search term
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const router = useRouter();
  // redirect to the pdf viewer passing the file path
  const readBook = (filePath: string ) => {
    router.push(`/reader?file_path=${filePath}`);
  }
  //redirect to the silk route press website
  const buyBook = () => {
    window.open('https://silkroutepress.com', '_blank');
  };

  //query db to get purchased books for the customer
  useEffect(() => {
    // console.log("session in books: ", session);
    const fetchPurchasedBooks = async () => {
      // const session = await getSession();
      if (isLoggedIn) {
        try {
          const response = await fetch('/api/purchasedBooks');
          const data = await response.json();
          setPurchasedBooks(data.purchasedBooks);
          
        } catch (error) {
          console.error("Error fetching purchased books:", error);
        } 
      }
    };
    fetchPurchasedBooks();
  }, [isLoggedIn]);

  return (
    <div>
      <header>
        <div className='flex items-end gap-4 justify-end px-2 mx-1'>
        <div className="text-md font-medium">Search Products</div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 bg-background shadow-md appearance-none pl-8 pr-4 py-2 rounded-md"
          />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
        {filteredCards.map((card) => {
          //check if single book or array of books
          let isPurchased: boolean;
          if(!Array.isArray(purchasedBooks)) {
            isPurchased = purchasedBooks === card.id;
          } else isPurchased = purchasedBooks.includes(card.id);
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
                {/* disable buttons based on whether book is purchased or not */}
                {isPurchased ? (
                  <Button onClick={() => readBook(card.fp)} className="mr-2 bg-slate-500 text-white p-2 rounded">Read</Button>
                ) : (
                  <Button className="mr-2 bg-slate-200 text-white p-2 rounded cursor-not-allowed" disabled>Read</Button>
                )}
                {isPurchased ? (
                  <Button className="bg-slate-500 text-white p-2 rounded cursor-not-allowed" disabled>Buy</Button>
                ) : (
                  <Button onClick={() => buyBook()} className="bg-slate-500 text-white p-2 rounded" >Buy</Button>
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