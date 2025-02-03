import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pub.css';
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

  if (loading) return <div>Loading medical articles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pubmed-articles">
      <h2>Latest Pathological Myopia Research</h2>
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search article by title or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-results">
          No articles found matching your search query.
        </div>
      ) : (
        filteredArticles.map(article => (
          <div key={article.id} className="article-card">
            <h3>{article.title}</h3>
            <p><strong>Authors:</strong> {article.authors}</p>
            <p><strong>Published:</strong> {article.pubDate}</p>
            <a 
              href={article.source} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on PubMed
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default PubMedArticles;