import { getTwitterMediaUrl } from '../../../utils/api/twitter'
import { error } from '../../../utils/api/alerts'

export default async (req, res) => {
  const { image } = req.body;

  if (typeof image !== "string") {
    return res.status(500).send(error.imageInvalid)
  }

  getTwitterMediaUrl(image)
    .then(mediaUrl =>
      res.json({
        mediaUrl
      })
    )
    .catch((err) => {
      console.error(err)
      res.status(500).send(err.message)
    });
}