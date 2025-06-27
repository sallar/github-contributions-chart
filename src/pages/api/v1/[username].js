import { fetchDataForAllYears } from '../../../utils/api/fetch'

export default async (req, res) => {
  const { username, format, startYear, endYear, yearRange } = req.query;
  const data = await fetchDataForAllYears(username, format, { startYear, endYear, yearRange });
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(data);
}