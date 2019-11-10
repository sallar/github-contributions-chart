declare module "github-contributions-canvas" {
  export type YearData = {
    year: string;
    total: number;
    range: {
      start: string;
      end: string;
    };
  };

  export type ContributionData = {
    date: string;
    count: number;
    color: string;
    intensity: number;
  };

  export type DrawContributionsProps = {
    data: {
      years: YearData[];
      contributions: ContributionData[];
    };
    username: string;
    themeName: string;
    footerText: string;
  };

  function drawContributions(
    canvas: HTMLCanvasElement,
    props: DrawContributionsProps
  ): void;
}
