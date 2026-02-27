"""
Lightweight GitHub repo information scraper using the GitHub public API.
Falls back to scraping the page with requests if the API rate-limits or fails.
"""

import re
import json
import urllib.request
import urllib.error


def scrape_github_repo(url: str) -> dict:
    """
    Fetch public metadata for a GitHub repository.

    Args:
        url: GitHub repo URL, e.g. https://github.com/user/repo

    Returns:
        dict with keys: url, name, description, techStack, stars, lastCommit, language
    """
    url = url.rstrip('/')

    # Parse owner/repo from URL
    match = re.search(r'github\.com/([^/]+)/([^/]+)', url)
    if not match:
        raise ValueError(f"Cannot parse GitHub URL: {url}")

    owner, repo = match.group(1), match.group(2)
    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    langs_url = f"https://api.github.com/repos/{owner}/{repo}/languages"

    try:
        # Fetch repo info
        req = urllib.request.Request(api_url, headers={
            'User-Agent': 'SkillBridge/1.0',
            'Accept': 'application/vnd.github.v3+json',
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            repo_data = json.loads(resp.read().decode())

        # Fetch languages
        req2 = urllib.request.Request(langs_url, headers={
            'User-Agent': 'SkillBridge/1.0',
            'Accept': 'application/vnd.github.v3+json',
        })
        with urllib.request.urlopen(req2, timeout=10) as resp2:
            langs_data = json.loads(resp2.read().decode())

        tech_stack = list(langs_data.keys())[:6]
        # Add topics as extra tech indicators
        topics = repo_data.get('topics', [])
        for t in topics[:4]:
            if t not in tech_stack:
                tech_stack.append(t)

        return {
            'url': url,
            'name': repo_data.get('full_name', f"{owner}/{repo}"),
            'description': repo_data.get('description') or 'No description provided',
            'techStack': tech_stack,
            'stars': repo_data.get('stargazers_count', 0),
            'language': repo_data.get('language', 'Unknown'),
            'lastCommit': repo_data.get('pushed_at', ''),
            'scrapedAt': __import__('datetime').datetime.utcnow().isoformat(),
        }

    except urllib.error.HTTPError as e:
        # Return partial data if API fails
        return {
            'url': url,
            'name': f"{owner}/{repo}",
            'description': f'Could not fetch repo details (HTTP {e.code})',
            'techStack': [],
            'stars': 0,
            'language': 'Unknown',
            'lastCommit': '',
            'scrapedAt': __import__('datetime').datetime.utcnow().isoformat(),
        }
    except Exception as e:
        return {
            'url': url,
            'name': f"{owner}/{repo}",
            'description': f'Error fetching repo: {str(e)}',
            'techStack': [],
            'stars': 0,
            'language': 'Unknown',
            'lastCommit': '',
            'scrapedAt': __import__('datetime').datetime.utcnow().isoformat(),
        }
