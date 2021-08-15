// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { buildSdk } from "@rpglogs/api-sdk";
import btoa from 'btoa';

export default async function handler(req, res) {
  if (!req.query.name ||
      !req.query.server ||
      !req.query.region) {

    res.status(400).json({
      message: 'Invalid parameters provided.'
    });

    return;
  }

  const accessToken = await getAccessToken();
  const sdk = buildSdk(accessToken);

  try {
    const response = await sdk.getGuildReports({
      guildName: req.query.name,
      guildServerSlug: req.query.server,
      guildServerRegion: req.query.region,
      limit: 1,
      zoneId: 28,
      includeFights: false,
    });

    if (!response?.reportData?.reports?.data?.length) {
      res.status(404).json({ message: 'Report not found.' });
      return;
    }

    res.status(200).json(response.reportData.reports.data[0]);
  } catch (error) {
    console.log(error);

    res
      .status(error?.response?.status ?? 500)
      .json({
        message: error?.response?.error ?? 'An error occurred.'
      });
  }
}

async function getAccessToken() {
  const authHeader = 'Basic ' +
    btoa(process.env.RPGLOGS_API_CLIENT_ID + ':' +
         process.env.RPGLOGS_API_CLIENT_SECRET);

  const response = await fetch(
    'https://www.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const json = await response.json();

  if (response.status === 200) {
    return json.access_token;
  } else {
    throw new Error(
      'Response was not OK: ' +
      JSON.stringify(json ?? {})
    );
  }
}