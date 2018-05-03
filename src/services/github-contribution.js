const BASE_URL = 'https://github-contributions-api.now.sh/v1/';

class GithubContribution {

  static getByUsername = username => fetch(`${BASE_URL}${username}`);

  static emptyYears = (years) => (years.length === 0 ? true : false);

}

export default GithubContribution;
