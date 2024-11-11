"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, List, Grid3x3 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NewsArticle {
  title: string;
  link: string;
  snippet: string;
  photo_url: string;
  thumbnail_url: string;
  published_datetime_utc: string;
  source_name: string;
  source_url: string;
  source_logo_url: string;
}

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const articlesPerPage = 9;

  useEffect(() => {
    const fetchNews = async () => {
      const options = {
        method: 'GET',
        url: process.env.NEXT_PUBLIC_NEWS_API_URL,
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
          'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
        },
        params: {
          topic: 'TECHNOLOGY',
          limit: '200',
          country: 'IN',
          lang: 'en'
        }
      };

      try {
        const response = await axios.request(options);
        if (response.data && response.data.data) {
          setNews(response.data.data);
        } else {
          setNews([]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

  const nextPage = () => {
    if (currentPage < Math.ceil(news.length / articlesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewChange = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="h-full pb-5">
      <Card className="h-full flex flex-col max-h-screen">
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>What's happening around the world?</CardTitle>
            <div className="flex items-center space-x-2">
              <List /><Label htmlFor="view">List View</Label>
              <Switch id="view" checked={isGridView} onCheckedChange={handleViewChange} />
              <Grid3x3 /><Label htmlFor="view">Grid View</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" size={48} />
            </div>
          ) : (
            <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col space-y-4"}>
              {currentArticles.map((article, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {article.thumbnail_url && (
                      <img src={article.photo_url} alt={article.title} className="w-full h-auto mb-2" />
                    )}
                    <p>{article.snippet}</p>
                    <p>
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        Read more
                      </a>
                    </p>
                    <p className='text-center m-5'>
                      <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        View Full Article
                      </a>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>Previous Page</Button>
          <Button onClick={nextPage} disabled={currentPage === Math.ceil(news.length / articlesPerPage)}>Next Page</Button>
        </CardFooter>
      </Card>
    </div>
  );
}