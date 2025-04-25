import { fetchDataForAllYears } from '../../../utils/api/fetch'

export default async (req, res) => {
  let { username, format } = req.query;
  let organization = undefined

  if (username.includes('|')) {
    [username, organization] = username.split('|');
  }

  const data = await fetchDataForAllYears(username, organization, format);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(data);
}