import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/demo/'], // Prevent indexing of internal app and demo routes
    },
    sitemap: 'https://www.swiftgate.in/sitemap.xml',
  };
}
