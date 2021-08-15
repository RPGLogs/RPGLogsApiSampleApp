import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from 'react';
import Code from "../components/Code";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const response = await fetch('/api/latestGuildReport?' + new URLSearchParams({
      name: event.target.name.value,
      server: event.target.server.value,
      region: event.target.region.value
    }).toString());

    const json = await response.json();

    setResult(JSON.stringify(json, null, 2));
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>RPGLogs API Sample App</title>
        <meta name="description" content="A sample application to demonstrate usage of the RPGLogs v2 API."/>
        <link rel="icon" href="https://assets.rpglogs.com/img/warcraft/favicon.png"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Using the RPGLogs API is <a href="https://github.com/RPGLogs/RPGLogsApiSampleApp">easy!</a>
        </h1>

        <p className={styles.description}>
          And the <a href="https://www.npmjs.com/package/@rpglogs/api-sdk">NPM package</a> makes it even
          easier.
        </p>

        {result ?
          (
            <div className={styles.card}>
              <h2>Result from the API</h2>
              <pre className={styles.code}>{result}</pre>
              <button className={styles.button} onClick={() => setResult(undefined)}>Again</button>
            </div>
          )
          : (
            <div className={styles.card}>
              <h2>Find a guild&apos;s latest report</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formElement}>
                  <label htmlFor="name">Name: </label>
                  <input className={styles.input} id="name" type="text" placeholder="Reaction" autoComplete="off" />
                </div>
                <div className={styles.formElement}>
                  <label htmlFor="server">Server: </label>
                  <input className={styles.input} id="server" type="text" placeholder="Kazzak" autoComplete="off" />
                </div>
                <div className={styles.formElement}>
                  <label htmlFor="region">Region: </label>
                  <input className={styles.input} id="region" type="text" placeholder="EU" autoComplete="off" />
                </div>
                <button disabled={isLoading} className={styles.button}
                        type="submit">{isLoading ? 'Loading...' : 'Search!'}</button>
              </form>
            </div>
          )
        }

        <div className={styles.implementation}>
          <h2>With the SDK, the implementation is simple:</h2>
          <Code language={'javascript'}>
            {`
import { buildSdk } from "@rpglogs/api-sdk";

const accessToken = await getAccessToken();
const sdk = buildSdk(accessToken);

const response = await sdk.getGuildReports({
  guildName: 'Reaction',
  guildServerSlug: 'Kazzak',
  guildServerRegion: 'EU',
  limit: 1,
  zoneId: 28,
  includeFights: false,
});

const report = response?.reportData?.reports.data[0];
            `}
          </Code>
        </div>

        <div className={styles.implementation}>
          <h2>Well, you might also want to handle validation and errors:</h2>
          <Code language={'javascript'}>
            {`
import { buildSdk } from "@rpglogs/api-sdk";

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
      res.status(404)
         .json({ message: 'Report not found.' });
      return;
    }

    res.status(200)
       .json(response.reportData.reports.data[0]);
  } catch (error) {
    res
      .status(error?.response?.status ?? 500)
      .json({
        message: error?.response?.error ?? 'An error occurred.'
      });
  }
}
            `}
          </Code>
        </div>

        <div className={styles.implementation}>
          <h2>You can provide a valid access token however you want. For example:</h2>
          <Code language={'javascript'}>
            {`
async function getAccessToken() {
  const authHeader = 'Basic ' +
    btoa(
      process.env.RPGLOGS_API_CLIENT_ID + ':' +
      process.env.RPGLOGS_API_CLIENT_SECRET
    );

  const response = await fetch(
    'https://www.warcraftlogs.com' +
    '/oauth/token',
    {
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
            `}
          </Code>
        </div>
      </main>
    </div>
  )
}
