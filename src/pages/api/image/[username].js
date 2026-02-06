import { createCanvas } from 'canvas';
import { drawContributions } from 'github-contributions-canvas';
import { fetchDataForAllYears } from '../../../utils/api/fetch';

export default async (req, res) => {
  try {
    const { username } = req.query;
    const theme = req.query.theme || 'standard';

    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }

    // Fetch contribution data
    const data = await fetchDataForAllYears(username);

    if (!data || !data.years || data.years.length === 0) {
      res.status(404).json({ error: 'User not found or has no contributions' });
      return;
    }

    // Create a canvas with sufficient size for the contribution chart
    // The drawing library will use this canvas to render the chart
    const canvas = createCanvas(1200, 600);

    // Draw contributions on the canvas
    drawContributions(canvas, {
      data,
      username: username,
      themeName: theme,
      footerText: 'Made by @sallar & friends - github-contributions.vercel.app'
    });

    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};
