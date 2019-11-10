declare module "github-contributions-canvas" {
  type Props = {
    data: string | null;
    username: string;
    themeName: string;
    footerText: string;
  };

  function drawContributions(canvas: HTMLCanvasElement, props: Props);
}
