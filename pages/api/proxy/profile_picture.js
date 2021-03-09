import axios from 'axios'

export default async (req, res) => {
    if (req.method === 'POST') {
        // temporary for showcase of profile pictures
        axios
            .get(`https://randomuser.me/api/?inc=picture&seed=${req.body.username}`,)
            .then((result) => {
                res.status(200).json(result.data)
            })
            .catch(err => {
                res.status(500)
                console.log(err)
            })   
    }
    res.status(404)
}

export const config = {
    api: {
      externalResolver: true,
    },
  }