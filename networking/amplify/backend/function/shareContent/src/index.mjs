import { createClient } from '@sanity/client'
import imageUrlBuilder from "@sanity/image-url";
  

export const handler = async (event) => {
    const client = createClient({
        projectId: "qfq09qhf",
        dataset: "production",
        apiVersion: "2024-11-01",
        useCdn: false,
    });

    const FETCH_CONTENT_BY_ID = `
      *[
        _id == $id
      ][0]{
        _id,
        image{
          asset{
            _ref
          }
        },
        title,
        youtubeLink,
        tags,
        date,
        caption,
        author,
        affiliation,
        contact,
        details,
        monsterSelect,
        readingTimeMinutes
      }
    `
    const getArticleFromCMS = async (id) => {
        try {
            const article = await client.fetch(FETCH_CONTENT_BY_ID , { id });
            console.log(article);
            // Process images to return URLs
            if (article.image && article.image.asset && article.image.asset._ref) {
              const imageUrl = imageUrlBuilder(client).image(article.image);
              return {
                ...article,
                image: {
                  ...article.image,
                  url: imageUrl,
                }
              };
            }
            return article;
          
          } catch (error) {
            console.error("Error fetching data from CMS:", error);
            throw error;
          }
    }
    const articleId = event.pathParameters.id;
    // Mocked article fetch — replace with actual Sanity fetch
    const article = await getArticleFromCMS(articleId);
  
   const escapeHtml = (str = '') => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
    }
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(article.title)}</title>
          <meta property="og:title" content="${escapeHtml(article.title)}" />
          <meta property="og:description" content="${escapeHtml(article.caption)}" />
          <meta property="og:image" content="${article.image?.url}" />
          <meta property="og:url" content="https://www.rightoneducation.com/library/${articleId}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body>
          <script>
            window.location.href = "https://www.rightoneducation.com/library/${articleId}";
          </script>
          <p>Redirecting to article...</p>
        </body>
      </html>
    `;
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    };
  };