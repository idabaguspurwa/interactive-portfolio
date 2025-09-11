/**
 * GitHub API Client for Enhanced AI Data Explorer
 * 
 * Provides live GitHub data when SQL database queries are insufficient
 */

import { Octokit } from '@octokit/rest'

// Initialize Octokit with optional token for higher rate limits
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN // Optional: for higher rate limits
})

/**
 * Search repositories on GitHub with various criteria
 */
export async function searchRepositories(params) {
  try {
    const {
      query,
      language = null,
      sort = 'stars',
      order = 'desc',
      per_page = 20,
      minStars = null,
      pushed = null,
      created = null,
      topic = null
    } = params

    let searchQuery = query || ''

    // Add language filter
    if (language) {
      searchQuery += ` language:${language}`
    }

    // Add minimum stars filter
    if (minStars) {
      searchQuery += ` stars:>${minStars}`
    }

    // Add push date filter (e.g., recent activity)
    if (pushed) {
      searchQuery += ` pushed:>${pushed}`
    }

    // Add creation date filter
    if (created) {
      searchQuery += ` created:>${created}`
    }

    // Add topic filter
    if (topic) {
      searchQuery += ` topic:${topic}`
    }

    console.log(`🔍 GitHub API search: "${searchQuery.trim()}"`)

    const { data } = await octokit.rest.search.repos({
      q: searchQuery.trim(),
      sort,
      order,
      per_page: Math.min(per_page, 50) // GitHub API limit
    })

    // Transform to match our database format EXACTLY for visualization compatibility
    const repositories = data.items.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || '',
      language: repo.language || 'Mixed',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      open_issues: repo.open_issues_count || 0,
      size_kb: repo.size || 0,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      is_fork: repo.fork ? 1 : 0, // Convert boolean to number for compatibility
      is_private: repo.private ? 1 : 0, // Convert boolean to number for compatibility
      homepage: repo.homepage || '',
      topics: repo.topics ? repo.topics.join(',') : '',
      owner: repo.owner.login,
      default_branch: repo.default_branch
    }))

    return {
      success: true,
      data: repositories,
      count: repositories.length,
      total_count: data.total_count,
      source: 'github_api'
    }

  } catch (error) {
    console.error('❌ GitHub API search error:', error.message)
    
    // Handle rate limit errors gracefully
    if (error.status === 403) {
      return {
        success: false,
        error: 'GitHub API rate limit exceeded. Try again later or add GITHUB_TOKEN.',
        source: 'github_api'
      }
    }

    return {
      success: false,
      error: error.message,
      source: 'github_api'
    }
  }
}

/**
 * Get trending repositories
 */
export async function getTrendingRepositories(params = {}) {
  const {
    language = '',
    since = 'week', // day, week, month
    limit = 20
  } = params

  const searchParams = {
    query: '',
    language,
    sort: 'stars',
    order: 'desc',
    per_page: limit
  }

  // Add time-based filtering
  const now = new Date()
  let dateFilter = ''
  
  switch (since) {
    case 'day':
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      dateFilter = yesterday.toISOString().split('T')[0]
      break
    case 'week':
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = lastWeek.toISOString().split('T')[0]
      break
    case 'month':
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = lastMonth.toISOString().split('T')[0]
      break
  }

  if (dateFilter) {
    searchParams.pushed = dateFilter
    searchParams.minStars = 10 // Minimum quality threshold
  }

  return await searchRepositories(searchParams)
}

/**
 * Search for specific topics or technologies
 */
export async function searchByTopic(topic, params = {}) {
  const searchParams = {
    topic,
    sort: 'stars',
    order: 'desc',
    per_page: params.limit || 20,
    ...params
  }

  return await searchRepositories(searchParams)
}

/**
 * Compare repositories by searching for alternatives
 */
export async function findAlternatives(mainRepo, language = null) {
  try {
    // Search for repositories with similar topics/keywords
    const keywords = mainRepo.toLowerCase()
    const searchTerms = [
      `${keywords} alternative`,
      `like ${keywords}`,
      `${keywords} competitor`
    ]

    const results = []

    for (const term of searchTerms) {
      const searchResult = await searchRepositories({
        query: term,
        language,
        per_page: 10
      })

      if (searchResult.success) {
        results.push(...searchResult.data)
      }
    }

    // Remove duplicates and sort by stars
    const uniqueRepos = Array.from(
      new Map(results.map(repo => [repo.full_name, repo])).values()
    ).sort((a, b) => b.stars - a.stars)

    return {
      success: true,
      data: uniqueRepos.slice(0, 20),
      count: uniqueRepos.length,
      source: 'github_api_alternatives'
    }

  } catch (error) {
    console.error('❌ Error finding alternatives:', error.message)
    return {
      success: false,
      error: error.message,
      source: 'github_api_alternatives'
    }
  }
}

/**
 * Get repository details with additional metadata
 */
export async function getRepositoryDetails(owner, repo) {
  try {
    const { data } = await octokit.rest.repos.get({
      owner,
      repo
    })

    // Get recent releases
    let latestRelease = null
    try {
      const { data: releases } = await octokit.rest.repos.listReleases({
        owner,
        repo,
        per_page: 1
      })
      latestRelease = releases[0] || null
    } catch (releaseError) {
      // Repository might not have releases
    }

    // Get contributor count
    let contributorCount = 0
    try {
      const { data: contributors } = await octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 1
      })
      contributorCount = contributors.length
    } catch (contributorError) {
      // Handle private repos or API limits
    }

    return {
      success: true,
      data: {
        ...data,
        latest_release: latestRelease,
        contributor_count: contributorCount
      },
      source: 'github_api_details'
    }

  } catch (error) {
    console.error(`❌ Error getting details for ${owner}/${repo}:`, error.message)
    return {
      success: false,
      error: error.message,
      source: 'github_api_details'
    }
  }
}

/**
 * Rate limit information
 */
export async function getRateLimitStatus() {
  try {
    const { data } = await octokit.rest.rateLimit.get()
    return {
      success: true,
      data: data.rate,
      source: 'github_api_ratelimit'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      source: 'github_api_ratelimit'
    }
  }
}