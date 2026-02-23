import { Octokit } from '@octokit/rest'

export async function GET() {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    })

    const { data: repos } = await octokit.repos.listForUser({
      username: 'idabaguspurwa',
      sort: 'pushed',
      direction: 'desc',
      per_page: 100,
      type: 'owner',
    })

    const publicRepos = repos.filter((r) => !r.fork && !r.archived)

    const shaped = publicRepos.map((r) => ({
      name: r.name,
      slug: r.name,
      description: r.description || '',
      language: r.language || null,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
      createdAt: r.created_at,
      url: r.html_url,
      topics: r.topics || [],
      homepage: r.homepage || null,
      sizeKb: r.size,
    }))

    // Aggregate stats
    const languages = {}
    for (const r of shaped) {
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1
      }
    }

    const stats = {
      totalRepos: shaped.length,
      totalStars: shaped.reduce((s, r) => s + r.stars, 0),
      totalForks: shaped.reduce((s, r) => s + r.forks, 0),
      languages,
      lastPushDate: shaped.length > 0 ? shaped[0].pushedAt : null,
    }

    return Response.json(
      { repos: shaped, stats, fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    if (error.status === 403 || error.status === 429) {
      return Response.json(
        {
          error: 'GitHub API rate limit reached. Try again in a few minutes.',
          retryAfter: error.response?.headers?.['retry-after'] || 60,
        },
        { status: 429 }
      )
    }

    return Response.json(
      { error: 'Failed to fetch GitHub data. Please try again later.' },
      { status: 500 }
    )
  }
}
