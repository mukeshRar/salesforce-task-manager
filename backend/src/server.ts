import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { PORT, CLIENT_ID, REDIRECT_URI, SF_LOGIN } = process.env;

app.post("/oauth/token", async (req, res) => {
  const { code, code_verifier } = req.body;

  try {
    const response = await axios.post(
      `${SF_LOGIN}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID!,
        redirect_uri: REDIRECT_URI!,
        code,
        code_verifier,
      }),
    );

    return res.json({
      access_token: response.data.access_token,
      instance_url: response.data.instance_url,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return res.status(500).json(err.response?.data ?? err.message);
    }

    return res.status(500).json({
      message: "Unexpected server error",
    });
  }
});

app.get("/tasks", async (req, res) => {
  const instanceUrl = req.headers["x-instance-url"];
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const response = await axios.get(`${instanceUrl}/services/apexrest/tasks`, {
      headers: {
        Authorization: token,
      },
    });

    return res.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return res.status(500).json(err.response?.data);
    }

    return res.status(500).json({ message: "Unexpected error" });
  }
});

app.post("/tasks", async (req, res) => {
  const instanceUrl = req.headers["x-instance-url"] as string;
  const token = req.headers.authorization;
  const { title } = req.body;

  if (!token || !instanceUrl) {
    return res.status(401).json({ message: "Missing auth headers" });
  }

  try {
    const response = await axios.post(
      `${instanceUrl}/services/apexrest/tasks`,
      { title },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(201).json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return res.status(500).json(err.response?.data);
    }

    return res.status(500).json({ message: "Unexpected error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const instanceUrl = req.headers["x-instance-url"] as string;
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token || !instanceUrl) {
    return res.status(401).json({ message: "Missing auth headers" });
  }

  try {
    await axios.delete(`${instanceUrl}/services/apexrest/tasks/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return res.status(204).send();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return res.status(500).json(err.response?.data);
    }

    return res.status(500).json({ message: "Unexpected error" });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const instanceUrl = req.headers["x-instance-url"] as string;
  const token = req.headers.authorization;
  const { id } = req.params;
  const { completed } = req.body;

  if (!token || !instanceUrl) {
    return res.status(401).json({ message: "Missing auth headers" });
  }

  try {
    const response = await axios.patch(
      `${instanceUrl}/services/apexrest/tasks`,
      { id, completed },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    );

    return res.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return res.status(500).json(err.response?.data);
    }

    return res.status(500).json({ message: "Unexpected error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
