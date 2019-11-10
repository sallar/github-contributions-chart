import { NextApiRequest, NextApiResponse } from "next";

import { fetchDataForAllYears } from "../../../utils/api/fetch";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, format } = req.query;
  const data = await fetchDataForAllYears(username, format);
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.json(data);
};
