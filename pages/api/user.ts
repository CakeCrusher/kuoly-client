import {
  IncomingMessage,
  ServerResponse,
} from "http"

export default function handler(req: IncomingMessage, res: any) {
  if (req.method === "POST") {
    res.status(200).json({
      name:'Create John Doe?'
    })
  } else {
    res.status(200).json({
      name:'John Doe'
    })
  }
}