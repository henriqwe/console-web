import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "qs";
import axios from "axios";

export default async function schemas(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${req.headers.authorization}`,
    });
    try {
      const { data } = await axios.get(
        "https://api.ycodify.com/api/modeler/schema",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${req.headers.authorization}`,
          },
        }
      );
      console.log(data);
      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ err: err.response });
    }
  }
  return res.status(404).json({ message: "Not found! :(" });
}
