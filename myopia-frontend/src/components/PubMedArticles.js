import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const PubMedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  const fetchPubMedArticles = async () => {
    try {
      setLoading(true);
      const searchTerm = 'pathological myopia';
      const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
      const summaryUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';

      // Searching for article IDs
      const searchResponse = await axios.get(baseUrl, {
        params: {
          db: 'pubmed',
          term: searchTerm,
          retmax: 100,  // Number of results
          retmode: 'json',
          sort: 'relevance'
        }
      });

      const articleIds = searchResponse.data.esearchresult.idlist;

      // Fetching details for those articles
      const detailsResponse = await axios.get(summaryUrl, {
        params: {
          db: 'pubmed',
          id: articleIds.join(','),
          retmode: 'json'
        }
      });

      // Processing article details
      const articleDetails = articleIds.map(id => {
        const details = detailsResponse.data.result[id];
        return {
          id: id,
          title: details?.title || 'Untitled',
          authors: details?.authors?.map(author => author.name).join(', ') || 'Unknown Authors',
          pubDate: details?.pubdate || 'N/A',
          source: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
        };
      });

      setArticles(articleDetails);
      setFilteredArticles(articleDetails);
      setLoading(false);
    } catch (err) {
      console.error('PubMed fetch error:', err);
      setError('Failed to fetch articles, try refreshing the page');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPubMedArticles();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase().trim();
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(lowercasedQuery) || 
        article.authors.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  if (loading) return (
    <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-md">
      <div className="text-gray-600 text-lg">Loading medical articles...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <div className="text-red-500 text-lg">{error}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Pathological Myopia Research</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search article by title or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-4 px-6 bg-gray-50 rounded-lg text-gray-600 text-center">
          No articles found matching your search query.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
              <p className="text-gray-700 mb-1"><span className="font-medium">Authors:</span> {article.authors}</p>
              <p className="text-gray-700 mb-3"><span className="font-medium">Published:</span> {article.pubDate}</p>
              <a 
                href={article.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
              >
                View on PubMed
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PubMedArticles;